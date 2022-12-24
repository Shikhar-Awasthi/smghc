import { Box } from "@mui/material";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../Error/Error";

function Brands() {
  return (
    <ErrorBoundary FallbackComponent={<Error />}>
      <Box></Box>
    </ErrorBoundary>
  );
}

export default Brands;
