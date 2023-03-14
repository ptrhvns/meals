import Alert from "./Alert";
import Anchor from "./Anchor";
import classes from "../styles/components/FoodList.module.scss";
import Pagination from "./Pagination";
import Paragraph from "./Paragraph";
import Table from "./Table";
import useApi from "../hooks/useApi";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FoodData, PaginationData } from "../lib/types";
import { handleApiError } from "../lib/utils";
import { isEmpty } from "lodash";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

export default function FoodList() {
  const [error, setError] = useState<string>();
  const [food, setFood] = useState<FoodData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationData>();
  const { foodManyGet } = useApi();

  async function handleFoodGet(page?: number) {
    page ||= 1;
    const response = await foodManyGet({ page });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setPagination(response.data.pagination);
    setFood(response.data.food);
  }

  useEffectOnce(handleFoodGet);

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
      ) : isEmpty(food) ? (
        <Paragraph variant="dimmed">No food yet.</Paragraph>
      ) : (
        <>
          <Table className={classes.table} striped>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>

            <tbody>
              {food.map((food) => (
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
              onChange={handleFoodGet}
              page={pagination.page}
              total={pagination.total}
            />
          )}
        </>
      )}
    </>
  );
}
