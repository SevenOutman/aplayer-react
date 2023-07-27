import { useCallback, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { defaultThemeColor } from "../constants";
import type { ArtistInfo, AudioInfo } from "../types";

type PlaylistProps = {
  open: boolean;
  audio: AudioInfo[];
  playingAudioUrl?: string;
  onPlayAudio?: (audio: AudioInfo) => void;
  themeColor?: string;
  listMaxHeight?: number;
};

export function Playlist({
  open,
  audio,
  playingAudioUrl,
  onPlayAudio,
  listMaxHeight,
  themeColor = defaultThemeColor,
}: PlaylistProps) {
  const olStyle = listMaxHeight ? { maxHeight: listMaxHeight } : undefined;

  const renderArtist = useCallback((artist?: string | ArtistInfo) => {
    if (!artist) return "Audio artist";
    if (typeof artist === "string") return artist;

    return artist.name ?? "Audio artist";
  }, []);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      const listElement = listRef.current;

      listElement.style.maxHeight = `${Math.min(
        listElement.scrollHeight,
        listMaxHeight ?? Infinity
      )}px`;

      return () => {
        listElement.removeAttribute("style");
      };
    }
  }, [listMaxHeight]);

  return (
    <div
      ref={listRef}
      className={clsx("aplayer-list", {
        "aplayer-list-hide": !open,
      })}
    >
      <ol style={olStyle}>
        {audio.map((audioInfo, index) => (
          <li
            key={index}
            className={clsx({
              "aplayer-list-light": audioInfo.url === playingAudioUrl,
            })}
            onClick={() => {
              if (audioInfo.url !== playingAudioUrl) {
                onPlayAudio?.(audioInfo);
              }
            }}
          >
            <span
              className="aplayer-list-cur"
              style={{
                backgroundColor: themeColor,
              }}
            ></span>
            <span className="aplayer-list-index">{index + 1}</span>
            <span className="aplayer-list-title">
              {audioInfo.name ?? "Audio name"}
            </span>
            <span className="aplayer-list-author">
              {renderArtist(audioInfo.artist)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
