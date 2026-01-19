import React from "react";
import { AxiosError } from "axios";
import { Alert, Text } from "@mantine/core";

interface ApiErrorResponse {
  message?: string;
}

interface ErrorAxiosProps {
  error: unknown;
  fallbackMessage?: string;
}

const ErrorAxios: React.FC<ErrorAxiosProps> = ({
  error,
  fallbackMessage = "An unknown error occurred",
}) => {
  const getErrorMessage = (error: unknown): string => {
    if ((error as AxiosError)?.isAxiosError) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return axiosError.response?.data?.message || fallbackMessage;
    }
    return fallbackMessage;
  };

  const errorMessage = getErrorMessage(error);

  return (
    <Alert color="red">
      <Text>{errorMessage}</Text>
    </Alert>
  );
};

export default ErrorAxios;
