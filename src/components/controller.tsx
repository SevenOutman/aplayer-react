import { ReactComponent as IconVolumeUp } from "../assets/volume-up.svg";
import { ReactComponent as IconVolumeDown } from "../assets/volume-down.svg";
import { ReactComponent as IconVolumeOff } from "../assets/volume-off.svg";
import { ReactComponent as IconMenu } from "../assets/menu.svg";
import { ReactComponent as IconOrderList } from "../assets/order-list.svg";
import { ReactComponent as IconOrderRandom } from "../assets/order-random.svg";
import { ReactComponent as IconLoopAll } from "../assets/loop-all.svg";
import { ReactComponent as IconLoopOne } from "../assets/loop-one.svg";
import { ReactComponent as IconLoopNone } from "../assets/loop-none.svg";
import { formatAudioDuration } from "../utils/formatAudioDuration";
import { ProgressBar } from "./progress";
import React, { useCallback } from "react";
import { PlaylistLoop, PlaylistOrder } from "../hooks/usePlaylist";

type PlaybackControlsProps = {
  themeColor: string;
  volume: number;
  onChangeVolume: (volume: number) => void;
  muted: boolean;
  currentTime: number | undefined;
  audioDurationSeconds: number | undefined;
  bufferedSeconds: number | undefined;
  onToggleMenu?: () => void;
  onToggleMuted: () => void;
  order: PlaylistOrder;
  onOrderChange: (order: PlaylistOrder) => void;
  loop: PlaylistLoop;
  onLoopChange: (loop: PlaylistLoop) => void;
  onSeek?: (second: number) => void;
};

export function PlaybackControls({
  themeColor,
  volume,
  onChangeVolume,
  muted,
  currentTime,
  audioDurationSeconds,
  bufferedSeconds,
  onToggleMenu,
  onToggleMuted,
  order,
  onOrderChange,
  loop,
  onLoopChange,
  onSeek,
}: PlaybackControlsProps) {
  const handleVolumeBarMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const volumeBarElement = e.currentTarget;
      const volumeBarRect = volumeBarElement.getBoundingClientRect();

      onChangeVolume(
        Math.min(
          1,
          Math.max(0, (volumeBarRect.bottom - e.clientY) / volumeBarRect.height)
        )
      );
    },
    [onChangeVolume]
  );

  // Switch order between "list" and "random"
  const handleOrderButtonClick = useCallback(() => {
    const nextOrder: PlaylistOrder = (
      {
        list: "random",
        random: "list",
      } as const
    )[order];

    onOrderChange(nextOrder);
  }, [order, onOrderChange]);

  // Transition of loop: all -> one -> none
  const handleLoopButtonClick = useCallback(() => {
    const nextLoop: PlaylistLoop = (
      {
        all: "one",
        one: "none",
        none: "all",
      } as const
    )[loop];

    onLoopChange(nextLoop);
  }, [loop, onLoopChange]);

  return (
    <div className="aplayer-controller">
      <ProgressBar
        themeColor={themeColor}
        playedPercentage={
          typeof currentTime === "undefined" ||
          typeof audioDurationSeconds === "undefined"
            ? undefined
            : currentTime / audioDurationSeconds
        }
        bufferedPercentage={
          typeof bufferedSeconds === "undefined" ||
          typeof audioDurationSeconds === "undefined"
            ? undefined
            : bufferedSeconds / audioDurationSeconds
        }
        onSeek={(progress) => onSeek?.(progress * audioDurationSeconds)}
      />
      <div className="aplayer-time">
        <span className="aplayer-time-inner">
          <span className="aplayer-ptime">
            {formatAudioDuration(currentTime)}
          </span>
          {" / "}
          <span className="aplayer-dtime">
            {formatAudioDuration(audioDurationSeconds)}
          </span>
        </span>
        <span className="aplayer-icon aplayer-icon-back"></span>
        <span className="aplayer-icon aplayer-icon-play"></span>
        <span className="aplayer-icon aplayer-icon-forward"></span>
        <div className="aplayer-volume-wrap">
          <button
            className="aplayer-icon aplayer-icon-volume-down"
            onClick={() => onToggleMuted()}
          >
            {muted ? (
              <IconVolumeOff />
            ) : volume >= 1 ? (
              <IconVolumeUp />
            ) : (
              <IconVolumeDown />
            )}
          </button>
          <div
            className="aplayer-volume-bar-wrap"
            onMouseDown={handleVolumeBarMouseDown}
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
        <button
          className="aplayer-icon aplayer-icon-order"
          onClick={handleOrderButtonClick}
        >
          {{ list: <IconOrderList />, random: <IconOrderRandom /> }[order]}
        </button>
        <button
          className="aplayer-icon aplayer-icon-loop"
          onClick={handleLoopButtonClick}
        >
          {
            {
              all: <IconLoopAll />,
              one: <IconLoopOne />,
              none: <IconLoopNone />,
            }[loop]
          }
        </button>
        <button
          className="aplayer-icon aplayer-icon-menu"
          onClick={() => onToggleMenu?.()}
        >
          <IconMenu />
        </button>
        <button className="aplayer-icon aplayer-icon-lrc"></button>
      </div>
    </div>
  );
}
