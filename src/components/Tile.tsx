import React from "react";

interface TileProps {
  label: string;
  value: string;
  placeholder?: boolean;
  valueClassName?: string;
  children?: React.ReactNode;
}

const Tile: React.FC<TileProps> = ({
  label,
  value,
  placeholder = false,
  valueClassName,
  children,
}) => {
  const classes = ["result-value"];
  if (placeholder) classes.push("result-value--placeholder");
  if (valueClassName) classes.push(valueClassName);

  return (
    <div className="result-tile">
      <span>{label}</span>
      <strong className={classes.join(" ")}>{value}</strong>
      {children}
    </div>
  );
};

export default Tile;
