import Alert from "./Alert";
import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import Input from "./Input";
import InputDiv from "./InputDiv";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import useApi from "../hooks/useApi";
import useAuthn from "../hooks/useAuthn";
import { handleApiError } from "../lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

interface FormData {
  password: string;
  remember_me: boolean;
  username: string;
}

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const authn = useAuthn();
  const navigate = useNavigate();
  const { login } = useApi();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>({ defaultValues: { remember_me: true } });

  return (
    <form
      onSubmit={handleSubmit(async (data: FormData) => {
        setSubmitting(true);
        const response = await login({ data });
        setSubmitting(false);

        if (response.isError) {
          return handleApiError<FormData>(response, {
            setError,
            setFieldError,
          });
        }

        authn.login(() => navigate("/dashboard", { replace: true }));
      })}
    >
      {error && (
        <Alert onDismiss={() => setError(undefined)} variant="error">
          {error}
        </Alert>
      )}

      <Field>
        <LabelDiv htmlFor="username">Username</LabelDiv>
        <InputDiv
          disabled={submitting}
          error={!!fieldErrors?.username?.message}
          id="username"
          type="text"
          {...register("username", { required: "Username is required." })}
        />
        <InputError error={fieldErrors?.username?.message} />
      </Field>

      <Field>
        <LabelDiv htmlFor="password">Password</LabelDiv>
        <InputDiv
          disabled={submitting}
          error={!!fieldErrors?.password?.message}
          id="password"
          type="password"
          {...register("password", { required: "Password is required." })}
        />
        <InputError error={fieldErrors?.password?.message} />
      </Field>

      <Field>
        <LabelDiv htmlFor="remember_me">
          <Input
            disabled={submitting}
            error={!!fieldErrors?.remember_me?.message}
            id="remember_me"
            type="checkbox"
            {...register("remember_me")}
          />{" "}
          Remember me
        </LabelDiv>
        <InputError error={fieldErrors?.remember_me?.message} />
      </Field>

      <FormActions>
        <Button
          color="primary"
          disabled={submitting}
          type="submit"
          variant="filled"
        >
          Log in
        </Button>
      </FormActions>
    </form>
  );
}
