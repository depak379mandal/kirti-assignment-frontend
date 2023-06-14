"use client";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, AppBar, Toolbar, List, ListItem } from "@mui/material";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Container sx={{ py: 4 }}>
          <ToastContainer />
          <AppBar>
            <Toolbar sx={{ color: "#fff", overflow: "auto" }}>
              <List
                sx={{
                  display: "flex",
                  ml: "auto",
                  overflowX: "auto",
                  "& a": {
                    color: "#fff",
                  },
                }}
              >
                <ListItem>
                  <Link href="/">Home/Books</Link>
                </ListItem>
                <ListItem>
                  <Link href="/orders">Orders</Link>
                </ListItem>
                <ListItem>
                  <Link href="/register">Register</Link>
                </ListItem>
                <ListItem>
                  <Link href="/login">Login</Link>
                </ListItem>
              </List>
            </Toolbar>
          </AppBar>
          <Toolbar></Toolbar>
          {children}
        </Container>
      </body>
    </html>
  );
}
