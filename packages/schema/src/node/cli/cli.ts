#!/usr/bin/env node

import cac from "cac";
import { writeFileSync } from "fs";
import { categoryMap } from "../../share/schemaUtils";
import { initConfig } from "../utils";
import { addonPath, configPath, DEFAULT_CONFIG } from "./common";
import {
  updateSchema,
  isNext,
  generateSchema,
  generateContent,
  setkeyword,
} from "./prompt";

const cli = cac();

cli
  .command("i")
  .alias("init")
  .action(async () => {
    writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG));
    writeFileSync(addonPath, `module.exports={}`);
  });

cli
  .command("u")
  .alias("update")
  .action(async () => {
    let config: any = await initConfig(configPath, addonPath);
    let ret;
    do {
      let answer = await updateSchema(config);
      ret = await isNext();
      config.schema[answer.schema].properties[answer.property] =
        categoryMap[answer.category].schema;
      writeFileSync(configPath, JSON.stringify(config));
    } while (ret.value);
  });

cli
  .command("g")
  .alias("generate")
  .action(async () => {
    let config: any = await initConfig(configPath, addonPath);
    let { schemaName } = await generateSchema(Object.keys(config.schema));
    config.schema[schemaName] = { type: "object", properties: {} };
    let ret;
    do {
      let answer = await generateContent(
        Object.keys(categoryMap),
        Object.keys(config.schema[schemaName].properties)
      );
      config.schema[schemaName].properties[answer.property] =
        categoryMap[answer.category].schema;
      if (Array.isArray(categoryMap[answer.category].prompt)) {
        let keyAnswer = await setkeyword(
          categoryMap[answer.category].prompt as any[]
        );
        for (let i in keyAnswer) {
          config.schema[schemaName].properties[answer.property][i] =
            keyAnswer[i];
        }
      }
      writeFileSync(configPath, JSON.stringify(config));

      ret = await isNext();
    } while (ret.value);
  });

cli.help();
cli.version(require("../../package.json").version);

cli.parse();
