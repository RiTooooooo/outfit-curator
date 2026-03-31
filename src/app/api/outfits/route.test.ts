import { expect, test } from "vitest";
import { $fc } from "./frourio.client";

test("GET /api/outfits", async () => {
  const res = await $fc().$get();

  expect(res).toEqual({ value: "ok" });
});
