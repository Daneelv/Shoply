import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z.string().refine((val) => {
  const regex = /^\d+(\.\d{2})?$/;
  return regex.test(formatNumberWithDecimal(Number(val)));
}, "Price Must have exactly 2 Decimal Places");

//Schema for inserting Products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 characters"),
  slug: z.string().min(3, "Slug must be atleast 3 characters"),
  category: z.string().min(3, "Category must be atleast 3 characters"),
  brand: z.string().min(3, "Brand must be atleast 3 characters"),
  description: z.string().min(3, "Description must be atleast 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have atleast one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// Schema for sining in a user
export const signInFormSchema = z.object({
  email: z.string().email("Email is not valid"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});

// Schema for sining up a user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be atleast 3 characters"),
    email: z.string().email("Email is not valid"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be atleast 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
