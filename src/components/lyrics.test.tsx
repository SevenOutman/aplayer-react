import { describe, expect, test } from "vitest";
import { parseLrc } from "./lyrics";

describe("parseLrc", () => {
  const lrc = `
  [00:00.000] 作词 : James Alyn Wee/Kasidej Hongladaromp
  [00:01.000] 作曲 : James Alyn Wee/Kasidej Hongladaromp
  [00:28.836] I'm just laying on the floor again`;

  test("Parse raw lrc to [[time, text]] format", () => {
    expect(parseLrc(lrc)).toEqual([
      [0, "作词 : James Alyn Wee/Kasidej Hongladaromp"],
      [1, "作曲 : James Alyn Wee/Kasidej Hongladaromp"],
      [28.836, "I'm just laying on the floor again"],
    ]);
  });
});
