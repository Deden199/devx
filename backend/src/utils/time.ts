import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const JAKARTA_TZ = 'Asia/Jakarta';

export function now() {
  return dayjs().tz(JAKARTA_TZ);
}

export function format(date: Date | string | number, fmt = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).tz(JAKARTA_TZ).format(fmt);
}
