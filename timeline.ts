import { activateEffect } from "./activateEffect";

export interface Component {
  [key: string]: any;
}

export interface EventPropsActivateEffect {
  component_uuid: string;
  source_uuid: string;
  target_uuid: string;
  [key: string]: any;
}

export interface EventPropsComponent {
  component_uuid: string;
  entity_uuid: string;
  component: Component;
}

export interface EventPropsEntity {
  entity_uuid: string;
}

export interface EventBasic {
  date_created: string | null;
  date_updated: string | null;
  event_type: string;
  id: number;
  index: number;
  properties: any;
}

export interface EventCreateEntity extends EventBasic {
  event_type: "create_entity";
  properties: EventPropsEntity;
}

export interface EventCreateComponent extends EventBasic {
  event_type: "create_component";
  properties: EventPropsComponent;
}

export interface EventActivateEffect extends EventBasic {
  event_type: "activate_effect";
  properties: EventPropsActivateEffect;
}

export type Event =
  | EventCreateEntity
  | EventCreateComponent
  | EventActivateEffect;

export type Timeline = Event[];

export type Entity = String;

export type Entities = Entity[];

export interface Components {
  [key: string]: Component;
}

export const runTimeline = (timeline: Timeline) => {
  const entities: Entity[] = [];
  const components: Components = {};

  for (const event of timeline) {
    switch (event.event_type) {
      case "create_entity":
        entities.push(event.properties.entity_uuid);
        break;

      case "create_component":
        components[event.properties.component_uuid] =
          event.properties.component;
        break;

      case "activate_effect":
        activateEffect(event, components);
        break;

      default:
        break;
    }
  }

  return { entities, components };
};
