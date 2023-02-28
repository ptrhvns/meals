import Button from "./Button";
import Combobox from "./Combobox";
import Field from "./Field";
import FormActions from "./FormActions";
import FormError from "./FormError";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import useApi from "../hooks/useApi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleApiError } from "../lib/utils";

interface EquipmentForRecipeNewFormProps {
  equipment: string[];
  recipeId: string;
}

interface FormData {
  description: string;
}

export default function EquipmentForRecipeNewForm({
  equipment,
  recipeId,
}: EquipmentForRecipeNewFormProps) {
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>();
  const navigate = useNavigate();
  const { equipmentLink } = useApi();

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
        const response = await equipmentLink({ data, recipeId });
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
        <LabelDiv htmlFor="description">Description</LabelDiv>
        <Combobox
          clearErrors={() => clearErrors("description")}
          disabled={submitting}
          error={!!fieldErrors?.description?.message}
          id="description"
          options={equipment}
          setValue={(value: string) => setValue("description", value)}
          type="text"
          {...register("description", { required: "Description is required." })}
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
