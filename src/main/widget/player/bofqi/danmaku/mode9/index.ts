import type { DanmakuElem } from '..';
import { Button } from './button';
import { generate, type IMode9Button, type IMode9Path, type IMode9Text } from './generate';
import style from './index.css' with {type: 'css'};
import { tokenize } from './lexer';
import { parser } from './parser';
import { Path } from './path';
import { Text } from './text';

export class Mode9 extends HTMLElement {
    static get is() {
        return 'mode-9';
    }
    #shadowRoot = this.attachShadow({ mode: 'closed' });
    constructor(
        parent: ParentNode,
        private dm: IMode9,
        delay = 0,
    ) {
        super();

        if (dm.content) {

            this.#shadowRoot.adoptedStyleSheets.push(style);

            if (!dm.mode9) {
                // 只解码一次
                dm.mode9 = <any>generate(parser(tokenize(dm.content.replace(/(?:\/n|\\n|\n|\r\n)/g, '\n'))))
            }

            if (dm.mode9?.length) {
                dm.mode9.forEach(d => {
                    switch (d.type) {
                        case 'text': {
                            this.#shadowRoot.append(new Text(this, d, delay));
                            break;
                        }
                        case 'button': {
                            this.#shadowRoot.append(new Button(this, d, delay));
                            break;
                        }
                        case 'path': {
                            this.#shadowRoot.append(new Path(this, d, delay));
                            break;
                        }
                    }
                })
                this.#shadowRoot.childElementCount && parent.append(this);
            }
        }
    }
    connectedCallback() {
        this.dm.$rendered = true;
        this.when('--remove').switchMap(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).filter(() => this.#shadowRoot.childElementCount === 0).take(1).subscribe(() => { this.remove() });
    }
    disconnectedCallback() {
        delete this.dm.$rendered;
    }
}
customElements.define(Mode9.is, Mode9);

interface IMode9 extends DanmakuElem {
    mode9?: (IMode9Text | IMode9Button | IMode9Path)[];
}