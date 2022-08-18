type sizeType = "px" | "%" | "vh" | "vw" | "rem";
export function tailGenerator<Instance>(instance: Instance) {
  function convertTo(Block: any, to: sizeType, property: string) {
    if (!Block) return false;
    let ret = convertToPx(Block, property);

    Block[property].type = to;
    switch (to) {
      case "px":
        Block[property].value = ret;
      case "rem":
        Block[property].value = ret / (instance as any).container.fontSize;
        break;
      case "%":
        Block[property].value =
          (100 * ret) / convertToPx(Block.parent, property);
        break;
      case "vw":
        Block[property].value =
          (100 * ret) / (instance as any).container["width"];
        break;
      case "vh":
        Block[property].value =
          (100 * ret) / (instance as any).container["height"];
        break;
      default:
        throw new Error("未识别的类型");
    }
  }

  function convertToPx(Block: any, property: string): number {
    switch (Block[property].type) {
      case "px":
        return Block[property].value;
      case "rem":
        return Block[property].value * (instance as any).container.fontSize;
      case "%":
        return (
          Block[property].value * 0.01 * convertToPx(Block.parent, property)
        );
      case "vw":
        return Block[property].value * 0.01 * (instance as any).container.width;
      case "vh":
        return (
          Block[property].value * 0.01 * (instance as any).container.height
        );
      default:
        throw new Error("未识别的类型");
    }
  }
  return { convertTo, convertToPx };
}
