import { format } from "date-fns";
import { getConfigFromSheet } from "./ConfigSheet";
import { getNonBusinessDays } from "./japaneseBusinessDay";

export function main() {
  const { outputSpreadsheetUrl, targetYears, storeCode } = getConfigFromSheet();

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
