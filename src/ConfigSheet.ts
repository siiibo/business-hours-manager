import { z } from "zod";

const ConfigSchema = z.object({
  outputSpreadsheetUrl: z.string(),
  storeCode: z.string(),
});

export const CONFIG_SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/12tJYVn-6p2gQpPuR_Kyb7eVBIyJuGyBPPQdRU94zyJg/edit#gid=0";

export function getConfigFromSheet() {
  const configSheetName = "設定";
  const configSheet = SpreadsheetApp.openByUrl(CONFIG_SPREADSHEET_URL).getSheetByName(configSheetName);
  if (!configSheet) throw new Error("設定シートが見つかりませんでした.");

  const sheetValues = configSheet.getRange(1, 2, 3).getValues().flat();
  return ConfigSchema.parse({
    outputSpreadsheetUrl: sheetValues[0],
    storeCode: sheetValues[2],
  });
}

export function addMenu(f: (args: unknown) => unknown) {
  SpreadsheetApp.getUi().createMenu("休業日出力").addItem("実行", f.name).addToUi();
}
