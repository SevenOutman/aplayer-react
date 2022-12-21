export function formatAudioDuration(seconds: number | undefined) {
  if (typeof seconds === "undefined") {
    return "--:--";
  }
  if (isNaN(seconds)) {
    return "00:00";
  }
  const pad0 = (num: number) => {
    return num < 10 ? "0" + num : "" + num;
  };

  const min = Math.trunc(seconds / 60);
  const sec = Math.trunc(seconds - min * 60);
  const hours = Math.trunc(min / 60);
  const minAdjust = Math.trunc(
    seconds / 60 - 60 * Math.trunc(seconds / 60 / 60)
  );
  return seconds >= 3600
    ? pad0(hours) + ":" + pad0(minAdjust) + ":" + pad0(sec)
    : pad0(min) + ":" + pad0(sec);
}
