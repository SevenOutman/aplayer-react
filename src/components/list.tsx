import cx from "clsx"
import { defaultThemeColor } from "../constants"
import type { AudioInfo } from "../types"

type PlaylistProps = {
  open: boolean
  audio: AudioInfo[]
  playingAudioUrl?: string
  onPlayAudio?: (audio: AudioInfo) => void
}

export function Playlist({
  open,
  audio,
  playingAudioUrl,
  onPlayAudio,
}: PlaylistProps) {
  return (
    <div
      className={cx("aplayer-list", {
        "aplayer-list-hide": !open,
      })}
    >
      <ol>
        {audio.map((audioInfo, index) => (
          <li
            key={index}
            className={cx({
              "aplayer-list-light": audioInfo.url === playingAudioUrl,
            })}
            onClick={() => {
              if (audioInfo.url !== playingAudioUrl) {
                onPlayAudio?.(audioInfo)
              }
            }}
          >
            <span
              className="aplayer-list-cur"
              style={{
                backgroundColor: audioInfo.theme ?? defaultThemeColor,
              }}
            ></span>
            <span className="aplayer-list-index">{index + 1}</span>
            <span className="aplayer-list-title">{audioInfo.name}</span>
            <span className="aplayer-list-author">{audioInfo.artist}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
