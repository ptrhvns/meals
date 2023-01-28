import Alert from "./Alert";
import Button from "./Button";
import classes from "../styles/components/AccountDeleteForm.module.scss";
import Field from "./Field";
import FormActions from "./FormActions";
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
}

export default function AccountDeleteForm() {
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { accountDestroy } = useApi();
  const { logout } = useAuthn();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>();

  return (
    <form
      className={classes.form}
      onSubmit={handleSubmit(async (data: FormData) => {
        setSubmitting(true);

        if (
          !window.confirm(
            "Are you sure you want to delete your account, and permanently delete all of your data?"
          )
        ) {
          setSubmitting(false);
          return;
        }

        const response = await accountDestroy({ data });
        setSubmitting(false);

        if (response.isError) {
          return handleApiError<FormData>(response, {
            setError,
            setFieldError,
          });
        }

        logout(() => navigate("/", { replace: true }));
      })}
    >
      {error && (
        <Alert onDismiss={() => setError(undefined)} variant="error">
          {error}
        </Alert>
      )}

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

      <FormActions>
        <Button
          color="red"
          disabled={submitting}
          type="submit"
        >
          Delete account
        </Button>
      </FormActions>
    </form>
  );
}
