import { vi, test, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSetTimeout } from "./useSetTimeout";

test("Returns a function that schedule a callback after specific delay", () => {
  vi.useFakeTimers();

  const { result } = renderHook(() => useSetTimeout());
  const callback = vi.fn();
  act(() => {
    result.current(callback, 1000);
  });

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(callback).toHaveBeenCalledOnce();
});

test("Cancels the schedule when component unmounts", () => {
  vi.useFakeTimers();

  const { result, unmount } = renderHook(() => useSetTimeout());
  const callback = vi.fn();
  act(() => {
    result.current(callback, 1000);
  });

  unmount();

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(callback).not.toHaveBeenCalled();
});
