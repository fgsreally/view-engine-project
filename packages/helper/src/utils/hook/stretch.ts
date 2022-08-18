interface boundaryType {
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export type stretchType = "x" | "y" | "all";

export function stretch(
  el: HTMLElement,
  dragEl: HTMLElement,
  type:stretchType = "all",
  boundary: boundaryType = {}
) {
  let initX = 0,
    initY = 0,
    initW: number,
    initH: number;

  let moveBoundary = {
    ...{ minW: 5, maxW: Infinity, minH: 5, maxH: Infinity },
    ...boundary,
  };

  function mouseMove(e: MouseEvent) {
    let offsetX = e.clientX - initX;
    let offsetY = e.clientY - initY;
    if (type !== "y") {
      if (initW + offsetX > moveBoundary.maxW) {
        el.style.width = moveBoundary.maxW + "px";
      }
      if (initW + offsetX < moveBoundary.minW) {
        el.style.width = moveBoundary.minW + "px";
      }
      if (
        initW + offsetX > moveBoundary.minW &&
        initW + offsetX < moveBoundary.maxW
      ) {
        el.style.width = initW + offsetX + "px";
      }
    }
    if (type !== "x") {
      if (initH + offsetY > moveBoundary.maxH) {
        el.style.height = moveBoundary.maxH + "px";
      }
      if (initH + offsetY < moveBoundary.minH) {
        el.style.height = moveBoundary.minH + "px";
      }
      if (
        initH + offsetY > moveBoundary.minH &&
        initH + offsetY < moveBoundary.maxH
      ) {
        el.style.height = initH + offsetY + "px";
      }
    }
  }

  function mouseUp(e: MouseEvent) {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
  }

  function mouseDown(e: MouseEvent) {
    e.preventDefault();
    initX = e.clientX;
    initY = e.clientY;
    let { width, height } = el.getBoundingClientRect();
    initW = width;
    initH = height;
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  }

  dragEl.addEventListener("mousedown", mouseDown as any);

  return () => dragEl.removeEventListener("mousedown", mouseDown as any);
}
