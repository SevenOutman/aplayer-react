import { useEffect, useRef, useState } from "react";
import cx from "clsx";

import { ReactComponent as IconPlay } from "../assets/play.svg";
import { ReactComponent as IconPause } from "../assets/pause.svg";
import type { AudioInfo } from "../types";
import { Playlist } from "./list";
import { PlaybackControls } from "./controller";
import { useAudioControl } from "../hooks/useAudioControl";
import { defaultThemeColor } from "../constants";
import { PlaylistLoop, PlaylistOrder, usePlaylist } from "../hooks/usePlaylist";
import { Lyrics } from "./lyrics";
import { useThemeColor } from "../hooks/useThemeColor";

/**
 * @see https://aplayer.js.org/#/home?id=options
 */
type APlayerProps = {
  audio: AudioInfo | AudioInfo[];

  theme?: string;

  /**
   * Initial volume
   *
   * @default 0.7
   */
  volume?: number;

  /**
   * @default "all"
   */
  initialLoop?: PlaylistLoop;

  /**
   * @default "list"
   */
  initialOrder?: PlaylistOrder;

  autoPlay?: boolean;
};

export function APlayer({
  theme = defaultThemeColor,
  audio,
  volume = 0.7,
  initialLoop,
  initialOrder,
  autoPlay = false,
}: APlayerProps) {
  const playlist = usePlaylist(Array.isArray(audio) ? audio : [audio], {
    initialLoop,
    initialOrder,
    getSongId: (song) => song.url,
  });

  const audioControl = useAudioControl({
    src: playlist.currentSong.url,
    initialVolume: volume,
    autoPlay,
    onError() {
      if (playlist.hasNextSong) {
        playlist.next();
      }
    },
    onEnded() {
      if (playlist.hasNextSong) {
        playlist.next();
      }
    },
  });

  useEffect(() => {
    if (autoPlay) {
      audioControl.playAudio(playlist.currentSong.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isInitialEffectRef = useRef(true);
  useEffect(() => {
    if (isInitialEffectRef.current) {
      isInitialEffectRef.current = false;
    } else {
      if (playlist.currentSong) {
        audioControl.playAudio(playlist.currentSong.url);
      }
    }
  }, [playlist.currentSong, audioControl.playAudio]);

  const hasPlaylist = playlist.length > 1;

  const [isPlaylistOpen, setPlaylistOpen] = useState(() => hasPlaylist);

  const themeColor = useThemeColor(playlist.currentSong, theme);

  return (
    <div
      className={cx("aplayer", {
        "aplayer-loading": audioControl.isLoading,
        "aplayer-withlist": hasPlaylist,
        "aplayer-withlrc": Boolean(playlist.currentSong.lrc),
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
              audioControl.isPlaying ? "aplayer-pause" : "aplayer-play"
            )}
            onClick={() => audioControl.togglePlay(playlist.currentSong.url)}
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
          <Lyrics
            lrcText={playlist.currentSong.lrc}
            currentTime={audioControl.currentTime ?? 0}
          />
          <PlaybackControls
            volume={audioControl.volume ?? volume}
            onChangeVolume={audioControl.setVolume}
            muted={audioControl.muted ?? false}
            onToggleMuted={() => audioControl.toggleMuted()}
            themeColor={themeColor}
            currentTime={audioControl.currentTime}
            audioDurationSeconds={audioControl.duration}
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
          themeColor={themeColor}
          open={isPlaylistOpen}
          audio={Array.isArray(audio) ? audio : [audio]}
          playingAudioUrl={playlist.currentSong.url}
          onPlayAudio={(audioInfo) => playlist.prioritize(audioInfo)}
        />
      ) : null}
    </div>
  );
}
