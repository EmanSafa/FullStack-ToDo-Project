import { forwardRef, type InputHTMLAttributes, type Ref } from "react";
const Input = forwardRef(
  (
    props: InputHTMLAttributes<HTMLInputElement>,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <input
        ref={ref}
        className="border-[1px] shadow-2xl border-zinc-500  focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-lg px-3 py-3 text-md w-full bg-transparent"
        {...props}
      />
    );
  }
);

export default Input;
