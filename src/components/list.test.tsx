import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Playlist } from "./list";

const playlist = [
  {
    name: "Dancing with my phone",
    artist: "HYBS",
    url: "https://music.163.com/song/media/outer/url?id=1969744125",
  },
  {
    name: "僕は今日も",
    artist: "Vaundy",
    url: "https://music.163.com/song/media/outer/url?id=1441997419",
  },
  {
    name: "エカテリーナのための協奏曲",
    artist: "松下奈緒",
    url: "https://music.163.com/song/media/outer/url?id=22825753",
  },
  {
    name: "海辺の丘",
    artist: "小瀬村晶/信澤宣明",
    url: "https://music.163.com/song/media/outer/url?id=1331298993",
  },
];

test("Display songs list", () => {
  render(<Playlist audio={playlist} open />);

  expect(
    screen.getAllByRole("listitem").map((element) => element.textContent)
  ).toEqual([
    "1Dancing with my phoneHYBS",
    "2僕は今日もVaundy",
    "3エカテリーナのための協奏曲松下奈緒",
    "4海辺の丘小瀬村晶/信澤宣明",
  ]);
});
