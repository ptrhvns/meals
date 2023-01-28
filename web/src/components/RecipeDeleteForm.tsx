import Alert from "./Alert";
import Button from "./Button";
import FormActions from "./FormActions";
import Paragraph from "./Paragraph";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent } from "./Dialog";
import { RecipeData } from "../lib/types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface RecipeDeleteFormProps {
  recipe?: RecipeData;
}

export default function RecipeDeleteForm({ recipe }: RecipeDeleteFormProps) {
  const [confirming, setConfirming] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const { recipeDestroy } = useApi();

  return (
    <>
      <Dialog open={!!error}>
        <DialogContent onDismiss={() => setError(undefined)}>
          <Alert variant="error">{error}</Alert>
        </DialogContent>
      </Dialog>

      <Dialog open={confirming}>
        <DialogContent onDismiss={() => setConfirming(false)}>
          <Paragraph>Are you sure you want to delete this recipe?</Paragraph>

          <form
            onSubmit={handleSubmit(async () => {
              if (!recipe) {
                setConfirming(false);
                return;
              }

              setSubmitting(true);
              const response = await recipeDestroy({ recipeId: recipe.id });
              setSubmitting(false);
              setConfirming(false);

              if (response.isError) {
                setError(response.message);
                return;
              }

              navigate(`/dashboard`, { replace: true });
            })}
          >
            <FormActions>
              <Button
                color="red"
                disabled={submitting}
                type="submit"
                variant="filled"
              >
                Delete
              </Button>

              <Button
                disabled={submitting}
                onClick={() => setConfirming(false)}
                type="button"
              >
                Dismiss
              </Button>
            </FormActions>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        color="red"
        disabled={submitting}
        onClick={() => setConfirming(true)}
        type="button"
      >
        Delete
      </Button>
    </>
  );
}
