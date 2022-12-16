import Alert from "./Alert";
import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import Input from "./Input";
import InputError from "./InputError";
import Label from "./Label";
import useApi from "../hooks/useApi";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  const onSubmit = handleSubmit(async (data: FormData) => {
    setSubmitting(true);
    const response = await recipeCreate(data);
    setSubmitting(false);

    if (response.isError) {
      return handleApiError<FormData>(response, {
        setError,
        setFieldError,
      });
    }

    navigate(`/recipe/${response.data.id}`, { replace: true });
  });

  const onAlertDismiss = () => setError(undefined);

  const onFormDismiss = () => navigate("/dashboard");

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <Alert onDismiss={onAlertDismiss} variant="error">
          {error}
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
          <FontAwesomeIcon icon={faCirclePlus} /> Create recipe
        </Button>

        <Button disabled={submitting} onClick={onFormDismiss} type="button">
          Dismiss
        </Button>
      </FormActions>
    </form>
  );
}
