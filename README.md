# \<etools-info-tooltip\>

Tooltip element associated with form elements (or any other element), 
an icon is used to trigger tooltip open.

![paper-input tooltip](screenshots/tooltip_for_paper_input.png)
![paper-input-tooltip important warning](screenshots/tooltip_important_warning_for_paper_input.png)
![text element important warning tooltip](screenshots/tooltip-important-warnin_text_elementg.png)
![text element tooltip](screenshots/tooltip_text_element.png)

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
  <span slot="message">Tooltip message <br>for this text</span>
</etools-info-tooltip>
```

Properties:
* icon - String, default: `info-outline`, only default set of icons can be used
* position - String, default: `top`
* importantWarning - Boolean, default: `false`
* theme - String, default: `dark` (only `dark` and `light` allowed)

You can use `importantWarning` property and `icon` property to make the field style look like a warning
(using `--error-color` var) on the UI.


## Styling

You can use `paper-tooltip` and element variables and mixins to change tooltip style.

Custom property | Description | Default
----------------|-------------|----------
`--paper-tooltip-background` | Tooltip background | `#ffffff`
`--paper-tooltip-opacity` | Tooltip opacity | `1`
`--paper-tooltip-text-color` | Tooltip text color | `var(--primary-text-color, rgba(0, 0, 0, 0.87)`
`--paper-tooltip` | Tooltip mixin | `{}`
`--etools-tooltip-trigger-icon` | Mixin applied to the icon that triggers tooltip open | `{}`

Attributes:
 * `icon-first` attribute can be used to place the icon in front of the element
 * `right-aligned` attribute will align the content to the right

## Install
```bash
$ bower install --save etools-info-tooltip
```

## Preview element locally

Install needed dependencies by running: `$ bower install`.
Make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `$ polymer serve` to serve your element application locally.

## Linting the code

Innstall local npm packages (run `npm install`)
Then just run the linting task

```bash
$ npm run lint
```
You should also use polylint. If you don't have Polylint installed run `npm install -g polylint`.
Then just run the linter on each file you wish to check like so

```bash
$ polylint -i filename.html
```
At the moment polylint crashes if it encounters a missing import. If that happens, temporarily comment out such imports and run the command again.

## Running Tests

You need to have `web-component-tester` installed (if not run `npm install -g web-component-tester`)
```bash
$ wct
```
or
```bash
$ wct -p
```
