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
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Combobox from "./Combobox";

interface IngredientNewFormProps {
  brands: string[];
  food: string[];
  recipeId: string;
  units: string[];
}

interface FormData {
  amount?: string;
  brand?: string;
  food: string;
  unit?: string;
}

export default function IngredientNewForm({
  brands,
  food,
  recipeId,
  units,
}: IngredientNewFormProps) {
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>();
  const navigate = useNavigate();
  const { ingredientCreate } = useApi();

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
        const response = await ingredientCreate({ data, recipeId });
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
        <LabelDiv htmlFor="amount">Amount</LabelDiv>
        <InputDiv
          disabled={submitting}
          error={!!fieldErrors?.amount?.message}
          id="amount"
          step={0.25}
          type="number"
          {...register("amount")}
        />
        <InputError error={fieldErrors?.amount?.message} />
      </Field>

      <Field>
        <LabelDiv htmlFor="unit">Unit</LabelDiv>
        <Combobox
          clearErrors={() => clearErrors("unit")}
          disabled={submitting}
          error={!!fieldErrors?.unit?.message}
          id="unit"
          options={units}
          setValue={(value: string) => setValue("unit", value)}
          type="text"
          {...register("unit")}
        />
        <InputError error={fieldErrors?.unit?.message} />
      </Field>

      <Field>
        <LabelDiv htmlFor="brand">Brand</LabelDiv>
        <Combobox
          clearErrors={() => clearErrors("brand")}
          disabled={submitting}
          error={!!fieldErrors?.brand?.message}
          id="brand"
          options={brands}
          setValue={(value: string) => setValue("brand", value)}
          type="text"
          {...register("brand")}
        />
        <InputError error={fieldErrors?.brand?.message} />
      </Field>

      <Field>
        <LabelDiv htmlFor="food">Food</LabelDiv>
        <Combobox
          clearErrors={() => clearErrors("food")}
          disabled={submitting}
          error={!!fieldErrors?.food?.message}
          id="food"
          options={food}
          setValue={(value: string) => setValue("food", value)}
          type="text"
          {...register("food", { required: "Food is required." })}
        />
        <InputError error={fieldErrors?.food?.message} />
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
