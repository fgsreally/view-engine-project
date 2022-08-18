interface mouseOpts {
  button?: number;
  altKey?: boolean;
  ctrlKey?: boolean;
}
function mouseFn(fn: Function, opts: mouseOpts = {}) {
  let options: mouseOpts = {
    ...{ button: 0, altKey: false, ctrlKey: false },
    ...opts,
  };
  return function event(e: MouseEvent) {
    let { button, altKey, ctrlKey } = e;
    if (
      options.button === button &&
      options.altKey === altKey &&
      options.ctrlKey === ctrlKey
    ) {
      fn(e);
    }
  };
}
export function useClick(fn: (e: MouseEvent) => void, opts?: mouseOpts) {
  let event = mouseFn(fn, opts);
  document.addEventListener("click", event);
  return () => document.removeEventListener("click", event);
}

export function useDown(fn: (e: MouseEvent) => void, opts?: mouseOpts) {
  let event = mouseFn(fn, opts);
  document.addEventListener("mousedown", event);
  return () => document.removeEventListener("mousedown", event);
}

export function useUp(fn: (e: MouseEvent) => void, opts?: mouseOpts) {
  let event = mouseFn(fn, opts);
  document.addEventListener("mouseup", event);
  return () => document.removeEventListener("mouseup", event);
}

export function useMove(fn: (e: MouseEvent) => void, opts?: mouseOpts) {
  let event = mouseFn(fn, opts);
  document.addEventListener("mousemove", event);
  return () => document.removeEventListener("mousemove", event);
}

interface holdHook {
  down: (e: MouseEvent) => void;
  move: (e: MouseEvent) => void;
  up: (e: MouseEvent) => void;
}
interface optsHook {
  down?: mouseOpts;
  move?: mouseOpts;
  up?: mouseOpts;
}

export function useHold(hook: holdHook, opts?: optsHook) {
  let removeMove:Function, removeUp:Function;
  let revoke = (e: MouseEvent) => {
    hook.up(e);
    removeMove();
    removeUp();
  };
  let invoke = (e: MouseEvent) => {
    hook.down(e);
    removeMove = useMove(hook.move, opts?.move);
    removeUp = useUp(revoke, opts?.up);
  };
  return useDown(invoke, opts?.down);
}

export function useVis(visCb: Function, disCb: Function) {
  let event = function () {
    if (document.visibilityState === "visible") {
      visCb();
    } else {
      disCb();
    }
  };
  document.addEventListener("visibilitychange", event);
  return () => document.removeEventListener("visibilitychange", event);
}

export function useFull(fullCb: Function, disCb: Function) {
  let event = function () {
    if (document.fullscreenElement) {
      fullCb();
    } else {
      disCb();
    }
  };
  document.addEventListener("fullscreenchange", event);
  return () => document.removeEventListener("fullscreenchange", event);
}
