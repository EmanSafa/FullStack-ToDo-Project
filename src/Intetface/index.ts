export interface IRegisterInput {
  name: 'username' | 'password' | 'email';
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
}

export interface IErrorResponse {
  error:{
    message?:string
  }
}