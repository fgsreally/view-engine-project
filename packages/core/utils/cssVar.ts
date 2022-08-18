export function changeStyleVar<CssVar extends string>(
  name: CssVar,
  value: string
) {
  document.documentElement.style.setProperty(`--${name}`, value);
}

export function changeStyleValue(
  name: keyof CSSStyleDeclaration,
  value: string
) {
  document.documentElement.style[name as any] = value;
}
