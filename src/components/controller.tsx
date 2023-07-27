import { useCallback } from "react";
import { clsx } from "clsx";
import { ReactComponent as IconMenu } from "../assets/menu.svg";
import { ReactComponent as IconPlay } from "../assets/play.svg";
import { ReactComponent as IconPause } from "../assets/pause.svg";
import { ReactComponent as IconSkip } from "../assets/skip.svg";
import { ReactComponent as IconLrc } from "../assets/lrc.svg";
import { ReactComponent as IconOrderList } from "../assets/order-list.svg";
import { ReactComponent as IconOrderRandom } from "../assets/order-random.svg";
import { ReactComponent as IconLoopAll } from "../assets/loop-all.svg";
import { ReactComponent as IconLoopOne } from "../assets/loop-one.svg";
import { ReactComponent as IconLoopNone } from "../assets/loop-none.svg";
import { formatAudioDuration } from "../utils/formatAudioDuration";
import { ProgressBar } from "./progress";
import { PlaylistLoop, PlaylistOrder } from "../hooks/usePlaylist";
import { Volume } from "./volume";

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
  isPlaying: boolean;
  onTogglePlay?: () => void;
  onSkipForward?: () => void;
  onSkipBack?: () => void;
  showLyrics?: boolean;
  onToggleLyrics?: () => void;
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
  isPlaying,
  onTogglePlay,
  onSkipForward,
  onSkipBack,
  showLyrics = true,
  onToggleLyrics,
}: PlaybackControlsProps) {
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
        <span className="aplayer-icon aplayer-icon-back" onClick={onSkipBack}>
          <IconSkip />
        </span>
        <span className="aplayer-icon aplayer-icon-play" onClick={onTogglePlay}>
          {isPlaying ? <IconPause /> : <IconPlay />}
        </span>
        <span
          className="aplayer-icon aplayer-icon-forward"
          onClick={onSkipForward}
        >
          <IconSkip />
        </span>
        <Volume
          themeColor={themeColor}
          volume={volume}
          muted={muted}
          onToggleMuted={onToggleMuted}
          onChangeVolume={onChangeVolume}
        />
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
        <button
          type="button"
          className={clsx("aplayer-icon aplayer-icon-lrc", {
            "aplayer-icon-lrc-inactivity": !showLyrics,
          })}
          onClick={onToggleLyrics}
        >
          <IconLrc />
        </button>
      </div>
    </div>
  );
}
