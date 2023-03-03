import Alert from "./Alert";
import Anchor from "./Anchor";
import classes from "../styles/components/EquipmentList.module.scss";
import Pagination from "./Pagination";
import Paragraph from "./Paragraph";
import Table from "./Table";
import useApi from "../hooks/useApi";
import { EquipmentData, PaginationData } from "../lib/types";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleApiError } from "../lib/utils";
import { isEmpty } from "lodash";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

export default function EquipmentList() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationData>();
  const [equipment, setEquipment] = useState<EquipmentData[]>([]);
  const { equipmentGet } = useApi();

  async function handleEquipmentGet(page?: number) {
    page ||= 1;
    const response = await equipmentGet({ page });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setPagination(response.data.pagination);
    setEquipment(response.data.equipment);
  }

  useEffectOnce(handleEquipmentGet);

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
      ) : isEmpty(equipment) ? (
        <Paragraph variant="dimmed">No equipment yet.</Paragraph>
      ) : (
        <>
          <Table className={classes.table} striped>
            <thead>
              <tr>
                <th>Description</th>
              </tr>
            </thead>

            <tbody>
              {equipment.map((eq) => (
                <tr key={eq.id}>
                  <td>
                    <Anchor to={`/equipment/${eq.id}/edit`}>
                      {eq.description}
                    </Anchor>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {pagination && pagination.total > 1 && (
            <Pagination
              navClassName={classes.pagination}
              onChange={handleEquipmentGet}
              page={pagination.page}
              total={pagination.total}
            />
          )}
        </>
      )}
    </>
  );
}
