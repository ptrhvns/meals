import Button from "./Button";
import classes from "../styles/components/Pagination.module.scss";
import { isNumber } from "lodash";

interface PaginationProps {
  navClassName?: string;
  onChange?: (page: number) => void;
  page?: number;
  total: number;
}

function buildRangeArray(start: number, total: number) {
  return Array(total)
    .fill(0)
    .map((_, index) => index + start);
}

function buildPaginationValues(
  page: number,
  total: number
): (number | "&hellip;")[] {
  if (total < 7) return buildRangeArray(1, total);

  // Minimum of 7 items here prevents shifting of buttons in the UI.

  const showLeftEllipsis = page > 3;
  const showRightEllipsis = page < total - 2;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...buildRangeArray(1, 5), "&hellip;", total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, "&hellip;", ...buildRangeArray(total - 4, 5)];
  }

  return [1, "&hellip;", ...buildRangeArray(page - 1, 3), "&hellip;", total];
}

export default function Pagination({
  navClassName,
  onChange,
  page = 1,
  total,
}: PaginationProps) {
  if (total <= 0) return null;

  const vetNewPage = (newPage: number): number => {
    if (newPage <= 0) return 1;
    if (newPage > total) return total;
    return newPage;
  };

  const paginationValues = buildPaginationValues(page, total);

  return (
    <nav
      aria-label="Pagination"
      className={navClassName}
      data-testid="pagination"
    >
      <ol className={classes.list}>
        <li>
          <Button
            className={classes.listButton}
            disabled={page <= 1}
            onClick={() => onChange?.(vetNewPage(page - 1))}
          >
            &lt;
          </Button>
        </li>

        {paginationValues.map((value, index) => (
          <li key={index}>
            {isNumber(value) ? (
              <Button
                className={classes.listButton}
                color={page === value ? "primary" : undefined}
                onClick={() => onChange?.(vetNewPage(value))}
                variant={page === value ? "filled" : undefined}
              >
                {value}
              </Button>
            ) : (
              <span
                className={classes.listHellip}
                dangerouslySetInnerHTML={{ __html: value }}
              />
            )}
          </li>
        ))}

        <li>
          <Button
            className={classes.listButton}
            disabled={page >= total}
            onClick={() => onChange?.(vetNewPage(page + 1))}
          >
            &gt;
          </Button>
        </li>
      </ol>
    </nav>
  );
}
