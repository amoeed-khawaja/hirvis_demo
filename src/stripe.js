import { loadStripe } from "@stripe/stripe-js";

// Test Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51RqCU9JnhtNNhpGHVxbg1j8VoVUtLDrVTu6MTkSvhQpoWGU4Bs8Nc98JEAlQsy8L6D4BAukRsbIDk96tZEyHv70m00TcB76A8j"
);

export default stripePromise;
