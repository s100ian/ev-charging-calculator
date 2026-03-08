import React from "react";

interface TileGridProps {
  title: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

const TileGrid: React.FC<TileGridProps> = ({ title, children, header, className }) => {
  const sectionClasses = ["results-section", className].filter(Boolean).join(" ");

  return (
    <div className={sectionClasses}>
      <h2>{title}</h2>
      {header}
      <div className="results-grid">{children}</div>
    </div>
  );
};

export default TileGrid;
