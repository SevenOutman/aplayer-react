import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim/index.js";
import { computePercentage } from "../utils/computePercentage";

type CreateAudioElementOptions = {
  initialVolume?: number;
} & Pick<
  React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  >,
  "src" | "autoPlay" | "onEnded" | "onError"
>;

function useCreateAudioElement(options?: CreateAudioElementOptions) {
  const audioElementRef = useRef<HTMLAudioElement>();

  if (typeof document !== "undefined" && !audioElementRef.current) {
    const audio = (audioElementRef.current = document.createElement("audio"));

    if (typeof options?.src !== "undefined") {
      audio.src = options.src;
    }

    if (typeof options?.autoPlay !== "undefined") {
      audio.autoplay = options.autoPlay;
    }

    if (typeof options?.initialVolume !== "undefined") {
      audio.volume = options.initialVolume;
    }
  }

  useEffect(() => {
    const audio = audioElementRef.current;

    if (audio && options?.onError) {
      audio.addEventListener("error", options.onError);

      return () => {
        audio.removeEventListener("error", options.onError);
      };
    }
  }, [options?.onError]);

  useEffect(() => {
    const audio = audioElementRef.current;

    if (audio && options?.onEnded) {
      audio.addEventListener("ended", options.onEnded);

      return () => {
        audio.removeEventListener("ended", options.onEnded);
      };
    }
  }, [options?.onEnded]);

  useEffect(() => {
    return () => {
      const audio = audioElementRef.current;
      // Properly stop the <audio> playing
      // https://stackoverflow.com/a/14836099/6840562
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      audioElementRef.current = undefined;
    };
  }, []);
  return audioElementRef;
}

function useProgressBar(audio: ReturnType<typeof useCreateAudioElement>) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [barState, setBarState] = useState({
    percentage: 0,
    isThumbDown: false,
  });

  const seek = useCallback(
    (second: number) => {
      if (audio.current && !Number.isNaN(second)) {
        audio.current.currentTime = second;
      }
    },
    [audio]
  );

  const handlePercentage = useCallback((percentage: number) => {
    if (!Number.isNaN(percentage)) {
      setBarState((prev) => ({ ...prev, percentage: percentage }));
    }
  }, []);

  const handleIsThumbDown = useCallback((is: boolean) => {
    setBarState((prev) => ({ ...prev, isThumbDown: is }));
  }, []);

  const thumbMove = useCallback(
    (e: MouseEvent) => {
      if (!progressBarRef.current || !audio.current) return;

      const percentage = computePercentage(e, progressBarRef);
      handlePercentage(percentage);
    },
    [audio, handlePercentage]
  );

  const thumbUp = useCallback(
    (e: MouseEvent) => {
      if (!progressBarRef.current || !audio.current) return;

      document.removeEventListener("mouseup", thumbUp);
      document.removeEventListener("mousemove", thumbMove);
      const percentage = computePercentage(e, progressBarRef);
      const currentTime = audio.current.duration * percentage;

      handlePercentage(percentage);
      handleIsThumbDown(false);
      seek(currentTime);
    },
    [audio, handleIsThumbDown, handlePercentage, seek, thumbMove]
  );

  useEffect(() => {
    const ref = progressBarRef.current;
    if (ref) {
      ref.addEventListener("mousedown", (e) => {
        handleIsThumbDown(true);
        const percentage = computePercentage(e, progressBarRef);
        handlePercentage(percentage);

        document.addEventListener("mousemove", thumbMove);
        document.addEventListener("mouseup", thumbUp);
      });
    }

    return () => {
      if (ref) {
        ref.removeEventListener("mousedown", () => {
          document.addEventListener("mousemove", thumbMove);
          document.addEventListener("mouseup", thumbUp);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { progressBarRef, barState };
}

export function useAudioControl(options: CreateAudioElementOptions) {
  const audioElementRef = useCreateAudioElement(options);
  const { progressBarRef, barState } = useProgressBar(audioElementRef);

  const playAudio = useCallback(
    async (src: string) => {
      const audio = audioElementRef.current;
      if (audio) {
        if (audio.src !== src) {
          audio.pause();
          audio.currentTime = 0;
          audio.src = src;
        }
        try {
          await audioElementRef.current?.play();
        } catch {
          // Do nothing (for now)
        }
      }
    },
    [audioElementRef]
  );

  const togglePlay = useCallback(
    (src: string) => {
      const audio = audioElementRef.current;
      if (!audio) {
        return;
      }

      if (audio.paused) {
        playAudio(src);
      } else {
        audio.pause();
      }
    },
    [audioElementRef, playAudio]
  );

  const seek = useCallback(
    (second: number) => {
      (audioElementRef.current as HTMLAudioElement).currentTime = second;
    },
    [audioElementRef]
  );

  const toggleMuted = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = !audioElementRef.current.muted;
    }
  }, [audioElementRef]);

  const setVolume = useCallback(
    (value: number) => {
      if (audioElementRef.current) {
        audioElementRef.current.volume = value;
      }
    },
    [audioElementRef]
  );

  const volume = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener(
          "volumechange",
          onStoreChange
        );

        return () => {
          audioElementRef.current?.removeEventListener(
            "volumechange",
            onStoreChange
          );
        };
      },
      [audioElementRef]
    ),
    () => audioElementRef.current?.volume,
    () => undefined
  );

  const muted = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener(
          "volumechange",
          onStoreChange
        );

        return () => {
          audioElementRef.current?.removeEventListener(
            "volumechange",
            onStoreChange
          );
        };
      },
      [audioElementRef]
    ),
    () => audioElementRef.current?.muted,
    () => undefined
  );

  const currentTime = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener("timeupdate", onStoreChange);

        return () => {
          audioElementRef.current?.removeEventListener(
            "timeupdate",
            onStoreChange
          );
        };
      },
      [audioElementRef]
    ),
    () => {
      if (!audioElementRef.current) {
        return undefined;
      }

      // Use `Math.round()` here because
      //   1. The player UI only displays currentTime at second-level precision
      //   2. Prevent too many updates (leads to crash on Safari)
      return Math.round(audioElementRef.current.currentTime);
    },
    () => undefined
  );

  const duration = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener(
          "durationchange",
          onStoreChange
        );

        return () => {
          audioElementRef.current?.removeEventListener(
            "durationchange",
            onStoreChange
          );
        };
      },
      [audioElementRef]
    ),
    () => audioElementRef.current?.duration,
    () => undefined
  );

  const bufferedSeconds = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener("progress", onStoreChange);

        return () => {
          audioElementRef.current?.removeEventListener(
            "progress",
            onStoreChange
          );
        };
      },
      [audioElementRef]
    ),
    () => {
      const audio = audioElementRef.current;

      if (!audio) return 0;

      if (audio.buffered.length > 0) {
        return audio.buffered.end(audio.buffered.length - 1);
      }
      return 0;
    },
    () => undefined
  );

  const isPlaying = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener("play", onStoreChange);
        audioElementRef.current?.addEventListener("pause", onStoreChange);

        return () => {
          audioElementRef.current?.removeEventListener("play", onStoreChange);
          audioElementRef.current?.removeEventListener("pause", onStoreChange);
        };
      },
      [audioElementRef]
    ),
    () => {
      const audio = audioElementRef.current;
      return audio ? !audio.paused : false;
    },
    () => undefined
  );

  const isLoading = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener("playing", onStoreChange);
        audioElementRef.current?.addEventListener("waiting", onStoreChange);

        return () => {
          audioElementRef.current?.removeEventListener(
            "playing",
            onStoreChange
          );
          audioElementRef.current?.removeEventListener(
            "waiting",
            onStoreChange
          );
        };
      },
      [audioElementRef]
    ),
    () => {
      const audio = audioElementRef.current;
      if (!audio) return false;
      return audio.networkState === audio.NETWORK_LOADING;
    },
    () => undefined
  );

  const playedPercentage = useMemo(() => {
    if (barState.isThumbDown) return barState.percentage;
    if (!currentTime || !duration) return 0;
    return currentTime / duration;
  }, [barState.isThumbDown, barState.percentage, currentTime, duration]);

  return {
    volume,
    setVolume,
    muted,
    toggleMuted,
    isPlaying,
    duration,
    currentTime,
    bufferedSeconds,
    playAudio,
    togglePlay,
    seek,
    isLoading,
    progressBarRef,
    playedPercentage,
  };
}
