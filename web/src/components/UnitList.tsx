import Alert from "./Alert";
import Anchor from "./Anchor";
import classes from "../styles/components/UnitList.module.scss";
import Pagination from "./Pagination";
import Paragraph from "./Paragraph";
import Table from "./Table";
import useApi from "../hooks/useApi";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleApiError } from "../lib/utils";
import { isEmpty } from "lodash";
import { UnitData, PaginationData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

export default function UnitList() {
  const [units, setUnits] = useState<UnitData[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationData>();
  const { unitsGet } = useApi();

  async function handleUnitsGet(page?: number) {
    page ||= 1;
    const response = await unitsGet({ page });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setPagination(response.data.pagination);
    setUnits(response.data.units);
  }

  useEffectOnce(handleUnitsGet);

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
      ) : isEmpty(units) ? (
        <Paragraph variant="dimmed">No units yet.</Paragraph>
      ) : (
        <>
          <Table className={classes.table} striped>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>

            <tbody>
              {units.map((unit) => (
                <tr key={unit.id}>
                  <td>
                    <Anchor to={`/unit/${unit.id}/edit`}>{unit.name}</Anchor>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {pagination && pagination.total > 1 && (
            <Pagination
              navClassName={classes.pagination}
              onChange={handleUnitsGet}
              page={pagination.page}
              total={pagination.total}
            />
          )}
        </>
      )}
    </>
  );
}
