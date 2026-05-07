import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { paymentService } from "../services/api";

export default function PaystackPayment({ amount, days, onError }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const initResponse = await paymentService.initializePayment(
        amount,
        days,
        user.currentCycle?._id,
      );

      if (initResponse.data.paymentUrl) {
        window.location.href = initResponse.data.paymentUrl;
        return;
      }

      throw new Error("Payment initialization failed");
    } catch (err) {
      console.error("Payment initialization failed:", err);
      setLoading(false);
      onError?.(err.message || "Payment initialization failed.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="btn btn-primary"
      style={{ width: "100%" }}
    >
      {loading ? "Initializing Payment..." : `Pay ₦${amount} for ${days} days`}
    </button>
  );
}
