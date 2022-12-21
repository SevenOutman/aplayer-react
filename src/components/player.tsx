import { useEffect, useState } from "react"
import cx from "clsx"

import { ReactComponent as IconPlay } from "../assets/play.svg"
import { ReactComponent as IconPause } from "../assets/pause.svg"
import type { AudioInfo } from "../types"
import { Playlist } from "./list"
import { PlaybackControls } from "./controller"
import { useAudioControl } from "../hooks/useAudioControl"
import { defaultThemeColor } from "../constants"
import { PlaylistLoop, PlaylistOrder, usePlaylist } from "../hooks/usePlaylist"

/**
 * @see https://aplayer.js.org/#/home?id=options
 */
type APlayerProps = {
  audio: AudioInfo | AudioInfo[]

  theme?: string

  /**
   * Initial volume
   *
   * @default 0.7
   */
  volume?: number

  /**
   * @default "all"
   */
  initialLoop?: PlaylistLoop

  /**
   * @default "list"
   */
  initialOrder?: PlaylistOrder

  autoplay?: boolean
}

export function APlayer({
  theme = defaultThemeColor,
  audio,
  volume = 0.7,
  initialLoop,
  initialOrder,
}: APlayerProps) {
  const playlist = usePlaylist(Array.isArray(audio) ? audio : [audio], {
    initialLoop,
    initialOrder,
    getSongId: (song) => song.url,
  })

  const audioControl = useAudioControl({
    initialVolume: volume,
    onError() {
      if (playlist.hasNextSong) {
        playlist.next()
      }
    },
    onEnded() {
      if (playlist.hasNextSong) {
        playlist.next()
      }
    },
  })

  useEffect(() => {
    if (playlist.currentSong) {
      audioControl.playAudio(playlist.currentSong.url)
    }
  }, [playlist.currentSong, audioControl])

  const hasPlaylist = Array.isArray(audio)

  const [isPlaylistOpen, setPlaylistOpen] = useState(() => hasPlaylist)

  return (
    <div style={{ width: 600 }}>
      <div
        className={cx("aplayer", {
          "aplayer-loading": audioControl.isLoading,
          "aplayer-withlist": hasPlaylist,
        })}
      >
        <div className="aplayer-body">
          <div
            className="aplayer-pic"
            style={{
              backgroundImage: `url("${playlist.currentSong?.cover}")`,
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
              <span className="aplayer-title">
                {playlist.currentSong?.name ?? "Audio name"}
              </span>
              <span className="aplayer-author">
                {" "}
                - {playlist.currentSong?.artist ?? "Audio artist"}
              </span>
            </div>
            <div className="aplayer-lrc"></div>
            <PlaybackControls
              volume={audioControl.volume}
              onChangeVolume={audioControl.updateVolume}
              muted={audioControl.muted}
              onToggleMuted={() =>
                audioControl.muted ? audioControl.unmute() : audioControl.mute()
              }
              themeColor={playlist.currentSong?.theme ?? theme}
              currentTime={audioControl.currentTime}
              audioDurationSeconds={audioControl.audioDuration}
              bufferedSeconds={audioControl.bufferedSeconds}
              onSeek={(second) => audioControl.seek(second)}
              onToggleMenu={() => setPlaylistOpen((open) => !open)}
              order={playlist.order}
              onOrderChange={playlist.setOrder}
              loop={playlist.loop}
              onLoopChange={playlist.setLoop}
            />
          </div>
          <div className="aplayer-notice"></div>
          <div className="aplayer-miniswitcher"></div>
        </div>
        {hasPlaylist ? (
          <Playlist
            open={isPlaylistOpen}
            audio={audio}
            playingAudioUrl={playlist.currentSong.url}
            onPlayAudio={(audioInfo) => playlist.prioritize(audioInfo)}
          />
        ) : null}
      </div>
    </div>
  )
}
