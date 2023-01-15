import { afterAll, beforeAll, test } from "@jest/globals";

import { DockerComposeEnvironment } from "testcontainers";

let environment;
let container;

beforeAll(async () => {
  const composeFilePath = __dirname;
  const composeFile = "docker-compose.yml";

  const options = {
    user: "test",
    password: "test",
    database: "test",
  };

  environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
    .withEnvironment(options)
    .up();

  container = environment.getContainer("postgres-1");
});

afterAll(async () => {
  await container.stop();
  await environment.down();
});

test("spin up postgres container", () => {
  expect(true).toBe(true);
});
