import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import Alert from "./Alert";
import Button from "./Button";
import classes from "../styles/components/EquipmentRecipeUnlinkForm.module.scss";
import FormActions from "./FormActions";
import Paragraph from "./Paragraph";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent } from "./Dialog";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RecipeData, EquipmentData } from "../lib/types";
import { useNavigate } from "react-router";
import { useState } from "react";

interface EquipmentRecipeUnlinkFormProps {
  recipe: RecipeData;
  equipment: EquipmentData;
}

export default function EquipmentRecipeUnlinkForm({
  recipe,
  equipment,
}: EquipmentRecipeUnlinkFormProps) {
  const [confirming, setConfirming] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { equipmentUnlink } = useApi();

  return (
    <>
      <Dialog open={!!error}>
        <DialogContent onDismiss={() => setError(undefined)}>
          <Alert variant="error">{error}</Alert>
        </DialogContent>
      </Dialog>

      <Dialog open={confirming}>
        <DialogContent onDismiss={() => setConfirming(false)}>
          <Paragraph>Are you sure you want to unlink this recipe?</Paragraph>

          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setSubmitting(true);

              const response = await equipmentUnlink({
                recipeId: recipe.id,
                equipmentId: equipment.id,
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
            }}
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
