import Alert from "./Alert";
import Anchor from "./Anchor";
import classes from "../styles/components/RecipeList.module.scss";
import Pagination from "./Pagination";
import Paragraph from "./Paragraph";
import Table from "./Table";
import useApi from "../hooks/useApi";
import { handleApiError } from "../lib/utils";
import { isEmpty } from "lodash";
import { PaginationData, RecipeData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

export default function RecipeList() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationData>();
  const [recipes, setRecipes] = useState<RecipeData[]>();
  const { recipesGet } = useApi();

  async function handleRecipesGet(page?: number) {
    const response = await recipesGet({ page });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setPagination(response.data.pagination);
    setRecipes(response.data.recipes);
  }

  useEffectOnce(handleRecipesGet);

  return (
    <>
      {!loading && error && (
        <Alert
          alertClassName={classes.alert}
          onDismiss={() => setError(undefined)}
          variant="error"
        >
          {error}
        </Alert>
      )}

      {!loading && !error && isEmpty(recipes) && (
        <Paragraph className={classes.noContentMessage}>
          No recipes have been created yet.
        </Paragraph>
      )}

      {!loading && !error && recipes && !isEmpty(recipes) && (
        <>
          <Table className={classes.table} striped>
            <thead>
              <tr>
                <th>Title</th>
              </tr>
            </thead>

            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>
                    <Anchor to={`/recipe/${recipe.id}`}>{recipe.title}</Anchor>
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
