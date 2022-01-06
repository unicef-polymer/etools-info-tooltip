import {LitElement, html} from 'lit-element';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/neon-animation/neon-animations.js';

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
          --paper-tooltip-delay-in: 0;
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
          --paper-tooltip: {
            font-size: 12px;
          }
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
          --paper-tooltip-background: var(--primary-background-color, #ffffff);
          --paper-tooltip-opacity: 1;
          --paper-tooltip-text-color: var(--primary-text-color, rgba(0, 0, 0, 0.87));

          --paper-tooltip: {
            @apply --tooltip-box-style;
            @apply --light-tooltip-style;
          }
        }

        :host([form-field-align]) #tooltip-trigger {
          display: flex;
          align-self: flex-end;
          margin-bottom: 11px;
        }

        :host(:not([icon-first])) #tooltip-trigger {
          margin-left: 8px;
        }

        :host([icon-first]) #tooltip-trigger {
          margin-left: 0;
          margin-right: 8px;
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
      <span id="tooltip-trigger" part="eit-trigger-icon" ?hidden$="${this.hideTooltip}" tabindex="0">
        <iron-icon ?hidden="${this.customIcon}" .icon="${this.icon}"></iron-icon>

        <slot ?hidden="${!this.customIcon}" name="custom-icon"></slot>
      </span>
      <paper-tooltip
        id="tooltip"
        for="tooltip-trigger"
        .position="${this.position}"
        .animationDelay="${this.animationDelay}"
        .manualMode="${this.openOnClick}"
        .animationConfig="${this.noAnimationConfig}"
        animation-entry=""
        animation-exit=""
        .fitToVisibleBounds="${this.fitToVisibleBounds}"
        .offset="${this.offset}"
      >
        <slot name="message"></slot>
      </paper-tooltip>
    `;
  }

  static get properties() {
    return {
      position: {
        type: String
      },
      animationDelay: {
        type: Number
      },
      icon: {
        type: String
      },
      customIcon: {
        type: Boolean,
        attribute: 'custom-icon'
      },
      hideTooltip: Boolean,
      importantWarning: {
        type: Boolean,
        attribute: 'important-warning'
      },
      theme: {
        type: String
      },
      fitToVisibleBounds: {
        type: Boolean
      },
      noAnimationConfig: {
        type: Object,
        attribute: 'no-animation-config'
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
    this.animationDelay = 0;
    this.fitToVisibleBounds = true;
    this.noAnimationConfig = {};
    this.offset = 5;
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      const tooltipContent = this.shadowRoot.querySelector('#tooltip');
      if (tooltipContent) {
        tooltipContent.style.display = 'flex';
        tooltipContent.style.flexDirection = 'row';
        tooltipContent.style.textAlign = 'left';
        tooltipContent.style.lineHeight = '16px';
        tooltipContent.style.whiteSpace = 'pre-wrap';
      }
    });
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
      target.addEventListener('click', this._openTooltip.bind(this));
      target.addEventListener('focus', this._openTooltip.bind(this));
      // target.addEventListener('mouseenter', this._openTooltip.bind(this));
      target.addEventListener('blur', this._closeTooltip.bind(this));
      // target.addEventListener('mouseleave', this._closeTooltip.bind(this));
    }
  }

  _removeClickEventListeners() {
    const target = this.shadowRoot.querySelector('#tooltip-trigger');
    if (target) {
      target.removeEventListener('click', this._openTooltip);
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
