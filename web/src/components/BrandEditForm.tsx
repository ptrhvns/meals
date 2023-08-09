import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import FormError from "./FormError";
import InputDiv from "./InputDiv";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import Paragraph from "./Paragraph";
import useApi from "../hooks/useApi";
import { BrandData } from "../lib/types";
import { Dialog, DialogContent } from "./Dialog";
import { handleApiError } from "../lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export interface BrandEditFormProps {
  brand?: BrandData;
}

interface FormData {
  name: string;
}

export default function BrandEditForm({ brand }: BrandEditFormProps) {
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { brandDestroy, brandUpdate } = useApi();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>({
    defaultValues: { name: brand?.name ?? "" },
  });

  if (!brand) return null;

  return (
    <>
      <Dialog open={confirmingDelete}>
        <DialogContent onDismiss={() => setConfirmingDelete(false)}>
          <Paragraph>
            Are you sure you want to delete this brand, and unlink it from all
            ingredients?
          </Paragraph>

          <form
            data-testid="brand-edit-form-confirmation-form"
            onSubmit={async (event) => {
              event.preventDefault();
              setSubmitting(true);

              const response = await brandDestroy({
                brandId: brand.id,
              });

              setSubmitting(false);
              setConfirmingDelete(false);

              if (response.isError) {
                setError(response.message);
                return;
              }

              navigate(`/dashboard/brands`, { replace: true });
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

          const response = await brandUpdate({
            data,
            brandId: brand.id,
          });

          setSubmitting(false);

          if (response.isError) {
            handleApiError(response, { setError, setFieldError });
            return;
          }

          navigate(`/dashboard/brands`, { replace: true });
        })}
      >
        <FormError error={error} setError={setError} />

        <Field>
          <LabelDiv htmlFor="name">Name</LabelDiv>
          <InputDiv
            disabled={submitting}
            error={!!fieldErrors?.name?.message}
            id="name"
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
            onClick={() => navigate("/dashboard/brands")}
            type="button"
          >
            Dismiss
          </Button>
        </FormActions>
      </form>
    </>
  );
}
