import dayjs from "dayjs";

export function sqlDate(date: string | number, daysToAdd: number = 0) {
  return dayjs(date).add(daysToAdd, "day").format('YYYY-MM-DD')
}