import { expect, test } from "vitest";
import { formatAudioDuration } from "./formatAudioDuration";

test("Return --:-- if time is undefined", () => {
  expect(formatAudioDuration(undefined)).toBe("--:--");
});

/**
 * `duration` can be NaN
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration#value
 */
test("Return --:-- if time is NaN", () => {
  expect(formatAudioDuration(NaN)).toBe("00:00");
});

test("Format seconds to mm:ss format", () => {
  expect(formatAudioDuration(0)).toBe("00:00");
  expect(formatAudioDuration(30)).toBe("00:30");
  expect(formatAudioDuration(60)).toBe("01:00");
  expect(formatAudioDuration(90)).toBe("01:30");
});
