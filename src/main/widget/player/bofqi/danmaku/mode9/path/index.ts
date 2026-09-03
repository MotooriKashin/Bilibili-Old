import { Button } from '../button';
import type { IMode9Button, IMode9Path, IMode9Text } from '../generate';
import type { NumberNode, ParamNode, PercentNode } from '../parser';
import { Text } from '../text';
import style from './index.css' with {type: 'css'};

export class Path extends HTMLElement {
    static get is() {
        return 'mode-9-path';
    }
    #shadowRoot = this.attachShadow({ mode: 'closed' });
    #target = this.#shadowRoot.appendChild(document.createElement('div'));
    constructor(
        private parrent: HTMLElement,
        { x, y, zIndex, alpha, anchorX, anchorY, scale, rotateX, rotateY, rotateZ, duration, d, borderWidth, borderColor, borderAlpha, fillColor, fillAlpha, viewBox, width, height, children, animation }: IMode9Path,
        delay = 0,
    ) {
        super();

        switch (x?.type) {
            case 'number': {
                this.dataset['x'] = `${x.value}px`;
                break;
            }
            case 'percent': {
                this.dataset['x'] = `${x.value}%`;
                break;
            }
        }
        switch (y?.type) {
            case 'number': {
                this.dataset['y'] = `${y.value}px`;
                break;
            }
            case 'percent': {
                this.dataset['y'] = `${y.value}%`;
                break;
            }
        }
        zIndex && (this.dataset['zIndex'] = <any>zIndex.value);
        alpha && (this.dataset['opacity'] = <any>alpha.value);
        anchorX && (this.dataset['anchorX'] = <any>(anchorX.value * 100));
        anchorY && (this.dataset['anchorY'] = <any>(anchorY.value * 100));
        scale && (this.dataset['scale'] = <any>scale.value);
        rotateX && (this.dataset['rotateX'] = <any>rotateX.value);
        rotateY && (this.dataset['rotateY'] = <any>rotateY.value);
        rotateZ && (this.dataset['rotateZ'] = <any>rotateZ.value);

        const svg = this.#target.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
        const path = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
        path.setAttribute('d', d.value);
        borderWidth && path.setAttribute('stroke-width', <any>borderWidth.value);
        borderColor && path.setAttribute('stroke', borderColor.value);
        borderAlpha && path.setAttribute('stroke-opacity', <any>borderAlpha.value);
        path.setAttribute('fill', fillColor?.value || 'white');
        fillAlpha && path.setAttribute('fill-opacity', <any>fillAlpha.value);
        if (viewBox) {
            svg.setAttribute('viewBox', viewBox.value);
            if (width || height) {
                switch (width?.type) {
                    case 'number': {
                        svg.setAttribute('width', <any>width.value);
                        break;
                    }
                    case 'percent': {
                        svg.setAttribute('width', `${width.value}cqi`);
                        break
                    }
                }
                switch (height?.type) {
                    case 'number': {
                        svg.setAttribute('height', <any>height.value);
                        break;
                    }
                    case 'percent': {
                        svg.setAttribute('height', `${height.value}cqi`);
                        break
                    }
                }
            } else {
                const [, , width] = viewBox.value.includes(',') ? viewBox.value.split(',') : viewBox.value.split(' ');
                width && svg.setAttribute('width', width);
            }
        }

        (<(IMode9Text | IMode9Button | IMode9Path)[]>children)?.forEach(d => {
            switch (d.type) {
                case 'text': {
                    this.#target.append(new Text(parrent, d, delay));
                    break;
                }
                case 'button': {
                    this.#target.append(new Button(parrent, d, delay));
                    break;
                }
                case 'path': {
                    this.#target.append(new Path(parrent, d, delay));
                    break;
                }
            }
        });

        const id = `mode-9-${crypto.randomUUID()}`;
        const animations = [`${id} ${duration?.value || 4000}ms linear ${delay}ms var(--playing)`]; // 生存周期动画（用于动画结束时移除元素）
        const keyframes = [`@keyframes ${id} {}`];
        animation?.forEach(({ duration, delay: d1, timeFunction, properties }) => {
            const params: string[] = [];
            (<ParamNode[]>properties).map(({ key, value }) => {
                switch (<keyof IMode9Path>key) {
                    case 'x': {
                        switch (value.type) {
                            case 'number': {
                                params.push(`--x: ${(<NumberNode>value).value}px;`);
                                break;
                            }
                            case 'percent': {
                                params.push(`--x: ${(<PercentNode>value).value}%;`);
                                break;
                            }
                        }
                        break;
                    }
                    case 'y': {
                        switch (value.type) {
                            case 'number': {
                                params.push(`--y: ${(<NumberNode>value).value}px;`);
                                break;
                            }
                            case 'percent': {
                                params.push(`--y: ${(<PercentNode>value).value}%;`);
                                break;
                            }
                        }
                        break;
                    }
                    case 'zIndex': {
                        params.push(`z-index: ${(<NumberNode>value).value};`);
                        break;
                    }
                    case 'alpha': {
                        params.push(`opacity: ${(<NumberNode>value).value};`);
                        break;
                    }
                    case 'anchorX': {
                        params.push(`--anchor-x: ${(<NumberNode>value).value * 100}%;`);
                        break;
                    }
                    case 'anchorY': {
                        params.push(`--anchor-y: ${(<NumberNode>value).value * 100}%;`);
                        break;
                    }
                    case 'scale': {
                        params.push(`--scale-x: ${(<NumberNode>value).value};`);
                        break;
                    }
                    case 'rotateX': {
                        params.push(`--rotate-x: ${(<NumberNode>value).value}deg;`);
                        break;
                    }
                    case 'rotateY': {
                        params.push(`--rotate-y: ${(<NumberNode>value).value}deg;`);
                        break;
                    }
                    case 'rotateZ': {
                        params.push(`--rotate-z: ${(<NumberNode>value).value}deg;`);
                        break;
                    }
                }
            });
            if (params.length) {
                const id = `mode-9-${crypto.randomUUID()}`;
                animations.push(`${id} ${duration}ms ${timeFunction || 'linear'} ${delay + d1}ms forwards var(--playing)`);
                keyframes.push(`@keyframes ${id} { to { ${params.join('\n')}} }`);
            }
        });

        keyframes.push(`:host{ animation:${animations.join(', ')}; }`);
        this.when('animationend').filter(d => d.animationName === id).take(1).subscribe(() => { this.remove(); });
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(keyframes.join('\n\n'));
        this.#shadowRoot.adoptedStyleSheets.push(sheet, style);
    }
    disconnectedCallback() {
        this.parrent.dispatchEvent(new Event('--remove'));
    }
}
customElements.define(Path.is, Path);