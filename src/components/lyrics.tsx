import React, { useMemo } from "react";
import { clsx } from "clsx";

type LyricsProps = {
  show: boolean;
  lrcText?: string;
  currentTime: number;
};

export function Lyrics({ show, lrcText, currentTime }: LyricsProps) {
  const lines = useMemo(() => parseLrc(lrcText), [lrcText]);

  const currentLineIndex = useMemo(() => {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1];
      if (currentTime >= line[0] && (!nextLine || currentTime < nextLine[0])) {
        return i;
      }
    }

    return 0;
  }, [currentTime, lines]);

  const transformStyle = useMemo<React.CSSProperties>(() => {
    return {
      transform: `translateY(${-currentLineIndex * 16}px)`,
      WebkitTransform: `translateY(${-currentLineIndex * 16}px)`,
    };
  }, [currentLineIndex]);

  return (
    <div
      className={clsx("aplayer-lrc", {
        "aplayer-lrc-hide": !show,
      })}
    >
      {lrcText ? (
        <div className="aplayer-lrc-contents" style={transformStyle}>
          {lines.map(([, text], index) => (
            <p
              key={index}
              className={clsx({
                "aplayer-lrc-current": index === currentLineIndex,
              })}
            >
              {text}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Parse lrc, suppose multiple time tag
 * @see https://github.com/MoePlayer/APlayer/blob/master/src/js/lrc.js#L83
 * @author DIYgod(https://github.com/DIYgod)
 *
 * @param {String} lrc_s - Format:
 * [mm:ss]lyric
 * [mm:ss.xx]lyric
 * [mm:ss.xxx]lyric
 * [mm:ss.xx][mm:ss.xx][mm:ss.xx]lyric
 * [mm:ss.xx]<mm:ss.xx>lyric
 *
 * @return {String} [[time, text], [time, text], [time, text], ...]
 */
export function parseLrc(lrc_s?: string): [time: number, text: string][] {
  if (lrc_s) {
    lrc_s = lrc_s.replace(/([^\]^\n])\[/g, (match, p1) => p1 + "\n[");
    const lyric = lrc_s.split("\n");
    const lrc: [time: number, text: string][] = [];
    const lyricLen = lyric.length;
    for (let i = 0; i < lyricLen; i++) {
      // match lrc time
      const lrcTimes = lyric[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g);
      // match lrc text
      const lrcText = lyric[i]
        .replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, "")
        .replace(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g, "")
        .replace(/^\s+|\s+$/g, "");

      if (lrcTimes) {
        // handle multiple time tag
        const timeLen = lrcTimes.length;
        for (let j = 0; j < timeLen; j++) {
          const oneTime = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/.exec(lrcTimes[j]);
          const min2sec = oneTime[1] * 60;
          const sec2sec = parseInt(oneTime[2]);
          const msec2sec = oneTime[4]
            ? parseInt(oneTime[4]) /
              ((oneTime[4] + "").length === 2 ? 100 : 1000)
            : 0;
          const lrcTime = min2sec + sec2sec + msec2sec;
          lrc.push([lrcTime, lrcText]);
        }
      }
    }
    // sort by time
    lrc.sort((a, b) => a[0] - b[0]);
    return lrc;
  } else {
    return [];
  }
}
