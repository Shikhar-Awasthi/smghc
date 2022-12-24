import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Box, Button, CircularProgress } from "@mui/material";
import { blue } from "@mui/material/colors";

export default function Stripe({ snackbar, amount }) {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      return;
    }
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:4003/stripe/callback`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      snackbar(error.message);
    } else {
      snackbar("An unexpected error occurred.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handlePaySubmit}>
      <PaymentElement />
      <Box position={"relative"}>
        <Button variant="contained" fullWidth type="submit" sx={{ borderRadius: 3, backgroundColor: "#264C7E", mt: 3 }} disabled={loading}>
          Pay Us ${amount}
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: blue,
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    </form>
  );
}
