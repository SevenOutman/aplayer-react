import React, { useCallback, useEffect, useRef, useState } from "react"

type CreateAudioElementOptions = {
  initialVolume?: number
}

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
    >,
) {
  const audioElementRef = useRef<HTMLAudioElement>()

  if (typeof document !== "undefined" && !audioElementRef.current) {
    const audio = (audioElementRef.current = document.createElement("audio"))

    if (typeof options?.initialVolume !== "undefined") {
      audio.volume = options.initialVolume
    }

    audio.addEventListener("play", (e) => {
      options?.onPlay?.(e)
    })
    audio.addEventListener("pause", (e) => {
      options?.onPause?.(e)
    })
    audio.addEventListener("durationchange", options?.onDurationChange)
    audio.addEventListener("progress", options?.onProgress)
    audio.addEventListener("timeupdate", options?.onTimeUpdate)
    audio.addEventListener("volumechange", options?.onVolumeChange)
  }

  useEffect(() => {
    const audio = audioElementRef.current

    if (audio && options?.onEnded) {
      audio.addEventListener("ended", options.onEnded)

      return () => {
        audio.removeEventListener("ended", options.onEnded)
      }
    }
  }, [options?.onEnded])

  useEffect(() => {
    return () => {
      audioElementRef.current = undefined
    }
  }, [])
  return audioElementRef
}

type UseAudioControlOptions = CreateAudioElementOptions &
  Pick<
    React.DetailedHTMLProps<
      React.AudioHTMLAttributes<HTMLAudioElement>,
      HTMLAudioElement
    >,
    "onEnded"
  >

export function useAudioControl(options: UseAudioControlOptions) {
  const audioElementRef = useCreateAudioElement({
    initialVolume: options.initialVolume,
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
      setVolume(audio.volume)
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
  const [volume, setVolume] = useState(options?.initialVolume ?? 0.7)
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
    if (audioElementRef.current) {
      audioElementRef.current.muted = true
    }
  }, [])
  const unmute = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = false
    }
  }, [])

  const updateVolume = useCallback((value: number) => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = value
    }
  }, [])

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
  }
}
