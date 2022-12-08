import Alert from "./Alert";
import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import Input from "./Input";
import InputError from "./InputError";
import Label from "./Label";
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
  const authn = useAuthn();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { login } = useApi();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>({ defaultValues: { remember_me: true } });

  const onFormSubmit = handleSubmit(async (data: FormData) => {
    setSubmitting(true);
    const response = await login(data);
    setSubmitting(false);

    if (response.isError) {
      return handleApiError<FormData>(response, {
        setFieldError,
        setFormError,
      });
    }

    authn.login(() => navigate("/dashboard", { replace: true }));
  });

  const onAlertDismiss = () => setFormError(undefined);

  return (
    <form onSubmit={onFormSubmit}>
      {formError && (
        <Alert onDismiss={onAlertDismiss} variant="error">
          {formError}
        </Alert>
      )}

      <Field>
        <Label htmlFor="username">Username</Label>
        <Input
          disabled={submitting}
          error={!!fieldErrors?.username?.message}
          id="username"
          type="text"
          {...register("username", { required: "Username is required." })}
        />
        <InputError error={fieldErrors?.username?.message} />
      </Field>

      <Field>
        <Label htmlFor="password">Password</Label>
        <Input
          disabled={submitting}
          error={!!fieldErrors?.password?.message}
          id="password"
          type="password"
          {...register("password", { required: "Password is required." })}
        />
        <InputError error={fieldErrors?.password?.message} />
      </Field>

      <Field>
        <Label htmlFor="remember_me">
          <Input
            disabled={submitting}
            error={!!fieldErrors?.remember_me?.message}
            id="remember_me"
            type="checkbox"
            wrap={false}
            {...register("remember_me")}
          />{" "}
          Remember me
        </Label>
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
