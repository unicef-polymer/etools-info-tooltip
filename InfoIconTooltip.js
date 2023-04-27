import {LitElement, html, css} from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html';
import '@polymer/paper-tooltip';
import '@polymer/iron-icons/iron-icons';
import {getTranslation} from './utils/translate';

/**
 * `info-icon-tooltip`
 *  Info icon element, on click will trigger tooltip open.
 *
 * @customElement
 * @demo demo/index.html
 */
export class InfoIconTooltip extends LitElement {
  static get styles() {
    return [
      css`
        #info-icon {
          color: var(--primary-color);
          cursor: pointer;
        }

        #etools-iit-content {
          padding: 20px;
          position: relative;
        }

        .tooltip-info {
          padding: 6px;
          margin: 10px 0px;
          box-sizing: border-box;
          font-size: var(--iit-font-size, 14px);
          color: var(--primary-text-color);
          line-height: 22px;
          font-weight: bold;
          user-select: text;
        }

        .tooltip-info.gray-border {
          border: solid 1px var(--secondary-background-color);
        }
        iron-icon {
          margin: var(--iit-margin, 0);
          width: var(--iit-icon-size, 24px);
          height: var(--iit-icon-size, 24px);
        }
        #close-link {
          font-weight: bold;
          top: 8px;
          right: 10px;
          font-size: 12px;
          position: absolute;
          color: var(--primary-color);
          text-decoration: none;
          cursor: pointer;
        }
        .elevation,
        :host(.elevation) {
          display: block;
        }

        .elevation[elevation='1'],
        :host(.elevation[elevation='1']) {
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
      `
    ];
  }

  render() {
    // language=HTML
    return html`
      <style>
        paper-tooltip {
          --paper-tooltip-background: #ffffff;
          --paper-tooltip: {
            padding: 0;
          }
          width: auto;
        }
        :host {
          display: inline-block;
          cursor: pointer;
        }
      </style>

      <iron-icon
        tabindex="0"
        id="info-icon"
        part="etools-iit-icon"
        icon="info-outline"
        @click="${this.showTooltip}"
      ></iron-icon>
      <paper-tooltip
        for="info-icon"
        id="tooltip"
        fit-to-visible-bounds
        manual-mode
        animation-entry="noanimation"
        .position="${this.position}"
        .offset="${this.offset}"
      >
        <div id="etools-iit-content" part="etools-iit-content" class="elevation" elevation="1">
          <a id="close-link" @click="${this.close}">${getTranslation(this.language, 'CLOSE')}</a>
          <div class="tooltip-info gray-border">
            ${this.tooltipText ? unsafeHTML(this.tooltipText) : this.tooltipHtml}
          </div>
        </div>
      </paper-tooltip>
    `;
  }

  static get properties() {
    return {
      tooltipText: {type: String},
      tooltipHtml: {type: Object},
      position: {type: String},
      offset: {type: Number},
      language: {type: String, attribute: true},
      _tooltipHandler: {
        attribute: false,
        type: Object
      }
    };
  }

  constructor() {
    super();

    this.tooltipText = '';
    this.position = 'right';
    this.offset = 14;
    this.language = window.EtoolsLanguage ? window.EtoolsLanguage : 'en';
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => this.callClickOnEnterPushListener(this.shadowRoot.querySelector('#info-icon')), 200);
    document.addEventListener('language-changed', this.handleLanguageChange.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('language-changed', this.handleLanguageChange.bind(this));
  }

  handleLanguageChange(e) {
    this.language = e.detail.language;
  }

  showTooltip(e) {
    e.stopImmediatePropagation();
    const tooltip = this.shadowRoot.querySelector('#tooltip');
    tooltip.show();

    this._tooltipHandler = this.hideTooltip.bind(this);
    document.addEventListener('click', this._tooltipHandler, true);
    setTimeout(() => {
      this.fixTooltipPosition(tooltip);
    }, 10);
  }

  fixTooltipPosition(tooltip) {
    // need window.EtoolsEsmmFitIntoEl to calculate positioning
    const offsetParent = window.EtoolsEsmmFitIntoEl;
    if (!offsetParent) {
      return;
    }

    if (tooltip.position === 'left') {
      // horizontal positioning
      let tooltipRect = tooltip.getBoundingClientRect();
      const iconRect = tooltip.target.getBoundingClientRect();
      const rightMargin = offsetParent.getBoundingClientRect().right - iconRect.right + iconRect.width;
      tooltip.style.inset = `${
        iconRect.top + offsetParent.scrollTop - offsetParent.offsetTop
      }px ${rightMargin}px auto auto`;
      tooltipRect = tooltip.getBoundingClientRect();
      // vertical positioning
      const verticalCenterOffset = (tooltipRect.height - iconRect.height) / 2;
      const availableTopAboveIcon = iconRect.top - offsetParent.offsetTop;
      const top =
        iconRect.top +
        offsetParent.scrollTop -
        offsetParent.offsetTop -
        Math.min(verticalCenterOffset, availableTopAboveIcon);
      tooltip.style.top = `${top}px`;
    } else if (tooltip.position === 'right') {
      const overlap = offsetParent.offsetTop - tooltip.getBoundingClientRect().top;
      if (overlap > 0) {
        // vertical positioning, make sure tooltip is not cut-off on top
        const tooltipTop = parseFloat(tooltip.style.top.replace('px', ''));
        tooltip.style.top = `${tooltipTop + overlap}px`;
      }
    }
  }

  /**
   * stopImmediatePropagation stops dropdown openning also when this component is inside it.
   * Conditional stopping of propagation is for timing issues, when this method executes before showTooltip.
   */
  hideTooltip(e) {
    const path = e.composedPath() || [];
    if (path.length && path[0].id !== 'close-link' && this._isInPath(path, 'id', 'etools-iit-content')) {
      e.stopImmediatePropagation();
      return;
    }

    const paperTooltip = this.shadowRoot.querySelector('#tooltip');
    if (paperTooltip._showing) {
      paperTooltip.hide();
      document.removeEventListener('click', this._tooltipHandler);
      if (!this.clickedOnOtherInfoIcon(path)) {
        e.stopImmediatePropagation();
      }
    }
  }

  /**
   * Avoid 2 clicks needed to open a second info tooltip
   */
  clickedOnOtherInfoIcon(path) {
    if (path[0] && path[0].id == 'info-icon' && path[0].getRootNode().host != this) {
      return true;
    }
    return false;
  }

  close(e) {
    e.preventDefault();
    this.hideTooltip(e);
  }

  _isInPath(path, propertyName, elementName) {
    path = path || [];
    for (let i = 0; i < path.length; i++) {
      if (path[i][propertyName] === elementName) {
        return true;
      }
    }
    return false;
  }

  callClickOnEnterPushListener(htmlElement) {
    if (htmlElement && htmlElement.addEventListener) {
      htmlElement.addEventListener('keyup', function (event) {
        if (event.key === 'Enter' && !event.ctrlKey) {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          htmlElement.click();
        }
      });
    }
  }
}
