import { parseISO, isValid, format } from "date-fns";

export function formatDate(isoString) {
  const parsedDate = parseISO(isoString);
  const isValidValue = isValid(parsedDate);

  return {
    date: isValidValue ? format(parsedDate, "dd.MM.yyyy") : "-",
    time: isValidValue ? format(parsedDate, "HH:mm") : "-",
  };
}
