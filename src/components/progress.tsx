import React, { Ref } from "react";
import { ReactComponent as IconLoading } from "../assets/loading.svg";

type ProgressBarProps = {
  themeColor: string;
  bufferedPercentage: number;
  playedPercentage: number;
};

export const ProgressBar = React.forwardRef(function ProgressBar(
  { themeColor, bufferedPercentage, playedPercentage }: ProgressBarProps,
  ref: Ref<HTMLDivElement>
) {
  return (
    <div ref={ref} className="aplayer-bar-wrap">
      <div className="aplayer-bar">
        <div
          className="aplayer-loaded"
          style={{ width: `${bufferedPercentage * 100}%` }}
        />
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
});
