import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/neon-animation/neon-animations.js';

/**
 * `etools-info-tooltip`
 * Tooltip element associated with form elements (or any other element), an icon is used to trigger tooltip open.
 *
 * @polymer
 * @customElement
 * @demo demo/index.html
 */
class EtoolsInfoTooltip extends PolymerElement {
  static get template() {
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
          @apply --layout-horizontal;
          @apply --layout-center;
        }

        :host([right-aligned]) {
          @apply --layout-end-justified;
        }

        :host([icon-first]) {
          @apply --layout-horizontal-reverse;
          @apply --layout-end-justified;
        }

        :host([icon-first][right-aligned]) {
          @apply --layout-start-justified;
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
          @apply --layout;
          @apply --layout-self-end;
          margin-bottom: 11px;
        }

        :host(:not([icon-first])) #tooltip-trigger {
          margin-left: 8px;
          @apply --etools-tooltip-trigger-icon;
        }

        :host([icon-first]) #tooltip-trigger {
          margin-left: 0;
          margin-right: 8px;
          @apply --etools-tooltip-trigger-icon;
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
      <span id="tooltip-trigger" hidden$="[[hideTooltip]]" tabindex="0">
        <template is="dom-if" if="[[!customIcon]]" restamp>
          <iron-icon icon="[[icon]]"></iron-icon>
        </template>
        <template is="dom-if" if="[[customIcon]]" restamp>
          <slot name="custom-icon"></slot>
        </template>
      </span>
      <paper-tooltip
        id="tooltip"
        for="tooltip-trigger"
        position="[[position]]"
        animation-delay="[[animationDelay]]"
        manual-mode="[[openOnClick]]"
        animation-config="[[noAnimationConfig]]"
        animation-entry=""
        animation-exit=""
        fit-to-visible-bounds="[[fitToVisibleBounds]]"
        offset="[[offset]]"
      >
        <slot name="message"></slot>
      </paper-tooltip>
    `;
  }

  static get is() {
    return 'etools-info-tooltip';
  }

  static get properties() {
    return {
      position: {
        type: String,
        value: 'top'
      },
      animationDelay: {
        type: Number,
        value: 0
      },
      icon: {
        type: String,
        value: 'info-outline'
      },
      customIcon: {
        type: Boolean,
        value: false
      },
      hideTooltip: Boolean,
      importantWarning: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_refreshStyles'
      },
      theme: {
        type: String,
        value: 'dark',
        reflectToAttribute: true,
        observer: '_refreshStyles'
      },
      fitToVisibleBounds: {
        type: Boolean,
        value: true
      },
      noAnimationConfig: {
        type: Object,
        value: {}
      },

      openOnClick: {
        type: Boolean,
        value: false,
        observer: '_openOnClickChanged'
      },
      /**
       * Used to align tooltip icon near a paper-input or a form input that uses paper-input-container
       */
      formFieldAlign: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      tooltipHandler: {
        type: Object
      },
      offset: {
        type: Number,
        value: 5
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    const tooltipContent = this.$.tooltip.$.tooltip;
    if (tooltipContent) {
      tooltipContent.style.display = 'flex';
      tooltipContent.style.flexDirection = 'row';
      tooltipContent.style.textAlign = 'left';
      tooltipContent.style.lineHeight = '16px';
      tooltipContent.style.whiteSpace = 'pre-wrap';
    }
  }

  _refreshStyles(importantWarning) {
    if (typeof importantWarning === 'undefined') {
      return;
    }
    this.updateStyles();
  }

  _openOnClickChanged(openOnClick) {
    if (openOnClick) {
      this._addClickEventListeners();
    } else {
      this._removeClickEventListeners();
    }
  }

  _addClickEventListeners() {
    const target = this.$['tooltip-trigger'];
    if (target) {
      target.addEventListener('click', this._openTooltip.bind(this));
      target.addEventListener('focus', this._openTooltip.bind(this));
      target.addEventListener('mouseenter', this._openTooltip.bind(this));
      target.addEventListener('blur', this._closeTooltip.bind(this));
      target.addEventListener('mouseleave', this._closeTooltip.bind(this));
    }
  }

  _removeClickEventListeners() {
    const target = this.$['tooltip-trigger'];
    if (target) {
      target.removeEventListener('click', this._openTooltip);
      target.removeEventListener('focus', this._openTooltip);
      target.removeEventListener('mouseenter', this._openTooltip);
      target.removeEventListener('blur', this._closeTooltip);
      target.removeEventListener('mouseleave', this._closeTooltip);
    }
  }

  _openTooltip() {
    this.$.tooltip.show();
  }

  _closeTooltip() {
    this.$.tooltip.hide();
  }
}

window.customElements.define(EtoolsInfoTooltip.is, EtoolsInfoTooltip);
