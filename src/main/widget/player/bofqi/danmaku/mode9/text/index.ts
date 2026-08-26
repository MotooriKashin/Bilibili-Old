import { Button } from '../button';
import type { IMode9Button, IMode9Path, IMode9Text } from '../generate';
import type { CurserNode, NumberNode, ParamNode, PercentNode, StringNode } from '../parser';
import { Path } from '../path';
import style from './index.css' with {type: 'css'};

export class Text extends HTMLElement {
    static get is() {
        return 'mode-9-text';
    }
    #shadowRoot = this.attachShadow({ mode: 'closed' });
    constructor(
        private parrent: HTMLElement,
        { x, y, zIndex, alpha, anchorX, anchorY, scale, rotateX, rotateY, rotateZ, duration, content, color, fontSize, fontFamily, bold, textShadow, strokeWidth, strokeColor, children, animation }: IMode9Text,
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

        this.dataset['content'] = content.value;
        color && (this.dataset['color'] = color.value);
        switch (fontSize?.type) {
            case 'number': {
                this.dataset['fontSize'] = `${fontSize.value}px`;
                break;
            }
            case 'percent': {
                this.dataset['fontSize'] = `${fontSize.value}cqi`;
                break;
            }
        }
        fontFamily && (this.dataset['fontFamily'] = fontFamily.value);
        bold?.value === 0 && this.classList.add('bold');
        textShadow?.value === 0 && this.classList.add('ts');
        strokeWidth && (this.dataset['strokeWidth'] = <any>strokeWidth.value);
        strokeColor && (this.dataset['strokeColor'] = strokeColor.value);

        (<(IMode9Text | IMode9Button | IMode9Path)[]>children)?.forEach(d => {
            switch (d.type) {
                case 'text': {
                    this.#shadowRoot.append(new Text(parrent, d, delay));
                    break;
                }
                case 'button': {
                    this.#shadowRoot.append(new Button(parrent, d, delay));
                    break;
                }
                case 'path': {
                    this.#shadowRoot.append(new Path(parrent, d, delay));
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
                switch (<keyof IMode9Text>key) {
                    case 'content': {
                        params.push(`--content: '${(<StringNode>value).value.replace("'", "\\'")}';`);
                        break;
                    }
                    case 'color': {
                        params.push(`color: ${(<CurserNode>value).value};`);
                        break;
                    }
                    case 'fontSize': {
                        switch (value.type) {
                            case 'number': {
                                params.push(`font-size: ${(<NumberNode>value).value}px;`);
                                break;
                            }
                            case 'percent': {
                                params.push(`font-size: ${(<PercentNode>value).value}cqi;`);
                                break;
                            }
                        }
                        break;
                    }
                    case 'fontFamily': {
                        params.push(`font-family: ${(<StringNode>value).value};`);
                        break;
                    }
                    case 'bold': {
                        params.push(`font-weight: ${(<NumberNode>value).value ? 'bold' : 'normal'};`);
                        break;
                    }
                    case 'textShadow': {
                        params.push(`text-shadow: ${(<NumberNode>value).value ? '1px 0 1px var(--shadow), 0 1px 1px var(--shadow), 0 -1px 1px var(--shadow), -1px 0 1px var(--shadow)' : 'none'};`);
                        break;
                    }
                    case 'strokeWidth': {
                        params.push(`-webkit-text-stroke-width: ${(<NumberNode>value).value}px;`);
                        break;
                    }
                    case 'strokeColor': {
                        params.push(`-webkit-text-stroke-color: ${(<CurserNode>value).value};`);
                        break;
                    }
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
                        params.push(`--scale: ${(<NumberNode>value).value};`);
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
        this.parrent.dispatchEvent(new CustomEvent('--remove'));
    }
}
customElements.define(Text.is, Text);