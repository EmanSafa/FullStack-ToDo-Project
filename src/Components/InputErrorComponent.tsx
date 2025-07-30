interface IProps {
  msg?: string;
}

const InputErrorComponent = ({ msg }: IProps) => {
  return msg ? (
    <span className="block text-sm  text-red-400">{msg}</span>
  ) : null;
};

export default InputErrorComponent;
