import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { nan } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert a prisma object to a JSON object
export function convertToPlainObj<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//Format Number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, dec] = num.toString().split(".");

  return dec ? `${int}.${dec.padEnd(2, "0")}` : `${int}.00`;
}

// Round number to 2 decimal places
export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is not a number or string");
  }
}

// Format Form Errors

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    // Handle Zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );

    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    // Handle Prisma Error
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    // Handle Other Errors
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

//Format Currency usint the format above
export function formatCurrency(amount: number | string | null): string {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else return nan;
}
