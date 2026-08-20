export class Slider extends HTMLInputElement {
    static get is() {
        return 'bpui-slider';
    }
    #implement = new AbortController();
    get vertical() {
        return this.classList.contains('vertical')
    }
    set vertical(v) {
        this.classList.toggle('vertical', v);
    }
    override get value() {
        return super.value;
    }
    override set value(v) {
        super.value = v;
        this.updateRangeBackground();
    }
    override get valueAsNumber() {
        return super.valueAsNumber;
    }
    override set valueAsNumber(v) {
        super.valueAsNumber = v;
        this.updateRangeBackground();
    }
    constructor() {
        super();
        this.classList.add('bpui-slider');
        this.type = 'range';
    }
    connectedCallback() {
        this.#implement.abort();
        this.#implement = new AbortController();

        this.when('input').subscribe(() => { this.updateRangeBackground(); }, { signal: this.#implement.signal });
        this.form?.when('reset').subscribe(() => {
            setTimeout(() => {
                this.updateRangeBackground();
            });
        }, { signal: this.#implement.signal });

        this.updateRangeBackground();
    }
    disconnectedCallback() {
        this.#implement.abort();
    }
    private updateRangeBackground() {
        const max = parseFloat(this.max);
        if (max) {
            const value = this.valueAsNumber / max * 100;
            if (value >= 0) {
                this.style.backgroundImage = `linear-gradient(to ${this.vertical ? 'top' : 'right'}, #00a1d6 0% ${value}%, transparent ${value}% 100%)`;
            }
        }
    }
}
customElements.define(Slider.is, Slider, { extends: 'input' });