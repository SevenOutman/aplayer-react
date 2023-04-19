import { clsx } from "clsx";
import { defaultThemeColor } from "../constants";
import type { AudioInfo } from "../types";

type PlaylistProps = {
  open: boolean;
  audio: AudioInfo[];
  playingAudioUrl?: string;
  onPlayAudio?: (audio: AudioInfo) => void;
  themeColor?: string;
};

export function Playlist({
  open,
  audio,
  playingAudioUrl,
  onPlayAudio,
  themeColor = defaultThemeColor,
}: PlaylistProps) {
  return (
    <div
      className={clsx("aplayer-list", {
        "aplayer-list-hide": !open,
      })}
    >
      <ol>
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
              {audioInfo.artist ?? "Audio artist"}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
