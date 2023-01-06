import { test, expect, describe } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { PlaylistLoop, PlaylistOrder, usePlaylist } from "./usePlaylist";

const songs = [
  {
    url: "example.com/song1",
  },
  {
    url: "example.com/song2",
  },
  {
    url: "example.com/song3",
  },
  {
    url: "example.com/song4",
  },
];

describe('order = "list"', () => {
  const renderUsePlaylist = (options?: {
    loop?: PlaylistLoop;
    order?: PlaylistOrder;
  }) =>
    renderHook(() =>
      usePlaylist(songs, {
        order: "list",
        loop: "none",
        getSongId: (song) => song.url,
        ...options,
      })
    );

  test("currentSong should be the first of the list initially", () => {
    const { result } = renderUsePlaylist();

    expect(result.current.currentSong).toBe(songs[0]);
  });

  test(".next() should move currentSong in the order of the list", () => {
    const { result } = renderUsePlaylist();

    act(() => {
      result.current.next();
    });
    expect(result.current.currentSong).toBe(songs[1]);

    act(() => {
      result.current.next();
    });
    expect(result.current.currentSong).toBe(songs[2]);

    act(() => {
      result.current.next();
    });
    expect(result.current.currentSong).toBe(songs[3]);
  });
});
