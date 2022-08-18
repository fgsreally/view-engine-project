import { Engine } from "../../engine/node";
import { expect, describe, it } from "vitest";
describe("normal action on engine instance", () => {
  let instance = new Engine({ container: {}, blocks: [], testKey: "UUID" });

  it("root instance in blockMap", () => {
    expect((instance as any).find("1").testKey).toEqual("UUID");
  });

  it("add block to root", () => {
    instance.add({ uuid: "test1", blocks: [] });
    expect((instance as any).find("test1").uuid).toEqual("test1");
  });

  it("add block to specifier", () => {
    instance.add({ uuid: "test2", blocks: [] }, "test1");
    expect((instance as any).find("test1").blocks.length).toEqual(1);
  });

  it("remove a block", () => {
    instance.remove("test1");
    expect((instance as any).find("1").blocks.length).toEqual(0);
    expect((instance as any).find("test2")).toEqual(undefined);
  });
});

describe("normal action on Singleton block", () => {
  let instance = new Engine({ container: {}, blocks: [], testKey: "UUID" });

  instance.add({ uuid: "test1", blocks: [] }, "1");
  it("select a block", () => {
    instance.$select("test1");
    expect(instance.clickBlock.uuid).toEqual("test1");
  });
  it("cancel", () => {
    instance.$cancel();
    expect(instance.clickBlock).toEqual(null);
  });
});

describe("normal action on Singleton block", () => {
  let instance = new Engine({ container: {}, blocks: [], testKey: "UUID" });

  instance.add({ uuid: "test1", blocks: [] }, "1");
  it("select a block", () => {
    instance.$select("test1");
    expect(instance.clickBlock.uuid).toEqual("test1");
  });
  it("cancel", () => {
    instance.$cancel();
    expect(instance.clickBlock).toEqual(null);
  });
});
