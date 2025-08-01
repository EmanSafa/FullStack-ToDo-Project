export interface IRegisterInput {
  name: "username" | "password" | "email";
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
}
export interface ILoginForm {
  name: "password" | "identifier";
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
}

export interface IErrorResponse {
  error: {
    message?: string;
  };
}

export interface ITodo {
  id: number;
  title: string;
}
