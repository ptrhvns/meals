import classes from "../styles/components/Skeleton.module.scss";
import { joinClassNames } from "../lib/utils";

interface SkeletonProps {
  backgroundColor?: string;
  borderRadius?: string;
  className?: string;
  height?: string;
  width?: string;
}

export default function Skeleton({
  backgroundColor = "var(--slate3)",
  borderRadius = "var(--border-radius)",
  className,
  height = "1rem",
  width = "100%",
}: SkeletonProps) {
  className = joinClassNames(classes.skeleton, className);

  return (
    <div
      className={className}
      style={{ backgroundColor, borderRadius, height, width }}
    />
  );
}
