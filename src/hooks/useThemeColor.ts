import { useEffect, useState } from "react";
import { defaultThemeColor } from "../constants";
import { AudioInfo } from "../types";
import { getImageColor } from "../utils/getImageColor";

function shouldUseColorThief(
  song: AudioInfo | undefined,
  fallback = defaultThemeColor
) {
  if (song?.theme === "auto" && song.cover) return true;
  return fallback === "auto" && Boolean(song?.cover);
}

export function useThemeColor(
  song: AudioInfo | undefined,
  fallback = defaultThemeColor
) {
  const [coverColorMap, setCoverColorMap] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    if (shouldUseColorThief(song, fallback)) {
      const coverUrl = song!.cover!;

      getImageColor(coverUrl).then((hex) => {
        setCoverColorMap((prev) => ({
          ...prev,
          [coverUrl]: hex,
        }));
      });
    }
  }, [song, fallback]);

  if (!song) {
    return fallback;
  }

  if (shouldUseColorThief(song, fallback)) {
    return (
      coverColorMap[song.cover!] ??
      (fallback === "auto" ? defaultThemeColor : fallback)
    );
  }

  return song.theme ?? (fallback === "auto" ? defaultThemeColor : fallback);
}
