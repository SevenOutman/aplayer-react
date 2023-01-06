# aplayer-react

[APlayer](https://aplayer.js.org/) for your React application.

![ScreenShot](./screenshot.png)

## Features

The APlayer feataures you love with the APlayer options you are familiar with.

- Beautiful and clean UI
- Lyrics scroll
- Playlist with repeat & shuffle controls
- Custom theme color / Self-adapting theme color

## Usage

Install `aplayer-react` along with `aplayer`.

    npm i aplayer-react aplayer

Import APlayer component from `aplayer-react` package, and import stylesheet from `aplayer` package.

```jsx
import { APlayer } from "aplayer-react";
import "aplayer/dist/APlayer.min.css";

render(
  <APlayer
    audio={{
      name: "Dancing with my phone",
      artist: "HYBS",
      url: "https://music.163.com/song/media/outer/url?id=1969744125",
    }}
    autoPlay
  />
);
```

### Props

| Prop         | Default          | Description                                                                                                                    |
| ------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| audio        |                  | Songs' information. Could be a single object or an array of objects                                                            |
| audio.name   | `"Audio name"`   | Title of the song                                                                                                              |
| audio.artist | `"Audio artist"` | Artist name of the song                                                                                                        |
| audio.url    |                  | Url of the media source to play                                                                                                |
| audio.cover  |                  | Url of the album cover image                                                                                                   |
| audio.lrc    |                  | Lyrics of the song in raw LRC format                                                                                           |
| audio.theme  |                  | Override theme color for this song. See `theme` prop for theme color explanation                                               |
| theme        | `"#ebd0c2"`      | Theme color of the player that applies to progress bar, volume control bar and playlist marker.                                |
| autoPlay     |                  | [See `autoplay` attribute of `<audio>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#attr-autoplay) |
| volume       | `0.7`            | Initial volume of the player.                                                                                                  |
| initialLoop  | `"all"`          | Initial loop mode of the player                                                                                                |
| initialOrder | `"list"`         | Initial playlist order of the player                                                                                           |

## Who uses aplayer-react?

- [Doma's blog](https://doma.land)

## Related projects

- [APlayer](https://github.com/DIYgod/APlayer): Prior art
- [react-aplayer](https://github.com/sabrinaluo/react-aplayer): A React wrapper component of APlayer
