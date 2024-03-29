import { expect, test } from "vitest";
import { computePercentage, computePercentageOfY } from "./computePercentage";
import { describe } from "vitest";

describe("computePercentage", () => {
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

  describe("Given an valid percentage,when the mouse moves on the X axis", () => {
    /* MOCK DOM  */
    test("Return valid percentage,when input two valid Event Objet", () => {
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
  });
});

describe("computePercentageOfY", () => {
  test("Return 0 if volumeBarRef.current is undefined", () => {
    expect(
      computePercentageOfY(new MouseEvent("mouseup"), {
        current: null,
      })
    ).toBe(0);
  });

  test("Return 0 if volumeBarRef.current is undefined", () => {
    expect(
      computePercentageOfY(new MouseEvent("mousemove"), {
        current: null,
      })
    ).toBe(0);
  });

  test("Return 0 if volumeBarRef.current is undefined", () => {
    expect(
      computePercentageOfY(new MouseEvent("mousedown"), {
        current: null,
      })
    ).toBe(0);
  });

  describe("Given an valid percentage,when the mouse moves on the Y axis", () => {
    /* MOCK DOM  */
    test("Return valid percentage,when input two valid Event Objet", () => {
      const container = document.createElement("div");
      container.style.width = "10px";
      container.style.height = "300px";
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: 50,
        clientY: 100,
      });

      /* hack ! no value in the node environment , so overwrite they */
      container.clientHeight = 300;
      container.getBoundingClientRect = () => ({
        x: 10,
        y: 10,
        width: 50,
        height: 300,
        top: 10,
        right: 300,
        bottom: 10,
        left: 10,
        toJSON: function () {
          return "";
        },
      });

      container.addEventListener("mousedown", function (e) {
        const val = computePercentageOfY(e, { current: container });
        expect(val).toBe(0.7);
      });

      container.dispatchEvent(mouseEvent);
    });
  });
});
