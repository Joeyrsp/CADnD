import { EventActivateEffect, Components } from "./timeline";

export const activateEffect = async (
  event: EventActivateEffect,
  components: Components
) => {
  const { event_type: eventType, properties: eventProps, id: eventId } = event;
  const { component_uuid } = eventProps;

  const effectComponent = components[component_uuid];
  const { slots } = effectComponent;

  if (slots) {
    slots.forEach(slot => {
      const { name: slotName, slot_type: slotType } = slot;

      if (eventProps[slotName]) {
        if (slotType === "roll") {
          // TODO: parse roll def string
          console.log("Roll: ", Math.random());
        }
      } else {
        console.error(
          `Event '${eventId}' of type '${eventType}' must have key '${slotName}' to match it's source effect component slot.`
        );
      }
    });
  } else {
    console.error(`Events of type '${eventType}' must have 'slots' prop.`);
  }
};
