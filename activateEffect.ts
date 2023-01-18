import { EventActivateEffect, Components } from "./timeline";

export const activateEffect = async (
  event: EventActivateEffect,
  components: Components
) => {
  const { event_type: eventType, properties: eventProps, id: eventId } = event;
  const { component_uuid } = eventProps;
  const { slots } = components[component_uuid];

  if (slots) {
    for (const slot of slots) {
      if (event.properties[slot.name]) {
        console.log(slot);
      } else {
        console.error(
          `Event '${eventId}' of type '${eventType}' must have key '${slot.name}' to match it's source effect component slot.`
        );
      }
    }
  } else {
    console.error(`Events of type '${eventType}' must have 'slots' prop.`);
  }
};
