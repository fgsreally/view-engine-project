import inquirer from "inquirer";
import { fschemaConfig } from "../../types";

export async function generateSchema(schemaNameList: string[]) {
  return await inquirer.prompt([
    {
      type: "input",
      message: `请输入schema名：${JSON.stringify(schemaNameList)}`,
      name: "schemaName",
    },
  ]);
}

export async function updateSchema(config: fschemaConfig) {
  return await inquirer.prompt([
    {
      type: "list",
      message: "请选择一个schema更改：",
      name: "schema",
      choices: Object.keys(config.schema),
      pageSize: 5,
    },
    {
      type: "list",
      message: "请选择一个property更改：",
      name: "property",
      choices: (answer) => {
        return Object.keys((config.schema[answer.schema] as any).properties);
      },
      pageSize: 5,
    },
    {
      type: "list",
      message: "请选择一个类别：",
      name: "category",
      choices: config.category,
      pageSize: 5,
    },
  ]);
}
export async function setkeyword(propsList: any[]) {
  return await inquirer.prompt(propsList);
}

export async function isNext() {
  return await inquirer.prompt([
    {
      type: "confirm",
      message: "是否继续添加属性",
      name: "value",
      default: true,
    },
  ]);
}

export async function generateContent(list: string[], curProperties: string[]) {
  return await inquirer.prompt([
    {
      type: "input",
      message: `请输入属性名:${JSON.stringify(curProperties)}`,
      name: "property",
    },
    {
      type: "list",
      message: "请选择一个类别：",
      name: "category",
      choices: list,
      pageSize: 5,
    },
  ]);
}
