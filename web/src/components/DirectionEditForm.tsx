import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import FormError from "./FormError";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import Paragraph from "./Paragraph";
import Textarea from "./Textarea";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent } from "./Dialog";
import { DirectionData } from "../lib/types";
import { handleApiError } from "../lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface DirectionEditFormProps {
  direction?: DirectionData;
  recipeId: string;
}

interface FormData {
  description: string;
}

export default function DirectionEditForm({
  direction,
  recipeId,
}: DirectionEditFormProps) {
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>();
  const navigate = useNavigate();
  const { directionDestroy, directionUpdate } = useApi();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>({
    defaultValues: { description: direction?.description },
  });

  if (!direction) return null;

  return (
    <>
      <Dialog open={confirmingDelete}>
        <DialogContent onDismiss={() => setConfirmingDelete(false)}>
          <Paragraph>Are you sure you want to delete this direction?</Paragraph>

          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setSubmitting(true);

              const response = await directionDestroy({
                directionId: direction.id,
              });

              setSubmitting(false);
              setConfirmingDelete(false);

              if (response.isError) {
                setError(response.message);
                return;
              }

              navigate(`/recipe/${recipeId}`, { replace: true });
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

          const response = await directionUpdate({
            data,
            directionId: direction.id,
          });

          setSubmitting(false);

          if (response.isError) {
            return handleApiError<FormData>(response, {
              setError,
              setFieldError,
            });
          }

          navigate(`/recipe/${recipeId}`, { replace: true });
        })}
      >
        <FormError error={error} setError={setError} />

        <Field>
          <LabelDiv htmlFor="description">Description</LabelDiv>
          <Textarea
            disabled={submitting}
            error={!!fieldErrors?.description?.message}
            id="description"
            {...register("description", {
              required: "Description is required",
            })}
          />
          <InputError error={fieldErrors?.description?.message} />
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
            onClick={() => navigate(`/recipe/${recipeId}`)}
            type="button"
          >
            Dismiss
          </Button>
        </FormActions>
      </form>
    </>
  );
}
