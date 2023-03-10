import Alert from "./Alert";
import Anchor from "./Anchor";
import classes from "../styles/components/BrandList.module.scss";
import Pagination from "./Pagination";
import Paragraph from "./Paragraph";
import Table from "./Table";
import useApi from "../hooks/useApi";
import { BrandData, PaginationData } from "../lib/types";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleApiError } from "../lib/utils";
import { isEmpty } from "lodash";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

export default function BrandList() {
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationData>();
  const { brandsGet } = useApi();

  async function handleBrandsGet(page?: number) {
    page ||= 1;
    const response = await brandsGet({ page });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setPagination(response.data.pagination);
    setBrands(response.data.brands);
  }

  useEffectOnce(handleBrandsGet);

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
      ) : isEmpty(brands) ? (
        <Paragraph variant="dimmed">No brands yet.</Paragraph>
      ) : (
        <>
          <Table className={classes.table} striped>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>

            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td>
                    <Anchor to={`/brands/${brand.id}/edit`}>
                      {brand.name}
                    </Anchor>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {pagination && pagination.total > 1 && (
            <Pagination
              navClassName={classes.pagination}
              onChange={handleBrandsGet}
              page={pagination.page}
              total={pagination.total}
            />
          )}
        </>
      )}
    </>
  );
}
