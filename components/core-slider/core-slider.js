// @ts-check

// @ts-ignore
import htmlTemplate from './core-slider.html';
// @ts-ignore
import cssTemplate from './core-slider.css';

/**
 * A basic slider
 * @example ---
 * @property {float} [value = 0]  - the binded value of the slider. Default is set to 0.
 * @property {float} [min = 0]    - the minimum value of the slider. Default is set to 0.
 * @property {float} [max = 100]  - the maximum value of the slider. Default is set to 100.
 * @property {float} [step = 0]   - the size of the step.           Default is set to 0
 */

class CoreSlider extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'min', 'max', 'step'];
  }

  constructor() {
    super();
    this.template = document.createElement('template');
    this.template.innerHTML = htmlTemplate;
    this.styleNode = document.createElement('style');
    this.styleNode.innerHTML = cssTemplate;

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this.template.content.cloneNode(true));
    shadowRoot.appendChild(this.styleNode);

    this.slider = shadowRoot.querySelector('input');
    this.tooltip = shadowRoot.querySelector('span');
    this.progress = shadowRoot.querySelector('.slider-progress');

    this.positionTooltip = this.positionTooltip.bind(this);

    this.value = 50;
    this.max = 100;
    this.min = 0;
    this.step = 1;
  }

  positionTooltip() {
    const p = (this.value - this.min) / (this.max - this.min);
    this.tooltip.style.left = `calc(${p * 100}% - ${30 * p}px)`;
    // @ts-ignore
    this.progress.style.width = `calc(${p * 100}% - ${34 * p}px)`;
    this.tooltip.innerText = this.value.toString();
  }

  connectedCallback() {
    this.positionTooltip();

    this.slider.addEventListener('input', (ev) => {
      // @ts-ignore
      this.value = ev.target.value;
      this.setAttribute('value', this.value.toString());
      this.positionTooltip();
    });

    this.onmousemove = this.positionTooltip;
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'min':
        this.min = parseFloat(newVal);
        this.slider.min = this.min.toString();
        break;
      case 'max':
        this.max = parseFloat(newVal);
        this.slider.max = this.max.toString();
        break;
      case 'value':
        this.value = parseFloat(newVal);
        this.slider.value = this.value.toString();
        break;
      default:
        break;
    }
  }
}

window.customElements.define('core-slider', CoreSlider);
