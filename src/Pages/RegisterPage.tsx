import InputErrorComponent from "../Components/InputErrorComponent";
import Input from "./../Components/UI/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { REGISTERFORM } from "./../data/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../Validation";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(registerSchema),
  });

  // ** Handlers
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
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
        <button className="w-full bg-indigo-600 p-3 rounded-md">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
