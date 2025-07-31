import type { ILoginForm, IRegisterInput } from "../Intetface";

export const REGISTERFORM: IRegisterInput[] = [
  {
    name: "username",
    placeholder: "username",
    type: "text",
    validation: {
      required: true,
      minLength: 5,
    },
  },
  {
    name: "email",
    placeholder: "email",
    type: "email",
    validation: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  {
    name: "password",
    placeholder: "password",
    type: "password",
    validation: {
      required: true,
      minLength: 6,
    },
  },
];
export const LOGINFORM: ILoginForm[] = [
  {
    name: "identifier",
    placeholder: "email",
    type: "email",
    validation: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  {
    name: "password",
    placeholder: "password",
    type: "password",
    validation: {
      required: true,
      minLength: 6,
    },
  },
];
