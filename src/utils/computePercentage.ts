export function computePercentage(
  eventTarget: MouseEvent,
  progressBarRef: React.RefObject<HTMLDivElement>
) {
  if (!progressBarRef.current) return 0;
  let percentage =
    (eventTarget.clientX -
      progressBarRef.current.getBoundingClientRect().left) /
    progressBarRef.current.clientWidth;
  percentage = Math.max(percentage, 0);
  percentage = Math.min(percentage, 1);
  percentage = Math.floor(percentage * 100) / 100;
  return percentage;
}
