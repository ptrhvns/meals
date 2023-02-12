import Button from "./Button";
import classes from "../styles/components/TimeNewForm.module.scss";
import Combobox from "./Combobox";
import Field from "./Field";
import FormActions from "./FormActions";
import FormError from "./FormError";
import Input from "./Input";
import InputDiv from "./InputDiv";
import InputError from "./InputError";
import Label from "./Label";
import LabelDiv from "./LabelDiv";
import SublabelDiv from "./SublabelDiv";
import useApi from "../hooks/useApi";
import { handleApiError } from "../lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface TimeNewFormProps {
  recipeId: string;
  timeCategories: string[];
}

interface FormData {
  days: string;
  hours: string;
  minutes: string;
  note: string;
  time_category: { name: string };
}

export default function TimeNewForm({
  recipeId,
  timeCategories,
}: TimeNewFormProps) {
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>();
  const navigate = useNavigate();
  const { timeCreate } = useApi();

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
        const response = await timeCreate({ data, recipeId });
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
          options={timeCategories}
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
