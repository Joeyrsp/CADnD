import { expect, test } from "@jest/globals";

import { runTimeline } from "./timeline";

import stubData from "./timelineStubData";

test("should run function", () => {
  expect(runTimeline(stubData)).toEqual(
    expect.objectContaining({
      entities: expect.any(Object),
      components: expect.any(Object),
    })
  );
});

test("should return array of entities (uuids)", () => {
  const { entities } = runTimeline(stubData);

  expect(entities).toEqual(["eA", "eB", "eC"]);
});

test("should return map of components", () => {
  const { components } = runTimeline(stubData);

  expect(Object.keys(components)).toEqual(["cA", "cB", "cD", "cE", "cF", "cG"]);
});
