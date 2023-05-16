import { expect, test } from "vitest";
import { computePercentage } from "./computePercentage";

test("Return 0 if progressBarRef.current is undefined", () => {
  expect(
    computePercentage(new MouseEvent("mouseup", {}), { current: null })
  ).toBe(0);
});

test("Return 0 if progressBarRef.current is undefined", () => {
  expect(
    computePercentage(new MouseEvent("mousemove"), { current: null })
  ).toBe(0);
});

test("Return 0 if progressBarRef.current is undefined", () => {
  expect(
    computePercentage(new MouseEvent("mousedown"), {
      current: null,
    })
  ).toBe(0);
});

/* MOCK DOM  */
test("Return percentage when mousedown event", () => {
  const container = document.createElement("div");
  container.style.width = "200px";
  container.style.height = "2px";
  const mouseEvent = new MouseEvent("mousedown", {
    clientX: 50,
    clientY: 50,
  });

  /* hack ! no value in the node environment , so overwrite they */
  container.clientWidth = 200;
  container.getBoundingClientRect = () => ({
    x: 10,
    y: 10,
    width: 300,
    height: 2,
    top: 10,
    right: 300,
    bottom: 10,
    left: 10,
    toJSON: function () {
      return "";
    },
  });

  container.addEventListener("mousedown", function (e) {
    const val = computePercentage(e, { current: container });
    expect(val).toBe(0.2);
  });

  container.dispatchEvent(mouseEvent);
});
