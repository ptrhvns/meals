import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import Paragraph from "./Paragraph";
import Textarea from "./Textarea";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent } from "./Dialog";
import { handleApiError } from "../lib/utils";
import { RecipeData } from "../lib/types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FormError from "./FormError";

interface NotesEditFormProps {
  recipe?: RecipeData;
}

interface FormData {
  notes: string;
}

export default function NotesEditForm({ recipe }: NotesEditFormProps) {
  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>();
  const navigate = useNavigate();
  const { notesDestroy, notesUpdate } = useApi();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>({
    defaultValues: {
      notes: recipe?.notes,
    },
  });

  if (!recipe) return null;

  return (
    <>
      <Dialog open={confirmingReset}>
        <DialogContent onDismiss={() => setConfirmingReset(false)}>
          <Paragraph>Are you sure you want to reset notes?</Paragraph>

          <form
            onSubmit={async (event) => {
              event.preventDefault();

              if (!recipe) {
                setConfirmingReset(false);
                return;
              }

              setSubmitting(true);
              const response = await notesDestroy({ recipeId: recipe.id });
              setSubmitting(false);
              setConfirmingReset(false);

              if (response.isError) {
                setError(response.message);
                return;
              }

              navigate(`/recipe/${recipe.id}`, { replace: true });
            }}
          >
            <FormActions>
              <Button
                color="red"
                disabled={submitting}
                variant="filled"
                type="submit"
              >
                Reset
              </Button>

              <Button
                disabled={submitting}
                onClick={() => setConfirmingReset(false)}
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
          const response = await notesUpdate({ data, recipeId: recipe.id });
          setSubmitting(false);

          if (response.isError) {
            handleApiError(response, { setError, setFieldError });
            return;
          }

          navigate(`/recipe/${recipe.id}`, { replace: true });
        })}
      >
        <FormError error={error} setError={setError} />

        <Field>
          <LabelDiv htmlFor="notes">Notes</LabelDiv>
          <Textarea
            disabled={submitting}
            error={!!fieldErrors?.notes?.message}
            id="notes"
            {...register("notes", { required: "Notes is required." })}
          />
          <InputError error={fieldErrors?.notes?.message} />
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
            onClick={() => setConfirmingReset(true)}
            type="button"
          >
            Reset
          </Button>

          <Button
            disabled={submitting}
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            type="button"
          >
            Dismiss
          </Button>
        </FormActions>
      </form>
    </>
  );
}
