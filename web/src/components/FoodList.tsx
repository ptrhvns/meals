import Alert from "./Alert";
import Anchor from "./Anchor";
import classes from "../styles/components/FoodList.module.scss";
import FoodSearchForm from "./FoodSearchForm";
import Pagination from "./Pagination";
import Paragraph from "./Paragraph";
import Table from "./Table";
import useApi from "../hooks/useApi";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FoodData, FoodListReducerAction, PaginationData } from "../lib/types";
import { isEmpty } from "lodash";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useReducer } from "react";

interface ReducerState {
  error?: string;
  food?: FoodData[];
  loading: boolean;
  page?: number;
  pagination?: PaginationData;
  savedQuery?: string;
}

export default function FoodList() {
  const { foodManyGet } = useApi();

  const [{ error, loading, pagination, food, savedQuery }, dispatch] =
    useReducer(
      (state: ReducerState, action: FoodListReducerAction): ReducerState => {
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
              food: action.payload.response.data.foodMany,
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
              food: action.payload.response.data.foodMany,
              savedQuery: action.payload.query,
            };
          default:
            return state;
        }
      },
      { loading: true }
    );

  async function search({ page, query }: { page?: number; query?: string }) {
    const response = await foodManyGet({
      data: { query: query ?? savedQuery },
      page: page ?? 1,
    });

    dispatch({
      payload: { response, query: query ?? savedQuery },
      type: response.isError ? "searchError" : "searchSuccess",
    });
  }

  useEffectOnce(async () => {
    const response = await foodManyGet({ page: 1 });

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
      ) : isEmpty(food) ? (
        <Paragraph variant="dimmed">No food yet.</Paragraph>
      ) : (
        <>
          <FoodSearchForm search={search} />

          <Table className={classes.table} striped>
            <thead>
              <tr>
                <th>
                  Name
                  {savedQuery && (
                    <>
                      {" "}
                      <span className={classes.filteredNote}>(Filtered)</span>
                    </>
                  )}
                </th>
              </tr>
            </thead>

            <tbody>
              {food?.map((food) => (
                <tr key={food.id}>
                  <td>
                    <Anchor to={`/food/${food.id}/edit`}>{food.name}</Anchor>
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
