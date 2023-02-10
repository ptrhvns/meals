import Alert from "./Alert";
import Button from "./Button";
import classes from "../styles/components/ServingsEditForm.module.scss";
import Field from "./Field";
import FormActions from "./FormActions";
import InputDiv from "./InputDiv";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import Paragraph from "./Paragraph";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent } from "./Dialog";
import { handleApiError } from "../lib/utils";
import { RecipeData } from "../lib/types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface ServingsEditFormProps {
  recipe?: RecipeData;
}

interface FormData {
  servings: number;
}

export default function ServingsEditForm({ recipe }: ServingsEditFormProps) {
  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>();
  const navigate = useNavigate();
  const { servingsDestroy, servingsUpdate } = useApi();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>({
    defaultValues: { servings: recipe?.servings ?? 0 },
  });

  if (!recipe) return null;

  return (
    <>
      <Dialog open={confirmingReset}>
        <DialogContent onDismiss={() => setConfirmingReset(false)}>
          <Paragraph>Are you sure you want to reset servings?</Paragraph>

          <form
            onSubmit={handleSubmit(async () => {
              if (!recipe) {
                setConfirmingReset(false);
                return;
              }

              setSubmitting(true);
              const response = await servingsDestroy({ recipeId: recipe.id });
              setSubmitting(false);
              setConfirmingReset(false);

              if (response.isError) {
                setError(response.message);
                return;
              }

              navigate(`/recipe/${recipe.id}`, { replace: true });
            })}
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
          const response = await servingsUpdate({ data, recipeId: recipe.id });
          setSubmitting(false);

          if (response.isError) {
            handleApiError(response, { setError, setFieldError });
            return;
          }

          navigate(`/recipe/${recipe.id}`, { replace: true });
        })}
      >
        {error && (
          <Alert onDismiss={() => setError(undefined)} variant="error">
            {error}
          </Alert>
        )}

        <Field>
          <LabelDiv htmlFor="servings">Servings</LabelDiv>
          <InputDiv
            className={classes.input}
            disabled={submitting}
            error={!!fieldErrors?.servings?.message}
            id="servings"
            min={0}
            step={0.25}
            type="number"
            {...register("servings", { required: "Servings is required." })}
          />
          <InputError error={fieldErrors?.servings?.message} />
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
