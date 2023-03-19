import Alert from "./Alert";
import Anchor from "./Anchor";
import classes from "../styles/components/TimeCategoryList.module.scss";
import Pagination from "./Pagination";
import Paragraph from "./Paragraph";
import Table from "./Table";
import useApi from "../hooks/useApi";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleApiError } from "../lib/utils";
import { isEmpty } from "lodash";
import { TimeCategoryData, PaginationData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

export default function TimeCategoryList() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationData>();
  const [timeCategories, setTimeCategories] = useState<TimeCategoryData[]>([]);
  const { timeCategoriesGet } = useApi();

  async function handleTimeCategoriesGet(page?: number) {
    page ||= 1;
    const response = await timeCategoriesGet({ page });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setPagination(response.data.pagination);
    setTimeCategories(response.data.timeCategories);
  }

  useEffectOnce(handleTimeCategoriesGet);

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
      ) : isEmpty(timeCategories) ? (
        <Paragraph variant="dimmed">No time categories yet.</Paragraph>
      ) : (
        <>
          <Table className={classes.table} striped>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>

            <tbody>
              {timeCategories.map((timeCategory) => (
                <tr key={timeCategory.id}>
                  <td>
                    <Anchor to={`/time-category/${timeCategory.id}/edit`}>
                      {timeCategory.name}
                    </Anchor>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {pagination && pagination.total > 1 && (
            <Pagination
              navClassName={classes.pagination}
              onChange={handleTimeCategoriesGet}
              page={pagination.page}
              total={pagination.total}
            />
          )}
        </>
      )}
    </>
  );
}
