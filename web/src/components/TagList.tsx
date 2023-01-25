import Alert from "./Alert";
import Anchor from "./Anchor";
import classes from "../styles/components/TagList.module.scss";
import Pagination from "./Pagination";
import Paragraph from "./Paragraph";
import Table from "./Table";
import useApi from "../hooks/useApi";
import { handleApiError } from "../lib/utils";
import { isEmpty } from "lodash";
import { PaginationData, TagData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useState } from "react";

export default function TagList() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationData>();
  const [tags, setTags] = useState<TagData[]>();
  const { tagsGet } = useApi();

  async function handleTagsGet(page?: number) {
    page ||= 1;
    const response = await tagsGet({ page });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setPagination(response.data.pagination);
    setTags(response.data.tags);
  }

  useEffectOnce(handleTagsGet);

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

      {!loading && !error && isEmpty(tags) && (
        <Paragraph className={classes.noContentMessage}>
          No tags have been created yet.
        </Paragraph>
      )}

      {!loading && !error && tags && !isEmpty(tags) && (
        <>
          <Table className={classes.table} striped>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>

            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id}>
                  <td>
                    <Anchor to={`/tag/${tag.id}/edit`}>{tag.name}</Anchor>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {pagination && pagination.total > 1 && (
            <Pagination
              navClassName={classes.pagination}
              onChange={handleTagsGet}
              page={pagination.page}
              total={pagination.total}
            />
          )}
        </>
      )}
    </>
  );
}
