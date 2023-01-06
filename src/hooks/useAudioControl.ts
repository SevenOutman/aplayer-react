import React, { useCallback, useEffect, useRef } from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim/index.js";

type CreateAudioElementOptions = {
  initialVolume?: number;
} & Pick<
  React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  >,
  "autoPlay" | "onEnded" | "onError"
>;

function useCreateAudioElement(options?: CreateAudioElementOptions) {
  const audioElementRef = useRef<HTMLAudioElement>();

  if (typeof document !== "undefined" && !audioElementRef.current) {
    const audio = (audioElementRef.current = document.createElement("audio"));

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

export function useAudioControl(options: CreateAudioElementOptions) {
  const audioElementRef = useCreateAudioElement(options);

  const playAudio = useCallback(
    async (src: string) => {
      const audio = audioElementRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = src;
        try {
          await audioElementRef.current?.play();
        } catch {
          // Do nothing (for now)
        }
      }
    },
    [audioElementRef]
  );

  const togglePlay = useCallback(() => {
    const audio = audioElementRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [audioElementRef]);

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
    () => audioElementRef.current?.currentTime,
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
  };
}
