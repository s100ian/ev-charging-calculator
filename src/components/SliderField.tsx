import React from "react";

interface SliderQuickSetOption {
  label: string;
  value: number;
  disabled?: boolean;
}

interface SliderFieldProps {
  groupTestId: string;
  label: string;
  value: number;
  displayValue?: React.ReactNode;
  sliderId: string;
  sliderTestId: string;
  min: number;
  max: number;
  step?: number;
  onSliderChange: (value: number) => void;
  onDecrement: () => void;
  onIncrement: () => void;
  quickSetLabel?: string;
  quickSetOptions?: SliderQuickSetOption[];
  quickSetGroupTestId?: string;
  quickSetAriaLabel?: string;
}

const SliderField: React.FC<SliderFieldProps> = ({
  groupTestId,
  label,
  value,
  displayValue = value,
  sliderId,
  sliderTestId,
  min,
  max,
  step = 1,
  onSliderChange,
  onDecrement,
  onIncrement,
  quickSetLabel,
  quickSetOptions,
  quickSetGroupTestId,
  quickSetAriaLabel,
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSliderChange(parseFloat(e.target.value));
  };

  const resolvedQuickSetOptions = quickSetOptions ?? [];
  const hasQuickSetOptions = resolvedQuickSetOptions.length > 0;
  const quickSetRange = max - min;

  const getQuickSetPosition = (optionValue: number) => {
    if (quickSetRange <= 0) {
      return 0;
    }

    const percentage = ((optionValue - min) / quickSetRange) * 100;

    return Math.min(100, Math.max(0, percentage));
  };

  const getQuickSetAlignment = (position: number) => {
    if (position <= 8) {
      return "start";
    }

    if (position >= 92) {
      return "end";
    }

    return "center";
  };

  return (
    <>
      <div className="slider-group" data-testid={groupTestId}>
        <div className="slider-header">
          <label className="slider-label" htmlFor={sliderId}>
            <span>{label}</span>
            <span className="slider-value">{displayValue}</span>
          </label>
        </div>
        <div className={`slider-controls${hasQuickSetOptions ? " slider-controls--with-presets" : ""}`}>
          <button className="control-button" onClick={onDecrement} type="button">
            -
          </button>
          <div className="slider-track-area">
            <input
              id={sliderId}
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={handleSliderChange}
              className="slider-input"
              data-testid={sliderTestId}
            />
            {hasQuickSetOptions ? (
              <div
                className="slider-track-presets"
                data-testid={quickSetGroupTestId}
                role="group"
                aria-label={quickSetAriaLabel ?? quickSetLabel ?? `${label} quick set`}
              >
                {resolvedQuickSetOptions.map((option) => {
                  const isActive = !option.disabled && value === option.value;
                  const position = getQuickSetPosition(option.value);
                  const alignment = getQuickSetAlignment(position);

                  return (
                    <button
                      key={option.label}
                      type="button"
                      className={`slider-track-preset slider-track-preset--${alignment}${isActive ? " slider-track-preset--active" : ""}`}
                      aria-pressed={isActive}
                      disabled={option.disabled}
                      onClick={() => onSliderChange(option.value)}
                      style={{ left: `${position}%` }}
                    >
                      <span className="slider-track-preset-label">{option.label}</span>
                      <span className="slider-track-preset-dot" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          <button className="control-button" onClick={onIncrement} type="button">
            +
          </button>
        </div>
      </div>
    </>
  );
};

export default SliderField;
