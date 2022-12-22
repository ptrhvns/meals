import Alert from "./Alert";
import Button from "./Button";
import classes from "../styles/components/SignupForm.module.scss";
import Field from "./Field";
import FormActions from "./FormActions";
import InputDiv from "./InputDiv";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleApiError } from "../lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

interface FormData {
  email: string;
  password: string;
  username: string;
}

export default function SignupForm() {
  const [error, setError] = useState<string>();
  const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>();
  const navigate = useNavigate();
  const { signupCreate } = useApi();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>();

  return (
    <>
      <Dialog
        open={openSuccessDialog}
        onOpenChange={(open: boolean) => {
          if (!open) {
            navigate("/login", { replace: true });
          }
        }}
      >
        <DialogContent onDismiss={() => setOpenSuccessDialog(false)}>
          <Alert variant="success">
            <DialogTitle asChild>
              <h1 className={classes.dialogHeading}>Sign Up Success</h1>
            </DialogTitle>
            {successMessage}
          </Alert>
        </DialogContent>
      </Dialog>

      <form
        onSubmit={handleSubmit(async (data: FormData) => {
          setSubmitting(true);
          const response = await signupCreate(data);
          setSubmitting(false);

          if (response.isError) {
            return handleApiError<FormData>(response, {
              setError,
              setFieldError,
            });
          }

          setSuccessMessage(response?.message ?? "You signed up successfully.");
          setOpenSuccessDialog(true);
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
          <LabelDiv htmlFor="email">Email</LabelDiv>
          <InputDiv
            disabled={submitting}
            error={!!fieldErrors?.email?.message}
            id="email"
            type="text"
            {...register("email", { required: "Email is required." })}
          />
          <InputError error={fieldErrors?.email?.message} />
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

        <FormActions>
          <Button
            color="primary"
            disabled={submitting}
            type="submit"
            variant="filled"
          >
            <FontAwesomeIcon icon={faUserPlus} /> Sign up
          </Button>
        </FormActions>
      </form>
    </>
  );
}
