import { generateAccessToken, paypal } from "../lib/paypal";

// Test to generate PayPal access token
test("Generate PayPal Access Token", async () => {
  const accessToken = await generateAccessToken();
  console.log(accessToken);

  expect(typeof accessToken).toBe("string");
  expect(accessToken.length).toBeGreaterThan(0);
});

// Test to create a PayPal order
test("Create a PayPal Order", async () => {
  await generateAccessToken();
  const price = 10.0; // Example price
  const orderResponse = await paypal.createOrder(price);
  console.log(orderResponse);

  expect(orderResponse).toHaveProperty("id");
  expect(orderResponse).toHaveProperty("status");
  expect(orderResponse.status).toBe("CREATED");
});

// Test to capture payment with a mock order
test("simulate capturing a payment form a order", async () => {
  const orderId = "100";

  const mockCapturePayments = jest
    .spyOn(paypal, "capturePayment")
    .mockResolvedValue({ status: "COMPLETED" });

  const captureResponse = await paypal.capturePayment(orderId);

  expect(captureResponse).toHaveProperty("status", "COMPLETED");

  mockCapturePayments.mockRestore();
});
