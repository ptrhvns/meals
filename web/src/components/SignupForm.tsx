import Alert from "./Alert";
import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import Input from "./Input";
import InputError from "./InputError";
import Label from "./Label";
import { Optional } from "../lib/types";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface FormData {
  email: string;
  password: string;
  username: string;
}

export default function SignupForm() {
  const [alert, setAlert] = useState<Optional<string>>();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // TODO implement
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {alert && (
        <Alert onDismiss={() => setAlert(undefined)} variant="error">
          {alert}
        </Alert>
      )}

      <Field>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          error={!!errors?.username?.message}
          {...register("username", { required: "Username is required." })}
        />
        <InputError error={errors?.username?.message} />
      </Field>

      <Field>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="text"
          error={!!errors?.email?.message}
          {...register("email", { required: "Email is required." })}
        />
        <InputError error={errors?.email?.message} />
      </Field>

      <FormActions>
        <Button color="primary" type="submit" variant="filled">
          Sign up
        </Button>
      </FormActions>
    </form>
  );
}
