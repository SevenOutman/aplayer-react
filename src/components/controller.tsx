import { ReactComponent as IconVolumeDown } from "../assets/volume-down.svg"
import { ReactComponent as IconVolumeOff } from "../assets/volume-off.svg"
import { ReactComponent as IconMenu } from "../assets/menu.svg"
import { ReactComponent as IconOrderList } from "../assets/order-list.svg"
import { ReactComponent as IconLoopAll } from "../assets/loop-all.svg"
import { formatAudioDuration } from "../utils/formatAudioDuration"
import { ProgressBar } from "./progress"

type PlaybackControlsProps = {
  themeColor: string
  muted: boolean
  currentTime: number | undefined
  audioDurationSeconds: number | undefined
  bufferedSeconds: number | undefined
  onSeek?: (second: number) => void
  onToggleMenu?: () => void
  onToggleMuted: () => void
}

export function PlaybackControls({
  themeColor,
  muted,
  currentTime,
  audioDurationSeconds,
  bufferedSeconds,
  onSeek,
  onToggleMenu,
  onToggleMuted,
}: PlaybackControlsProps) {
  return (
    <div className="aplayer-controller">
      <ProgressBar
        themeColor={themeColor}
        playedPercentage={currentTime / audioDurationSeconds}
        bufferedPercentage={bufferedSeconds / audioDurationSeconds}
        onSeek={(percentage) => onSeek?.(percentage * audioDurationSeconds)}
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
            {muted ? <IconVolumeOff /> : <IconVolumeDown />}
          </button>
          <div className="aplayer-volume-bar-wrap">
            <div className="aplayer-volume-bar">
              <div className="aplayer-volume"></div>
            </div>
          </div>
        </div>
        <button className="aplayer-icon aplayer-icon-order">
          <IconOrderList />
        </button>
        <button className="aplayer-icon aplayer-icon-loop">
          <IconLoopAll />
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
  )
}
