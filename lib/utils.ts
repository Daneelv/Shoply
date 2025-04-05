import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert a prisma object to a JSON object
export function convertToPlainObj<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//Format Numbner with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, dec] = num.toString.split(".");

  return decimal ? `${int}.${dec.padEnd(2, "0")}` : `${int}.00`;
}
