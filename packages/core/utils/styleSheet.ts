export function getAllCssText(startIndex: number = 37, perfix?: string) {
  //get csstext by styleSheet
  let styleSheet = document.styleSheets;
  let ret = "";
  for (let i = startIndex; i < styleSheet[1].cssRules.length; i++) {
    let cssText = styleSheet[1].cssRules[i].cssText;
    if (cssText.startsWith(".")) {
      ret += perfix + cssText;
    }
  }
  return ret;
}
