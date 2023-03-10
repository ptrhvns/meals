import useApi from "../hooks/useApi";
import { handleApiError } from "../lib/utils";
import { IngredientData } from "../lib/types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FormError from "./FormError";
import Field from "./Field";
import LabelDiv from "./LabelDiv";
import InputDiv from "./InputDiv";
import InputError from "./InputError";
import Combobox from "./Combobox";
import FormActions from "./FormActions";
import Button from "./Button";
import { Dialog, DialogContent } from "./Dialog";
import Paragraph from "./Paragraph";

interface IngredientEditFormProps {
  brands: string[];
  food: string[];
  ingredient?: IngredientData;
  recipeId: string;
  units: string[];
}

interface FormData {
  amount?: string;
  brand?: string;
  food: string;
  unit?: string;
}

export default function IngredientEditForm({
  brands,
  food,
  ingredient,
  recipeId,
  units,
}: IngredientEditFormProps) {
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>();
  const navigate = useNavigate();
  const { ingredientDestroy, ingredientUpdate } = useApi();

  const {
    clearErrors,
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      amount: ingredient?.amount?.toString(),
      brand: ingredient?.brand?.name,
      food: ingredient?.food?.name,
      unit: ingredient?.unit?.name,
    },
  });

  if (!ingredient) return null;

  return (
    <>
      <Dialog open={confirmingDelete}>
        <DialogContent onDismiss={() => setConfirmingDelete(false)}>
          <Paragraph>
            Are you sure you want to delete this ingredient?
          </Paragraph>

          <Paragraph variant="dimmed">
            Any brands, food, or units created with this ingredient will not be
            deleted. To delete those items, you will need to manage them
            directly.
          </Paragraph>

          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setSubmitting(true);
              const response = await ingredientDestroy({
                ingredientId: ingredient.id,
              });
              setSubmitting(false);
              setConfirmingDelete(false);

              if (response.isError) {
                setError(response.message);
                return;
              }

              navigate(`/recipe/${recipeId}`, { replace: true });
            }}
          >
            <FormActions>
              <Button
                color="red"
                disabled={submitting}
                variant="filled"
                type="submit"
              >
                Delete
              </Button>

              <Button
                disabled={submitting}
                onClick={() => setConfirmingDelete(false)}
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
          const response = await ingredientUpdate({
            data,
            ingredientId: ingredient.id,
          });
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
            Update
          </Button>

          <Button
            color="red"
            disabled={submitting}
            onClick={() => setConfirmingDelete(true)}
            type="button"
          >
            Delete
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
    </>
  );
}
