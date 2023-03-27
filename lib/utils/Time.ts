const SECOND_MS = 1000 // 1000ms
const MINUTE_MS = SECOND_MS * 60
const HOUR_MS = MINUTE_MS * 60
const DAY_MS = HOUR_MS * 24
const WEEK_MS = DAY_MS * 7
const YEAR_MS = DAY_MS * 365

type TimeUnitSingular = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'year'
type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'years'
type SingleTimeStr = `${number} ${TimeUnit}` | `1 ${TimeUnitSingular}`
type TimeStr<T extends string = string> = T extends SingleTimeStr
  ? T
  : T extends `${infer First}, ${infer Rest}`
  ? First extends SingleTimeStr
    ? `${First}, ${TimeStr<Rest>}`
    : never
  : never

function getMsFromUnit(unit: TimeUnit | TimeUnitSingular) {
  switch (unit) {
    case 'second':
    case 'seconds':
      return SECOND_MS
    case 'minute':
    case 'minutes':
      return MINUTE_MS
    case 'hour':
    case 'hours':
      return HOUR_MS
    case 'day':
    case 'days':
      return DAY_MS
    case 'week':
    case 'weeks':
      return WEEK_MS
    case 'year':
    case 'years':
      return YEAR_MS
  }
}

export function timeStr2Ms<T extends string>(timeStr: T extends TimeStr<T> ? T : TimeStr<T>) {
  const distances = timeStr.split(', ') as SingleTimeStr[]
  return distances.reduce((ms, singleTimeStr) => {
    const [amount, unit] = singleTimeStr.split(' ') as [number, TimeUnit | TimeUnitSingular]
    return ms + amount * getMsFromUnit(unit)
  }, 0)
}

export const Time = {
  now: (): Date => new Date(),
  in<T extends string>(timeStr: T extends TimeStr<T> ? T : TimeStr<T>): Date {
    return new Date(Date.now() + timeStr2Ms<T>(timeStr))
  },
  ago<T extends string>(timeStr: T extends TimeStr<T> ? T : TimeStr<T>): Date {
    return new Date(Date.now() - timeStr2Ms<T>(timeStr))
  },
  toMs: timeStr2Ms,
}
