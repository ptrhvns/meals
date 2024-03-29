import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import FormError from "./FormError";
import InputDiv from "./InputDiv";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import useApi from "../hooks/useApi";
import { handleApiError } from "../lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

interface FormData {
  title: string;
}

export default function RecipeNewForm() {
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { recipeCreate } = useApi();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>();

  return (
    <form
      onSubmit={handleSubmit(async (data: FormData) => {
        setSubmitting(true);
        const response = await recipeCreate({ data });
        setSubmitting(false);

        if (response.isError) {
          return handleApiError<FormData>(response, {
            setError,
            setFieldError,
          });
        }

        navigate(`/recipe/${response.data.recipe.id}`, { replace: true });
      })}
    >
      <FormError error={error} setError={setError} />

      <Field>
        <LabelDiv htmlFor="title">Title</LabelDiv>
        <InputDiv
          disabled={submitting}
          error={!!fieldErrors?.title?.message}
          id="title"
          type="title"
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
          Create
        </Button>

        <Button
          disabled={submitting}
          onClick={() => navigate("/dashboard")}
          type="button"
        >
          Dismiss
        </Button>
      </FormActions>
    </form>
  );
}
