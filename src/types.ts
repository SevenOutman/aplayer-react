export type AudioInfo = {
  name?: string
  artist?: string
  url: string
  cover?: string
  lrc?: string
  theme?: string
  type?: "auto" | "hls" | "normal"
}
