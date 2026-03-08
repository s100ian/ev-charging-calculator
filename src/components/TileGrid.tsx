import React from "react";

interface TileGridProps {
  title: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  testId?: string;
}

const TileGrid: React.FC<TileGridProps> = ({ title, children, header, testId }) => {
  return (
    <div className="results-section" data-testid={testId}>
      <h2>{title}</h2>
      {header}
      <div className="results-grid">{children}</div>
    </div>
  );
};

export default TileGrid;
