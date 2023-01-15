import { afterAll, beforeAll, test } from "@jest/globals";

import { DockerComposeEnvironment } from "testcontainers";
import { Client } from "pg";

const options = {
  user: "test",
  password: "test",
  database: "test",

  host: "localhost",
  port: "5432",
};

let environment;
let container;

beforeAll(async () => {
  const composeFilePath = __dirname;
  const composeFile = "docker-compose.yml";

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

test("connect to postgres container", async () => {
  const client = new Client(options);
  await client.connect();
  client.end();
});
