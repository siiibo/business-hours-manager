import { init, onConfigSheetOpen, main } from "./app";

/**
 * @file GASエディタから実行できる関数を定義する
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const global: any;
global.init = init;
global.onConfigSheetOpen = onConfigSheetOpen;
global.main = main;
