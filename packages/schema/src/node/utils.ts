import { fschemaConfig } from "../types";
import inquirer from "inquirer";
import { defaultKey, defaultFormat, defaultCategory } from "./cli/common";
import { addKeyword, addFormat, addCategory } from "../client";
import { pathToFileURL } from "url";

async function dyImport(filePath: string) {
  return await import(pathToFileURL(filePath) as any);
}

export async function initConfig(configPath: string, addonPath: string) {
  let config: fschemaConfig = await dyImport(configPath);
  let addon: any = await dyImport(addonPath);

  // default config
  addKeyword(defaultKey);
  addFormat(defaultFormat);
  addCategory(defaultCategory);
  config.keywords = Object.keys(defaultKey) as string[];
  config.formats = Object.keys(defaultFormat);
  config.category = Object.keys(defaultCategory);
  // addon config
  if (addon.keywords) {
    config.keywords = config.keywords.concat(Object.keys(addon.keywords));
    addKeyword(addon.keyword);
  }
  if (addon.format) {
    config.formats = config.formats.concat(Object.keys(addon.formats));
    addFormat(addon.format);
  }
  if (addon.categroy) {
    config.category = config.category.concat(Object.keys(addon.category));

    addCategory(addon.categroy);
  }
  return config;
}
