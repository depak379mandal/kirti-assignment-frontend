"use client";
import client from "@/utils/client";
import { useFormik } from "formik";
import React from "react";
import { object, string } from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Stack, Typography, TextField, Button } from "@mui/material";

type Props = {};

function Register({}: Props) {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    validationSchema: object({
      first_name: string().required(),
      last_name: string().required(),
      email: string().required(),
      password: string().required(),
    }),
    onSubmit: (values) => {
      client
        .post("/v1/auth/email/register", values)
        .then(() => {
          toast.success("Registered Successfully.");
          router.push("/login");
        })
        .catch(() => {
          toast.error("Unable to register.");
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
      <Typography>Register</Typography>
      <TextField
        label="First Name"
        {...formik.getFieldProps("first_name")}
        error={formik.touched.first_name && !!formik.errors.first_name}
        helperText={formik.errors.first_name}
      />
      <TextField
        label="Last Name"
        {...formik.getFieldProps("last_name")}
        error={formik.touched.last_name && !!formik.errors.last_name}
        helperText={formik.errors.last_name}
      />
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
        Register
      </Button>
    </Stack>
  );
}

export default Register;
