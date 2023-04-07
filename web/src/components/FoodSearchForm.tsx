import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import Button from "./Button";
import classes from "../styles/components/FoodSearchForm.module.scss";
import Input from "./Input";
import Label from "./Label";
import { ChangeEvent } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { omit } from "lodash";
import { useDebouncedFunction } from "../hooks/useDebouncedFunction";
import { useForm } from "react-hook-form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface FoodSearchFormProps {
  search: ({ page, query }: { page?: number; query?: string }) => Promise<void>;
}

interface FormData {
  query: string;
}

export default function FoodSearchForm({ search }: FoodSearchFormProps) {
  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
  } = useForm<FormData>();

  const inputProps = register("query");

  const searchDebounced = useDebouncedFunction(200, (query: string) =>
    search({ query })
  );

  return (
    <form onSubmit={handleSubmit(({ query }: FormData) => search({ query }))}>
      <VisuallyHidden>
        <Label htmlFor="search">Search</Label>
      </VisuallyHidden>

      <span className={classes.searchWrapper}>
        <Input
          error={!!fieldErrors?.query?.message}
          id="search"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            inputProps.onChange(event);
            searchDebounced(event.target.value);
          }}
          placeholder="Search food"
          type="text"
          {...omit(inputProps, "onChange")}
        />

        <Button type="submit">
          <AccessibleIcon.Root label="Search">
            <FontAwesomeIcon icon={faMagnifyingGlass} title="Search" />
          </AccessibleIcon.Root>
        </Button>
      </span>
    </form>
  );
}
