import { create } from "domain";

const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

export const paypal = {
  createOrder: async (price: number) => {
    const accessToken = await generateAccessToken();
    const url = new URL("/v2/checkout/orders", base);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: price.toFixed(2),
            },
          },
        ],
      }),
    });

    return await handleResponse(response);
  },

  capturePayment: async (orderId: string) => {
    const accessToken = await generateAccessToken();
    const url = new URL(`/v2/checkout/orders/${orderId}/capture`, base);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return handleResponse(response);
  },
};

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `PayPal API request failed: ${response.status} - ${errorMessage}`
    );
  }
  return response.json();
}

// Generate Access Token
export async function generateAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
    "base64"
  );
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

export { generateAccessToken };
