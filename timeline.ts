interface Event {
  date_created: string;
  date_updated: string;
  event_type: string;
  id: number;
  index:number;
  properties: any; 
}

type Timeline = Event[];

const runTimeline = (timeline: Timeline) => {
  for (const event of timeline) {
    switch (event.event_type) {
      case "create_entity":
        break;

      case "create_component":
        break;

      case "activate_effect":
        break;
          
      default:
        break;
    }
  }
}
