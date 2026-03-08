import React from "react";

interface TileGroupProps {
  title: string;
  sectionClassName?: string;
  gridClassName?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
}

const TileGroup: React.FC<TileGroupProps> = ({
  title,
  sectionClassName,
  gridClassName,
  children,
  header,
}) => {
  const sectionClasses = ["results-section"];
  if (sectionClassName) sectionClasses.push(sectionClassName);

  const gridClasses = ["results-grid"];
  if (gridClassName) gridClasses.push(gridClassName);

  return (
    <div className={sectionClasses.join(" ")}>
      <h2>{title}</h2>
      {header}
      <div className={gridClasses.join(" ")}>{children}</div>
    </div>
  );
};

export default TileGroup;
