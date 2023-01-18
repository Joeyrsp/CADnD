import { Timeline } from "./timeline";

const timeline: Timeline = [
  {
    id: 1,
    index: 0,
    date_created: null,
    date_updated: null,
    event_type: "create_entity",
    properties: { entity_uuid: "eA" },
  },
  {
    id: 2,
    index: 1,
    date_created: null,
    date_updated: null,
    event_type: "create_component",
    properties: {
      component: { name: "Player", component_type: "name" },
      entity_uuid: "eA",
      component_uuid: "cA",
    },
  },
  {
    id: 3,
    index: 2,
    date_created: null,
    date_updated: null,
    event_type: "create_component",
    properties: {
      component: { dex: 2, strength: 10, component_type: "stats" },
      entity_uuid: "eA",
      component_uuid: "cB",
    },
  },
  {
    id: 4,
    index: 3,
    date_created: null,
    date_updated: null,
    event_type: "create_entity",
    properties: { entity_uuid: "eB" },
  },
  {
    id: 5,
    index: 4,
    date_created: null,
    date_updated: null,
    event_type: "create_component",
    properties: {
      component: { name: "Sword", component_type: "name" },
      entity_uuid: "eB",
      component_uuid: "cD",
    },
  },
  {
    id: 6,
    index: 5,
    date_created: null,
    date_updated: null,
    event_type: "create_component",
    properties: {
      component: {
        name: "Attack",
        slots: [
          { name: "source_uuid", slot_type: "entity" },
          { name: "target_uuid", slot_type: "entity" },
          { name: "roll", roll: "2d6", slot_type: "roll" },
        ],
        effect: "$target.health -= $source.stats.strength + $roll",
        component_type: "effect",
      },
      entity_uuid: "eB",
      component_uuid: "cE",
    },
  },
  {
    id: 7,
    index: 6,
    date_created: null,
    date_updated: null,
    event_type: "create_entity",
    properties: { entity_uuid: "eC" },
  },
  {
    id: 8,
    index: 7,
    date_created: null,
    date_updated: null,
    event_type: "create_component",
    properties: {
      component: { name: "Enemy", component_type: "name" },
      entity_uuid: "eC",
      component_uuid: "cF",
    },
  },
  {
    id: 9,
    index: 8,
    date_created: null,
    date_updated: null,
    event_type: "create_component",
    properties: {
      component: { max: 50, component_type: "health" },
      entity_uuid: "eC",
      component_uuid: "cG",
    },
  },
  {
    id: 10,
    index: 9,
    date_created: null,
    date_updated: null,
    event_type: "activate_effect",
    properties: {
      roll: [1, 2],
      source_uuid: "eA",
      target_uuid: "eC",
      component_uuid: "cE",
    },
  },
];

export default timeline;
