import Alert from "./Alert";
import Anchor from "./Anchor";
import classes from "../styles/components/RecipesForEquipmentList.module.scss";
import EquipmentRecipeUnlinkForm from "./EquipmentRecipeUnlinkForm";
import Pagination from "./Pagination";
import Paragraph from "./Paragraph";
import Table from "./Table";
import useApi from "../hooks/useApi";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleApiError } from "../lib/utils";
import { isEmpty } from "lodash";
import { PaginationData, RecipeData, EquipmentData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

interface RecipesForEquipmentListProps {
  equipment?: EquipmentData;
}

export default function RecipesForEquipmentList({
  equipment,
}: RecipesForEquipmentListProps) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationData>();
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const { equipmentRecipesGet } = useApi();

  async function handleRecipesGet(page?: number) {
    if (!equipment) return;

    const response = await equipmentRecipesGet({
      page,
      equipmentId: equipment.id,
    });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setPagination(response.data.pagination);
    setRecipes(response.data.recipes);
  }

  useEffectOnce(handleRecipesGet);

  if (!equipment) return null;

  return (
    <>
      {loading ? (
        <Paragraph>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </Paragraph>
      ) : error ? (
        <Alert alertClassName={classes.alert} variant="error">
          {error}
        </Alert>
      ) : isEmpty(recipes) ? (
        <Paragraph variant="dimmed">
          No recipes have been linked to this equipment yet.
        </Paragraph>
      ) : (
        <>
          <Table className={classes.table} striped>
            <thead>
              <tr>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>
                    <Anchor to={`/recipe/${recipe.id}`}>{recipe.title}</Anchor>
                  </td>

                  <td>
                    <EquipmentRecipeUnlinkForm
                      recipe={recipe}
                      equipment={equipment}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {pagination && pagination.total > 1 && (
            <Pagination
              navClassName={classes.pagination}
              onChange={handleRecipesGet}
              page={pagination.page}
              total={pagination.total}
            />
          )}
        </>
      )}
    </>
  );
}
