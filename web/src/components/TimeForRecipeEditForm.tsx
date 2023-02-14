import Button from "./Button";
import classes from "../styles/components/TimeForRecipeEditForm.module.scss";
import Combobox from "./Combobox";
import Field from "./Field";
import FormActions from "./FormActions";
import FormError from "./FormError";
import Input from "./Input";
import InputDiv from "./InputDiv";
import InputError from "./InputError";
import Label from "./Label";
import LabelDiv from "./LabelDiv";
import Paragraph from "./Paragraph";
import SublabelDiv from "./SublabelDiv";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent } from "./Dialog";
import { handleApiError } from "../lib/utils";
import { TimeCategoryData, TimeData } from "../lib/types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface TimeForRecipeEditFormProps {
  recipeId: string;
  time?: TimeData;
  timeCategories?: TimeCategoryData[];
}

interface FormData {
  days: string;
  hours: string;
  minutes: string;
  note: string;
  time_category: { name: string };
}

export default function TimeForRecipeEditForm({
  recipeId,
  time,
  timeCategories,
}: TimeForRecipeEditFormProps) {
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>();
  const navigate = useNavigate();
  const { timeDestroy, timeUpdate } = useApi();

  const {
    clearErrors,
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      days: time?.days?.toString() ?? "",
      hours: time?.hours?.toString() ?? "",
      minutes: time?.minutes?.toString() ?? "",
      note: time?.note ?? "",
      time_category: time?.time_category ?? { name: "" },
    },
  });

  if (!time || !timeCategories) return null;

  return (
    <>
      <Dialog open={confirmingDelete}>
        <DialogContent onDismiss={() => setConfirmingDelete(false)}>
          <Paragraph>
            Are you sure you want to delete this time? The related category will
            not be deleted.
          </Paragraph>

          <form
            onSubmit={async (event) => {
              event.preventDefault();

              if (!time) {
                setConfirmingDelete(false);
                return;
              }

              setSubmitting(true);
              const response = await timeDestroy({ timeId: time.id });
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
          const response = await timeUpdate({
            data,
            recipeId,
            timeId: time.id,
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
          <LabelDiv htmlFor="category">Category</LabelDiv>
          <SublabelDiv>(Cook, Preparation, etc.)</SublabelDiv>
          <Combobox
            clearErrors={() => clearErrors("time_category")}
            disabled={submitting}
            error={!!fieldErrors?.time_category?.name?.message}
            id="category"
            maxLength={32 /* from API model */}
            options={timeCategories.map((t) => t.name)}
            setValue={(value: string) => setValue("time_category.name", value)}
            type="text"
            {...register("time_category.name", {
              required: "Category is required.",
            })}
          />
          <InputError error={fieldErrors?.time_category?.name?.message} />
        </Field>

        <div className={classes.unitsWrapper}>
          <Field>
            <Label htmlFor="days">Days</Label>
            <Input
              disabled={submitting}
              error={!!fieldErrors?.days?.message}
              id="days"
              {...register("days")}
            />
            <InputError error={fieldErrors?.days?.message} />
          </Field>

          <Field>
            <Label htmlFor="hours">Hours</Label>
            <Input
              disabled={submitting}
              error={!!fieldErrors?.hours?.message}
              id="hours"
              {...register("hours")}
            />
            <InputError error={fieldErrors?.hours?.message} />
          </Field>

          <Field>
            <Label htmlFor="minutes">Minutes</Label>
            <Input
              disabled={submitting}
              error={!!fieldErrors?.minutes?.message}
              id="minutes"
              {...register("minutes")}
            />
            <InputError error={fieldErrors?.minutes?.message} />
          </Field>
        </div>

        <Field>
          <LabelDiv htmlFor="note">Note</LabelDiv>
          <InputDiv
            disabled={submitting}
            error={!!fieldErrors?.note?.message}
            id="note"
            {...register("note")}
          />
          <InputError error={fieldErrors?.note?.message} />
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
