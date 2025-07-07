"use client";

import { createOrder } from "@/lib/actions/order.actions";
import { useFormStatus } from "react-dom";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await createOrder();

    console.log("Order Response:", res);

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        Place Order
      </Button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
