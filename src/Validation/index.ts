import * as yup from "yup";

export const registerSchema = yup
  .object({
    username: yup
      .string()
      .required("Username is required ! ")
      .min(5, "Username should be at least 5 characters"),
    password: yup
      .string()
      .required("Password is required ! ")
      .min(6, "Username should be at least 6 characters"),
    email: yup
      .string()
      .required("Email is required !")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  })
  .required();
