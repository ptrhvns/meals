import Alert from "./Alert";
import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import Input from "./Input";
import Label from "./Label";
import useApi from "../hooks/useApi";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      {error && (
        <Alert onDismiss={() => setError(undefined)} variant="error">
          {error}
        </Alert>
      )}

      <Field>
        <Label htmlFor="title">Title</Label>
        <Input
          disabled={submitting}
          error={!!fieldErrors?.title?.message}
          id="title"
          type="text"
          {...register("title", { required: "Title is required." })}
        />
      </Field>

      <FormActions>
        <Button
          color="primary"
          disabled={submitting}
          type="submit"
          variant="filled"
        >
          <FontAwesomeIcon icon={faPenToSquare} /> Update
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
