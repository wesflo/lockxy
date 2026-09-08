import type { CustomElementDecorator } from '@lit/reactive-element/decorators.js';
import type { Constructor } from '@lit/reactive-element/decorators/base.js';

export const wfElement =
    (tagName: string): CustomElementDecorator =>
    (
        classOrTarget: Omit<typeof HTMLElement, 'new'> | Constructor<HTMLElement>,
        context?: ClassDecoratorContext<Constructor<HTMLElement>>
    ) => {
        if (typeof customElements === 'undefined') {
            return;
        }

        if (!customElements.get(tagName)) {
            if (context !== undefined) {
                context.addInitializer(() => {
                    customElements.define(tagName, classOrTarget as CustomElementConstructor);
                });
            } else {
                customElements.define(tagName, classOrTarget as CustomElementConstructor);
            }
        }
    };
