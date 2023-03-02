import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import Alert from "./Alert";
import Button from "./Button";
import classes from "../styles/components/EquipmentForRecipeUnlinkForm.module.scss";
import FormActions from "./FormActions";
import Paragraph from "./Paragraph";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent } from "./Dialog";
import { Dispatch, useState } from "react";
import { EquipmentData, RecipeData, RecipeReducerAction } from "../lib/types";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface EquipmentForRecipeUnlinkFormProps {
  dispatch: Dispatch<RecipeReducerAction>;
  recipe: RecipeData;
  equipment: EquipmentData;
}

export default function EquipmentForRecipeUnlinkForm({
  dispatch,
  recipe,
  equipment,
}: EquipmentForRecipeUnlinkFormProps) {
  const [confirming, setConfirming] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
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
          <Paragraph>Are you sure you want to unlink this equipment?</Paragraph>

          <Paragraph variant="dimmed">
            It will only be unlinked from this recipe. To unlink it from other
            recipes, or to delete it entirely, manage the piece of equipment
            itself.
          </Paragraph>

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

              dispatch({ type: "unlinkEquipment", payload: equipment.id });
              setConfirming(false);
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
