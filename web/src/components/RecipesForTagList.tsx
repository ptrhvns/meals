import Alert from "./Alert";
import Anchor from "./Anchor";
import classes from "../styles/components/RecipesForTagList.module.scss";
import Heading from "./Heading";
import Pagination from "./Pagination";
import Paragraph from "./Paragraph";
import Table from "./Table";
import TagRecipeUnlinkForm from "./TagRecipeUnlinkForm";
import useApi from "../hooks/useApi";
import { handleApiError } from "../lib/utils";
import { isEmpty } from "lodash";
import { PaginationData, RecipeData, TagData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

interface RecipesForTagListProps {
  tag?: TagData;
}

export default function RecipesForTagList({ tag }: RecipesForTagListProps) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationData>();
  const [recipes, setRecipes] = useState<RecipeData[]>();
  const { tagRecipesGet } = useApi();

  async function handleRecipesGet(page?: number) {
    if (!tag) return;

    const response = await tagRecipesGet({ page, tagId: tag.id });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setPagination(response.data.pagination);
    setRecipes(response.data.recipes);
  }

  useEffectOnce(handleRecipesGet);

  if (!tag) return null;

  return (
    <>
      <Heading size={2}>Linked Recipes</Heading>

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
          No recipes have been linked to this tag yet.
        </Paragraph>
      )}

      {!loading && !error && recipes && !isEmpty(recipes) && (
        <>
          <Table className={classes.table} striped>
            <thead>
              <tr>
                <th>Title</th>
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
                    <TagRecipeUnlinkForm recipe={recipe} tag={tag} />
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
