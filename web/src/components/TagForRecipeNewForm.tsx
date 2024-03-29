import Button from "./Button";
import Combobox from "./Combobox";
import Field from "./Field";
import FormActions from "./FormActions";
import FormError from "./FormError";
import InputError from "./InputError";
import Label from "./Label";
import useApi from "../hooks/useApi";
import { handleApiError } from "../lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

interface TagForRecipeNewFormProps {
  tags: string[];
}

interface FormData {
  name: string;
}

export default function TagForRecipeNewForm({
  tags,
}: TagForRecipeNewFormProps) {
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>();
  const navigate = useNavigate();
  const { recipeId } = useParams() as { recipeId: string };
  const { tagLink } = useApi();

  const {
    clearErrors,
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
    setValue,
  } = useForm<FormData>();

  return (
    <form
      onSubmit={handleSubmit(async (data: FormData) => {
        setSubmitting(true);
        const response = await tagLink({ recipeId, data });
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
        <Label htmlFor="name">Name</Label>
        <Combobox
          clearErrors={() => clearErrors("name")}
          disabled={submitting}
          error={!!fieldErrors?.name?.message}
          id="name"
          options={tags}
          setValue={(value: string) => setValue("name", value)}
          type="text"
          {...register("name", { required: "Name is required" })}
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
          Create
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
