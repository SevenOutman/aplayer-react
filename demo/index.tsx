import { useState } from "react"
import { createRoot } from "react-dom/client"
import { APlayer } from "../src"

const playlist1 = [
  {
    name: "Dancing with my phone",
    artist: "HYBS",
    url: "https://music.163.com/song/media/outer/url?id=1969744125",
    cover:
      "https://p1.music.126.net/tOtUdKjS9rktAFRamcomWQ==/109951167748733958.jpg",
  },
  {
    name: "僕は今日も",
    artist: "Vaundy",
    url: "https://music.163.com/song/media/outer/url?id=1441997419",
    cover:
      "https://p1.music.126.net/AnR2ejcBgGnOJXPsytivBQ==/109951164922366027.jpg",
  },
]

const playlist2 = [
  {
    name: "滥俗的歌",
    artist: "汉堡黄",
    url: "https://music.163.com/song/media/outer/url?id=1923210613",
    cover:
      "https://p1.music.126.net/uOvEut2NG6enWVM1s_lJZQ==/109951167656922852.jpg",
  },
]

function App() {
  const [playlist, setPlaylist] = useState(playlist1)
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <APlayer audio={playlist} autoplay />
      <div>
        <button onClick={() => setPlaylist(playlist1)}>Playlist 1</button>
        <button onClick={() => setPlaylist(playlist2)}>Playlist 2</button>
      </div>
    </div>
  )
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />)
