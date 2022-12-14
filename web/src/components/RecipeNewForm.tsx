import Alert from "./Alert";
import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import Input from "./Input";
import InputError from "./InputError";
import Label from "./Label";
import useApi from "../hooks/useApi";
import { handleApiError } from "../lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

interface FormData {
  title: string;
}

export default function RecipeNewForm() {
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { recipeCreate } = useApi();
  const navigate = useNavigate();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data: FormData) => {
    setSubmitting(true);
    const response = await recipeCreate(data);
    setSubmitting(false);

    if (response.isError) {
      return handleApiError<FormData>(response, {
        setFieldError,
        setFormError,
      });
    }

    navigate(`/recipe/${response.data.id}`, { replace: true });
  });

  const onAlertDismiss = () => setFormError(undefined);

  const onFormDismiss = () => navigate("/dashboard");

  return (
    <form onSubmit={onSubmit}>
      {formError && (
        <Alert onDismiss={onAlertDismiss} variant="error">
          {formError}
        </Alert>
      )}

      <Field>
        <Label htmlFor="title">Title</Label>
        <Input
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
          Create recipe
        </Button>

        <Button disabled={submitting} onClick={onFormDismiss} type="button">
          Dismiss
        </Button>
      </FormActions>
    </form>
  );
}
