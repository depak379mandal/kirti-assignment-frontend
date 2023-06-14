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
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

export interface IBook {
  id: string;
  title: string;
  writer: string;
  price: number;
  image: string;
  tags: string[];
}

const BookBuyModal = ({
  data,
  onClose,
}: {
  data: IBook | null;
  onClose: () => void;
}) => {
  const [buying, setBuying] = useState(false);

  const buyBook = () => {
    setBuying(true);
    AuthClient()
      .post(`/v1/orders`, { book_id: data?.id })
      .then(({ data }) => {
        setBuying(false);
        onClose();
        toast.success(`Buy was success. order id is ${data.id}`);
      })
      .catch((res) => {
        console.error(res);
        toast.error("May be You are out of point.");
        setBuying(false);
      });
  };

  return (
    <Dialog open={!!data} onClose={onClose}>
      <DialogTitle>Are You Sure</DialogTitle>
      <DialogContent>
        It will decrease point by {data?.price} and buy the book
      </DialogContent>
      <DialogActions>
        <Button color="error" variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" disabled={buying} onClick={buyBook}>
          {buying ? "Buying" : "Buy"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function Home() {
  const router = useRouter();

  const [books, setBooks] = useState<{
    page: number;
    books: IBook[];
    hasMore: boolean;
  }>({
    page: 0,
    books: [],
    hasMore: true,
  });
  const [user, setUser] = useState<any>({});
  const [activeBuy, setActiveBuy] = useState<IBook | null>(null);

  const getBooks = () => {
    client
      .get(`/v1/books?page=${books.page + 1}&limit=12`)
      .then(({ data }) => {
        setBooks((prev) => ({
          page: data.page,
          hasMore: !!data.rows.length,
          books: [...prev.books, ...data.rows],
        }));
      })
      .catch((res) => {
        console.error(res);
      });
  };

  const getUser = () => {
    AuthClient()
      .get(`/v1/user/me`)
      .then(({ data }) => {
        setUser(data);
      })
      .catch((res) => {
        console.error(res);
      });
  };

  useEffect(() => {
    const auth_token = localStorage.getItem("auth_token");
    if (!auth_token) {
      router.push("/login");
      return;
    }

    getBooks();
  }, []);

  useEffect(() => {
    getUser();
  }, [activeBuy]);

  return (
    <>
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        All Books (Left Points {user.points})
      </Typography>
      <Grid container spacing={2} mt={4}>
        <InfiniteScroll
          dataLength={books.books.length} //This is important field to render the next data
          next={getBooks}
          hasMore={books.hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {books.books.map((book) => (
            <Grid key={book.id} item xs={12} md={3} lg={2} p={1}>
              <Card elevation={3}>
                <CardContent sx={{ textAlign: "center", p: 0 }}>
                  <img
                    src={book.image}
                    style={{ objectFit: "cover" }}
                    height={200}
                    alt="Something"
                  />
                  <Typography fontSize="small">{book.writer}</Typography>
                  <Typography fontSize="small">{book.title}</Typography>
                  <Typography>
                    {book.tags.map((tag) => `#${tag}`).join(", ")}
                  </Typography>
                  <Typography>Points {book.price}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setActiveBuy(book)}
                  >
                    Buy Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </InfiniteScroll>
      </Grid>
      <BookBuyModal data={activeBuy} onClose={() => setActiveBuy(null)} />
    </>
  );
}
