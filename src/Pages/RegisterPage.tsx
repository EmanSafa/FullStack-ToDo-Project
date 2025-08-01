import InputErrorComponent from "../Components/InputErrorComponent";
import Input from "./../Components/UI/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { REGISTERFORM } from "./../data/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../Validation";
import axiosInstance from "../Config/axios.config";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Button from "../Components/UI/Button";
import type { AxiosError } from "axios";
import type { IErrorResponse } from "../Intetface";
import { Link, useNavigate } from "react-router-dom";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(registerSchema),
  });

  // ** Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    // ** 1 - pinding
    setIsLoading(true);
    try {
      // ** 2 - Fulfilled => success => (optional)
      const { status } = await axiosInstance.post("/auth/local/register", data);
      console.log(status);
      if (status === 200) {
        toast.success(
          "You will navigate to the login page after 2 seconds to login.",
          {
            position: "bottom-center",
            duration: 1500,
            style: {
              backgroundColor: "black",
              color: "white",
              width: "fit-content",
            },
          }
        );
        setTimeout(() => {
          navigate("/login");
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
    }finally {
      setIsLoading(false);
    }
  };

  // ** Renders
  const renderRegisterForm = REGISTERFORM.map(
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
    <div className="max-w-md mx-auto flex flex-col justify-center items-center px-3 py-5">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access !
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full flex flex-col justify-center items-center"
      >
        {renderRegisterForm}
        <Button fullWidth isLoading={isLoading}>
          Register
        </Button>
        <p className="text-sm text-gray-400">
          Have an accout?{" "}
          <Link to="/login" className="underline text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
