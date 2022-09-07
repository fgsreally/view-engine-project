import { basicBlock } from "../types/types";
import { diff } from "deep-object-diff";
import _ from "lodash";

export function diffData<BlockType extends basicBlock<BlockType>>(
  group1: BlockType[],
  group2: BlockType[],
  ret: { [key in string]: object[] } = {},
  exclude: string[] = ["uuid", "blocks", "parent"]
) {
  if (group1.length !== group2.length)
    throw new Error("two groups have different structure");
  for (let i in group1) {
    if (group1[i].uuid !== group2[i].uuid) {
      throw new Error("two groups have different structure");
    }
    let effectArr = [];
    ret[group1[i].uuid] = effectArr;
    for (let j in group1[i]) {
      if (exclude.includes(j)) continue;
      let diffInfo = baseDiff(j, group1[i][j], group2[i][j]);
      if (diffInfo) effectArr.push(diffInfo);
    }
    diffData(group1[i].blocks, group2[i].blocks, ret, exclude);
  }
  return ret;
}

function baseDiff<T extends unknown>(key: string, param1: T, param2: T) {
  //without undefined and null
  let ret = {};
  if (typeof param1 !== typeof param2)
    throw new Error("property has different structure");
  switch (typeof param1) {
    case "string":
    case "number":
      if (param1 === param2) return null;

      ret[key] = param2;
      return ret;
    case "object":
      ret[key] = diff(param1 as Object, param2 as Object);
      return ret;
  }
}

export function applyDiff<O extends object>(
  originValue: O,
  variationSet: object[]
) {
  variationSet.forEach((item) => {
    traverse(item, item, originValue);
  });
  return originValue;
}

function traverse(
  partVar: unknown,
  variation: object,
  originValue: object,
  path = ""
) {
  if (typeof partVar === "object") {
    for (let i in partVar) {
      traverse(partVar[i], variation, originValue, path ? path + "." + i : i);
    }
  } else {
    let parent: unknown = _.get(
      originValue,
      path.slice(0, path.lastIndexOf("."))
    );

    _.set(originValue, path, _.get(variation, path));
    if (Array.isArray(parent)) {
      _.set(
        originValue,
        path.slice(0, path.lastIndexOf(".")),
        parent.filter((item) => item)
      );
    }
  }
}
