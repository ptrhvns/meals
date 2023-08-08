import Button from "./Button";
import classes from "../styles/components/AccountDeleteForm.module.scss";
import Field from "./Field";
import FormActions from "./FormActions";
import FormError from "./FormError";
import InputDiv from "./InputDiv";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import Paragraph from "./Paragraph";
import useApi from "../hooks/useApi";
import useAuthn from "../hooks/useAuthn";
import { Dialog, DialogContent } from "./Dialog";
import { handleApiError } from "../lib/utils";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

interface FormData {
  password: string;
}

export default function AccountDeleteForm() {
  const [confirming, setConfirming] = useState<boolean>(false);
  const [data, setData] = useState<FormData>();
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
    <>
      <Dialog open={confirming}>
        <DialogContent onDismiss={() => setConfirming(false)}>
          <Paragraph>
            Are you sure you want to delete your account, and permanently delete
            all of your data?
          </Paragraph>

          <form
            onSubmit={async (event) => {
              event.preventDefault();

              // Test for empty data to make TypeScript happy.
              if (isEmpty(data)) {
                setConfirming(false);
                return;
              }

              setSubmitting(true);
              const response = await accountDestroy({ data });
              setSubmitting(false);

              if (response.isError) {
                setConfirming(false);
                handleApiError<FormData>(response, { setError, setFieldError });
                return;
              }

              logout(() => navigate("/", { replace: true }));
            }}
          >
            <FormActions>
              <Button
                color="red"
                disabled={submitting}
                variant="filled"
                type="submit"
              >
                Delete
              </Button>

              <Button
                disabled={submitting}
                onClick={() => setConfirming(false)}
                type="button"
              >
                Dismiss
              </Button>
            </FormActions>
          </form>
        </DialogContent>
      </Dialog>

      <form
        className={classes.form}
        onSubmit={handleSubmit(async (data: FormData) => {
          setData(data);
          setConfirming(true);
        })}
      >
        <FormError error={error} setError={setError} />

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
          <Button color="red" disabled={submitting} type="submit">
            Delete account
          </Button>
        </FormActions>
      </form>
    </>
  );
}
