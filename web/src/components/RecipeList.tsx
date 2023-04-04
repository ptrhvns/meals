import Alert from "./Alert";
import Anchor from "./Anchor";
import classes from "../styles/components/RecipeList.module.scss";
import Pagination from "./Pagination";
import Paragraph from "./Paragraph";
import RecipeSearchForm from "./RecipeSearchForm";
import Table from "./Table";
import useApi from "../hooks/useApi";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import {
  PaginationData,
  RecipeData,
  RecipeListReducerAction,
} from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useReducer } from "react";

interface ReducerState {
  error?: string;
  loading: boolean;
  page?: number;
  pagination?: PaginationData;
  recipes?: RecipeData[];
  savedQuery?: string;
}

export default function RecipeList() {
  const { recipesGet } = useApi();

  const [{ error, loading, pagination, recipes, savedQuery }, dispatch] =
    useReducer(
      (state: ReducerState, action: RecipeListReducerAction): ReducerState => {
        switch (action.type) {
          case "clearError":
            return {
              ...state,
              error: undefined,
            };
          case "loadingError":
            return {
              ...state,
              error: action.payload.response.message,
              loading: false,
            };
          case "loadingSuccess":
            return {
              ...state,
              loading: false,
              pagination: action.payload.response.data.pagination,
              recipes: action.payload.response.data.recipes,
            };
          case "searchError":
            return {
              ...state,
              error: action.payload.response.message,
              savedQuery: action.payload.query,
            };
          case "searchSuccess":
            return {
              ...state,
              pagination: action.payload.response.data.pagination,
              recipes: action.payload.response.data.recipes,
              savedQuery: action.payload.query,
            };
          default:
            return state;
        }
      },
      { loading: true }
    );

  async function search({ page, query }: { page?: number; query?: string }) {
    const response = await recipesGet({
      data: { query: query ?? savedQuery },
      page: page ?? 1,
    });

    dispatch({
      payload: { response, query: query ?? savedQuery },
      type: response.isError ? "searchError" : "searchSuccess",
    });
  }

  useEffectOnce(async () => {
    const response = await recipesGet({ page: 1 });

    dispatch({
      type: response.isError ? "loadingError" : "loadingSuccess",
      payload: { response },
    });
  });

  return (
    <>
      {loading ? (
        <Paragraph>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </Paragraph>
      ) : error ? (
        <Alert
          alertClassName={classes.alert}
          onDismiss={() => dispatch({ type: "clearError" })}
          variant="error"
        >
          {error}
        </Alert>
      ) : isEmpty(recipes) ? (
        <Paragraph variant="dimmed">No recipes yet.</Paragraph>
      ) : (
        <>
          <RecipeSearchForm search={search} />

          <Table className={classes.table} striped>
            <thead>
              <tr>
                <th>Title</th>
              </tr>
            </thead>

            <tbody>
              {recipes?.map((recipe) => (
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
              onChange={(page) => search({ page })}
              page={pagination.page}
              total={pagination.total}
            />
          )}
        </>
      )}
    </>
  );
}
