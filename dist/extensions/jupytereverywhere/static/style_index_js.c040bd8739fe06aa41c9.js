"use strict";
(self["webpackChunkjupytereverywhere"] = self["webpackChunkjupytereverywhere"] || []).push([["style_index_js"],{

/***/ "./node_modules/css-loader/dist/runtime/api.js"
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
(module) {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ },

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js"
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
(module) {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ },

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js"
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
(module) {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
(module) {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js"
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
(module) {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js"
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
(module) {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js"
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
(module) {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js"
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
(module) {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ },

/***/ "./style/index.js"
/*!************************!*\
  !*** ./style/index.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.css */ "./style/base.css");



/***/ },

/***/ "./node_modules/css-loader/dist/cjs.js!./style/base.css"
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style/base.css ***!
  \**************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./icons/coursekata-logo.svg */ "./style/icons/coursekata-logo.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ./icons/download-simple.svg */ "./style/icons/download-simple.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap);"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* stylelint-disable no-descending-specificity */

/*
    See the JupyterLab Developer Guide for useful CSS Patterns:

    https://jupyterlab.readthedocs.io/en/stable/developer/css.html
*/

#jp-menu-panel,
#jp-top-bar,
#jp-top-panel,
.jp-LabShell[data-shell-mode='single-document'] #jp-menu-panel,
.jp-LabShell[data-shell-mode='single-document'] #jp-top-bar {
  min-height: 0;
  display: none;
}

:root {
  --je-scale: 0.74;
  --je-slate-blue: #412c88;
  --je-round-corners: 0px;
  --je-round-corners-filetiles: 4px;
  --je-font-family: 'Inter', sans-serif;
  --je-dialog-round-corners: 6px;
  --je-cell-height: 34px;
  --je-toastify-z-index: calc(var(--toastify-z-index) + 2);
  --je-document-padding: calc(var(--je-scale) * 42px);
  --je-toolbar-height: calc(var(--je-scale) * 56px);
  --je-margin-below-toolbar: calc(var(--je-scale) * 10px);
  --je-lilac: #fff;
  --je-border-color: #d7d7d7;
  --je-slate-blue-gradient:
    linear-gradient(90deg, rgb(0 0 0 / 0%) 0%, rgb(0 0 0 / 20%) 100%), #4b3187;
}

.jp-Dialog-content {
  border: 1px solid var(--je-slate-blue);
  border-radius: var(--je-dialog-round-corners);
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  font-family: var(--je-font-family);
}

.jp-Dialog-body {
  color: var(--je-slate-blue);
  font-family: var(--je-font-family);
  font-size: calc(var(--je-scale) * 16px);
  line-height: 1.45;
}

.jp-Dialog-footer {
  justify-content: center;
}

.jp-Dialog-footerButtons {
  text-align: center;
  cursor: pointer;
}

.jp-Dialog {
  clip-path: rect(
    calc(var(--je-document-padding) + var(--je-toolbar-height) + var(--je-margin-below-toolbar))
      calc(100% - var(--je-document-padding)) calc(100% - var(--je-document-padding))
      var(--je-document-padding) round var(--je-dialog-round-corners)
  );
}

.jp-Dialog-content .jp-Dialog-button {
  background: var(--je-slate-blue) !important;
  box-shadow: none;
  border-radius: 4px;
  font-family: var(--je-font-family);
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  cursor: pointer;
}

.jp-Dialog-header {
  color: var(--je-slate-blue);
  font-family: var(--je-font-family);
  font-weight: 600;
  text-align: center;
  justify-content: center;
}

.jp-toastContainer {
  z-index: var(--je-toastify-z-index);
}

.jp-InputArea-prompt-indicator {
  left: 0;
  line-height: 25px;
}

.jp-InputArea-prompt-indicator::before {
  left: 0;
  line-height: 25px;
  top: 5px;
}

.jp-InputArea-prompt {
  overflow: visible !important;
}

.jp-InputArea-prompt-run.je-cell-run-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%) scale(1.15) !important;
  opacity: 0 !important;
  transition: opacity 0.15s ease-in-out;
  color: #fe5b7d !important;
  overflow: visible;
}

.jp-InputArea-prompt-run.je-cell-run-button button:focus,
.jp-InputArea-prompt-run.je-cell-run-button button:focus-visible {
  outline: none;
}

.jp-InputArea-prompt-run.je-cell-run-button.je-cell-running::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2.5px solid transparent;
  border-top-color: #fe5b7d;
  animation: je-run-spin 0.7s linear infinite;
  pointer-events: none;
  box-sizing: border-box;
}

@keyframes je-run-spin {
  to { transform: rotate(360deg); }
}

.jp-RawCell .jp-InputArea-prompt-run.je-cell-run-button {
  display: none;
}

.jp-Cell.jp-mod-active:not(.jp-RawCell) .jp-InputArea-prompt-run.je-cell-run-button {
  opacity: 1 !important;
}

.jp-InputArea-prompt-run.je-cell-run-button circle {
  fill: #fe5b7d !important;
}

.jp-InputArea-prompt-run.je-cell-run-button:hover circle {
  fill: #e24f6e !important;
}

.jp-InputArea-prompt-run.je-cell-run-button svg,
.jp-InputArea-prompt-run.je-cell-run-button svg *,
.jp-InputArea-prompt-run.je-cell-run-button .jp-Icon,
.jp-InputArea-prompt-run.je-cell-run-button .jp-Icon * {
  fill: #fe5b7d !important;
  stroke: #fe5b7d !important;
}

.jp-InputArea-prompt-run.je-cell-run-button:hover,
.jp-InputArea-prompt-run.je-cell-run-button:hover svg,
.jp-InputArea-prompt-run.je-cell-run-button:hover svg *,
.jp-InputArea-prompt-run.je-cell-run-button:hover .jp-Icon,
.jp-InputArea-prompt-run.je-cell-run-button:hover .jp-Icon * {
  fill: #e24f6e !important;
  stroke: #e24f6e !important;
}

/* Hide all dirty state indicators */
.jp-Cell.jp-mod-dirty .jp-Cell-inputCollapser,
.jp-InputCollapser.jp-Cell-inputCollapser,
.jp-OutputCollapser.jp-Cell-outputCollapser,
.jp-Collapser-child {
  display: none;
}

.jp-Notebook .jp-CodeCell:hover .jp-InputArea-prompt-indicator,
.jp-Notebook .jp-CodeCell.jp-mod-active .jp-InputArea-prompt-indicator,
.jp-Notebook .jp-CodeCell.jp-mod-selected .jp-InputArea-prompt-indicator,
.jp-Notebook .jp-CodeCell:hover .jp-InputPrompt > .jp-InputArea-prompt-indicator,
.jp-Notebook .jp-CodeCell.jp-mod-active .jp-InputPrompt > .jp-InputArea-prompt-indicator,
.jp-Notebook .jp-CodeCell.jp-mod-selected .jp-InputPrompt > .jp-InputArea-prompt-indicator {
  visibility: hidden;
}

.jp-Notebook .jp-Cell:not(.jp-mod-active) .jp-OutputPrompt {
  visibility: hidden;
}

.jp-Notebook .jp-Cell.jp-mod-active .jp-OutputPrompt {
  visibility: visible;
}

.jp-Cell.jp-mod-dirty::before {
  display: none;
}

.jp-Cell.jp-mod-dirty .jp-InputArea::before {
  display: none;
}

/* Hide the • (U+2022) character for dirty cells */
.jp-Cell.jp-mod-dirty .jp-InputPrompt.jp-InputArea-prompt::before {
  content: '';
}

.jp-InputArea {
  position: relative;
}

.jp-InputArea-editor {
  border-radius: 0;
  padding: calc(var(--je-scale) * 4px);
}

/* Ensure markdown and raw cells have a height that's
consistent with code cells */
.jp-MarkdownCell .jp-InputArea,
.jp-RawCell .jp-InputArea {
  min-height: var(--je-cell-height);
}

.jp-CodeCell .jp-Cell-inputWrapper {
  min-height: var(--je-cell-height);
}

.jp-mod-focused .cm-placeholder {
  visibility: hidden;
}

.cm-editor .cm-placeholder {
  color: #828282 !important;
  font-weight: 600;
}

.jp-MarkdownCell .jp-RenderedHTMLCommon,
.jp-MarkdownCell .jp-InputArea-editor {
  min-height: 32px;
  align-items: center;
}

/* ------------------------------------------------------------------ */

/* Toolbars: base styles, then JE overrides                           */

/* ------------------------------------------------------------------ */

.jp-Toolbar {
  --jp-ui-font-color1: var(--je-slate-blue);
  --jp-ui-font-family: var(--je-font-family);

  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px !important;
}

.jp-Toolbar-item {
  margin-right: 6px !important;
}

.jp-ToolbarButton {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
}

.jp-ToolbarButton svg {
  width: 16px;
  height: 16px;
  stroke: #412c88;
  fill: none;
}

.jp-ToolbarButtonComponent {
  border-radius: 0 !important;
  padding: 2px 4px !important;
}

.jp-ToolbarButtonComponent svg {
  width: 18px !important;
  height: 18px !important;
}

.jp-ToolbarButtonComponent-label {
  font-weight: 600;
  font-size: 16px !important;
}

.jp-ToolbarButtonComponent-label span:first-child {
  color: #fe5b7d;
}

.jp-ToolbarButtonComponent-label:has(> span) span:first-child {
  color: #fe5b7d !important;
}

jp-button[aria-label='Download'] svg {
  width: 16px !important;
  height: 16px !important;
  fill: #412c88 !important;
  stroke: #412c88 !important;
}

.je-KernelSwitcherButton.jp-ToolbarButtonComponent::part(content) {
  gap: 4px;
  flex-direction: row-reverse;
}

.jp-cell-toolbar .jp-ToolbarButtonComponent {
  padding: calc(var(--je-scale) * 3px);
}

.jp-cell-toolbar .jp-ToolbarButtonComponent > svg {
  min-height: 21px;
  min-width: 18px;
}

/* Main area widget: full-width toolbar band */
.jp-MainAreaWidget > .jp-Toolbar {
  width: 100% !important;
  min-height: 44px !important;
  padding: 6px 14px !important;
  margin: 0 0 10px !important;
  border-radius: 0 !important;
  background: #f3f3f3 !important;
  border-top: 1px solid #e0e0e0 !important;
  border-bottom: 1px solid #e0e0e0 !important;
  box-shadow: none !important;
}

.jp-MainAreaWidget > .jp-Toolbar .jp-Toolbar-item {
  margin-right: 8px !important;
}

.jp-MainAreaWidget > .jp-Toolbar .jp-ToolbarButtonComponent-label {
  font-size: 18px !important;
  font-weight: 600;
}

.jp-MainAreaWidget > .jp-Toolbar .jp-ToolbarButtonComponent > svg {
  height: initial;
  width: initial;
  scale: 0.62 !important;
}

.jp-MainAreaWidget > :not(.jp-Toolbar) {
  border-radius: 0;
  margin-top: var(--je-margin-below-toolbar);
  background: white;
}

.jp-Notebook {
  --jp-code-font-size: calc(var(--je-scale) * 16px);
  --jp-cell-editor-background: #fff;
  --jp-cell-editor-border-color: #cfcfcf;
  --jp-border-width: calc(var(--je-scale) * 1px);
}

.jp-Cell,
.jp-CodeCell .jp-Cell-inputWrapper,
.jp-MarkdownCell .jp-InputArea,
.jp-RawCell .jp-InputArea {
  border-radius: 0 !important;
}

/* ------------------------------------------------------------------ */

/* Notebook panel toolbar: CourseKata logo and tool cluster           */

/* ------------------------------------------------------------------ */

.jp-NotebookPanel-toolbar {
  display: flex;
  align-items: center;
}

.ck-logo-button {
  width: 110px;
  height: 28px;
  margin-right: 16px;
  margin-left: 2px;
  flex: 0 0 auto;
}

.ck-logo-button a {
  display: block;
  width: 100%;
  height: 100%;
  background: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) no-repeat center left;
  background-size: contain;
}

.jp-NotebookPanel-toolbar .jp-Toolbar-spacer {
  flex: 1 1 auto;
}

.jp-NotebookPanel-toolbar .jp-Toolbar-item {
  margin-right: 4px;
}

.jp-NotebookPanel-toolbar .jp-ToolbarButtonComponent {
  padding: 1px 2px !important;
}

.jp-NotebookPanel-toolbar .jp-ToolbarButtonComponent-label {
  font-size: 14px !important;
}

.jp-NotebookPanel-toolbar .jp-ToolbarButtonComponent > svg {
  width: 16px !important;
  height: 16px !important;
}

.jp-NotebookPanel-toolbar jp-button.jp-ToolbarButtonComponent .jp-ToolbarButtonComponent-label {
  font-size: 13px !important;
  font-weight: 600 !important;
  line-height: 1 !important;
}

/* Per-tool icon sizing */
.jp-NotebookPanel-toolbar [data-jp-item-name='run'] svg {
  width: 14px !important;
  height: 18px !important;
}

.jp-NotebookPanel-toolbar [data-jp-item-name='interrupt'] svg,
.jp-NotebookPanel-toolbar [data-jp-item-name='restart'] svg {
  width: 18px !important;
  height: 18px !important;
}

.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] svg {
  width: 18px !important;
  height: 18px !important;
}

.jp-NotebookPanel-toolbar [data-jp-item-name='jeKernelSwitcher'] svg {
  width: 10px !important;
  height: 10px !important;
}

/* Color the + icons CourseKata red */
.jp-NotebookPanel-toolbar [data-jp-item-name='insert'] svg[data-icon='ui-components:add'] path,
.jp-NotebookPanel-toolbar
  [data-jp-item-name='insert-text']
  svg[data-icon='ui-components:add']
  path {
  stroke: #fe5b7d !important;
}

/* Hide tools we don't use */
.jp-NotebookPanel-toolbar [data-jp-item-name='restart-and-run'],
.jp-NotebookPanel-toolbar [data-jp-item-name='kernelStatus'] {
  display: none !important;
}

/* Replace Download text+icon with a simple custom icon */
.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] .jp-ToolbarButtonComponent-label {
  display: none !important;
}

.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] .jp-ToolbarButtonComponent > svg {
  display: none !important;
}

.jp-NotebookPanel-toolbar
  [data-jp-item-name='downloadDropdown']
  jp-button.jp-ToolbarButtonComponent::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url(${___CSS_LOADER_URL_REPLACEMENT_1___}) no-repeat center;
  background-size: contain;
  vertical-align: middle;
  position: relative;
  top: 3px;
}

.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] jp-button {
  --focus-stroke-outer: transparent !important;
  --focus-stroke-inner: transparent !important;
}

.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] jp-button::part(control) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] .jp-ToolbarButtonComponent:focus,
.jp-NotebookPanel-toolbar
  [data-jp-item-name='downloadDropdown']
  .jp-ToolbarButtonComponent:focus-visible,
.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] jp-button:focus,
.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] jp-button:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] jp-button:focus::part(control),
.jp-NotebookPanel-toolbar
  [data-jp-item-name='downloadDropdown']
  jp-button:focus-visible::part(control),
.jp-NotebookPanel-toolbar
  [data-jp-item-name='downloadDropdown']
  jp-button[focus-visible]::part(control) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

#jp-main-dock-panel[data-mode='single-document'] {
  padding: var(--je-document-padding) !important;
  background: var(--je-lilac);
}

#jp-main-dock-panel[data-mode='single-document'] .jp-MainAreaWidget {
  border-radius: 0;
  background: transparent;
}

.je-NotFound {
  height: 100%;
  width: 100%;
  background: white;
  border-radius: 0;
}

.je-NotFound-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
}

.je-NotFound-content {
  font-family: var(--je-font-family);
  color: var(--je-slate-blue);
}

.je-NotFound-code {
  opacity: 0.5;
  margin-bottom: 12px;
  font-size: 48px;
  color: var(--je-slate-blue);
}

.je-NotFound-title {
  margin: 0 0 8px;
  font-weight: 700;
  color: var(--je-slate-blue);
}

.je-NotFound-message {
  margin: 0;
  opacity: 0.8;
  color: var(--je-slate-blue);
}

/* ------------------------------------------------------------------ */

/* Kernel indicator                                                   */

/* ------------------------------------------------------------------ */

.ck-KernelIndicator {
  font-weight: 600;
  padding: 0 6px;
  font-size: 14px;
}

.ck-kernel-starting {
  color: #7a7a7a;
  animation: ck-kernel-pulse 1.2s ease-in-out infinite;
}

.ck-kernel-ready {
  color: #16a34a;
}

@keyframes ck-kernel-pulse {
  0% {
    opacity: 0.45;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.45;
  }
}

/* GitHub file browser dialog */

.je-GitHubBrowser {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 460px;
  padding: 4px 0;
  font-family: var(--je-font-family);
}

.je-GitHubBrowser-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.je-GitHubBrowser-input {
  flex: 1;
  padding: 6px 10px;
  font-size: 13px;
  font-family: var(--je-font-family);
  border: 1px solid var(--je-border-color);
  border-radius: 4px;
  outline: none;
}

.je-GitHubBrowser-input:focus {
  border-color: var(--je-slate-blue);
}

.je-GitHubBrowser-browse-btn {
  padding: 6px 14px;
  font-size: 13px;
  font-family: var(--je-font-family);
  background: var(--je-slate-blue);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.je-GitHubBrowser-browse-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.je-GitHubBrowser-recent {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 8px;
  font-size: 12px;
  padding: 2px 0;
}

.je-GitHubBrowser-recent-label {
  color: #888;
  flex-shrink: 0;
}

.je-GitHubBrowser-recent-item {
  cursor: pointer;
  color: var(--je-slate-blue);
  text-decoration: underline;
}

.je-GitHubBrowser-recent-item:hover {
  opacity: 0.75;
}

.je-GitHubBrowser-breadcrumb {
  font-size: 12px;
  color: #666;
  padding: 2px 0;
}

.je-GitHubBrowser-sep {
  color: #aaa;
}

.je-GitHubBrowser-repo-label {
  font-weight: 600;
  color: #333;
}

.je-GitHubBrowser-crumb {
  cursor: pointer;
  color: var(--je-slate-blue);
  text-decoration: underline;
}

.je-GitHubBrowser-crumb:hover {
  opacity: 0.75;
}

.je-GitHubBrowser-list {
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid var(--je-border-color);
  border-radius: 4px;
  font-size: 13px;
}

.je-GitHubBrowser-item {
  padding: 7px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.je-GitHubBrowser-item:last-child {
  border-bottom: none;
}

.je-GitHubBrowser-item:hover {
  background: #f5f3ff;
}

.je-GitHubBrowser-item--selected {
  background: #ede9fe;
  font-weight: 500;
}

.je-GitHubBrowser-item--dir {
  color: var(--je-slate-blue);
  font-weight: 500;
}

.je-GitHubBrowser-item--file {
  color: #333;
}

.je-GitHubBrowser-message {
  padding: 16px 12px;
  color: #888;
  text-align: center;
  font-size: 13px;
}

.je-GitHubBrowser-error {
  padding: 12px;
  color: #b91c1c;
  font-size: 13px;
}

/* Checkmark for the currently-open notebook in the File menu recents list */
.lm-Menu-item.lm-mod-toggled > .lm-Menu-itemIcon {
  position: relative;
}

.lm-Menu-item.lm-mod-toggled > .lm-Menu-itemIcon::after {
  content: '✓';
  display: block;
  font-size: 13px;
  font-weight: bold;
  color: var(--je-slate-blue, #5c8ede);
  text-align: center;
  line-height: 1;
}
`, "",{"version":3,"sources":["webpack://./style/base.css"],"names":[],"mappings":"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","sourcesContent":["/* stylelint-disable no-descending-specificity */\n\n/*\n    See the JupyterLab Developer Guide for useful CSS Patterns:\n\n    https://jupyterlab.readthedocs.io/en/stable/developer/css.html\n*/\n\n@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');\n\n#jp-menu-panel,\n#jp-top-bar,\n#jp-top-panel,\n.jp-LabShell[data-shell-mode='single-document'] #jp-menu-panel,\n.jp-LabShell[data-shell-mode='single-document'] #jp-top-bar {\n  min-height: 0;\n  display: none;\n}\n\n:root {\n  --je-scale: 0.74;\n  --je-slate-blue: #412c88;\n  --je-round-corners: 0px;\n  --je-round-corners-filetiles: 4px;\n  --je-font-family: 'Inter', sans-serif;\n  --je-dialog-round-corners: 6px;\n  --je-cell-height: 34px;\n  --je-toastify-z-index: calc(var(--toastify-z-index) + 2);\n  --je-document-padding: calc(var(--je-scale) * 42px);\n  --je-toolbar-height: calc(var(--je-scale) * 56px);\n  --je-margin-below-toolbar: calc(var(--je-scale) * 10px);\n  --je-lilac: #fff;\n  --je-border-color: #d7d7d7;\n  --je-slate-blue-gradient:\n    linear-gradient(90deg, rgb(0 0 0 / 0%) 0%, rgb(0 0 0 / 20%) 100%), #4b3187;\n}\n\n.jp-Dialog-content {\n  border: 1px solid var(--je-slate-blue);\n  border-radius: var(--je-dialog-round-corners);\n  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);\n  font-family: var(--je-font-family);\n}\n\n.jp-Dialog-body {\n  color: var(--je-slate-blue);\n  font-family: var(--je-font-family);\n  font-size: calc(var(--je-scale) * 16px);\n  line-height: 1.45;\n}\n\n.jp-Dialog-footer {\n  justify-content: center;\n}\n\n.jp-Dialog-footerButtons {\n  text-align: center;\n  cursor: pointer;\n}\n\n.jp-Dialog {\n  clip-path: rect(\n    calc(var(--je-document-padding) + var(--je-toolbar-height) + var(--je-margin-below-toolbar))\n      calc(100% - var(--je-document-padding)) calc(100% - var(--je-document-padding))\n      var(--je-document-padding) round var(--je-dialog-round-corners)\n  );\n}\n\n.jp-Dialog-content .jp-Dialog-button {\n  background: var(--je-slate-blue) !important;\n  box-shadow: none;\n  border-radius: 4px;\n  font-family: var(--je-font-family);\n  font-style: normal;\n  font-weight: 500;\n  line-height: 150%;\n  cursor: pointer;\n}\n\n.jp-Dialog-header {\n  color: var(--je-slate-blue);\n  font-family: var(--je-font-family);\n  font-weight: 600;\n  text-align: center;\n  justify-content: center;\n}\n\n.jp-toastContainer {\n  z-index: var(--je-toastify-z-index);\n}\n\n.jp-InputArea-prompt-indicator {\n  left: 0;\n  line-height: 25px;\n}\n\n.jp-InputArea-prompt-indicator::before {\n  left: 0;\n  line-height: 25px;\n  top: 5px;\n}\n\n.jp-InputArea-prompt {\n  overflow: visible !important;\n}\n\n.jp-InputArea-prompt-run.je-cell-run-button {\n  position: absolute;\n  right: 8px;\n  top: 50%;\n  transform: translateY(-50%) scale(1.15) !important;\n  opacity: 0 !important;\n  transition: opacity 0.15s ease-in-out;\n  color: #fe5b7d !important;\n  overflow: visible;\n}\n\n.jp-InputArea-prompt-run.je-cell-run-button button:focus,\n.jp-InputArea-prompt-run.je-cell-run-button button:focus-visible {\n  outline: none;\n}\n\n.jp-InputArea-prompt-run.je-cell-run-button.je-cell-running::after {\n  content: '';\n  position: absolute;\n  inset: -4px;\n  border-radius: 50%;\n  border: 2.5px solid transparent;\n  border-top-color: #fe5b7d;\n  animation: je-run-spin 0.7s linear infinite;\n  pointer-events: none;\n  box-sizing: border-box;\n}\n\n@keyframes je-run-spin {\n  to { transform: rotate(360deg); }\n}\n\n.jp-RawCell .jp-InputArea-prompt-run.je-cell-run-button {\n  display: none;\n}\n\n.jp-Cell.jp-mod-active:not(.jp-RawCell) .jp-InputArea-prompt-run.je-cell-run-button {\n  opacity: 1 !important;\n}\n\n.jp-InputArea-prompt-run.je-cell-run-button circle {\n  fill: #fe5b7d !important;\n}\n\n.jp-InputArea-prompt-run.je-cell-run-button:hover circle {\n  fill: #e24f6e !important;\n}\n\n.jp-InputArea-prompt-run.je-cell-run-button svg,\n.jp-InputArea-prompt-run.je-cell-run-button svg *,\n.jp-InputArea-prompt-run.je-cell-run-button .jp-Icon,\n.jp-InputArea-prompt-run.je-cell-run-button .jp-Icon * {\n  fill: #fe5b7d !important;\n  stroke: #fe5b7d !important;\n}\n\n.jp-InputArea-prompt-run.je-cell-run-button:hover,\n.jp-InputArea-prompt-run.je-cell-run-button:hover svg,\n.jp-InputArea-prompt-run.je-cell-run-button:hover svg *,\n.jp-InputArea-prompt-run.je-cell-run-button:hover .jp-Icon,\n.jp-InputArea-prompt-run.je-cell-run-button:hover .jp-Icon * {\n  fill: #e24f6e !important;\n  stroke: #e24f6e !important;\n}\n\n/* Hide all dirty state indicators */\n.jp-Cell.jp-mod-dirty .jp-Cell-inputCollapser,\n.jp-InputCollapser.jp-Cell-inputCollapser,\n.jp-OutputCollapser.jp-Cell-outputCollapser,\n.jp-Collapser-child {\n  display: none;\n}\n\n.jp-Notebook .jp-CodeCell:hover .jp-InputArea-prompt-indicator,\n.jp-Notebook .jp-CodeCell.jp-mod-active .jp-InputArea-prompt-indicator,\n.jp-Notebook .jp-CodeCell.jp-mod-selected .jp-InputArea-prompt-indicator,\n.jp-Notebook .jp-CodeCell:hover .jp-InputPrompt > .jp-InputArea-prompt-indicator,\n.jp-Notebook .jp-CodeCell.jp-mod-active .jp-InputPrompt > .jp-InputArea-prompt-indicator,\n.jp-Notebook .jp-CodeCell.jp-mod-selected .jp-InputPrompt > .jp-InputArea-prompt-indicator {\n  visibility: hidden;\n}\n\n.jp-Notebook .jp-Cell:not(.jp-mod-active) .jp-OutputPrompt {\n  visibility: hidden;\n}\n\n.jp-Notebook .jp-Cell.jp-mod-active .jp-OutputPrompt {\n  visibility: visible;\n}\n\n.jp-Cell.jp-mod-dirty::before {\n  display: none;\n}\n\n.jp-Cell.jp-mod-dirty .jp-InputArea::before {\n  display: none;\n}\n\n/* Hide the • (U+2022) character for dirty cells */\n.jp-Cell.jp-mod-dirty .jp-InputPrompt.jp-InputArea-prompt::before {\n  content: '';\n}\n\n.jp-InputArea {\n  position: relative;\n}\n\n.jp-InputArea-editor {\n  border-radius: 0;\n  padding: calc(var(--je-scale) * 4px);\n}\n\n/* Ensure markdown and raw cells have a height that's\nconsistent with code cells */\n.jp-MarkdownCell .jp-InputArea,\n.jp-RawCell .jp-InputArea {\n  min-height: var(--je-cell-height);\n}\n\n.jp-CodeCell .jp-Cell-inputWrapper {\n  min-height: var(--je-cell-height);\n}\n\n.jp-mod-focused .cm-placeholder {\n  visibility: hidden;\n}\n\n.cm-editor .cm-placeholder {\n  color: #828282 !important;\n  font-weight: 600;\n}\n\n.jp-MarkdownCell .jp-RenderedHTMLCommon,\n.jp-MarkdownCell .jp-InputArea-editor {\n  min-height: 32px;\n  align-items: center;\n}\n\n/* ------------------------------------------------------------------ */\n\n/* Toolbars: base styles, then JE overrides                           */\n\n/* ------------------------------------------------------------------ */\n\n.jp-Toolbar {\n  --jp-ui-font-color1: var(--je-slate-blue);\n  --jp-ui-font-family: var(--je-font-family);\n\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-height: 42px !important;\n}\n\n.jp-Toolbar-item {\n  margin-right: 6px !important;\n}\n\n.jp-ToolbarButton {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 28px;\n}\n\n.jp-ToolbarButton svg {\n  width: 16px;\n  height: 16px;\n  stroke: #412c88;\n  fill: none;\n}\n\n.jp-ToolbarButtonComponent {\n  border-radius: 0 !important;\n  padding: 2px 4px !important;\n}\n\n.jp-ToolbarButtonComponent svg {\n  width: 18px !important;\n  height: 18px !important;\n}\n\n.jp-ToolbarButtonComponent-label {\n  font-weight: 600;\n  font-size: 16px !important;\n}\n\n.jp-ToolbarButtonComponent-label span:first-child {\n  color: #fe5b7d;\n}\n\n.jp-ToolbarButtonComponent-label:has(> span) span:first-child {\n  color: #fe5b7d !important;\n}\n\njp-button[aria-label='Download'] svg {\n  width: 16px !important;\n  height: 16px !important;\n  fill: #412c88 !important;\n  stroke: #412c88 !important;\n}\n\n.je-KernelSwitcherButton.jp-ToolbarButtonComponent::part(content) {\n  gap: 4px;\n  flex-direction: row-reverse;\n}\n\n.jp-cell-toolbar .jp-ToolbarButtonComponent {\n  padding: calc(var(--je-scale) * 3px);\n}\n\n.jp-cell-toolbar .jp-ToolbarButtonComponent > svg {\n  min-height: 21px;\n  min-width: 18px;\n}\n\n/* Main area widget: full-width toolbar band */\n.jp-MainAreaWidget > .jp-Toolbar {\n  width: 100% !important;\n  min-height: 44px !important;\n  padding: 6px 14px !important;\n  margin: 0 0 10px !important;\n  border-radius: 0 !important;\n  background: #f3f3f3 !important;\n  border-top: 1px solid #e0e0e0 !important;\n  border-bottom: 1px solid #e0e0e0 !important;\n  box-shadow: none !important;\n}\n\n.jp-MainAreaWidget > .jp-Toolbar .jp-Toolbar-item {\n  margin-right: 8px !important;\n}\n\n.jp-MainAreaWidget > .jp-Toolbar .jp-ToolbarButtonComponent-label {\n  font-size: 18px !important;\n  font-weight: 600;\n}\n\n.jp-MainAreaWidget > .jp-Toolbar .jp-ToolbarButtonComponent > svg {\n  height: initial;\n  width: initial;\n  scale: 0.62 !important;\n}\n\n.jp-MainAreaWidget > :not(.jp-Toolbar) {\n  border-radius: 0;\n  margin-top: var(--je-margin-below-toolbar);\n  background: white;\n}\n\n.jp-Notebook {\n  --jp-code-font-size: calc(var(--je-scale) * 16px);\n  --jp-cell-editor-background: #fff;\n  --jp-cell-editor-border-color: #cfcfcf;\n  --jp-border-width: calc(var(--je-scale) * 1px);\n}\n\n.jp-Cell,\n.jp-CodeCell .jp-Cell-inputWrapper,\n.jp-MarkdownCell .jp-InputArea,\n.jp-RawCell .jp-InputArea {\n  border-radius: 0 !important;\n}\n\n/* ------------------------------------------------------------------ */\n\n/* Notebook panel toolbar: CourseKata logo and tool cluster           */\n\n/* ------------------------------------------------------------------ */\n\n.jp-NotebookPanel-toolbar {\n  display: flex;\n  align-items: center;\n}\n\n.ck-logo-button {\n  width: 110px;\n  height: 28px;\n  margin-right: 16px;\n  margin-left: 2px;\n  flex: 0 0 auto;\n}\n\n.ck-logo-button a {\n  display: block;\n  width: 100%;\n  height: 100%;\n  background: url('./icons/coursekata-logo.svg') no-repeat center left;\n  background-size: contain;\n}\n\n.jp-NotebookPanel-toolbar .jp-Toolbar-spacer {\n  flex: 1 1 auto;\n}\n\n.jp-NotebookPanel-toolbar .jp-Toolbar-item {\n  margin-right: 4px;\n}\n\n.jp-NotebookPanel-toolbar .jp-ToolbarButtonComponent {\n  padding: 1px 2px !important;\n}\n\n.jp-NotebookPanel-toolbar .jp-ToolbarButtonComponent-label {\n  font-size: 14px !important;\n}\n\n.jp-NotebookPanel-toolbar .jp-ToolbarButtonComponent > svg {\n  width: 16px !important;\n  height: 16px !important;\n}\n\n.jp-NotebookPanel-toolbar jp-button.jp-ToolbarButtonComponent .jp-ToolbarButtonComponent-label {\n  font-size: 13px !important;\n  font-weight: 600 !important;\n  line-height: 1 !important;\n}\n\n/* Per-tool icon sizing */\n.jp-NotebookPanel-toolbar [data-jp-item-name='run'] svg {\n  width: 14px !important;\n  height: 18px !important;\n}\n\n.jp-NotebookPanel-toolbar [data-jp-item-name='interrupt'] svg,\n.jp-NotebookPanel-toolbar [data-jp-item-name='restart'] svg {\n  width: 18px !important;\n  height: 18px !important;\n}\n\n.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] svg {\n  width: 18px !important;\n  height: 18px !important;\n}\n\n.jp-NotebookPanel-toolbar [data-jp-item-name='jeKernelSwitcher'] svg {\n  width: 10px !important;\n  height: 10px !important;\n}\n\n/* Color the + icons CourseKata red */\n.jp-NotebookPanel-toolbar [data-jp-item-name='insert'] svg[data-icon='ui-components:add'] path,\n.jp-NotebookPanel-toolbar\n  [data-jp-item-name='insert-text']\n  svg[data-icon='ui-components:add']\n  path {\n  stroke: #fe5b7d !important;\n}\n\n/* Hide tools we don't use */\n.jp-NotebookPanel-toolbar [data-jp-item-name='restart-and-run'],\n.jp-NotebookPanel-toolbar [data-jp-item-name='kernelStatus'] {\n  display: none !important;\n}\n\n/* Replace Download text+icon with a simple custom icon */\n.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] .jp-ToolbarButtonComponent-label {\n  display: none !important;\n}\n\n.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] .jp-ToolbarButtonComponent > svg {\n  display: none !important;\n}\n\n.jp-NotebookPanel-toolbar\n  [data-jp-item-name='downloadDropdown']\n  jp-button.jp-ToolbarButtonComponent::before {\n  content: '';\n  display: inline-block;\n  width: 14px;\n  height: 14px;\n  background: url('./icons/download-simple.svg') no-repeat center;\n  background-size: contain;\n  vertical-align: middle;\n  position: relative;\n  top: 3px;\n}\n\n.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] jp-button {\n  --focus-stroke-outer: transparent !important;\n  --focus-stroke-inner: transparent !important;\n}\n\n.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] jp-button::part(control) {\n  outline: none !important;\n  box-shadow: none !important;\n  border: none !important;\n}\n\n.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] .jp-ToolbarButtonComponent:focus,\n.jp-NotebookPanel-toolbar\n  [data-jp-item-name='downloadDropdown']\n  .jp-ToolbarButtonComponent:focus-visible,\n.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] jp-button:focus,\n.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] jp-button:focus-visible {\n  outline: none !important;\n  box-shadow: none !important;\n}\n\n.jp-NotebookPanel-toolbar [data-jp-item-name='downloadDropdown'] jp-button:focus::part(control),\n.jp-NotebookPanel-toolbar\n  [data-jp-item-name='downloadDropdown']\n  jp-button:focus-visible::part(control),\n.jp-NotebookPanel-toolbar\n  [data-jp-item-name='downloadDropdown']\n  jp-button[focus-visible]::part(control) {\n  outline: none !important;\n  box-shadow: none !important;\n  border: none !important;\n}\n\n#jp-main-dock-panel[data-mode='single-document'] {\n  padding: var(--je-document-padding) !important;\n  background: var(--je-lilac);\n}\n\n#jp-main-dock-panel[data-mode='single-document'] .jp-MainAreaWidget {\n  border-radius: 0;\n  background: transparent;\n}\n\n.je-NotFound {\n  height: 100%;\n  width: 100%;\n  background: white;\n  border-radius: 0;\n}\n\n.je-NotFound-container {\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  padding: 24px;\n}\n\n.je-NotFound-content {\n  font-family: var(--je-font-family);\n  color: var(--je-slate-blue);\n}\n\n.je-NotFound-code {\n  opacity: 0.5;\n  margin-bottom: 12px;\n  font-size: 48px;\n  color: var(--je-slate-blue);\n}\n\n.je-NotFound-title {\n  margin: 0 0 8px;\n  font-weight: 700;\n  color: var(--je-slate-blue);\n}\n\n.je-NotFound-message {\n  margin: 0;\n  opacity: 0.8;\n  color: var(--je-slate-blue);\n}\n\n/* ------------------------------------------------------------------ */\n\n/* Kernel indicator                                                   */\n\n/* ------------------------------------------------------------------ */\n\n.ck-KernelIndicator {\n  font-weight: 600;\n  padding: 0 6px;\n  font-size: 14px;\n}\n\n.ck-kernel-starting {\n  color: #7a7a7a;\n  animation: ck-kernel-pulse 1.2s ease-in-out infinite;\n}\n\n.ck-kernel-ready {\n  color: #16a34a;\n}\n\n@keyframes ck-kernel-pulse {\n  0% {\n    opacity: 0.45;\n  }\n\n  50% {\n    opacity: 1;\n  }\n\n  100% {\n    opacity: 0.45;\n  }\n}\n\n/* GitHub file browser dialog */\n\n.je-GitHubBrowser {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  width: 460px;\n  padding: 4px 0;\n  font-family: var(--je-font-family);\n}\n\n.je-GitHubBrowser-input-row {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n\n.je-GitHubBrowser-input {\n  flex: 1;\n  padding: 6px 10px;\n  font-size: 13px;\n  font-family: var(--je-font-family);\n  border: 1px solid var(--je-border-color);\n  border-radius: 4px;\n  outline: none;\n}\n\n.je-GitHubBrowser-input:focus {\n  border-color: var(--je-slate-blue);\n}\n\n.je-GitHubBrowser-browse-btn {\n  padding: 6px 14px;\n  font-size: 13px;\n  font-family: var(--je-font-family);\n  background: var(--je-slate-blue);\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n\n.je-GitHubBrowser-browse-btn:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n\n.je-GitHubBrowser-recent {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 4px 8px;\n  font-size: 12px;\n  padding: 2px 0;\n}\n\n.je-GitHubBrowser-recent-label {\n  color: #888;\n  flex-shrink: 0;\n}\n\n.je-GitHubBrowser-recent-item {\n  cursor: pointer;\n  color: var(--je-slate-blue);\n  text-decoration: underline;\n}\n\n.je-GitHubBrowser-recent-item:hover {\n  opacity: 0.75;\n}\n\n.je-GitHubBrowser-breadcrumb {\n  font-size: 12px;\n  color: #666;\n  padding: 2px 0;\n}\n\n.je-GitHubBrowser-sep {\n  color: #aaa;\n}\n\n.je-GitHubBrowser-repo-label {\n  font-weight: 600;\n  color: #333;\n}\n\n.je-GitHubBrowser-crumb {\n  cursor: pointer;\n  color: var(--je-slate-blue);\n  text-decoration: underline;\n}\n\n.je-GitHubBrowser-crumb:hover {\n  opacity: 0.75;\n}\n\n.je-GitHubBrowser-list {\n  max-height: 320px;\n  overflow-y: auto;\n  border: 1px solid var(--je-border-color);\n  border-radius: 4px;\n  font-size: 13px;\n}\n\n.je-GitHubBrowser-item {\n  padding: 7px 12px;\n  cursor: pointer;\n  border-bottom: 1px solid #f0f0f0;\n}\n\n.je-GitHubBrowser-item:last-child {\n  border-bottom: none;\n}\n\n.je-GitHubBrowser-item:hover {\n  background: #f5f3ff;\n}\n\n.je-GitHubBrowser-item--selected {\n  background: #ede9fe;\n  font-weight: 500;\n}\n\n.je-GitHubBrowser-item--dir {\n  color: var(--je-slate-blue);\n  font-weight: 500;\n}\n\n.je-GitHubBrowser-item--file {\n  color: #333;\n}\n\n.je-GitHubBrowser-message {\n  padding: 16px 12px;\n  color: #888;\n  text-align: center;\n  font-size: 13px;\n}\n\n.je-GitHubBrowser-error {\n  padding: 12px;\n  color: #b91c1c;\n  font-size: 13px;\n}\n\n/* Checkmark for the currently-open notebook in the File menu recents list */\n.lm-Menu-item.lm-mod-toggled > .lm-Menu-itemIcon {\n  position: relative;\n}\n\n.lm-Menu-item.lm-mod-toggled > .lm-Menu-itemIcon::after {\n  content: '✓';\n  display: block;\n  font-size: 13px;\n  font-weight: bold;\n  color: var(--je-slate-blue, #5c8ede);\n  text-align: center;\n  line-height: 1;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./style/base.css"
/*!************************!*\
  !*** ./style/base.css ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./base.css */ "./node_modules/css-loader/dist/cjs.js!./style/base.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ },

/***/ "./style/icons/coursekata-logo.svg"
/*!*****************************************!*\
  !*** ./style/icons/coursekata-logo.svg ***!
  \*****************************************/
(module) {

module.exports = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='UTF-8'%3f%3e %3csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3033.14 600'%3e %3cdefs%3e %3cstyle%3e .cls-1 %7b fill: %2300cadb%3b %7d .cls-2 %7b fill: %23fd001f%3b %7d .cls-3 %7b fill: %23ff5b7d%3b %7d .cls-4 %7b fill: %2332deed%3b %7d .cls-5 %7b fill: %2300b5c4%3b %7d .cls-6 %7b fill: %2321005a%3b %7d %3c/style%3e %3c/defs%3e %3cg%3e %3cg%3e %3cpath class='cls-6' d='M667.97%2c299.09c0-94.82%2c57.9-163.66%2c155.91-163.66%2c81.15%2c0%2c136.77%2c47.41%2c150.44%2c127.65h-39.66c-11.85-58.35-52.88-92.54-110.78-92.54-71.58%2c0-115.8%2c49.69-115.8%2c128.56s44.22%2c130.38%2c115.8%2c130.38c59.72%2c0%2c98.47-32.37%2c110.78-92.55h39.66c-14.13%2c82.97-67.01%2c127.65-150.44%2c127.65-98.02%2c0-155.91-68.84-155.91-165.49Z'/%3e %3cpath class='cls-6' d='M996.67%2c336.47c0-80.69%2c52.88-124%2c118.53-124%2c77.05%2c0%2c118.53%2c55.62%2c118.53%2c124%2c0%2c83.43-50.6%2c128.1-118.53%2c128.1-77.5%2c0-118.53-55.16-118.53-128.1ZM1194.99%2c336.47c0-54.25-31.46-91.18-79.78-91.18s-79.78%2c36.93-79.78%2c91.18c0%2c62%2c36.02%2c95.28%2c79.78%2c95.28%2c51.52%2c0%2c79.78-42.85%2c79.78-95.28Z'/%3e %3cpath class='cls-6' d='M1258.35%2c379.32v-161.38h37.84v160.02c0%2c34.65%2c24.16%2c53.34%2c58.35%2c53.34%2c45.13%2c0%2c69.75-30.09%2c70.21-66.56v-146.8h37.84v241.62h-30.09l-3.19-36.47c-15.96%2c27.35-45.13%2c41.49-78.41%2c41.49-58.81%2c0-92.55-36.02-92.55-85.25Z'/%3e %3cpath class='cls-6' d='M1500.92%2c459.56v-241.62h30.09l4.56%2c46.04c15.5-31%2c43.76-47.41%2c83.88-47.41h8.21v37.38h-8.21c-51.06%2c0-80.69%2c29.18-80.69%2c78.87v126.74h-37.84Z'/%3e %3cpath class='cls-6' d='M1632.8%2c383.43h36.93c2.74%2c31.46%2c31.46%2c48.78%2c67.93%2c48.78%2c34.19%2c0%2c50.6-13.22%2c50.6-37.38%2c0-22.79-17.78-27.81-42.85-36.47l-35.1-11.85c-35.56-11.85-71.12-22.79-71.12-66.56%2c0-41.03%2c31.91-67.47%2c84.79-67.47s90.27%2c28.72%2c96.19%2c82.52h-36.93c-4.1-33.74-27.81-50.15-60.63-50.15-29.63%2c0-46.96%2c13.22-46.96%2c34.19%2c0%2c25.07%2c26.44%2c30.09%2c46.5%2c36.93l32.82%2c10.94c44.22%2c14.59%2c70.66%2c29.63%2c70.66%2c69.75%2c0%2c42.4-31%2c67.93-89.81%2c67.93s-99.84-30.09-103.03-81.15Z'/%3e %3cpath class='cls-6' d='M1841.59%2c339.66c0-82.52%2c53.34-127.19%2c114.43-127.19%2c66.56%2c0%2c109.41%2c44.68%2c110.78%2c122.18v10.49h-187.37c2.28%2c51.52%2c32.37%2c86.62%2c81.15%2c86.62%2c33.74%2c0%2c58.35-16.87%2c68.38-48.32h36.93c-10.94%2c49.69-50.15%2c81.15-105.31%2c81.15-71.57%2c0-118.99-52.43-118.99-124.91ZM2027.14%2c313.68c-6.84-42.4-32.37-68.38-71.12-68.38s-66.56%2c25.07-74.31%2c68.38h145.43Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-1' d='M2096.91%2c459.56V140.44h54.71v156.37l144.97-156.37h69.29l-124.91%2c130.84%2c134.03%2c188.28h-67.01l-104.85-148.62-51.52%2c53.79v94.82h-54.71Z'/%3e %3cpath class='cls-1' d='M2373.64%2c392.54c.45-56.53%2c56.53-68.38%2c103.48-73.85%2c36.47-4.1%2c63.37-5.47%2c63.83-24.62-.46-23.71-18.69-39.21-49.69-39.21s-54.7%2c17.32-57.9%2c42.4h-54.25c5.02-51.06%2c50.6-86.62%2c113.06-86.62s101.21%2c35.56%2c101.21%2c87.07v109.41c0%2c6.84%2c3.65%2c10.48%2c11.85%2c10.48h13.22v41.94h-25.53c-24.62%2c0-39.66-10.03-43.77-28.27-.91-2.28-1.82-5.47-2.28-8.21-14.13%2c25.99-40.57%2c41.49-81.6%2c41.49-55.62%2c0-92.09-26.9-91.63-72.03ZM2540.95%2c368.84v-33.74c-9.12%2c14.13-32.37%2c17.32-57.9%2c20.52-30.09%2c3.65-55.16%2c7.75-55.16%2c33.28%2c0%2c20.97%2c16.87%2c33.28%2c48.33%2c33.28%2c36.93%2c0%2c64.74-20.97%2c64.74-53.34Z'/%3e %3cpath class='cls-1' d='M2734.24%2c459.56c-52.43%2c0-80.69-25.99-80.69-73.85v-122.18h-42.4v-45.59h42.4v-82.51h53.79v82.51h62.46v45.59h-62.46v118.53c0%2c20.52%2c10.48%2c31.91%2c30.55%2c31.91h27.35v45.59h-31Z'/%3e %3cpath class='cls-1' d='M2788.33%2c392.54c.46-56.53%2c56.53-68.38%2c103.49-73.85%2c36.47-4.1%2c63.37-5.47%2c63.83-24.62-.46-23.71-18.69-39.21-49.69-39.21s-54.71%2c17.32-57.9%2c42.4h-54.25c5.02-51.06%2c50.6-86.62%2c113.06-86.62s101.21%2c35.56%2c101.21%2c87.07v109.41c0%2c6.84%2c3.65%2c10.48%2c11.85%2c10.48h13.22v41.94h-25.53c-24.62%2c0-39.66-10.03-43.76-28.27-.91-2.28-1.82-5.47-2.28-8.21-14.13%2c25.99-40.57%2c41.49-81.6%2c41.49-55.62%2c0-92.09-26.9-91.63-72.03ZM2955.64%2c368.84v-33.74c-9.12%2c14.13-32.37%2c17.32-57.9%2c20.52-30.09%2c3.65-55.16%2c7.75-55.16%2c33.28%2c0%2c20.97%2c16.87%2c33.28%2c48.32%2c33.28%2c36.93%2c0%2c64.74-20.97%2c64.74-53.34Z'/%3e %3c/g%3e %3c/g%3e %3cg%3e %3cg%3e %3cpolygon id='Pink_right_rectangel' data-name='Pink right rectangel' class='cls-3' points='266.69 193.33 446.69 193.33 483.36 237.33 513.36 273.33 513.36 553.33 266.69 553.33 266.69 193.33'/%3e %3cpolygon class='cls-2' points='446.69 193.33 513.36 273.33 446.69 273.33 446.69 193.33'/%3e %3c/g%3e %3cpath class='cls-6' d='M348.69%2c436.24v-100.25h47.55c18.19%2c0%2c30.93%2c10.31%2c30.93%2c25.35%2c0%2c11.46-8.31%2c20.34-20.62%2c23.34%2c13.89%2c2.15%2c22.77%2c11.6%2c22.77%2c24.35%2c0%2c16.04-13.18%2c27.21-32.22%2c27.21h-48.41ZM365.73%2c377.81h29.93c8.59%2c0%2c14.46-5.73%2c14.46-13.75%2c0-7.45-5.44-12.75-13.18-12.75h-31.22v26.49ZM365.73%2c420.77h32.22c8.59%2c0%2c13.89-6.16%2c13.89-14.18s-6.3-13.89-15.47-13.89h-30.65v28.07Z'/%3e %3cg%3e %3cpolygon id='blue_left_rectangle' data-name='blue left rectangle' class='cls-4' points='246.67 53.15 66.67 53.15 30 97.15 0 133.15 0 413.15 246.67 413.15 246.67 53.15'/%3e %3cpolygon id='left_blue_corner' data-name='left blue corner' class='cls-5' points='66.67 53.15 0 133.15 66.67 133.15 66.67 53.15'/%3e %3c/g%3e %3cpath class='cls-6' d='M73.71%2c291.23l40.96-100.25h17.19l41.1%2c100.25h-17.76l-10.17-24.78h-43.39l-10.17%2c24.78h-17.76ZM107.8%2c251.28h31.08l-15.47-38.09-15.61%2c38.09Z'/%3e %3crect id='vertical_line' data-name='vertical line' class='cls-6' x='246.69' width='20' height='600'/%3e %3c/g%3e %3c/svg%3e";

/***/ },

/***/ "./style/icons/download-simple.svg"
/*!*****************************************!*\
  !*** ./style/icons/download-simple.svg ***!
  \*****************************************/
(module) {

module.exports = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e %3csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 122.88 110.9' style='enable-background:new 0 0 122.88 110.9' xml:space='preserve'%3e %3cstyle type='text/css'%3e.st0%7bfill:%23412c88%3bfill-rule:evenodd%3bclip-rule:evenodd%3b%7d%3c/style%3e %3cg%3e %3cpath class='st0' d='M13.09%2c35.65h30.58V23.2l34.49%2c0v12.45l31.47%2c0L61.39%2c82.58L13.09%2c35.65L13.09%2c35.65z M61.44%2c97.88l47.51-0.14 l4.54-21.51l9.38%2c0.31v34.36L0%2c110.9V76.55l9.39-0.31l4.54%2c21.51L61.44%2c97.88L61.44%2c97.88L61.44%2c97.88z M43.67%2c0h34.49v4.62H43.67 V0L43.67%2c0z M43.67%2c9.32h34.49v9.44H43.67V9.32L43.67%2c9.32z'/%3e %3c/g%3e %3c/svg%3e";

/***/ }

}]);
//# sourceMappingURL=style_index_js.c040bd8739fe06aa41c9.js.map