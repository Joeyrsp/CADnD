import { afterAll, beforeAll, expect, test } from "@jest/globals";

import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "testcontainers";
import { Client, ClientConfig } from "pg";

let container: StartedPostgreSqlContainer;
let options: ClientConfig;

jest.setTimeout(30000);

beforeAll(async () => {
  container = await new PostgreSqlContainer().start();

  options = {
    host: container.getHost(),
    port: container.getPort(),
    database: container.getDatabase(),
    user: container.getUsername(),
    password: container.getPassword(),
  };
});

afterAll(async () => {
  await container.stop();
});

test("spin up postgres container", async () => {
  expect(true).toBe(true);
});

test("connect to postgres container", async () => {
  const client = new Client(options);
  await client.connect();

  await client.end();
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
    const { rows } = await client.query(`
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
      RETURNING *;
    `);
    console.log("@@ ~ file: index.test.ts:83 ~ test ~ rows", rows);

    expect(rows).toHaveLength(10);
  } catch (error) {
    console.error("@@ Insert event error", error);
  }

  await client.end();
});
