/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   etools-info-tooltip.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/**
 * `etools-info-tooltip`
 * Tooltip element associated with form elements (or any other element), an icon is used to trigger tooltip open.
 */
declare class EtoolsInfoTooltip extends PolymerElement {
  position: string|null|undefined;
  animationDelay: number|null|undefined;
  icon: string|null|undefined;
  customIcon: boolean|null|undefined;
  hideTooltip: boolean|null|undefined;
  importantWarning: boolean|null|undefined;
  theme: string|null|undefined;
  fitToVisibleBounds: boolean|null|undefined;
  openOnClick: boolean|null|undefined;

  /**
   * Used to align tooltip icon near a paper-input or a form input that uses paper-input-container
   */
  formFieldAlign: boolean|null|undefined;
  connectedCallback(): void;
  _refreshStyles(importantWarning: any): void;
  _openOnClickChanged(openOnClick: any): void;
  _addClickEventListeners(): void;
  _removeClickEventListeners(): void;
  _openTooltip(): void;
  _closeTooltip(): void;
}

declare global {

  interface HTMLElementTagNameMap {
    "etools-info-tooltip": EtoolsInfoTooltip;
  }
}
