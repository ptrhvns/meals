import Button from "./Button";
import classes from "../styles/routes/RatingEditForm.module.scss";
import FormActions from "./FormActions";
import FormError from "./FormError";
import InputError from "./InputError";
import Paragraph from "./Paragraph";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent } from "./Dialog";
import { handleApiError } from "../lib/utils";
import { Rating as ReactRating } from "@smastrom/react-rating";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface RatingEditFormProps {
  rating?: number;
  recipeId: string;
}

export default function RatingEditForm({
  rating = 0,
  recipeId,
}: RatingEditFormProps) {
  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [ratingError, setRatingError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { ratingDestroy, ratingUpdate } = useApi();

  return (
    <>
      <Dialog open={confirmingReset}>
        <DialogContent onDismiss={() => setConfirmingReset(false)}>
          <Paragraph>Are you sure you want to reset the rating?</Paragraph>

          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setSubmitting(true);
              const response = await ratingDestroy({ recipeId });
              setSubmitting(false);
              setConfirmingReset(false);

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
                Reset
              </Button>

              <Button
                disabled={submitting}
                onClick={() => setConfirmingReset(false)}
                type="button"
              >
                Dismiss
              </Button>
            </FormActions>
          </form>
        </DialogContent>
      </Dialog>

      <FormError error={error} setError={setError} />

      <div className={classes.ratingWrapper}>
        <ReactRating
          className={classes.rating}
          isDisabled={submitting}
          onChange={async (value: number) => {
            if (submitting) return;
            setSubmitting(true);

            const response = await ratingUpdate({
              data: { rating: value },
              recipeId,
            });

            setSubmitting(false);

            if (response.isError) {
              handleApiError(response, { setError });
              setRatingError(response.message);
              return;
            }

            navigate(`/recipe/${recipeId}`, { replace: true });
          }}
          value={rating}
        />
        <span className={classes.ratingText}>({rating || 0})</span>
      </div>

      <InputError className={classes.inputError} error={ratingError} />

      <FormActions>
        <Button
          color="red"
          disabled={submitting}
          onClick={() => setConfirmingReset(true)}
          type="button"
        >
          Reset
        </Button>

        <Button
          disabled={submitting}
          onClick={() => navigate(`/recipe/${recipeId}`)}
          type="button"
        >
          Dismiss
        </Button>
      </FormActions>
    </>
  );
}
