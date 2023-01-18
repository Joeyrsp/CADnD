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

export const runTimeline = (timeline: Timeline) => {
  const entities: Entity[] = [];
  const components: { [key: string]: Component } = {};

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
        const { component_uuid } = event.properties;
        const { slots } = components[component_uuid];

        if (slots) {
          const slotNames = slots.map(s => s.name);

          for (const slotName of slotNames) {
            if (!event.properties[slotName]) {
              console.error(
                `Event '${event.id}' of type '${event.event_type}' must have key '${slotName}' to match it's source effect component slot.`
              );
            }
          }
        } else {
          console.error(
            `Events of type '${event.event_type}' must have 'slots' prop.`
          );
        }

        break;

      default:
        break;
    }
  }

  return { entities, components };
};
