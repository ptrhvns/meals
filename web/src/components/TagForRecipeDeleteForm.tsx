import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import Alert from "./Alert";
import Button from "./Button";
import classes from "../styles/components/TagForRecipeDeleteForm.module.scss";
import FormActions from "./FormActions";
import Paragraph from "./Paragraph";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent } from "./Dialog";
import { Dispatch, useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RecipeData, RecipeReducerAction, TagData } from "../lib/types";
import { useForm } from "react-hook-form";

interface TagForRecipeDeleteFormProps {
  dispatch: Dispatch<RecipeReducerAction>;
  recipe: RecipeData;
  tag: TagData;
}

export default function TagForRecipeDeleteForm({
  dispatch,
  recipe,
  tag,
}: TagForRecipeDeleteFormProps) {
  const [confirming, setConfirming] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { handleSubmit } = useForm();
  const { tagDissociate } = useApi();

  return (
    <>
      <Dialog open={!!error}>
        <DialogContent onDismiss={() => setError(undefined)}>
          <Alert variant="error">{error}</Alert>
        </DialogContent>
      </Dialog>

      <Dialog open={confirming}>
        <DialogContent onDismiss={() => setConfirming(false)}>
          <Paragraph>
            <strong>Are you sure you want to delete this tag?</strong>
          </Paragraph>

          <Paragraph>
            It will only be removed from this recipe. To remove it from all
            recipes, visit the tags manager.
          </Paragraph>

          <form
            onSubmit={handleSubmit(async () => {
              setSubmitting(true);

              const response = await tagDissociate({
                recipeId: recipe.id,
                tagId: tag.id,
              });

              setSubmitting(false);

              if (response.isError) {
                setError(response.message);
                setConfirming(false);
                return;
              }

              dispatch({ type: "deleteTag", payload: tag.id });
              setConfirming(false);
            })}
          >
            <FormActions>
              <Button
                color="red"
                disabled={submitting}
                variant="filled"
                type="submit"
              >
                Delete tag
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
        className={classes.button}
        disabled={submitting}
        onClick={() => setConfirming(true)}
        title="Delete"
        type="button"
        variant="unstyled"
      >
        <AccessibleIcon.Root label="Delete">
          <FontAwesomeIcon icon={faTimes} />
        </AccessibleIcon.Root>
      </Button>
    </>
  );
}
