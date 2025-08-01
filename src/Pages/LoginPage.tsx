import InputErrorComponent from "../Components/InputErrorComponent";
import Button from "../Components/UI/Button";
import { LOGINFORM } from "../data";
import Input from "./../Components/UI/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { loginSchema } from "../Validation";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { IErrorResponse } from "../Intetface";
import axiosInstance from "../Config/axios.config";
import { Link } from "react-router-dom";

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    // ** 1 - pinding
    setIsLoading(true);
    try {
      // ** 2 - Fulfilled => success => (optional)
      const { status, data: resData } = await axiosInstance.post(
        "/auth/local",
        data
      );
      console.log(resData);
      console.log(status);
      if (status === 200) {
        toast.success("You will navigate to the Home page after 2 seconds .", {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        localStorage.setItem("loggedInUser", JSON.stringify(resData));

        setTimeout(() => {
          location.replace("/");
        }, 2000);
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data?.error?.message}`, {
        position: "bottom-center",
        duration: 1500,
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = LOGINFORM.map(
    ({ name, placeholder, type, validation }, idx) => {
      return (
        <div key={idx} className="w-full">
          <Input
            placeholder={placeholder}
            {...register(name, validation)}
            type={type}
          />
          {errors[name] && <InputErrorComponent msg={errors[name]?.message} />}
        </div>
      );
    }
  );
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access !
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full flex flex-col justify-center items-center"
      >
        {renderLoginForm}
        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
        <p className="text-sm text-gray-400">
          No an accout?{" "}
          <Link to="/register" className="underline text-blue-500">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
