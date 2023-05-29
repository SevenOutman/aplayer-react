import { useCallback, useRef, useState } from "react";
import { ReactComponent as IconVolumeUp } from "../assets/volume-up.svg";
import { ReactComponent as IconVolumeDown } from "../assets/volume-down.svg";
import { ReactComponent as IconVolumeOff } from "../assets/volume-off.svg";
import { computePercentageOfY } from "../utils/computePercentage";
import clsx from "clsx";

type VolumeProps = {
  themeColor: string;
  volume: number;
  muted: boolean;
  onToggleMuted: () => void;
  onChangeVolume: (volume: number) => void;
};

export function Volume({
  themeColor,
  volume,
  muted,
  onToggleMuted,
  onChangeVolume,
}: VolumeProps) {
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState(false); // ensure related element in :hover

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      onChangeVolume(computePercentageOfY(e, volumeBarRef));
      setDragging(true);

      const handleMouseMove = (e: MouseEvent) => {
        onChangeVolume(computePercentageOfY(e, volumeBarRef));
      };

      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleMouseMove);

        setDragging(false);
        onChangeVolume(computePercentageOfY(e, volumeBarRef));
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [onChangeVolume]
  );

  return (
    <div className="aplayer-volume-wrap">
      <button
        className="aplayer-icon aplayer-icon-volume-down"
        onClick={() => onToggleMuted()}
      >
        {muted || !volume ? (
          <IconVolumeOff />
        ) : volume >= 1 ? (
          <IconVolumeUp />
        ) : (
          <IconVolumeDown />
        )}
      </button>
      <div
        className={clsx("aplayer-volume-bar-wrap", {
          "aplayer-volume-bar-wrap-active": isDragging,
        })}
        ref={volumeBarRef}
        onMouseDown={handleMouseDown}
      >
        <div className="aplayer-volume-bar">
          <div
            className="aplayer-volume"
            style={{
              backgroundColor: themeColor,
              height: muted ? 0 : `${volume * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
