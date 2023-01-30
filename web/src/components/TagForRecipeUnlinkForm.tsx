import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import Alert from "./Alert";
import Button from "./Button";
import classes from "../styles/components/TagForRecipeUnlinkForm.module.scss";
import FormActions from "./FormActions";
import Paragraph from "./Paragraph";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent } from "./Dialog";
import { Dispatch, useState } from "react";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RecipeData, RecipeReducerAction, TagData } from "../lib/types";
import { useForm } from "react-hook-form";

interface TagForRecipeUnlinkFormProps {
  dispatch: Dispatch<RecipeReducerAction>;
  recipe: RecipeData;
  tag: TagData;
}

export default function TagForRecipeUnlinkForm({
  dispatch,
  recipe,
  tag,
}: TagForRecipeUnlinkFormProps) {
  const [confirming, setConfirming] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { handleSubmit } = useForm();
  const { tagUnlink } = useApi();

  return (
    <>
      <Dialog open={!!error}>
        <DialogContent onDismiss={() => setError(undefined)}>
          <Alert variant="error">{error}</Alert>
        </DialogContent>
      </Dialog>

      <Dialog open={confirming}>
        <DialogContent onDismiss={() => setConfirming(false)}>
          <Paragraph>Are you sure you want to unlink this tag?</Paragraph>

          <Paragraph>
            It will only be unlinked from this recipe. To unlink it from other
            recipes, or to delete it entirely, visit the tag.
          </Paragraph>

          <form
            onSubmit={handleSubmit(async () => {
              setSubmitting(true);

              const response = await tagUnlink({
                recipeId: recipe.id,
                tagId: tag.id,
              });

              setSubmitting(false);

              if (response.isError) {
                setError(response.message);
                setConfirming(false);
                return;
              }

              dispatch({ type: "unlinkTag", payload: tag.id });
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
                Unlink
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
        title="Unlink"
        type="button"
        variant="unstyled"
      >
        <AccessibleIcon.Root label="Unlink">
          <FontAwesomeIcon icon={faCircleXmark} />
        </AccessibleIcon.Root>
      </Button>
    </>
  );
}
