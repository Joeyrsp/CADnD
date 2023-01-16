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

test("create events table and insert rows", async () => {
  const client = new Client(options);
  await client.connect();

  // TODO: move to migration
  await client.query(`
    CREATE TABLE events (
      id SERIAL PRIMARY KEY,
      index INTEGER UNIQUE, -- event order per "game"
      date_created TIMESTAMPTZ,
      date_updated TIMESTAMPTZ,
      event_type VARCHAR, -- TODO: move to enum table
      properties JSONB
    );
  `);

  try {
    const { rows: rowsA } = await client.query(`
      INSERT INTO events (index, event_type, properties) VALUES 
        (0, 'create_entity', '{"uuid": "eA"}'),
        (1, 'create_component', '{"uuid": "cA", "entity_uuid": "eA", "component": {"type": "name", "name": "Player"}}'),
        (2, 'create_component', '{"uuid": "cB", "entity_uuid": "eA", "component": {"type": "stats", "dex": 2, "strength": 10}}'),
        (3, 'create_entity', '{"uuid": "eB"}'),
        (4, 'create_component', '{"uuid": "cD", "entity_uuid": "eB", "component": {"type": "name", "name": "Sword"}}'),
        (5, 'create_component', '{
            "uuid": "cE", 
            "entity_uuid": "eB", 
            "component": {
              "type": "effect", 
              "name": "Attack", 
              "effect": "$target.health -= $source.stats.strength + $roll",
              "slots": [
                {"type": "entity", "name": "source"}, 
                {"type": "entity", "name": "target"}, 
                {"type": "roll", "name": "roll", "roll": "2d6"}
              ]}}'),
        (6, 'create_entity', '{"uuid": "eC"}'),
        (7, 'create_component', '{"uuid": "cF", "entity_uuid": "eC", "component": {"type": "name", "name": "Enemy"}}'),
        (8, 'create_component', '{"uuid": "cG", "entity_uuid": "eC", "component": {"type": "health", "max": 50}}'),
        (9, 'activate_effect', '{"component_uuid": "cE", "source": "eA", "target": "eC", "roll": [1, 2]}')
      RETURNING id, index;
    `);

    expect(rowsA).toHaveLength(10);
  } catch (error) {
    console.error("@@ Insert event error", error);
  }

  client.end();
});
