import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";

import { ReactComponent as IconPlay } from "../assets/play.svg";
import { ReactComponent as IconPause } from "../assets/pause.svg";
import { ReactComponent as IconRight } from "../assets/right.svg";
import type { ArtistInfo, AudioInfo } from "../types";
import { Playlist } from "./list";
import { PlaybackControls } from "./controller";
import { useAudioControl } from "../hooks/useAudioControl";
import { defaultThemeColor } from "../constants";
import { PlaylistLoop, PlaylistOrder, usePlaylist } from "../hooks/usePlaylist";
import { Lyrics } from "./lyrics";
import { useThemeColor } from "../hooks/useThemeColor";
import { useNotice } from "../hooks/useNotice";
import { useSetTimeout } from "../hooks/useSetTimeout";

import "../styles/main.css";

/**
 * @see https://aplayer.js.org/#/home?id=options
 */
type APlayerProps = {
  audio: AudioInfo | readonly AudioInfo[];

  theme?: string;

  /**
   * Initial volume
   *
   * @default 0.7
   */
  volume?: number;

  /**
   * @default "normal"
   */
  appearance?: "normal" | "fixed";

  /**
   * @default "all"
   */
  initialLoop?: PlaylistLoop;

  /**
   * @default "list"
   */
  initialOrder?: PlaylistOrder;

  autoPlay?: boolean;

  /**
   * @default 250
   */
  listMaxHeight?: number;
};

export function APlayer({
  theme = defaultThemeColor,
  audio,
  appearance = "normal",
  volume = 0.7,
  initialLoop,
  initialOrder,
  autoPlay = false,
  listMaxHeight = 250,
}: APlayerProps) {
  const playlist = usePlaylist(Array.isArray(audio) ? audio : [audio], {
    initialLoop,
    initialOrder,
    getSongId: (song) => song.url,
  });

  const [notice, showNotice] = useNotice();

  const autoSkipTimeoutRef = useRef<
    ReturnType<typeof setTimeout> | undefined
  >();
  const setTimeout = useSetTimeout();

  const cancelAutoSkip = useCallback(() => {
    if (autoSkipTimeoutRef.current) {
      clearTimeout(autoSkipTimeoutRef.current);
      autoSkipTimeoutRef.current = undefined;
    }
  }, []);

  const audioControl = useAudioControl({
    src: playlist.currentSong.url,
    initialVolume: volume,
    autoPlay,
    onError(e) {
      const { error } = e.target as HTMLAudioElement;

      if (error) {
        showNotice(
          "An audio error has occurred, player will skip forward in 2 seconds."
        );
      }
      if (playlist.hasNextSong) {
        autoSkipTimeoutRef.current = setTimeout(() => {
          playlist.next();
        }, 2000);
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

  const handlePlayButtonClick = useCallback(() => {
    cancelAutoSkip();
    audioControl.togglePlay(playlist.currentSong.url);
  }, [audioControl, cancelAutoSkip, playlist.currentSong.url]);

  const hasPlaylist = playlist.length > 1;

  const [isPlaylistOpen, setPlaylistOpen] = useState(() => hasPlaylist);

  const themeColor = useThemeColor(playlist.currentSong, theme);
  const playlistAudioProp = useMemo(
    () => (Array.isArray(audio) ? audio : [audio]),
    [audio]
  );

  const { prioritize } = playlist;
  const handlePlayAudioFromList = useCallback(
    (audioInfo: AudioInfo) => {
      cancelAutoSkip();
      prioritize(audioInfo);
    },
    [cancelAutoSkip, prioritize]
  );

  const renderArtist = useCallback((artist?: string | ArtistInfo) => {
    if (!artist) return "Audio artist";
    if (typeof artist === "string") return artist;

    if (!artist.url) {
      return artist.name ?? "Audio artist";
    }

    return (
      <a href={artist.url} target="_blank" rel="noreferrer">
        {artist.name ?? "Audio artist"}
      </a>
    );
  }, []);

  const [mini, setMini] = useState(false);

  const [displayLyrics, setDisplayLyrics] = useState(true);

  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appearance === "fixed") {
      if (bodyRef.current) {
        const bodyElement = bodyRef.current;
        // Explicitly set width on the body element
        // to ensure the width transition works
        bodyElement.style.width = bodyElement.offsetWidth - 18 + "px";

        return () => {
          bodyElement.removeAttribute("style");
        };
      }
    }
  }, [appearance]);

  return (
    <div
      className={clsx("aplayer", {
        "aplayer-fixed": appearance === "fixed",
        "aplayer-loading": audioControl.isLoading,
        "aplayer-withlist": hasPlaylist,
        "aplayer-withlrc":
          Boolean(playlist.currentSong.lrc) && appearance !== "fixed",
        "aplayer-narrow": mini,
      })}
    >
      <div ref={bodyRef} className="aplayer-body">
        <div
          className="aplayer-pic"
          onClick={handlePlayButtonClick}
          style={{
            backgroundImage: `url("${playlist.currentSong?.cover}")`,
          }}
        >
          <div
            className={clsx(
              "aplayer-button",
              audioControl.isPlaying ? "aplayer-pause" : "aplayer-play"
            )}
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
              - {renderArtist(playlist.currentSong?.artist)}
            </span>
          </div>
          {appearance === "fixed" ? null : (
            <Lyrics
              show={displayLyrics}
              lrcText={playlist.currentSong.lrc}
              currentTime={audioControl.currentTime ?? 0}
            />
          )}
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
            isPlaying={audioControl.isPlaying ?? false}
            onTogglePlay={handlePlayButtonClick}
            onSkipForward={() => {
              if (playlist.hasNextSong) {
                playlist.next();
              }
            }}
            onSkipBack={() => {
              playlist.previous();
            }}
            showLyrics={displayLyrics}
            onToggleLyrics={() => {
              setDisplayLyrics((prev) => !prev);
            }}
          />
        </div>
        <div className="aplayer-notice" style={notice.style}>
          {notice.text}
        </div>
        <div
          className="aplayer-miniswitcher"
          onClick={() => setMini((prev) => !prev)}
        >
          <button className="aplayer-icon">
            <IconRight />
          </button>
        </div>
      </div>
      {hasPlaylist ? (
        <Playlist
          themeColor={themeColor}
          open={isPlaylistOpen}
          audio={playlistAudioProp}
          playingAudioUrl={playlist.currentSong.url}
          onPlayAudio={handlePlayAudioFromList}
          listMaxHeight={listMaxHeight}
        />
      ) : null}
      {appearance === "fixed" && (
        <Lyrics
          show={displayLyrics}
          lrcText={playlist.currentSong.lrc}
          currentTime={audioControl.currentTime ?? 0}
        />
      )}
    </div>
  );
}
