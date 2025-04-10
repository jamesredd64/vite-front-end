interface CalendarEvent {
    id: string;
    title: string;
    start: string;
  }
  
  let eventGuid: number = 0;
  const todayStr: string = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
  
  const INITIAL_EVENTS: CalendarEvent[] = [
    {
      id: createEventId(),
      title: 'All-day event',
      start: todayStr      
      
    },
    {
      id: createEventId(),
      title: 'Timed event',
      start: todayStr + 'T12:00:00'
     
      
    }
  ];
  
  function createEventId(): string {
    return String(eventGuid++);
  }
  
  export {
    INITIAL_EVENTS,
    createEventId,
    type CalendarEvent
  };
