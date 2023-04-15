import { expect, test, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNotice } from "./useNotice";

test("Return empty text and opacity: 0 initially", () => {
  const { result } = renderHook(() => useNotice());

  expect(result.current[0]).toEqual({ text: "", style: { opacity: 0 } });
});

test("showNotice updates state to according text and opacity: 1", () => {
  const { result } = renderHook(() => useNotice());

  act(() => {
    result.current[1]("A notice");
  });

  expect(result.current[0]).toEqual({
    text: "A notice",
    style: { opacity: 1 },
  });
});

test("After 2000ms, opacity becomes 0 and text remains", () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useNotice());

  act(() => {
    result.current[1]("A notice");
  });

  act(() => {
    vi.advanceTimersByTime(2000);
  });

  expect(result.current[0]).toEqual({
    text: "A notice",
    style: { opacity: 0 },
  });
});
