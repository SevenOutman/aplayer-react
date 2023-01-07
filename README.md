# aplayer-react

[APlayer](https://aplayer.js.org/) for your React application.

![ScreenShot](./screenshot.png)

View full documentation on https://aplayer-react.vercel.app

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

## Who uses aplayer-react?

- [Doma's blog](https://doma.land)

## Related projects

- [APlayer](https://github.com/DIYgod/APlayer): Prior art
- [react-aplayer](https://github.com/sabrinaluo/react-aplayer): A React wrapper component of APlayer
