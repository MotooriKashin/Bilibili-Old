const timers = new Set<Timer>();
const elements = new Set<HTMLElement>();

export function pushTimer(timer: Timer) {
    timers.add(timer);
}

export function popTimer(timer: Timer) {
    timer.stop();
    timers.delete(timer);
}

export function clearTimer() {
    for (const timer of timers) {
        timer.stop();
    }
    timers.clear();
}

export function pushEl(el: HTMLElement) {
    elements.add(el);
}

export function popEl(el: HTMLElement) {
    el.remove();
    elements.delete(el);
}

export function clearEl() {
    for (const timer of elements) {
        timer.remove();
    }
    elements.clear();
}

/** TODO */
export function clearTrigger() { }

interface Timer {
    stop: () => void
}