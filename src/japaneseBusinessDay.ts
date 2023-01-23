import { endOfYear, getYear } from "date-fns";
import * as R from "remeda";

export function getNonBusinessDays(year: number) {
  const thisYear = getYear(new Date());
  if (year < thisYear - 1 || year > thisYear + 1) throw new Error("現在の年から ±1年の範囲で入力してください.");

  const _startOfYear = new Date(`${year}/1/1`);
  const _endOfYear = endOfYear(_startOfYear);

  const jpHolidays = getJapaneseHolidays(_startOfYear, _endOfYear).map((e) => new Date(e.getStartTime().getTime()));

  // 年末年始は祝日とは異なるが休業日のため追加（元旦は祝日）
  const nonBusinessDays = R.pipe(
    [new Date(`${year}/1/2`), new Date(`${year}/1/3`), new Date(`${year}/12/31`), ...jpHolidays],
    removeDuplicateDate,
    sortDateAscending
  );

  return nonBusinessDays;
}

function getJapaneseHolidays(startTime: Date, endTime: Date) {
  // NOTE: ± 1年分の祝日しか登録されていない
  const calendarId = "ja.japanese#holiday@group.v.calendar.google.com";
  const calendar = CalendarApp.getCalendarById(calendarId);
  return calendar.getEvents(startTime, endTime);
}

function removeDuplicateDate(dates: Date[]): Date[] {
  return R.uniqBy(dates, (d) => d.getTime());
}

function sortDateAscending(dates: Date[]) {
  return R.sort(dates, (a: Date, b: Date) => a.getTime() - b.getTime());
}
