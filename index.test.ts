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
        (0, 'create_entity', '{"entity_uuid": "eA"}'),
        (1, 'create_component', '{"component_uuid": "cA", "entity_uuid": "eA", "component": {"component_type": "name", "name": "Player"}}'),
        (2, 'create_component', '{"component_uuid": "cB", "entity_uuid": "eA", "component": {"component_type": "stats", "dex": 2, "strength": 10}}'),
        (3, 'create_entity', '{"entity_uuid": "eB"}'),
        (4, 'create_component', '{"component_uuid": "cD", "entity_uuid": "eB", "component": {"component_type": "name", "name": "Sword"}}'),
        (5, 'create_component', '{
            "component_uuid": "cE", 
            "entity_uuid": "eB", 
            "component": {
              "component_type": "effect", 
              "name": "Attack", 
              "effect": "$target.health -= $source.stats.strength + $roll",
              "slots": [
                {"slot_type": "entity", "name": "source_uuid"}, 
                {"slot_type": "entity", "name": "target_uuid"}, 
                {"slot_type": "roll", "name": "roll", "roll": "2d6"}
              ]}}'),
        (6, 'create_entity', '{"entity_uuid": "eC"}'),
        (7, 'create_component', '{"component_uuid": "cF", "entity_uuid": "eC", "component": {"component_type": "name", "name": "Enemy"}}'),
        (8, 'create_component', '{"component_uuid": "cG", "entity_uuid": "eC", "component": {"component_type": "health", "max": 50}}'),
        (9, 'activate_effect', '{"component_uuid": "cE", "source_uuid": "eA", "target_uuid": "eC", "roll": [1, 2]}')
      RETURNING *;
    `);
    console.log(
      "@@ ~ file: index.test.ts:83 ~ test ~ rows",
      JSON.stringify(rows)
    );

    expect(rows).toHaveLength(10);
  } catch (error) {
    console.error("@@ Insert event error", error);
  }

  await client.end();
});
