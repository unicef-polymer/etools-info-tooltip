# \<etools-info-tooltip\>

Tooltip element associated with form elements (or any other element),
an icon is used to trigger tooltip open.

Check demo for more details (`npm i`, `polymer serve`).

![paper-input tooltip](https://raw.githubusercontent.com/unicef-polymer/etools-info-tooltip/HEAD/screenshots/tooltip_for_paper_input.png)
![paper-input-tooltip important warning](https://raw.githubusercontent.com/unicef-polymer/etools-info-tooltip/HEAD/screenshots/tooltip_important_warning_for_paper_input.png)
![text element important warning tooltip](https://raw.githubusercontent.com/unicef-polymer/etools-info-tooltip/HEAD/screenshots/tooltip-important-warnin_text_elementg.png)
![text element tooltip](https://raw.githubusercontent.com/unicef-polymer/etools-info-tooltip/HEAD/screenshots/tooltip_text_element.png)

## Usage

```html
<etools-info-tooltip theme="light">
  <paper-input slot="field" label="Form input" placeholder="Enter text here..."></paper-input>
  <span slot="message">Tooltip message for this input</span>
</etools-info-tooltip>

<etools-info-tooltip icon="report-problem" important-warning>
  <paper-input slot="field" label="Form input" placeholder="Enter text here..."></paper-input>
  <span slot="message">Tooltip message for this input</span>
</etools-info-tooltip>

<etools-info-tooltip theme="light">
  <span slot="field">This is just a simple text.</span>
  <span slot="message">Tooltip message for this text</span>
</etools-info-tooltip>

<etools-info-tooltip icon="report" important-warning>
  <span slot="field">This is just a simple text.</span>
  <span slot="message">Tooltip message <br />for this text</span>
</etools-info-tooltip>
```

Properties:

- icon - String, default: `info-outline`, only default set of icons can be used
- position - String, default: `top`
- importantWarning - Boolean, default: `false`
- theme - String, default: `dark` (only `dark` and `light` allowed)

You can use `importantWarning` property and `icon` property to make the field style look like a warning
(using `--error-color` var) on the UI.

## Styling

You can use `paper-tooltip` and element variables and mixins to change tooltip style.

| Custom property                 | Description                                          | Default                                         |
| ------------------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| `--paper-tooltip-background`    | Tooltip background                                   | `#ffffff`                                       |
| `--paper-tooltip-opacity`       | Tooltip opacity                                      | `1`                                             |
| `--paper-tooltip-text-color`    | Tooltip text color                                   | `var(--primary-text-color, rgba(0, 0, 0, 0.87)` |
| `--paper-tooltip`               | Tooltip mixin                                        | `{}`                                            |
| `--etools-tooltip-trigger-icon` | Mixin applied to the icon that triggers tooltip open | `{}`                                            |

Attributes:

- `icon-first` attribute can be used to place the icon in front of the element
- `right-aligned` attribute will align the content to the right

## Install

```bash
$ npm i --save @unicef-polymer/etools-info-tooltip
```

## Linting the code

Install local npm packages (run `npm install`)
Then just run the linting task

```bash
$ npm run lint
```

## Demo / Preview element locally

Install needed dependencies by running: `$ npm install`.

By default iron-component-page will look for a file called analysis.json. If the JSON descriptor file - analysis.json is not up-to-date, re-generate it using

```bash
polymer analyze > analysis.json
```

If the generated analysis.json is empty , try specifing the file or the entrypoint in polymer.json.

Make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `$ polymer serve` to serve your element application locally.

## Running Tests

TODO: improve and add more tests

```
$ polymer test
```

## Circle CI

Package will be automatically published after tag push (`git tag 1.2.3` , `git push --tags`). Tag name must correspond to SemVer (Semantic Versioning) rules.  
Examples:

| Version match      | Result   |
| ------------------ | -------- |
| `1.2.3`            | match    |
| `1.2.3-pre`        | match    |
| `1.2.3+build`      | match    |
| `1.2.3-pre+build`  | match    |
| `v1.2.3-pre+build` | match    |
| `1.2`              | no match |

You can see more details [here](https://rgxdb.com/r/40OZ1HN5)
