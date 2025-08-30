import { formatInTimeZone } from "date-fns-tz";

const dateFormat = (date: string | number | Date) => {
  return formatInTimeZone(date, "Asia/Tehran", "yyyy MM dd");
};

export default dateFormat;
