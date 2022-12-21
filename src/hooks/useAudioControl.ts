import React, { useCallback, useEffect, useRef, useState } from "react";

type CreateAudioElementOptions = {
  initialVolume?: number;
};

function useCreateAudioElement(
  options?: CreateAudioElementOptions &
    Pick<
      React.DetailedHTMLProps<
        React.AudioHTMLAttributes<HTMLAudioElement>,
        HTMLAudioElement
      >,
      | "onPlay"
      | "onPause"
      | "onProgress"
      | "onDurationChange"
      | "onTimeUpdate"
      | "onVolumeChange"
      | "onEnded"
      | "onWaiting"
      | "onCanPlay"
      | "onError"
    >
) {
  const audioElementRef = useRef<HTMLAudioElement>();

  if (typeof document !== "undefined" && !audioElementRef.current) {
    const audio = (audioElementRef.current = document.createElement("audio"));

    if (typeof options?.initialVolume !== "undefined") {
      audio.volume = options.initialVolume;
    }

    audio.addEventListener("play", (e) => {
      options?.onPlay?.(e);
    });
    audio.addEventListener("pause", (e) => {
      options?.onPause?.(e);
    });
    audio.addEventListener("durationchange", options?.onDurationChange);
    audio.addEventListener("progress", options?.onProgress);
    audio.addEventListener("timeupdate", options?.onTimeUpdate);
    audio.addEventListener("volumechange", options?.onVolumeChange);
  }

  useEffect(() => {
    const audio = audioElementRef.current;

    if (audio && options?.onWaiting) {
      audio.addEventListener("waiting", options.onWaiting);

      return () => {
        audio.removeEventListener("waiting", options.onWaiting);
      };
    }
  }, [options?.onWaiting]);

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

    if (audio && options?.onCanPlay) {
      audio.addEventListener("canplay", options.onCanPlay);

      return () => {
        audio.removeEventListener("canplay", options.onCanPlay);
      };
    }
  }, [options?.onCanPlay]);

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

type UseAudioControlOptions = CreateAudioElementOptions &
  Pick<
    React.DetailedHTMLProps<
      React.AudioHTMLAttributes<HTMLAudioElement>,
      HTMLAudioElement
    >,
    "onEnded" | "onError"
  >;

export function useAudioControl(options: UseAudioControlOptions) {
  const audioElementRef = useCreateAudioElement({
    initialVolume: options.initialVolume,
    onPlay() {
      setPlaying(true);
    },
    onPause() {
      setPlaying(false);
    },
    onDurationChange(e) {
      setAudioDuration((e.target as HTMLAudioElement).duration);
    },
    onTimeUpdate(e) {
      setCurrentTime((e.target as HTMLAudioElement).currentTime);
    },
    onProgress(e) {
      const audio = e.target as HTMLAudioElement;
      setBufferedSeconds(audio.buffered.end(audio.buffered.length - 1));
    },
    onVolumeChange(e) {
      const audio = e.target as HTMLAudioElement;
      setVolume(audio.volume);
      setMuted(audio.muted);
    },
    onWaiting() {
      setLoading(true);
    },
    onCanPlay() {
      setLoading(false);
    },
    onError: options.onError,
    onEnded: options.onEnded,
  });
  const [isLoading, setLoading] = useState(false);

  const [isPlaying, setPlaying] = useState(() =>
    audioElementRef.current ? !audioElementRef.current.paused : false
  );
  const [audioDuration, setAudioDuration] = useState<number | undefined>();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [bufferedSeconds, setBufferedSeconds] = useState<number | undefined>(
    undefined
  );
  const [volume, setVolume] = useState(options?.initialVolume ?? 0.7);
  const [muted, setMuted] = useState<boolean>(
    () => audioElementRef.current?.muted ?? false
  );

  const playAudio = useCallback(
    async (src: string) => {
      audioElementRef.current?.setAttribute("src", src);
      try {
        await audioElementRef.current?.play();
      } catch {
        // Do nothing (for now)
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

  const mute = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = true;
    }
  }, [audioElementRef]);
  const unmute = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = false;
    }
  }, [audioElementRef]);

  const updateVolume = useCallback(
    (value: number) => {
      if (audioElementRef.current) {
        audioElementRef.current.volume = value;
      }
    },
    [audioElementRef]
  );

  return {
    volume,
    updateVolume,
    muted,
    mute,
    unmute,
    isPlaying,
    audioDuration,
    currentTime,
    bufferedSeconds,
    playAudio,
    togglePlay,
    seek,
    isLoading,
  };
}
