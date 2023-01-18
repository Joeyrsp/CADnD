export interface Event {
  date_created: string | null;
  date_updated: string | null;
  event_type: string;
  id: number;
  index: number;
  properties: any;
}

export type Timeline = Event[];

export type Entity = String;

export const runTimeline = (timeline: Timeline) => {
  const entities: Entity[] = [];
  const components: { [key: string]: Event } = {};

  let currentComponent;

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
        const sourceComponent = components[component_uuid];
        console.log(
          "@@ ~ file: timeline.ts:34 ~ runTimeline ~ sourceComponent",
          sourceComponent
        );
        break;

      default:
        break;
    }
  }

  return { entities, components };
};
