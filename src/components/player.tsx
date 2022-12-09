import { useEffect, useMemo, useState } from "react"
import cx from "clsx"

import { ReactComponent as IconPlay } from "../assets/play.svg"
import { ReactComponent as IconPause } from "../assets/pause.svg"
import type { AudioInfo } from "../types"
import { Playlist } from "./list"
import { PlaybackControls } from "./controller"
import { useAudioControl } from "../hooks/useAudioControl"
import { defaultThemeColor } from "../constants"

/**
 * @see https://aplayer.js.org/#/home?id=options
 */
type APlayerProps = {
  audio: AudioInfo | AudioInfo[]

  theme?: string

  autoplay?: boolean
}

export function APlayer({
  theme = defaultThemeColor,
  audio,
  autoplay,
}: APlayerProps) {
  const audioControl = useAudioControl()

  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | undefined>(
    () => (Array.isArray(audio) ? audio[0].url : audio.url),
  )

  // When `audio` changes and `playingAudioUrl` is not included in `audio`
  // pause the playback and change `playingAudioUrl` to the first song of the new playlist
  useEffect(() => {
    if (
      Array.isArray(audio) &&
      !audio.some((audioInfo) => audioInfo.url === playingAudioUrl)
    ) {
      setPlayingAudioUrl(audio[0].url)
    } else if (!Array.isArray(audio) && audio.url !== playingAudioUrl) {
      setPlayingAudioUrl(audio.url)
    }
  }, [audio])

  useEffect(() => {
    if (playingAudioUrl) {
      audioControl.playAudio(playingAudioUrl)
    }
  }, [playingAudioUrl])

  const playingAudio = useMemo<AudioInfo | undefined>(() => {
    if (typeof playingAudioUrl === "undefined") return undefined

    if (Array.isArray(audio)) {
      return audio.find((audioInfo) => audioInfo.url === playingAudioUrl)
    }

    return audio.url === playingAudioUrl ? audio : undefined
  }, [audio, playingAudioUrl])

  const hasPlaylist = Array.isArray(audio)

  const [isPlaylistOpen, setPlaylistOpen] = useState(() => hasPlaylist)

  return (
    <div style={{ width: 600 }}>
      <div
        className={cx("aplayer", {
          "aplayer-withlist": hasPlaylist,
        })}
      >
        <div className="aplayer-body">
          <div
            className="aplayer-pic"
            style={{
              backgroundImage: `url("${playingAudio?.cover}")`,
            }}
          >
            <div
              className={cx(
                "aplayer-button",
                audioControl.isPlaying ? "aplayer-pause" : "aplayer-play",
              )}
              onClick={() => audioControl.togglePlay()}
            >
              {audioControl.isPlaying ? <IconPause /> : <IconPlay />}
            </div>
          </div>
          <div className="aplayer-info">
            <div className="aplayer-music">
              <span className="aplayer-title">{playingAudio?.name}</span>
              <span className="aplayer-author"> - {playingAudio?.artist}</span>
            </div>
            <div className="aplayer-lrc"></div>
            <PlaybackControls
              muted={audioControl.muted}
              onToggleMuted={() =>
                audioControl.muted ? audioControl.unmute() : audioControl.mute()
              }
              themeColor={playingAudio?.theme ?? theme}
              currentTime={audioControl.currentTime}
              audioDurationSeconds={audioControl.audioDuration}
              bufferedSeconds={audioControl.bufferedSeconds}
              onSeek={(second) => audioControl.seek(second)}
              onToggleMenu={() => setPlaylistOpen((open) => !open)}
            />
          </div>
          <div className="aplayer-notice"></div>
          <div className="aplayer-miniswitcher"></div>
        </div>
        {hasPlaylist ? (
          <Playlist
            open={isPlaylistOpen}
            audio={audio}
            playingAudioUrl={playingAudioUrl}
            onPlayAudio={(audioInfo) => setPlayingAudioUrl(audioInfo.url)}
          />
        ) : null}
      </div>
    </div>
  )
}
