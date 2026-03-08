import React from "react";

interface TileGridProps {
  title: string;
  children: React.ReactNode;
  header?: React.ReactNode;
}

const TileGrid: React.FC<TileGridProps> = ({ title, children, header }) => {
  return (
    <div className="results-section">
      <h2>{title}</h2>
      {header}
      <div className="results-grid">{children}</div>
    </div>
  );
};

export default TileGrid;
