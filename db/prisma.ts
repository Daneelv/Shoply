import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export const prisma = new PrismaClient().$extends({
  result: {
    product: {
      price: {
        compute(product: { price: Decimal }) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product: { rating: Decimal }) {
          return product.rating.toString();
        },
      },
    },

    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart: { itemsPrice: Decimal }) {
          return cart.itemsPrice.toString();
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(cart: { shippingPrice: Decimal }) {
            return cart.shippingPrice.toString();
          },
        },
        taxprice: {
          needs: { taxPrice: true },
          compute(cart: { taxPrice: Decimal }) {
            return cart.taxPrice.toString();
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(cart: { totalPrice: Decimal }) {
            return cart.totalPrice;
          },
        },
      },
    },

    order: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart: { itemsPrice: Decimal }) {
          return cart.itemsPrice.toString();
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(cart: { shippingPrice: Decimal }) {
            return cart.shippingPrice.toString();
          },
        },
        taxprice: {
          needs: { taxPrice: true },
          compute(cart: { taxPrice: Decimal }) {
            return cart.taxPrice.toString();
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(cart: { totalPrice: Decimal }) {
            return cart.totalPrice;
          },
        },
      },
    },
    orderItem: {
      price: {
        compute(cart: { price: Decimal }) {
          return cart.price.toString();
        },
      },
    },
  },
});
