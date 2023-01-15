import { afterAll, beforeAll, expect, test } from "@jest/globals";

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

test.only("create events table", async () => {
  const client = new Client(options);
  await client.connect();

  // TODO: move to migration
  await client.query(`
    CREATE TABLE events (
      id SERIAL PRIMARY KEY,
      index INTEGER UNIQUE, -- event order per "game"
      date_created TIMESTAMPTZ,
      date_updated TIMESTAMPTZ,
      type VARCHAR, -- TODO: move to enum table
      properties JSONB
    );
  `);

  try {
    const { rows: rowsA } = await client.query(`
      INSERT INTO events (index, type, properties) VALUES 
        (0, 'create_entity', '{"uuid": "a"}'),
        (1, 'create_component', '{"entity_uuid": "a", "component": {"type": "name", "name": "Player"}}'),
        (2, 'create_entity', '{"uuid": "b"}'),
        (3, 'create_component', '{"entity_uuid": "b", "component": {"type": "name", "name": "Attack"}}'),
        (4, 'create_entity', '{"uuid": "c"}'),
        (5, 'create_component', '{"entity_uuid": "c", "component": {"type": "name", "name": "Enemy"}}')
      RETURNING id, index;
    `);
    console.log("@@ ~ file: index.test.ts:69 ~ test.only ~ rowsA", rowsA);

    // expect(rowsA).toEqual([{ id: 1 }]);
  } catch (error) {
    console.error("@@ Insert event error", error);
  }

  client.end();
});
