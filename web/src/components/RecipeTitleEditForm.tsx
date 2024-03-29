import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import FormError from "./FormError";
import InputDiv from "./InputDiv";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import useApi from "../hooks/useApi";
import { handleApiError } from "../lib/utils";
import { RecipeData } from "../lib/types";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

interface RecipeTitleEditFormProps {
  recipe?: RecipeData;
}

interface FormData {
  title: string;
}

export default function RecipeTitleEditForm({
  recipe,
}: RecipeTitleEditFormProps) {
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>();
  const navigate = useNavigate();
  const { recipeId } = useParams() as { recipeId: string };
  const { recipeTitleUpdate } = useApi();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>({ defaultValues: { title: recipe?.title ?? "" } });

  if (!recipe) return null;

  return (
    <form
      onSubmit={handleSubmit(async (data: FormData) => {
        setSubmitting(true);
        const response = await recipeTitleUpdate({ recipeId, data });
        setSubmitting(false);

        if (response.isError) {
          handleApiError(response, { setError, setFieldError });
          return;
        }

        navigate(`/recipe/${recipeId}`, { replace: true });
      })}
    >
      <FormError error={error} setError={setError} />

      <Field>
        <LabelDiv htmlFor="title">Title</LabelDiv>
        <InputDiv
          disabled={submitting}
          error={!!fieldErrors?.title?.message}
          id="title"
          type="text"
          {...register("title", { required: "Title is required." })}
        />
        <InputError error={fieldErrors?.title?.message} />
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
          disabled={submitting}
          onClick={() => navigate(`/recipe/${recipeId}`)}
          type="button"
        >
          Dismiss
        </Button>
      </FormActions>
    </form>
  );
}
