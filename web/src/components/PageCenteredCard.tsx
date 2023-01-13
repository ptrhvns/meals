import Anchor from "./Anchor";
import classes from "../styles/components/PageCenteredCard.module.scss";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinClassNames } from "../lib/utils";
import { ReactNode } from "react";

interface PageCenteredCardProps {
  children: ReactNode;
  contentClassName?: string;
}

export default function PageCenteredCard({
  children,
  contentClassName,
}: PageCenteredCardProps) {
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
