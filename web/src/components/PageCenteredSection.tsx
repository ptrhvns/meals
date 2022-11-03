import Anchor from "./Anchor";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinClassNames } from "../lib/utils";
import { ReactNode } from "react";

import classes from "../styles/components/PageCenteredSection.module.scss";

interface PageCenteredSectionProps {
  children: ReactNode;
  contentClassName?: string;
}

export default function PageCenteredSection({
  children,
  contentClassName,
}: PageCenteredSectionProps) {
  const linkClassName = joinClassNames(classes.slate, classes.link);
  contentClassName = joinClassNames(classes.content, contentClassName);

  return (
    <div className={classes.wrapper}>
      <div className={classes.innerWrapper}>
        <Anchor className={linkClassName} to="/">
          <FontAwesomeIcon icon={faUtensils} /> Meals
        </Anchor>

        <section className={contentClassName}>{children}</section>
      </div>
    </div>
  );
}
