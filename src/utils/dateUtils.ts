export const formatEventDate = (date: Date | null): string => {
  if (!date) return "";
  
  const utcDate = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  );

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  }).format(utcDate);
};

export const areRequiredFieldsFilled = (
  eventTitle: string,
  eventStartDate: string,
  eventEndDate: string,
  eventLevel: string
): boolean => {
  return Boolean(
    eventTitle.trim() && 
    eventStartDate && 
    eventEndDate && 
    eventLevel
  );
};