"use client";
import client from "@/utils/client";
import { useFormik } from "formik";
import React from "react";
import { object, string } from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Stack, Typography, TextField, Button } from "@mui/material";

type Props = {};

function Login({}: Props) {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: object({
      email: string().required(),
      password: string().required(),
    }),
    onSubmit: (values) => {
      client
        .post("/v1/auth/email/login", values)
        .then(({ data }) => {
          toast.success("Logged In Successfully.");
          localStorage.setItem("auth_token", data.auth_token);
          router.push("/");
        })
        .catch(() => {
          toast.error("Unable to login.");
        });
    },
  });

  return (
    <Stack
      component="form"
      maxWidth="md"
      p={3}
      spacing={2}
      mx="auto"
      onSubmit={formik.handleSubmit}
    >
      <Typography>Login</Typography>
      <TextField
        label="Email"
        {...formik.getFieldProps("email")}
        error={formik.touched.email && !!formik.errors.email}
        helperText={formik.errors.email}
      />
      <TextField
        label="Password"
        type="password"
        {...formik.getFieldProps("password")}
        error={formik.touched.password && !!formik.errors.password}
        helperText={formik.errors.password}
      />
      <Button type="submit" variant="contained" fullWidth>
        Login
      </Button>
    </Stack>
  );
}

export default Login;
