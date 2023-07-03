import {LitElement, html} from 'lit-element';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/neon-animation/neon-animations.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

/**
 * `etools-info-tooltip`
 * Tooltip element associated with form elements (or any other element), an icon is used to trigger tooltip open.
 *
 * @polymer
 * @customElement
 * @demo demo/index.html
 */
export class EtoolsInfoTooltip extends LitElement {
  render() {
    // language=HTML
    return html`
      <style>
        [hidden] {
          display: none !important;
        }

        :host {
          --tooltip-box-style: {
            text-align: center;
            line-height: 1.4;
          }
          --light-tooltip-style: {
            -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
            -moz-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
            border: 1px solid rgba(0, 0, 0, 0.15);
          }

          --show-delay: 50;

          display: flex;
          flex-direction: row;
          align-items: center;
        }

        :host([right-aligned]) {
          justify-content: flex-end;
        }

        :host([icon-first]) {
          display: flex;
          flex-direction: row-reverse;
          justify-content: flex-end;
        }

        :host([icon-first][right-aligned]) {
          justify-content: flex-start;
        }

        :host([theme='light']) {
          --sl-tooltip-background-color: var(--primary-background-color, #ffffff);
          --sl-tooltip-color: var(--primary-text-color, rgba(0, 0, 0, 0.87));
        }
        sl-tooltip[theme='light']::part(body) {
          @apply --tooltip-box-style;
          @apply --light-tooltip-style;
        }

        :host([form-field-align]) #tooltip-trigger {
          display: flex;
          align-self: flex-end;
          margin-bottom: 11px;
        }

        :host(:not([icon-first])) #tooltip-trigger {
          margin-inline-start: 8px;
        }

        :host([icon-first]) #tooltip-trigger {
          margin-inline-start: 0;
          margin-inline-end: 8px;
        }

        :host([important-warning]:not([hide-tooltip])) {
          color: var(--error-color, #e54f2e);
        }
        :host #tooltip-trigger:focus:not(:focus-visible) {
          outline: 0;
        }
        :host #tooltip-trigger:focus-visible {
          outline: 0;
          box-shadow: 0 0 5px 5px rgba(170, 165, 165, 0.3);
          background-color: rgba(170, 165, 165, 0.2);
        }
      </style>
      <!-- element assigned to this tooltip -->
      <slot name="field"></slot>
      <sl-tooltip id="tooltip" .trigger="${this.openOnClick ? 'click' : 'hover'}" theme="${this.theme}">
        <div slot="content">
          <slot name="message"></slot>
        </div>
        <span id="tooltip-trigger" part="eit-trigger-icon" ?hidden="${this.hideTooltip}" tabindex="0">
          <iron-icon ?hidden="${this.customIcon}" .icon="${this.icon}"></iron-icon>

          <slot ?hidden="${!this.customIcon}" name="custom-icon"></slot>
        </span>
      </sl-tooltip>
    `;
  }

  static get properties() {
    return {
      position: {
        type: String
      },
      icon: {
        type: String
      },
      customIcon: {
        type: Boolean,
        attribute: 'custom-icon'
      },
      hideTooltip: {
        type: Boolean,
        attribute: 'hide-tooltip'
      },
      importantWarning: {
        type: Boolean,
        attribute: 'important-warning'
      },
      theme: {
        type: String
      },
      openOnClick: {
        type: Boolean,
        attribute: 'open-on-click'
      },
      /**
       * Used to align tooltip icon near a paper-input or a form input that uses paper-input-container
       */
      formFieldAlign: {
        type: Boolean
      },
      tooltipHandler: {
        type: Object
      },
      offset: {
        type: Number
      }
    };
  }

  get readingOrderConvertedPosition() {
    if (this.position === 'left' && document.dir === 'rtl') {
      return 'right';
    }

    if (this.position === 'right' && document.dir === 'rtl') {
      return 'left';
    }

    return this.position;
  }

  set openOnClick(val) {
    this._openOnClick = val;
    setTimeout(() => this._openOnClickChanged.bind(this, val)(), 200);
  }
  get openOnClick() {
    return this._openOnClick;
  }

  set theme(val) {
    this._theme = val;
    this._refreshStyles();
  }

  get theme() {
    return this._theme;
  }

  set importantWarning(val) {
    this._importantWarning = val;
    this._refreshStyles();
  }

  get importantWarning() {
    return this._importantWarning;
  }

  constructor() {
    super();

    this.icon = 'info-outline';
    this.position = 'top';
    this._theme = 'dark';
    this._importantWarning = false;
    this._openOnClick = false;
    this.formFieldAlign = false;
    this.customIcon = false;
    this.offset = 5;
    this.language = window.EtoolsLanguage || 'en';
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('language-changed', this._handleLanguageChange.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('language-changed', this._handleLanguageChange.bind(this));
  }

  _handleLanguageChange(e) {
    this.language = e.detail.language;
  }

  _refreshStyles(importantWarning) {
    if (typeof importantWarning === 'undefined') {
      return;
    }
    this.requestUpdate();
  }

  _openOnClickChanged(openOnClick) {
    if (openOnClick) {
      this._addClickEventListeners();
    } else {
      this._removeClickEventListeners();
    }
  }

  _addClickEventListeners() {
    const target = this.shadowRoot.querySelector('#tooltip-trigger');
    if (target) {
      target.addEventListener('focus', this._openTooltip.bind(this));
      // target.addEventListener('mouseenter', this._openTooltip.bind(this));
      target.addEventListener('blur', this._closeTooltip.bind(this));
      // target.addEventListener('mouseleave', this._closeTooltip.bind(this));
    }
  }

  _removeClickEventListeners() {
    const target = this.shadowRoot.querySelector('#tooltip-trigger');
    if (target) {
      target.removeEventListener('focus', this._openTooltip);
      //  target.removeEventListener('mouseenter', this._openTooltip);
      target.removeEventListener('blur', this._closeTooltip);
      // target.removeEventListener('mouseleave', this._closeTooltip);
    }
  }

  _openTooltip() {
    this.shadowRoot.querySelector('#tooltip').show();
  }

  _closeTooltip() {
    this.shadowRoot.querySelector('#tooltip').hide();
  }
}
