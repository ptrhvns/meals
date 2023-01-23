import Alert from "./Alert";
import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import InputDiv from "./InputDiv";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import useApi from "../hooks/useApi";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleApiError } from "../lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface FormData {
  name: string;
}

export default function TagNewForm() {
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { tagCreate } = useApi();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>();

  return (
    <form
      onSubmit={handleSubmit(async (data: FormData) => {
        setSubmitting(true);
        const response = await tagCreate(data);
        setSubmitting(false);

        if (response.isError) {
          return handleApiError<FormData>(response, {
            setError,
            setFieldError,
          });
        }

        // TODO navigate to tags tab of dashboard.
        navigate(`/dashboard`, { replace: true });
      })}
    >
      {error && (
        <Alert onDismiss={() => setError(undefined)} variant="error">
          {error}
        </Alert>
      )}

      <Field>
        <LabelDiv htmlFor="name">Name</LabelDiv>
        <InputDiv
          disabled={submitting}
          error={!!fieldErrors?.name?.message}
          id="name"
          type="name"
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
          <FontAwesomeIcon icon={faCirclePlus} /> Create tag
        </Button>

        {/* TODO navigate to tags tab of dashboard. */}
        <Button
          disabled={submitting}
          onClick={() => navigate("/dashboard")}
          type="button"
        >
          Dismiss
        </Button>
      </FormActions>
    </form>
  );
}
