"use client";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Container from "@mui/material/Container";

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
          {children}
        </Container>
      </body>
    </html>
  );
}
