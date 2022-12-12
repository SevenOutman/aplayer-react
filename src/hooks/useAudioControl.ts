import React, { useCallback, useEffect, useRef, useState } from "react"

function useCreateAudioElement(
  eventHanlders?: Pick<
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
  >,
) {
  const audioElementRef = useRef<HTMLAudioElement>()

  if (typeof document !== "undefined" && !audioElementRef.current) {
    const audio = (audioElementRef.current = document.createElement("audio"))

    audio.addEventListener("play", (e) => {
      eventHanlders?.onPlay?.(e)
    })
    audio.addEventListener("pause", (e) => {
      eventHanlders?.onPause?.(e)
    })
    audio.addEventListener("durationchange", eventHanlders?.onDurationChange)
    audio.addEventListener("progress", eventHanlders?.onProgress)
    audio.addEventListener("timeupdate", eventHanlders?.onTimeUpdate)
    audio.addEventListener("volumechange", eventHanlders?.onVolumeChange)
    audio.addEventListener("ended", eventHanlders?.onEnded)
  }

  useEffect(() => {
    return () => {
      audioElementRef.current = undefined
    }
  }, [])
  return audioElementRef
}

type UseAudioControlOptions = Pick<
  React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  >,
  "onEnded"
>

export function useAudioControl(options: UseAudioControlOptions) {
  const audioElementRef = useCreateAudioElement({
    onPlay() {
      setPlaying(true)
    },
    onPause() {
      setPlaying(false)
    },
    onDurationChange(e) {
      setAudioDuration((e.target as HTMLAudioElement).duration)
    },
    onTimeUpdate(e) {
      setCurrentTime((e.target as HTMLAudioElement).currentTime)
    },
    onProgress(e) {
      const audio = e.target as HTMLAudioElement
      setBufferedSeconds(audio.buffered.end(audio.buffered.length - 1))
    },
    onVolumeChange(e) {
      const audio = e.target as HTMLAudioElement
      setMuted(audio.muted)
    },
    onEnded: options.onEnded,
  })
  const [isPlaying, setPlaying] = useState(() =>
    audioElementRef.current ? !audioElementRef.current.paused : false,
  )
  const [audioDuration, setAudioDuration] = useState<number | undefined>()
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [bufferedSeconds, setBufferedSeconds] = useState<number | undefined>(
    undefined,
  )
  const [muted, setMuted] = useState<boolean>(
    () => audioElementRef.current?.muted ?? false,
  )

  const playAudio = useCallback(async (src: string) => {
    audioElementRef.current?.setAttribute("src", src)
    try {
      await audioElementRef.current?.play()
    } catch {
      // Do nothing (for now)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioElementRef.current
    if (!audio) {
      return
    }

    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [])

  const seek = useCallback((second: number) => {
    ;(audioElementRef.current as HTMLAudioElement).currentTime = second
  }, [])

  const mute = useCallback(() => {
    ;(audioElementRef?.current as HTMLAudioElement).muted = true
  }, [])
  const unmute = useCallback(() => {
    ;(audioElementRef?.current as HTMLAudioElement).muted = false
  }, [])

  return {
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
  }
}
