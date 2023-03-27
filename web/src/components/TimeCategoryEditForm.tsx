import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import FormError from "./FormError";
import InputDiv from "./InputDiv";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import Paragraph from "./Paragraph";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent } from "./Dialog";
import { handleApiError } from "../lib/utils";
import { TimeCategoryData } from "../lib/types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface TimeCategoryEditFormProps {
  timeCategory?: TimeCategoryData;
}

interface FormData {
  name: string;
}

export default function TimeCategoryEditForm({
  timeCategory,
}: TimeCategoryEditFormProps) {
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { timeCategoryDestroy, timeCategoryUpdate } = useApi();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>({
    defaultValues: { name: timeCategory?.name ?? "" },
  });

  if (!timeCategory) return null;

  return (
    <>
      <Dialog open={confirmingDelete}>
        <DialogContent onDismiss={() => setConfirmingDelete(false)}>
          <Paragraph>
            Are you sure you want to delete this time category, and unlink it
            from all recipes?
          </Paragraph>

          <form
            onSubmit={async (event) => {
              event.preventDefault();

              if (!timeCategory) {
                setConfirmingDelete(false);
                return;
              }

              setSubmitting(true);

              const response = await timeCategoryDestroy({
                timeCategoryId: timeCategory.id,
              });

              setSubmitting(false);
              setConfirmingDelete(false);

              if (response.isError) {
                setError(response.message);
                return;
              }

              navigate(`/dashboard/times`, { replace: true });
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
                onClick={() => setConfirmingDelete(false)}
                type="button"
              >
                Dismiss
              </Button>
            </FormActions>
          </form>
        </DialogContent>
      </Dialog>

      <form
        onSubmit={handleSubmit(async (data: FormData) => {
          setSubmitting(true);

          const response = await timeCategoryUpdate({
            data,
            timeCategoryId: timeCategory.id,
          });

          setSubmitting(false);

          if (response.isError) {
            handleApiError(response, { setError, setFieldError });
            return;
          }

          navigate(`/dashboard/times`, { replace: true });
        })}
      >
        <FormError error={error} setError={setError} />

        <Field>
          <LabelDiv htmlFor="name">Name</LabelDiv>
          <InputDiv
            disabled={submitting}
            error={!!fieldErrors?.name?.message}
            id="name"
            type="text"
            {...register("name", { required: "Name is required." })}
          />
          <InputError error={fieldErrors?.name?.message} />
        </Field>

        <FormActions>
          <Button
            color="primary"
            disabled={submitting}
            type="submit"
            variant="filled"
          >
            Update
          </Button>

          <Button
            color="red"
            disabled={submitting}
            onClick={() => setConfirmingDelete(true)}
            type="button"
          >
            Delete
          </Button>

          <Button
            disabled={submitting}
            onClick={() => navigate("/dashboard/times")}
            type="button"
          >
            Dismiss
          </Button>
        </FormActions>
      </form>
    </>
  );
}
