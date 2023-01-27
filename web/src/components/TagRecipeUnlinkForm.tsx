import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import Alert from "./Alert";
import Button from "./Button";
import classes from "../styles/components/TagRecipeUnlinkForm.module.scss";
import FormActions from "./FormActions";
import Paragraph from "./Paragraph";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent } from "./Dialog";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RecipeData, TagData } from "../lib/types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

interface TagRecipeUnlinkFormProps {
  recipe: RecipeData;
  tag: TagData;
}

export default function TagRecipeUnlinkForm({
  recipe,
  tag,
}: TagRecipeUnlinkFormProps) {
  const [confirming, setConfirming] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
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
          <Paragraph>
            <strong>Are you sure you want to unlink this recipe?</strong>
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

              setConfirming(false);

              // XXX The following "full reload" navigation is suboptimal for
              // performance and user experience. However, it's an easy way to
              // ensure the recipe list state, including pagination, is correct.
              // Maybe we can improve things in the future with more
              // sophisticated state management in the ancestor components.
              navigate(0);
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
        disabled={submitting}
        onClick={() => setConfirming(true)}
        title="Unlink"
        type="button"
        variant="unstyled"
      >
        <AccessibleIcon.Root label="Unlink">
          <FontAwesomeIcon
            className={classes.unlinkIcon}
            icon={faCircleXmark}
          />
        </AccessibleIcon.Root>
      </Button>
    </>
  );
}
