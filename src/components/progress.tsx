import React, { useCallback, useRef } from "react";
import { ReactComponent as IconLoading } from "../assets/loading.svg";

type ProgressBarProps = {
  themeColor: string;
  bufferedPercentage: number;
  playedPercentage: number;

  onSeek?: (percentage: number) => void;
};

export function ProgressBar({
  themeColor,
  bufferedPercentage,
  playedPercentage,
  onSeek,
}: ProgressBarProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const barDimensions = wrapperRef.current?.getBoundingClientRect();
      const deltaX = e.clientX - barDimensions.x;
      const percentage = deltaX / barDimensions?.width;

      onSeek?.(percentage);
    },
    [onSeek]
  );

  return (
    <div
      ref={wrapperRef}
      className="aplayer-bar-wrap"
      onMouseDown={handleMouseDown}
    >
      <div className="aplayer-bar">
        <div
          className="aplayer-loaded"
          style={{ width: `${bufferedPercentage * 100}%` }}
        ></div>
        <div
          className="aplayer-played"
          style={{
            width: `${playedPercentage * 100}%`,
            backgroundColor: themeColor,
          }}
        >
          <span
            className="aplayer-thumb"
            style={{ backgroundColor: themeColor }}
          >
            <span className="aplayer-loading-icon">
              <IconLoading />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
