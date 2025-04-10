import dayjs from "dayjs";
import DayJSUtc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(DayJSUtc);
dayjs.extend(timezone);

export const formatDateWithTimezoneISOString = (date: Date) => {
    return dayjs(date).tz("America/New_York").toISOString();
};
