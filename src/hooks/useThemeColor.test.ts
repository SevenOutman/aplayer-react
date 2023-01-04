import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { defaultThemeColor } from "../constants";

import { useThemeColor } from "./useThemeColor";

vi.mock("../utils/getImageColor", () => {
  return {
    getImageColor: vi.fn(() => Promise.resolve(["r", "g", "b"])),
  };
});

describe("`song.theme` is not specified", () => {
  const song = {
    url: "https://example.com/song.mp3",
    cover: "https://example.com/song.jpg",
  };

  test('Return `fallback` if it\'s not "auto"', () => {
    const { result } = renderHook(() => useThemeColor(song, "green"));

    expect(result.current).toBe("green");
  });

  test('Return `defaultThemeColor` and then calculated color if `fallback` is "auto"', async () => {
    const { result } = renderHook(() => useThemeColor(song, "auto"));

    expect(result.current).toBe(defaultThemeColor);

    await waitFor(() => {
      expect(result.current).toBe("rgb(r,g,b)");
    });
  });
});

describe('`song.theme` is specified and is not "auto"', () => {
  const song = {
    url: "https://example.com/song.mp3",
    theme: "red",
  };

  test("Return `song.theme`", () => {
    const { result } = renderHook(() =>
      useThemeColor({
        ...song,
        theme: "red",
      })
    );

    expect(result.current).toBe("red");
  });
});

describe('`song.theme` is "auto"', () => {
  const song = {
    url: "https://example.com/song.mp3",
    cover: "https://example.com/song.jpg",
    theme: "auto",
  };

  test('Return `fallback` and then calculated color if `fallback` is not "auto"', async () => {
    const { result } = renderHook(() => useThemeColor(song, "green"));

    expect(result.current).toBe("green");

    await waitFor(() => {
      expect(result.current).toBe("rgb(r,g,b)");
    });
  });

  test('Return `defaultThemeColor` and then calculated color if `fallback` is "auto"', async () => {
    const { result } = renderHook(() => useThemeColor(song, "auto"));

    expect(result.current).toBe(defaultThemeColor);

    await waitFor(() => {
      expect(result.current).toBe("rgb(r,g,b)");
    });
  });
});
