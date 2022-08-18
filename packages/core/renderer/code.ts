export class codeGenerator {
  content: string;
  tag: string;
  property: string;
  script: string;
  constructor(tag: string) {
    this.content = "";
    this.property = "";
    this.tag = tag;
    this.script = "";
  }
  useContent() {
    this.content;
  }
  useProperty(propertyMap: Map<string, { name: string; value: any }>) {
    let propertyStr = ``;
    let scriptStr = ``;

    for (let i of propertyMap) {
      propertyStr += ` :${i[0]}=${i[1].name} `;
      scriptStr += `let ${i[1].name}=${i[1].value};`;
    }
    this.property += propertyStr;
    this.script += scriptStr;
  }
  exec() {
    return {
      script: this.script,
      template: `<${this.tag} ${this.property}>${this.content}</${this.tag}>`,
    };
  }
}
