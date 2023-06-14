/* eslint-disable @next/next/no-img-element */
"use client";
import client, { AuthClient } from "@/utils/client";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { IBook } from "../page";

export interface IOrder {
  id: string;
  book: IBook;
}

export default function Order() {
  const router = useRouter();

  const [orders, setOrders] = useState<{
    page: number;
    orders: IOrder[];
    hasMore: boolean;
  }>({
    page: 0,
    orders: [],
    hasMore: true,
  });
  const [activeOrder, setActiveOrder] = useState<IOrder | null>(null);

  const getOrders = () => {
    const auth_token = localStorage.getItem("auth_token");

    client
      .get(`/v1/orders?page=${orders.page + 1}`, {
        headers: { Authorization: `Bearer ${auth_token}` },
      })
      .then(({ data }) => {
        setOrders((prev) => ({
          page: data.page,
          hasMore: !!data.rows.length,
          orders: [...prev.orders, ...data.rows],
        }));
      })
      .catch((res) => {
        console.error(res);
      });
  };

  const cancelOrder = () => {
    if (!activeOrder) {
      return;
    }

    AuthClient()
      .delete(`/v1/orders/${activeOrder?.id}`)
      .then(({ data }) => {
        setActiveOrder(null);
        toast.success(`Order Cancel was success.`);
        setOrders((prev) => ({
          ...prev,
          orders: prev.orders.filter((order) => activeOrder.id !== order.id),
        }));
      })
      .catch((res) => {
        console.error(res);
        setActiveOrder(null);
      });
  };

  useEffect(() => {
    cancelOrder();
  }, [activeOrder]);

  useEffect(() => {
    const auth_token = localStorage.getItem("auth_token");
    if (!auth_token) {
      router.push("/login");
      return;
    }

    getOrders();
  }, []);

  return (
    <>
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        All Orders
      </Typography>
      <Grid
        container
        spacing={2}
        mt={4}
        sx={{
          "& .infinite-scroll-component__outerdiv": {
            width: "100%",
          },
        }}
      >
        <InfiniteScroll
          dataLength={orders.orders.length} //This is important field to render the next data
          next={getOrders}
          hasMore={orders.hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          {orders.orders.map((order) => (
            <Grid key={order.id} item xs={12} md={3} lg={2} p={1}>
              <Card elevation={3}>
                <CardContent sx={{ textAlign: "center", p: 0 }}>
                  <img
                    src={order.book.image}
                    style={{ objectFit: "cover" }}
                    height={200}
                    alt="Something"
                  />
                  <Typography fontSize="small">{order.book.writer}</Typography>
                  <Typography fontSize="small">{order.book.title}</Typography>
                  <Typography>Points {order.book.price}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={activeOrder?.id === order.id}
                    onClick={() => setActiveOrder(order)}
                  >
                    {order.id !== activeOrder?.id
                      ? "Cancel Order"
                      : "Canceling"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </InfiniteScroll>
      </Grid>
    </>
  );
}
