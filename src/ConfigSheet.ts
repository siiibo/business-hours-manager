import { z } from "zod";

const ConfigSchema = z.object({
  outputSpreadsheetUrl: z.string(),
  // TODO: 理由書く
  targetYears: z.union([z.number(), z.string()]).transform((v) => {
    if (typeof v === "string") {
      return v.replace(/\s/g, "").split(",").map(Number);
    } else {
      return [v];
    }
  }),
  storeCode: z.string()
});

export function getConfigFromSheet() {
  const configSpreadsheetUrl =
    "https://docs.google.com/spreadsheets/d/12tJYVn-6p2gQpPuR_Kyb7eVBIyJuGyBPPQdRU94zyJg/edit#gid=0";
  const configSheetName = "設定";
  const configSheet = SpreadsheetApp.openByUrl(configSpreadsheetUrl).getSheetByName(configSheetName);
  if (!configSheet) throw new Error("設定シートが見つかりませんでした.");

  const sheetValues = configSheet.getRange(1, 2, 3).getValues().flat();
  return ConfigSchema.parse({
    outputSpreadsheetUrl: sheetValues[0],
    targetYears: sheetValues[1],
    storeCode: sheetValues[2]
  });
}

export function addMenu(){
  //
}
