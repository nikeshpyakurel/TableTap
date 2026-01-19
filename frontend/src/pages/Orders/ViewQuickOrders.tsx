import { Badge, Divider, Group, Paper, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { quickOrder } from "../../api/order";
import React from "react";
import AlertComponent from "../../components/utils/Error/AlertComponent";
import { AxiosError } from "axios";
import AxiosErrorResponse from "../../type/error";

const ViewQuickOrders = () => {
  const navigate = useNavigate();
  const {
    data: quickOrderData,
    isError,
    error,
  } = useQuery({
    queryKey: ["quickOrderData"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(`${quickOrder}`);
      return response.data;
    },
  });

  if (isError) {
    const axiosError = error as AxiosError<AxiosErrorResponse>;
    return (
      <AlertComponent
        title="An error occured"
        message={
          axiosError.response?.data?.message ||
          error.message ||
          "An error occurred"
        }
      />
    );
  }

  return (
    <Paper p="md" shadow="md" mt={10}>
      <Title size="h3" c="#ff6347">
        Quick Orders
      </Title>
      {quickOrderData?.map((item: any, index: any) => {
        return (
          <React.Fragment key={index}>
            <Group justify="space-between" mt={10}>
              <Text mt={10}>
                Order code{" "}
                <span
                  style={{ color: "#ff6347", cursor: "pointer" }}
                  onClick={() =>
                    navigate("/quickOrder-details/" + item.id, { state: item })
                  }
                >
                  {item?.id}
                </span>{" "}
                has been placed
              </Text>
              <Badge color="green" mt={5}>
                Quick order
              </Badge>
            </Group>
            <Text mt={5} size="sm">
              {item?.updatedAt.slice(0, 10)}
            </Text>
            <Divider mt={5} />
          </React.Fragment>
        );
      })}
    </Paper>
  );
};

export default ViewQuickOrders;
