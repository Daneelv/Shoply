"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObj, formatError } from "../utils";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";

// Create order and create the order items

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error("user not found");

    const user = await getUserById(userId);

    if (!cart || cart.items === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }

    if (!user.address) {
      return {
        success: false,
        message: "No Shipping Address found",
        redirectTo: "/shipping-address",
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No Payment Method found",
        redirectTo: "/payment-method",
      };
    }

    // create order object
    const order = insertOrderSchema.parse({
      userId: userId,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    // Create a transaction to insert the order and order items
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create the order
      const insertedOrder = await tx.order.create({ data: order });

      // Create the order items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }

      // Clear the user's cart after creating the order
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order creation failed");

    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

// Get Order by ID
export async function getOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderitems: true, // Include order items
      user: { select: { name: true, email: true } }, // Include user details
    },
  });

  return convertToPlainObj(order);
}
