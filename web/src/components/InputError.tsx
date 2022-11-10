import classes from "../styles/components/InputError.module.scss";

interface InputErrorProps {
  error?: string;
}

const InputError = ({ error }: InputErrorProps) => {
  if (!error) return null;
  return <div className={classes.wrapper}>{error}</div>;
};

export default InputError;
