import Button from "./Button";
import Combobox from "./Combobox";
import Field from "./Field";
import FormActions from "./FormActions";
import FormError from "./FormError";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import Paragraph from "./Paragraph";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent } from "./Dialog";
import { FoodData } from "../lib/types";
import { handleApiError } from "../lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface FoodEditFormProps {
  foodOne?: FoodData;
  foodMany: string[];
}

interface FormData {
  name: string;
}

export default function FoodEditForm({ foodOne, foodMany }: FoodEditFormProps) {
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { foodDestroy, foodUpdate } = useApi();

  const {
    clearErrors,
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
    setValue,
  } = useForm<FormData>({
    defaultValues: { name: foodOne?.name ?? "" },
  });

  if (!foodOne) return null;

  return (
    <>
      <Dialog open={confirmingDelete}>
        <DialogContent onDismiss={() => setConfirmingDelete(false)}>
          <Paragraph>
            Are you sure you want to delete this food and delete all linked
            ingredients?
          </Paragraph>

          <form
            onSubmit={async (event) => {
              event.preventDefault();

              if (!foodOne) {
                setConfirmingDelete(false);
                return;
              }

              setSubmitting(true);
              const response = await foodDestroy({ foodId: foodOne.id });
              setSubmitting(false);
              setConfirmingDelete(false);

              if (response.isError) {
                setError(response.message);
                return;
              }

              navigate(`/dashboard/food`, { replace: true });
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
          const response = await foodUpdate({ data, foodId: foodOne.id });
          setSubmitting(false);

          if (response.isError) {
            handleApiError(response, { setError, setFieldError });
            return;
          }

          navigate(`/dashboard/food`, { replace: true });
        })}
      >
        <FormError error={error} setError={setError} />

        <Field>
          <LabelDiv htmlFor="name">Name</LabelDiv>
          <Combobox
            clearErrors={() => clearErrors("name")}
            disabled={submitting}
            error={!!fieldErrors?.name?.message}
            id="name"
            options={foodMany}
            setValue={(value: string) => setValue("name", value)}
            type="text"
            {...register("name", { required: "Name is required." })}
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
            onClick={() => navigate("/dashboard/food")}
            type="button"
          >
            Dismiss
          </Button>
        </FormActions>
      </form>
    </>
  );
}
