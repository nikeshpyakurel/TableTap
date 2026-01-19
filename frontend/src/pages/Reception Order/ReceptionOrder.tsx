/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridCol,
  Loader,
  Paper,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { useQuery } from "@tanstack/react-query";
import AlertComponent from "../../components/utils/Error/AlertComponent";
import useAuthStore from "../../providers/useAuthStore";
import useSocketStore from "../../providers/useSocketStore";
import { useEffect } from "react";
import { useTableOrderCart } from "../../providers/useTableOrderCart";
import { useMediaQuery } from "@mantine/hooks";
import { AxiosError } from "axios";
import AxiosErrorResponse from "../../type/error";

const TableOrder = () => {
  const navigate = useNavigate();
  const { setTableId, tableId, removeTableId, clearCart } = useTableOrderCart();
  const { restaurantId } = useAuthStore((state) => state);
  const { socketRef } = useSocketStore((state) => state);
  const isMobile = useMediaQuery("(max-width: 767px)");

  async function fetchTable() {
    const res = await axiosPrivateInstance.get("/table");
    return res.data;
  }
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["table"],
    queryFn: fetchTable,
  });

  useEffect(() => {
    if (restaurantId) {
      socketRef?.on("order", (message) => {
        if (message.success) {
          refetch();
        }
      });
    }
  }, [restaurantId]);

  //Remove all the item from cart if the user navigate to selection of table to prevent unnecessary bugs
  useEffect(() => {
    if (tableId) {
      removeTableId();
      clearCart();
    }
  }, [tableId]);

  if (isLoading) {
    return (
      <Center style={{ height: "80vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }
  if (error) {
    const axiosError = error as AxiosError<AxiosErrorResponse>;
    return (
      <AlertComponent
        message={
          axiosError.response?.data?.message ||
          error.message ||
          "An error occurred"
        }
        title="Error"
      />
    );
  }
  return (
    <>
      <Text mb="lg">Table Status</Text>
      <Paper p="md" mt={20}>
        <Grid justify="center">
          {data?.map((table: any) => (
            <GridCol span={isMobile ? 12 : 2} key={table.id}>
              <Box
                style={(theme) => ({
                  backgroundColor:
                    table?.status == "occupied" ? "gray" : "green",
                  color: theme.white,
                  padding: theme.spacing.md,
                  textAlign: "center",
                  borderRadius: theme.radius.md,
                  cursor: "pointer",
                })}
                onClick={() => {
                  setTableId(table.id);
                  navigate(`/book-table`);
                  // }
                }}
              >
                <Text>{table.name}</Text>
              </Box>
            </GridCol>
          ))}
        </Grid>

        <Flex justify="center" align="center" mt="lg">
          <Flex align="center" mr="xl">
            <Box
              style={(theme) => ({
                backgroundColor: "green",
                width: 20,
                height: 20,
                borderRadius: "50%",
                marginRight: theme.spacing.xs,
              })}
            />
            <Text>Empty Tables</Text>
          </Flex>

          <Flex align="center">
            <Box
              style={(theme) => ({
                backgroundColor: "gray",
                width: 20,
                height: 20,
                borderRadius: "50%",
                marginRight: theme.spacing.xs,
              })}
            />
            <Text>Reserved Tables</Text>
          </Flex>
        </Flex>
      </Paper>
      {isMobile && (
        <Button
          fullWidth={true}
          mt={16}
          size="md"
          bg={"orange"}
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
      )}
    </>
  );
};

export default TableOrder;
