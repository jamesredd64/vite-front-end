import useLocalStorage from './useLocalStorage';

export const useCalendarSettings = () => {
  const [showAllEvents, setShowAllEvents] = useLocalStorage('showAllCalendarEvents', false);

  return {
    showAllEvents,
    setShowAllEvents,
  };
};


