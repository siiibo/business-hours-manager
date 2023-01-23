import { format, getYear } from "date-fns";
import { getConfigFromSheet, addMenu, CONFIG_SPREADSHEET_URL } from "./ConfigSheet";
import { getNonBusinessDays } from "./japaneseBusinessDay";

export function init() {
  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger(onConfigSheetOpen.name)
    .forSpreadsheet(SpreadsheetApp.openByUrl(CONFIG_SPREADSHEET_URL))
    .onOpen()
    .create();
}

export function onConfigSheetOpen() {
  addMenu(main);
}

export function main() {
  const { outputSpreadsheetUrl, storeCode } = getConfigFromSheet();

  const thisYear = getYear(new Date());
  const targetYears = [thisYear, thisYear + 1];

  const outputSpreadsheet = SpreadsheetApp.openByUrl(outputSpreadsheetUrl);
  const newSheetName = `${targetYears.join("-")}-休業日`;
  const newSheet = outputSpreadsheet.insertSheet(newSheetName, 0);

  const header = ["店舗コード", "特別営業時間"];
  const nonBusinessDays = targetYears.flatMap(getNonBusinessDays);

  newSheet.getRange(1, 1, 2, header.length).setValues([header, [storeCode, getFormattedDates(nonBusinessDays)]]);
}

function getFormattedDates(dates: Date[]): string {
  // see: https://support.google.com/business/answer/6303076
  function formatDateForGoogleBusinessProfile(date: Date) {
    return `${format(date, "yyyy-MM-dd")}: x`;
  }

  return dates.map(formatDateForGoogleBusinessProfile).join(", ");
}
