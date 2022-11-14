import Alert from "./Alert";
import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import Input from "./Input";
import InputError from "./InputError";
import Label from "./Label";
import useApi from "../hooks/useApi";
import { handleApiError } from "../lib/utils";
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
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { createSignup } = useApi();

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const response = await createSignup({ data });
    setSubmitting(false);

    if (response.isError) {
      return handleApiError<FormData>(response, { setAlert, setError });
    }

    // TODO handle success response
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
          disabled={submitting}
          error={!!errors?.username?.message}
          id="username"
          type="text"
          {...register("username", { required: "Username is required." })}
        />
        <InputError error={errors?.username?.message} />
      </Field>

      <Field>
        <Label htmlFor="email">Email</Label>
        <Input
          disabled={submitting}
          error={!!errors?.email?.message}
          id="email"
          type="text"
          {...register("email", { required: "Email is required." })}
        />
        <InputError error={errors?.email?.message} />
      </Field>

      <Field>
        <Label htmlFor="password">Password</Label>
        <Input
          disabled={submitting}
          error={!!errors?.password?.message}
          id="password"
          type="password"
          {...register("password", { required: "Password is required." })}
        />
        <InputError error={errors?.password?.message} />
      </Field>

      <FormActions>
        <Button
          color="primary"
          disabled={submitting}
          type="submit"
          variant="filled"
        >
          Sign up
        </Button>
      </FormActions>
    </form>
  );
}
