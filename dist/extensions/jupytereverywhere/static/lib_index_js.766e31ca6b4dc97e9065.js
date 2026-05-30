"use strict";
(self["webpackChunkjupytereverywhere"] = self["webpackChunkjupytereverywhere"] || []).push([["lib_index_js"],{

/***/ "./lib/commands.js"
/*!*************************!*\
  !*** ./lib/commands.js ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Commands: () => (/* binding */ Commands)
/* harmony export */ });
var Commands;
(function (Commands) {
    Commands.openNotFound = 'jupytereverywhere:open-not-found';
    Commands.routeNotFound = 'jupytereverywhere:not-found-route';
    Commands.downloadNotebookCommand = 'jupytereverywhere:download-notebook';
    Commands.downloadPDFCommand = 'jupytereverywhere:download-pdf';
    Commands.saveNotebookCommand = 'jupytereverywhere:save-notebook';
    Commands.switchKernelCommand = 'jupytereverywhere:switch-kernel';
    Commands.restartMemoryAndRunAllCommand = 'jupytereverywhere:restart-and-run-all';
    Commands.openFromGitHub = 'jupytereverywhere:open-from-github';
    Commands.copyShareLink = 'jupytereverywhere:copy-share-link';
    Commands.saveToFile = 'jupytereverywhere:save-to-file';
    Commands.closeNotebook = 'jupytereverywhere:close-notebook';
    Commands.clearStorage = 'jupytereverywhere:clear-storage';
})(Commands || (Commands = {}));


/***/ },

/***/ "./lib/dialogs.js"
/*!************************!*\
  !*** ./lib/dialogs.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sessionDialogs: () => (/* binding */ sessionDialogs)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/translation */ "webpack/sharing/consume/default/@jupyterlab/translation");
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_translation__WEBPACK_IMPORTED_MODULE_1__);


class JESessionContextDialogs extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.SessionContextDialogs {
    async restart(sessionContext) {
        const result = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showDialog)({
            title: 'Would you like to restart the notebook’s memory?',
            buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' }), _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.okButton({ label: 'Restart', className: 'ck-btn' })]
        });
        if (result.button.accept) {
            try {
                await sessionContext.restartKernel();
                return true;
            }
            catch (err) {
                console.error('Memory restart failed', err);
                return false;
            }
        }
        return false;
    }
}
const sessionDialogs = {
    id: '@jupyter-everywhere/apputils-extension:sessionDialogs',
    provides: _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.ISessionContextDialogs,
    optional: [_jupyterlab_translation__WEBPACK_IMPORTED_MODULE_1__.ITranslator],
    autoStart: true,
    activate: async (app, translator) => {
        return new JESessionContextDialogs({
            translator: translator !== null && translator !== void 0 ? translator : _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_1__.nullTranslator
        });
    }
};


/***/ },

/***/ "./lib/filesystem.js"
/*!***************************!*\
  !*** ./lib/filesystem.js ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCurrentFileHandle: () => (/* binding */ getCurrentFileHandle),
/* harmony export */   isFileSystemAccessSupported: () => (/* binding */ isFileSystemAccessSupported),
/* harmony export */   pickNotebookFile: () => (/* binding */ pickNotebookFile),
/* harmony export */   pickSaveLocation: () => (/* binding */ pickSaveLocation),
/* harmony export */   retrieveHandleForUpload: () => (/* binding */ retrieveHandleForUpload),
/* harmony export */   retrieveRecentHandle: () => (/* binding */ retrieveRecentHandle),
/* harmony export */   saveToHandle: () => (/* binding */ saveToHandle),
/* harmony export */   setCurrentFileHandle: () => (/* binding */ setCurrentFileHandle),
/* harmony export */   storeHandleForUpload: () => (/* binding */ storeHandleForUpload),
/* harmony export */   storeRecentHandle: () => (/* binding */ storeRecentHandle)
/* harmony export */ });
const DB_NAME = 'jupytereverywhere-fs';
const DB_VERSION = 1;
const STORE_NAME = 'fileHandles';
// Shared state — both index.ts and notebook.tsx import this
let _currentFileHandle = null;
function getCurrentFileHandle() {
    return _currentFileHandle;
}
function setCurrentFileHandle(handle) {
    _currentFileHandle = handle;
}
function isFileSystemAccessSupported() {
    return typeof window.showOpenFilePicker ===
        'function';
}
function openIDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}
async function pickNotebookFile() {
    const picker = window
        .showOpenFilePicker;
    try {
        const [handle] = await picker({
            types: [{ description: 'Jupyter Notebooks', accept: { 'application/json': ['.ipynb'] } }],
            multiple: false
        });
        const file = await handle.getFile();
        const text = await file.text();
        return { handle, text };
    }
    catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
            return null;
        }
        throw err;
    }
}
async function pickSaveLocation(suggestedName) {
    const picker = window
        .showSaveFilePicker;
    try {
        return await picker({
            suggestedName,
            types: [{ description: 'Jupyter Notebooks', accept: { 'application/json': ['.ipynb'] } }]
        });
    }
    catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
            return null;
        }
        throw err;
    }
}
async function saveToHandle(handle, text) {
    const fsa = handle;
    let perm = await fsa.queryPermission({ mode: 'readwrite' });
    if (perm !== 'granted') {
        perm = await fsa.requestPermission({ mode: 'readwrite' });
    }
    if (perm !== 'granted') {
        throw new Error('Permission denied');
    }
    const writable = await handle.createWritable();
    await writable.write(text);
    await writable.close();
}
async function storeHandleForUpload(uploadId, handle) {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(handle, uploadId);
        tx.oncomplete = () => {
            db.close();
            resolve();
        };
        tx.onerror = () => {
            db.close();
            reject(tx.error);
        };
    });
}
async function retrieveHandleForUpload(uploadId) {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(uploadId);
        getReq.onsuccess = () => {
            var _a;
            store.delete(uploadId);
            db.close();
            resolve((_a = getReq.result) !== null && _a !== void 0 ? _a : null);
        };
        getReq.onerror = () => {
            db.close();
            reject(getReq.error);
        };
    });
}
async function storeRecentHandle(key, handle) {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(handle, `recent:${key}`);
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = () => { db.close(); reject(tx.error); };
    });
}
async function retrieveRecentHandle(key) {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(`recent:${key}`);
        req.onsuccess = () => { var _a; db.close(); resolve((_a = req.result) !== null && _a !== void 0 ? _a : null); };
        req.onerror = () => { db.close(); reject(req.error); };
    });
}


/***/ },

/***/ "./lib/github.js"
/*!***********************!*\
  !*** ./lib/github.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addRecentRepo: () => (/* binding */ addRecentRepo),
/* harmony export */   fetchContents: () => (/* binding */ fetchContents),
/* harmony export */   getRecentRepos: () => (/* binding */ getRecentRepos),
/* harmony export */   parseRepoInput: () => (/* binding */ parseRepoInput)
/* harmony export */ });
const GITHUB_API = 'https://api.github.com';
const RECENT_REPOS_KEY = 'jupytereverywhere:github-recent-repos';
const MAX_RECENT_REPOS = 5;
function parseRepoInput(input) {
    const trimmed = input.trim();
    if (!trimmed) {
        return null;
    }
    const urlMatch = trimmed.match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/);
    if (urlMatch) {
        return { owner: urlMatch[1], repo: urlMatch[2] };
    }
    const slugMatch = trimmed.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/);
    if (slugMatch) {
        return { owner: slugMatch[1], repo: slugMatch[2] };
    }
    return null;
}
async function fetchContents(owner, repo, path = '') {
    const apiPath = path ? `/${path}` : '';
    const url = `${GITHUB_API}/repos/${owner}/${repo}/contents${apiPath}`;
    const response = await fetch(url, {
        headers: { Accept: 'application/vnd.github.v3+json' }
    });
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Repository "${owner}/${repo}" not found or path does not exist.`);
        }
        if (response.status === 403) {
            throw new Error('GitHub API rate limit exceeded. Please try again later.');
        }
        throw new Error(`GitHub API error: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
        throw new Error('Expected a directory path.');
    }
    return data
        .filter(item => item.type === 'dir' || (item.type === 'file' && item.name.endsWith('.ipynb')))
        .sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'dir' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });
}
function getRecentRepos() {
    try {
        const raw = localStorage.getItem(RECENT_REPOS_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch (_a) {
        return [];
    }
}
function addRecentRepo(slug) {
    const lower = slug.toLowerCase();
    const recent = getRecentRepos().filter(r => r.toLowerCase() !== lower);
    recent.unshift(slug);
    localStorage.setItem(RECENT_REPOS_KEY, JSON.stringify(recent.slice(0, MAX_RECENT_REPOS)));
}


/***/ },

/***/ "./lib/icons.js"
/*!**********************!*\
  !*** ./lib/icons.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EverywhereIcons: () => (/* binding */ EverywhereIcons)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_icons_save_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style/icons/save.svg */ "./style/icons/save.svg");
/* harmony import */ var _style_icons_folder_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../style/icons/folder.svg */ "./style/icons/folder.svg");
/* harmony import */ var _style_icons_add_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../style/icons/add.svg */ "./style/icons/add.svg");
/* harmony import */ var _style_icons_link_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../style/icons/link.svg */ "./style/icons/link.svg");
/* harmony import */ var _style_icons_run_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../style/icons/run.svg */ "./style/icons/run.svg");
/* harmony import */ var _style_icons_run_cell_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../style/icons/run-cell.svg */ "./style/icons/run-cell.svg");
/* harmony import */ var _style_icons_refresh_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../style/icons/refresh.svg */ "./style/icons/refresh.svg");
/* harmony import */ var _style_icons_stop_svg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../style/icons/stop.svg */ "./style/icons/stop.svg");
/* harmony import */ var _style_icons_fast_forward_svg__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../style/icons/fast-forward.svg */ "./style/icons/fast-forward.svg");










var EverywhereIcons;
(function (EverywhereIcons) {
    EverywhereIcons.save = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
        name: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.saveIcon.name,
        svgstr: _style_icons_save_svg__WEBPACK_IMPORTED_MODULE_1__
    });
    EverywhereIcons.folder = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
        name: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.folderIcon.name,
        svgstr: _style_icons_folder_svg__WEBPACK_IMPORTED_MODULE_2__
    });
    EverywhereIcons.add = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
        name: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.addIcon.name,
        svgstr: _style_icons_add_svg__WEBPACK_IMPORTED_MODULE_3__
    });
    EverywhereIcons.link = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
        name: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.linkIcon.name,
        svgstr: _style_icons_link_svg__WEBPACK_IMPORTED_MODULE_4__
    });
    EverywhereIcons.run = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
        name: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.runIcon.name,
        svgstr: _style_icons_run_svg__WEBPACK_IMPORTED_MODULE_5__
    });
    EverywhereIcons.refresh = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
        name: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.refreshIcon.name,
        svgstr: _style_icons_refresh_svg__WEBPACK_IMPORTED_MODULE_7__
    });
    EverywhereIcons.stop = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
        name: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.stopIcon.name,
        svgstr: _style_icons_stop_svg__WEBPACK_IMPORTED_MODULE_8__
    });
    EverywhereIcons.fastForward = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
        name: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.fastForwardIcon.name,
        svgstr: _style_icons_fast_forward_svg__WEBPACK_IMPORTED_MODULE_9__
    });
    EverywhereIcons.runCell = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
        name: 'everywhere:run-cell',
        svgstr: _style_icons_run_cell_svg__WEBPACK_IMPORTED_MODULE_6__
    });
})(EverywhereIcons || (EverywhereIcons = {}));


/***/ },

/***/ "./lib/index.js"
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/statedb */ "webpack/sharing/consume/default/@jupyterlab/statedb");
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _pdf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pdf */ "./lib/pdf.js");
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./routes */ "./lib/routes.js");
/* harmony import */ var _pages_not_found__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pages/not-found */ "./lib/pages/not-found.js");
/* harmony import */ var _commands__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./commands */ "./lib/commands.js");
/* harmony import */ var _pages_notebook__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pages/notebook */ "./lib/pages/notebook.js");
/* harmony import */ var _filesystem__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./filesystem */ "./lib/filesystem.js");
/* harmony import */ var _notebook_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./notebook-utils */ "./lib/notebook-utils.js");
/* harmony import */ var _kernels__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./kernels */ "./lib/kernels.js");
/* harmony import */ var _single_mode__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./single-mode */ "./lib/single-mode.js");
/* harmony import */ var _notebook_factory__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./notebook-factory */ "./lib/notebook-factory.js");
/* harmony import */ var _placeholders__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./placeholders */ "./lib/placeholders.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./icons */ "./lib/icons.js");
/* harmony import */ var _dialogs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./dialogs */ "./lib/dialogs.js");

















const _downloadCopyCount = new Map();
const plugin = {
    id: 'jupytereverywhere:plugin',
    description: 'A Jupyter extension for k12 education',
    autoStart: true,
    requires: [_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__.INotebookTracker],
    activate: (app, tracker) => {
        const { commands } = app;
        commands.addCommand(_commands__WEBPACK_IMPORTED_MODULE_7__.Commands.downloadNotebookCommand, {
            label: 'Download as a notebook',
            execute: async (args) => {
                var _a, _b;
                void args;
                const panel = tracker.currentWidget;
                if (!panel) {
                    console.warn('No active notebook to download');
                    return;
                }
                const content = panel.context.model.toJSON();
                const baseName = panel.context.path && panel.context.path !== 'Untitled.ipynb'
                    ? panel.context.path.replace(/\.ipynb$/i, '')
                    : (0,_notebook_utils__WEBPACK_IMPORTED_MODULE_10__.generateDefaultNotebookName)();
                const copyN = ((_a = _downloadCopyCount.get(baseName)) !== null && _a !== void 0 ? _a : 0) + 1;
                _downloadCopyCount.set(baseName, copyN);
                const suggestedName = copyN === 1 ? `${baseName}_copy` : `${baseName}_copy${copyN}`;
                const input = document.createElement('input');
                input.value = suggestedName;
                input.style.width = '100%';
                input.style.boxSizing = 'border-box';
                input.style.padding = '8px';
                const body = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.Widget();
                body.node.appendChild(input);
                const result = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.showDialog)({
                    title: 'Download notebook as…',
                    body,
                    buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Dialog.cancelButton({ className: 'ck-btn' }), _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Dialog.okButton({ label: 'Download', className: 'ck-btn' })]
                });
                if (!result.button.accept) {
                    return;
                }
                const rawName = input.value.trim() || suggestedName;
                const fileName = rawName.toLowerCase().endsWith('.ipynb') ? rawName : `${rawName}.ipynb`;
                const blob = new Blob([JSON.stringify(content, null, 2)], {
                    type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                try {
                    sessionStorage.setItem(`ck-last-downloaded:${panel.context.path}`, JSON.stringify((_b = content.cells) !== null && _b !== void 0 ? _b : []));
                }
                catch (_c) { }
            }
        });
        commands.addCommand(_commands__WEBPACK_IMPORTED_MODULE_7__.Commands.downloadPDFCommand, {
            label: 'Download as PDF',
            execute: async (args) => {
                void args;
                const panel = tracker.currentWidget;
                if (!panel) {
                    console.warn('No active notebook to download as PDF');
                    return;
                }
                const suggestedName = panel.context.path && panel.context.path !== 'Untitled.ipynb'
                    ? panel.context.path.replace(/\.ipynb$/i, '')
                    : (0,_notebook_utils__WEBPACK_IMPORTED_MODULE_10__.generateDefaultNotebookName)();
                const input = document.createElement('input');
                input.value = suggestedName;
                input.style.width = '100%';
                input.style.boxSizing = 'border-box';
                input.style.padding = '8px';
                const body = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.Widget();
                body.node.appendChild(input);
                const result = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.showDialog)({
                    title: 'Download PDF as…',
                    body,
                    buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Dialog.cancelButton({ className: 'ck-btn' }), _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Dialog.okButton({ label: 'Download', className: 'ck-btn' })]
                });
                if (!result.button.accept) {
                    return;
                }
                const rawName = input.value.trim() || suggestedName;
                try {
                    await (0,_pdf__WEBPACK_IMPORTED_MODULE_4__.exportNotebookAsPDF)(panel, rawName);
                }
                catch (error) {
                    console.error('Failed to export notebook as PDF:', error);
                    await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.showDialog)({
                        title: 'Error exporting PDF',
                        body: 'An error occurred while exporting the notebook as a PDF.',
                        buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Dialog.okButton()]
                    });
                }
            }
        });
        commands.addCommand(_commands__WEBPACK_IMPORTED_MODULE_7__.Commands.restartMemoryAndRunAllCommand, {
            label: 'Restart Notebook Memory and Run All Cells',
            icon: _icons__WEBPACK_IMPORTED_MODULE_15__.EverywhereIcons.fastForward,
            isEnabled: () => !!tracker.currentWidget,
            execute: async () => {
                const panel = tracker.currentWidget;
                if (!panel) {
                    console.warn('No active notebook to restart and run.');
                    return;
                }
                const result = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.showDialog)({
                    title: 'Would you like to restart the notebook\u2019s memory and rerun all cells?',
                    buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' }), _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Dialog.okButton({ label: 'Restart', className: 'ck-btn' })]
                });
                if (result.button.accept) {
                    try {
                        await panel.sessionContext.restartKernel();
                        await commands.execute('notebook:run-all-cells');
                    }
                    catch (err) {
                        console.error('Restarting and running all cells failed', err);
                    }
                }
            }
        });
        commands.addCommand(_commands__WEBPACK_IMPORTED_MODULE_7__.Commands.saveNotebookCommand, {
            label: 'Save Notebook',
            execute: async () => {
                const panel = tracker.currentWidget;
                if (!panel) {
                    console.warn('No active notebook to save');
                    return;
                }
                const fileHandle = (0,_filesystem__WEBPACK_IMPORTED_MODULE_9__.getCurrentFileHandle)();
                if (fileHandle) {
                    if (!panel.context.model.dirty) {
                        return;
                    }
                    const content = panel.context.model.toJSON();
                    const text = JSON.stringify(content, null, 2);
                    try {
                        await (0,_filesystem__WEBPACK_IMPORTED_MODULE_9__.saveToHandle)(fileHandle, text);
                        await panel.context.save();
                        (0,_notebook_utils__WEBPACK_IMPORTED_MODULE_10__.showSavedToast)();
                    }
                    catch (err) {
                        console.error('Failed to save to file handle:', err);
                        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Notification.warning('Could not save to file.', { autoClose: 4000 });
                    }
                    return;
                }
                // No file handle yet — fall through to Save as… (new notebook or GitHub notebook)
                await commands.execute(_commands__WEBPACK_IMPORTED_MODULE_7__.Commands.saveToFile);
            }
        });
        app.commands.addKeyBinding({
            command: _commands__WEBPACK_IMPORTED_MODULE_7__.Commands.saveNotebookCommand,
            keys: ['Accel S'],
            selector: '.jp-NotebookPanel'
        });
        commands.addCommand(_commands__WEBPACK_IMPORTED_MODULE_7__.Commands.switchKernelCommand, {
            label: args => {
                const kernel = args['kernel'] || '';
                const isActive = args['isActive'];
                const display = _kernels__WEBPACK_IMPORTED_MODULE_11__.KERNEL_DISPLAY_NAMES[kernel] || kernel;
                if (isActive) {
                    return display;
                }
                return `Switch to ${display}`;
            },
            execute: async (args) => {
                var _a, _b;
                const kernel = args['kernel'];
                const panel = tracker.currentWidget;
                if (!kernel) {
                    console.warn('No kernel specified for switching.');
                    return;
                }
                if (!panel) {
                    console.warn('No active notebook panel.');
                    return;
                }
                const currentKernel = ((_b = (_a = panel.sessionContext.session) === null || _a === void 0 ? void 0 : _a.kernel) === null || _b === void 0 ? void 0 : _b.name) || '';
                if (currentKernel !== kernel) {
                    const currentKernelDisplay = _kernels__WEBPACK_IMPORTED_MODULE_11__.KERNEL_DISPLAY_NAMES[currentKernel] || currentKernel;
                    const targetKernelDisplay = _kernels__WEBPACK_IMPORTED_MODULE_11__.KERNEL_DISPLAY_NAMES[kernel] || kernel;
                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Notification.warning(`You are about to switch your notebook coding language from ${currentKernelDisplay} to ${targetKernelDisplay}. Your previously created code will not run as intended.`, { autoClose: 5000 });
                }
                await (0,_kernels__WEBPACK_IMPORTED_MODULE_11__.switchKernel)(panel, kernel);
            }
        });
    }
};
const stateDBShim = {
    id: '@jupyter-everywhere/apputils-extension:state',
    autoStart: true,
    provides: _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_3__.IStateDB,
    activate: (app) => {
        void app;
        return new _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_3__.StateDB();
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([
    stateDBShim,
    _notebook_factory__WEBPACK_IMPORTED_MODULE_13__.notebookFactoryPlugin,
    plugin,
    _pages_notebook__WEBPACK_IMPORTED_MODULE_8__.notebookPlugin,
    _routes__WEBPACK_IMPORTED_MODULE_5__["default"],
    _single_mode__WEBPACK_IMPORTED_MODULE_12__.singleDocumentMode,
    _placeholders__WEBPACK_IMPORTED_MODULE_14__.placeholderPlugin,
    _dialogs__WEBPACK_IMPORTED_MODULE_16__.sessionDialogs,
    _pages_not_found__WEBPACK_IMPORTED_MODULE_6__["default"]
]);


/***/ },

/***/ "./lib/kernels.js"
/*!************************!*\
  !*** ./lib/kernels.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTIVE_KERNELS: () => (/* binding */ ACTIVE_KERNELS),
/* harmony export */   KERNEL_DISPLAY_NAMES: () => (/* binding */ KERNEL_DISPLAY_NAMES),
/* harmony export */   KERNEL_NAME_TO_URL: () => (/* binding */ KERNEL_NAME_TO_URL),
/* harmony export */   KERNEL_URL_TO_NAME: () => (/* binding */ KERNEL_URL_TO_NAME),
/* harmony export */   switchKernel: () => (/* binding */ switchKernel)
/* harmony export */ });
const KERNEL_URL_TO_NAME = {
    python: 'python',
    r: 'xr'
};
const KERNEL_NAME_TO_URL = {
    python: 'python',
    xpython: 'python',
    xr: 'r'
};
const KERNEL_DISPLAY_NAMES = {
    python: 'Python',
    xpython: 'Python',
    xr: 'R'
};
/**
 * List of kernels that will appear in the kernel switcher dropdown,
 * i.e., for which we have an available factory.
 */
const ACTIVE_KERNELS = ['python', 'xr'];
/**
 * Switch the notebook's kernel if it differs from the desired one.
 * @param panel The NotebookPanel to operate on
 * @param desiredKernel The kernel name to switch to (e.g. "python", "xr")
 */
async function switchKernel(panel, desiredKernel) {
    var _a, _b;
    const currentKernel = (_b = (_a = panel.sessionContext.session) === null || _a === void 0 ? void 0 : _a.kernel) === null || _b === void 0 ? void 0 : _b.name;
    if (currentKernel === desiredKernel) {
        console.log(`Already on kernel: ${desiredKernel}. Skipping switch.`);
        return;
    }
    await panel.sessionContext.changeKernel({ name: desiredKernel });
    console.log(`Switched to kernel: ${desiredKernel}.`);
}


/***/ },

/***/ "./lib/notebook-factory.js"
/*!*********************************!*\
  !*** ./lib/notebook-factory.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JENotebookContentFactory: () => (/* binding */ JENotebookContentFactory),
/* harmony export */   notebookFactoryPlugin: () => (/* binding */ notebookFactoryPlugin)
/* harmony export */ });
/* harmony import */ var _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/cells */ "webpack/sharing/consume/default/@jupyterlab/cells");
/* harmony import */ var _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_cells__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/codeeditor */ "webpack/sharing/consume/default/@jupyterlab/codeeditor");
/* harmony import */ var _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _placeholders__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./placeholders */ "./lib/placeholders.js");
/* harmony import */ var _run_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./run-button */ "./lib/run-button.js");





class JENotebookContentFactory extends _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_2__.Notebook.ContentFactory {
    constructor(options) {
        super(options);
        this._app = options.app;
    }
    createInputPrompt() {
        return new _run_button__WEBPACK_IMPORTED_MODULE_4__.JEInputPrompt(this._app);
    }
    createNotebook(options) {
        return new _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_2__.Notebook(options);
    }
    createMarkdownCell(options) {
        return new _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_0__.MarkdownCell({
            ...options,
            emptyPlaceholder: _placeholders__WEBPACK_IMPORTED_MODULE_3__.EMPTY_MARKDOWN_PLACEHOLDER
        }).initializeState();
    }
}
/**
 * Plugin that provides the custom notebook factory.
 */
const notebookFactoryPlugin = {
    id: 'jupytereverywhere:notebook-factory',
    description: 'Provides notebook cell factory with input prompts',
    provides: _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_2__.NotebookPanel.IContentFactory,
    requires: [_jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_1__.IEditorServices],
    autoStart: true,
    activate: (app, editorServices) => {
        const editorFactory = editorServices.factoryService.newInlineEditor;
        const factory = new JENotebookContentFactory({
            editorFactory,
            app
        });
        return factory;
    }
};


/***/ },

/***/ "./lib/notebook-utils.js"
/*!*******************************!*\
  !*** ./lib/notebook-utils.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateDefaultNotebookName: () => (/* binding */ generateDefaultNotebookName),
/* harmony export */   isNotebookEmpty: () => (/* binding */ isNotebookEmpty),
/* harmony export */   showSavedToast: () => (/* binding */ showSavedToast)
/* harmony export */ });
const toText = (src) => (Array.isArray(src) ? src.join('') : (src !== null && src !== void 0 ? src : ''));
/**
 * Iterates over all cells of a notebook and returns true the notebook has no meaningful
 * content. We consider a notebook "non-empty" if at least one cell has a populated
 * non-whitespace source.
 * @param nb - the notebook to check if it's empty
 * @returns - a boolean indicating whether the notebook is empty or not.
 */
function isNotebookEmpty(nb) {
    var _a;
    const cells = (_a = nb === null || nb === void 0 ? void 0 : nb.cells) !== null && _a !== void 0 ? _a : [];
    if (cells.length === 0) {
        return true;
    }
    for (const cell of cells) {
        if (/\S/.test(toText(cell === null || cell === void 0 ? void 0 : cell.source))) {
            return false;
        }
    }
    return true;
}
/**
 * Generates a default notebook name based on the current date and time.
 *
 * @returns A string representing the default notebook name, with
 *          the format: "Notebook_YYYY-MM-DD_HH-MM-SS"
 */
function generateDefaultNotebookName() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    return `Notebook_${date}_${time}`;
}
function showSavedToast(message = 'Changes saved') {
    const el = document.createElement('div');
    el.textContent = message;
    el.style.cssText = [
        'position:fixed',
        'top:50%',
        'left:50%',
        'transform:translate(-50%,-50%)',
        'background:#f5f3ff',
        'color:#412c88',
        'border:2px solid #412c88',
        'padding:18px 48px',
        'border-radius:10px',
        'font-size:16px',
        'font-weight:600',
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
        'box-shadow:0 4px 20px rgba(0,0,0,0.12)',
        'z-index:10000',
        'pointer-events:none',
        'opacity:1',
        'transition:opacity 0.4s ease',
    ].join(';');
    document.body.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 400);
    }, 1500);
}


/***/ },

/***/ "./lib/pages/not-found.js"
/*!********************************!*\
  !*** ./lib/pages/not-found.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   notFoundPlugin: () => (/* binding */ notFoundPlugin)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _commands__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../commands */ "./lib/commands.js");



class NotFoundView extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.ReactWidget {
    constructor() {
        super();
        this.addClass('je-NotFound');
    }
    render() {
        return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "je-NotFound-container" },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "je-NotFound-content" },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "je-NotFound-code" }, "404"),
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("h2", { className: "je-NotFound-title" }, "Oops! We could not find what you are looking for."),
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("p", { className: "je-NotFound-message" }, "The page may have moved or the link might be incorrect."))));
    }
}
const notFoundPlugin = {
    id: 'jupytereverywhere:not-found',
    autoStart: true,
    activate: (app) => {
        const newWidget = () => {
            const widget = new NotFoundView();
            widget.id = 'je-not-found';
            widget.title.label = 'Not found';
            widget.title.closable = true;
            return widget;
        };
        let widget = newWidget();
        app.commands.addCommand(_commands__WEBPACK_IMPORTED_MODULE_2__.Commands.openNotFound, {
            label: 'Open 404 Page',
            execute: () => {
                if (widget.isDisposed) {
                    widget = newWidget();
                }
                if (!widget.isAttached) {
                    app.shell.add(widget, 'main');
                }
                app.shell.activateById(widget.id);
            }
        });
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (notFoundPlugin);


/***/ },

/***/ "./lib/pages/notebook.js"
/*!*******************************!*\
  !*** ./lib/pages/notebook.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   notebookPlugin: () => (/* binding */ notebookPlugin)
/* harmony export */ });
/* harmony import */ var _ui_components_OpenDropdownButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ui-components/OpenDropdownButton */ "./lib/ui-components/OpenDropdownButton.js");
/* harmony import */ var _ui_components_RunDropdownButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui-components/RunDropdownButton */ "./lib/ui-components/RunDropdownButton.js");
/* harmony import */ var _ui_components_KernelIndicator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ui-components/KernelIndicator */ "./lib/ui-components/KernelIndicator.js");
/* harmony import */ var _ui_components_GitHubBrowserDialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ui-components/GitHubBrowserDialog */ "./lib/ui-components/GitHubBrowserDialog.js");
/* harmony import */ var _jupyterlite_application__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlite/application */ "webpack/sharing/consume/default/@jupyterlite/application/@jupyterlite/application");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _lumino_messaging__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @lumino/messaging */ "webpack/sharing/consume/default/@lumino/messaging");
/* harmony import */ var _lumino_messaging__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_lumino_messaging__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @lumino/coreutils */ "webpack/sharing/consume/default/@lumino/coreutils");
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_lumino_coreutils__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @jupyterlab/settingregistry */ "webpack/sharing/consume/default/@jupyterlab/settingregistry");
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @jupyterlab/translation */ "webpack/sharing/consume/default/@jupyterlab/translation");
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_translation__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _commands__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../commands */ "./lib/commands.js");
/* harmony import */ var _kernels__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../kernels */ "./lib/kernels.js");
/* harmony import */ var _upload__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../upload */ "./lib/upload.js");
/* harmony import */ var _filesystem__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../filesystem */ "./lib/filesystem.js");
/* harmony import */ var _recents__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../recents */ "./lib/recents.js");
/* harmony import */ var _notebook_utils__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../notebook-utils */ "./lib/notebook-utils.js");


















function mapLanguageToKernel(content) {
    var _a, _b, _c, _d, _e, _f;
    const rawLang = ((_c = (_b = (_a = content === null || content === void 0 ? void 0 : content.metadata) === null || _a === void 0 ? void 0 : _a.kernelspec) === null || _b === void 0 ? void 0 : _b.language) === null || _c === void 0 ? void 0 : _c.toLowerCase()) ||
        ((_f = (_e = (_d = content === null || content === void 0 ? void 0 : content.metadata) === null || _d === void 0 ? void 0 : _d.language_info) === null || _e === void 0 ? void 0 : _e.name) === null || _f === void 0 ? void 0 : _f.toLowerCase()) ||
        'python';
    if (rawLang === 'r') {
        return 'xr';
    }
    return 'python';
}
function wrapRCodeForAutoprint(code) {
    // Use R raw strings so arbitrary user code is embedded without escaping.
    // Find a delimiter suffix that doesn't collide with anything in the code.
    let d = '';
    while (code.includes(')' + d + '"'))
        d += '-';
    const open = `r"${d}(`, close = `)${d}"`;
    return (`invisible(lapply(as.list(parse(text=${open}\n${code}\n${close})), ` +
        `function(.ck_e) { .ck_r <- withVisible(eval(.ck_e, envir = .GlobalEnv)); ` +
        `if (.ck_r$visible) print(.ck_r$value) }))`);
}
function patchXeusR(sessionContext) {
    var _a;
    const kernel = (_a = sessionContext.session) === null || _a === void 0 ? void 0 : _a.kernel;
    if (!kernel || !['xr', 'ir'].includes(kernel.name))
        return;
    if (kernel._ckAutoprintPatched)
        return;
    kernel._ckAutoprintPatched = true;
    kernel.requestExecute({ code: 'options(width = 220)', silent: true });
    const orig = kernel.requestExecute.bind(kernel);
    kernel.requestExecute = (content, disposeOnDone, metadata) => {
        var _a;
        if (!content.silent && content.store_history !== false && ((_a = content.code) === null || _a === void 0 ? void 0 : _a.trim())) {
            content = { ...content, code: wrapRCodeForAutoprint(content.code) };
        }
        return orig(content, disposeOnDone, metadata);
    };
}
async function patchPyodideHttp(sessionContext) {
    const session = sessionContext.session;
    if (!session) {
        throw Error('Session should have been ready');
    }
    const kernel = session.kernel;
    if (!kernel) {
        console.warn('Kernel was expected but not found');
        return;
    }
    if (kernel.name !== 'python') {
        console.debug('Non-python kernel: not patching');
        return;
    }
    await kernel.requestExecute({
        allow_stdin: false,
        code: [
            '%pip install -y pyodide-http requests',
            'import pyodide_http',
            'pyodide_http.patch_all()'
        ].join('\n'),
        silent: true,
        stop_on_error: false,
        store_history: false
    });
}
const notebookPlugin = {
    id: 'jupytereverywhere:notebook',
    autoStart: true,
    requires: [
        _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_5__.INotebookTracker,
        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.IToolbarWidgetRegistry,
        _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_5__.INotebookWidgetFactory,
        _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_10__.ISettingRegistry,
        _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_11__.ITranslator
    ],
    optional: [_jupyterlite_application__WEBPACK_IMPORTED_MODULE_4__.ILiteRouter],
    activate: (app, tracker, toolbarRegistry, notebookFactory, settingRegistry, translator, router) => {
        const { commands, serviceManager } = app;
        const { contents } = serviceManager;
        // Snapshot all open notebooks that have a VFS cache entry into sessionStorage.
        // Call this before any page redirect so reopening from recents restores edits.
        const flushVfsCaches = () => {
            tracker.forEach(w => {
                const path = w.context.path;
                if (sessionStorage.getItem(`vfs-cache:${path}`) !== null) {
                    try {
                        sessionStorage.setItem(`vfs-cache:${path}`, JSON.stringify(w.context.model.toJSON()));
                    }
                    catch ( /* ignore quota errors */_a) { /* ignore quota errors */ }
                }
            });
        };
        (() => {
            const s = document.createElement('style');
            s.textContent = '.jp-Dialog-button.ck-btn.jp-mod-accept{background:#1a3a5c!important;color:#fff!important;border-color:#1a3a5c!important;text-decoration:none!important;}.jp-Dialog-button.ck-btn.jp-mod-accept *{text-decoration:none!important;}.jp-Dialog-button.ck-btn.jp-mod-reject{background:#fff!important;color:#333!important;border:1px solid #ccc!important;text-decoration:none!important;}.je-GitHubBrowser-browse-btn{background:#1a3a5c!important;color:#fff!important;border-color:#1a3a5c!important;}';
            document.head.appendChild(s);
        })();
        // Register the settings transformer for our plugin so JupyterLab can load our
        // jupyter.lab.toolbars.Notebook entries. The factory itself is unused (the Notebook
        // widget is created by @jupyterlab/notebook-extension), but the side effect of this
        // call is to register a transform for 'jupytereverywhere:plugin' via settingRegistry.
        (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.createToolbarFactory)(toolbarRegistry, settingRegistry, 'Notebook', 'jupytereverywhere:plugin', translator);
        void notebookFactory;
        const params = new URLSearchParams(window.location.search);
        const uploadedNotebookId = params.get('uploaded-notebook');
        const fromUrl = params.get('from');
        let notebookSourceUrl = null;
        window.addEventListener('beforeunload', (e) => {
            var _a;
            if ((_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.context.model.dirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
        const fsaSupported = (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.isFileSystemAccessSupported)();
        if (!fsaSupported && !sessionStorage.getItem('ck-fsa-notice')) {
            sessionStorage.setItem('ck-fsa-notice', '1');
            setTimeout(() => {
                _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Notification.info("File saving isn't supported in this browser — use \"Download notebook\" to save your work.", { autoClose: 10000 });
            }, 2000);
        }
        const openNewNotebookWindow = async (kernelParam) => {
            const currentWidget = tracker.currentWidget;
            if (fsaSupported && currentWidget && currentWidget.context.model.dirty) {
                const result = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showDialog)({
                    title: 'Unsaved Notebook',
                    body: `"${currentWidget.context.path}" has unsaved changes.`,
                    buttons: [
                        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' }),
                        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Discard', className: 'ck-btn' }),
                        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.okButton({ label: fsaSupported ? 'Save' : 'Download', className: 'ck-btn' })
                    ]
                });
                if (result.button.label === 'Cancel')
                    return;
                if (result.button.accept) {
                    await commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.saveNotebookCommand);
                }
            }
            if (!fsaSupported && currentWidget && currentWidget.context.model.dirty) {
                const _hasCache = sessionStorage.getItem(`vfs-cache:${currentWidget.context.path}`) !== null;
                if (!_hasCache) {
                    const _ni = document.createElement('input');
                    _ni.value = currentWidget.context.path.replace(/\.ipynb$/i, '') || 'my-notebook';
                    _ni.style.cssText = 'width:100%;box-sizing:border-box;padding:8px';
                    const _nb = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_7__.Widget();
                    _nb.node.appendChild(_ni);
                    const _r = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showDialog)({
                        title: 'Name your new notebook',
                        body: _nb,
                        buttons: [
                            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' }),
                            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Discard', className: 'ck-btn' }),
                            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.okButton({ label: 'Save to browser', className: 'ck-btn' })
                        ]
                    });
                    if (_r.button.label === 'Cancel')
                        return;
                    if (_r.button.accept) {
                        const _rn = _ni.value.trim() || 'my-notebook';
                        const _fn = _rn.toLowerCase().endsWith('.ipynb') ? _rn : `${_rn}.ipynb`;
                        try {
                            sessionStorage.setItem(`vfs-cache:${_fn}`, JSON.stringify(currentWidget.context.model.toJSON()));
                        }
                        catch (_a) { }
                        (0,_recents__WEBPACK_IMPORTED_MODULE_16__.addRecentNotebook)({ label: _fn, type: 'vfs', path: _fn });
                    }
                }
            }
            const url = new URL(window.location.href);
            url.searchParams.delete('uploaded-notebook');
            url.searchParams.delete('from');
            url.searchParams.delete('tab');
            url.searchParams.set('kernel', kernelParam);
            _ckIntentionalNav = true;
            tracker.forEach(w => { w.context.model.dirty = false; });
            window.location.href = url.toString();
        };
        const createNewNotebook = async () => {
            notebookSourceUrl = null;
            (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.setCurrentFileHandle)(null);
            try {
                const currentParams = new URLSearchParams(window.location.search);
                const desiredKernelParam = currentParams.get('kernel') || 'r';
                const desiredKernel = _kernels__WEBPACK_IMPORTED_MODULE_13__.KERNEL_URL_TO_NAME[desiredKernelParam] || 'xr';
                await commands.execute('notebook:create-new', {
                    kernelName: desiredKernel
                });
                console.log(`Created new notebook with kernel: ${desiredKernel}`);
            }
            catch (error) {
                console.error('Failed to create new notebook:', error);
            }
        };
        const openUploadedNotebook = async (id) => {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                const raw = localStorage.getItem(`uploaded-notebook:${id}`);
                if (!raw) {
                    console.warn(`No uploaded notebook found for ID: ${id}`);
                    await createNewNotebook();
                    return;
                }
                const sourceUrl = (_a = localStorage.getItem(`uploaded-notebook-source:${id}`)) !== null && _a !== void 0 ? _a : null;
                const storedName = (_b = localStorage.getItem(`uploaded-notebook-name:${id}`)) !== null && _b !== void 0 ? _b : null;
                const content = JSON.parse(raw);
                const kernelName = mapLanguageToKernel(content);
                content.metadata.kernelspec = {
                    name: kernelName,
                    display_name: (_c = _kernels__WEBPACK_IMPORTED_MODULE_13__.KERNEL_DISPLAY_NAMES[kernelName]) !== null && _c !== void 0 ? _c : kernelName
                };
                // storedName is the actual filename from the user's disk (e.g. "jim_test.ipynb").
                // Without it, local files get stored as Uploaded_<id>.ipynb in the virtual FS,
                // which breaks the recents lookup (handle.name vs VFS path mismatch).
                const fileNameFromUrl = sourceUrl
                    ? ((_e = (_d = sourceUrl.split('/').pop()) === null || _d === void 0 ? void 0 : _d.replace(/\.ipynb$/i, '')) !== null && _e !== void 0 ? _e : null)
                    : null;
                const filename = storedName ||
                    `${((_f = content.metadata) === null || _f === void 0 ? void 0 : _f.name) || fileNameFromUrl || `Uploaded_${id}`}.ipynb`;
                await contents.save(filename, {
                    type: 'notebook',
                    format: 'json',
                    content
                });
                // DEBUG: log tracker state before docmanager:open
                const preOpenWidgets = [];
                tracker.forEach(w => { preOpenWidgets.push(`${w.context.path}(dirty=${w.context.model.dirty})`); });
                console.log('[openUploaded] tracker BEFORE open:', preOpenWidgets);
                await commands.execute('docmanager:open', { path: filename });
                // DEBUG: log tracker state after docmanager:open
                const postOpenWidgets = [];
                tracker.forEach(w => { postOpenWidgets.push(`${w.context.path}(dirty=${w.context.model.dirty})`); });
                console.log('[openUploaded] tracker AFTER open:', postOpenWidgets);
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.delete('uploaded-notebook');
                window.history.replaceState({}, '', currentUrl.toString());
                notebookSourceUrl = sourceUrl;
                const fileHandle = await (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.retrieveHandleForUpload)(id);
                (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.setCurrentFileHandle)(fileHandle);
                const fromCache = localStorage.getItem(`uploaded-notebook-from-cache:${id}`) === '1';
                localStorage.removeItem(`uploaded-notebook-from-cache:${id}`);
                if (!fileHandle && !sourceUrl) {
                    try {
                        sessionStorage.setItem(`vfs-cache:${filename}`, JSON.stringify(content));
                    }
                    catch ( /* ignore quota errors */_h) { /* ignore quota errors */ }
                    (0,_recents__WEBPACK_IMPORTED_MODULE_16__.addRecentNotebook)({ label: filename, type: 'vfs', path: filename });
                }
                if (!fromCache) {
                    try {
                        sessionStorage.setItem(`ck-last-downloaded:${filename}`, JSON.stringify((_g = content.cells) !== null && _g !== void 0 ? _g : []));
                    }
                    catch (_j) { }
                }
                localStorage.removeItem(`uploaded-notebook:${id}`);
                localStorage.removeItem(`uploaded-notebook-name:${id}`);
                if (sourceUrl) {
                    localStorage.removeItem(`uploaded-notebook-source:${id}`);
                }
                console.log(`Opened uploaded notebook: ${filename}`);
            }
            catch (error) {
                console.error('Failed to open uploaded notebook:', error);
                await createNewNotebook();
            }
        };
        const openNotebookFromProvidedURL = async (url) => {
            var _a;
            try {
                let fetchUrl = url.trim();
                if ((fetchUrl.startsWith('"') && fetchUrl.endsWith('"')) ||
                    (fetchUrl.startsWith("'") && fetchUrl.endsWith("'"))) {
                    fetchUrl = fetchUrl.slice(1, -1);
                }
                if (fetchUrl.includes('github.com') && fetchUrl.includes('/blob/')) {
                    fetchUrl = fetchUrl
                        .replace('https://github.com/', 'https://raw.githubusercontent.com/')
                        .replace('/blob/', '/');
                }
                const response = await fetch(fetchUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch notebook: ${response.status} ${response.statusText}`);
                }
                const parsed = (await response.json());
                const fileName = (_a = fetchUrl.split('/').pop()) !== null && _a !== void 0 ? _a : 'notebook.ipynb';
                const currentWidget = tracker.currentWidget;
                if (fsaSupported && currentWidget && currentWidget.context.model.dirty) {
                    const result = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showDialog)({
                        title: 'Unsaved Notebook',
                        body: `"${currentWidget.context.path}" has unsaved changes.`,
                        buttons: [
                            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' }),
                            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Discard', className: 'ck-btn' }),
                            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.okButton({ label: 'Save', className: 'ck-btn' })
                        ]
                    });
                    if (result.button.label === 'Cancel')
                        return;
                    if (result.button.accept) {
                        await commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.saveNotebookCommand);
                    }
                }
                if (!fsaSupported && currentWidget && currentWidget.context.model.dirty) {
                    const _hasCache = sessionStorage.getItem(`vfs-cache:${currentWidget.context.path}`) !== null;
                    if (!_hasCache) {
                        const _ni = document.createElement('input');
                        _ni.value = currentWidget.context.path.replace(/\.ipynb$/i, '') || 'my-notebook';
                        _ni.style.cssText = 'width:100%;box-sizing:border-box;padding:8px';
                        const _nb = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_7__.Widget();
                        _nb.node.appendChild(_ni);
                        const _r = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showDialog)({
                            title: 'Name your new notebook',
                            body: _nb,
                            buttons: [
                                _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' }),
                                _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Discard', className: 'ck-btn' }),
                                _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.okButton({ label: 'Save to browser', className: 'ck-btn' })
                            ]
                        });
                        if (_r.button.label === 'Cancel')
                            return;
                        if (_r.button.accept) {
                            const _rn = _ni.value.trim() || 'my-notebook';
                            const _fn = _rn.toLowerCase().endsWith('.ipynb') ? _rn : `${_rn}.ipynb`;
                            try {
                                sessionStorage.setItem(`vfs-cache:${_fn}`, JSON.stringify(currentWidget.context.model.toJSON()));
                            }
                            catch (_b) { }
                            (0,_recents__WEBPACK_IMPORTED_MODULE_16__.addRecentNotebook)({ label: _fn, type: 'vfs', path: _fn });
                        }
                    }
                }
                (0,_recents__WEBPACK_IMPORTED_MODULE_16__.addRecentNotebook)({ label: `GitHub: ${fileName}`, type: 'github', url: fetchUrl });
                flushVfsCaches();
                _ckIntentionalNav = true;
                tracker.forEach(w => { w.context.model.dirty = false; });
                await (0,_upload__WEBPACK_IMPORTED_MODULE_14__.openNotebookContent)(parsed, fetchUrl);
            }
            catch (error) {
                console.error('Failed to open notebook from URL:', error);
                alert('Failed to open notebook from URL.');
            }
        };
        const openNotebookFromURL = async () => {
            const url = window.prompt('Enter a GitHub notebook URL or raw .ipynb URL:');
            if (!url) {
                return;
            }
            await openNotebookFromProvidedURL(url);
        };
        if (uploadedNotebookId) {
            void openUploadedNotebook(uploadedNotebookId);
        }
        else if (fromUrl) {
            void openNotebookFromProvidedURL(fromUrl);
        }
        else {
            void createNewNotebook();
        }
        const openLocalFile = async () => {
            const currentWidget = tracker.currentWidget;
            if (fsaSupported && currentWidget && currentWidget.context.model.dirty) {
                const result = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showDialog)({
                    title: 'Unsaved Notebook',
                    body: `"${currentWidget.context.path}" has unsaved changes.`,
                    buttons: [
                        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' }),
                        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Discard', className: 'ck-btn' }),
                        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.okButton({ label: fsaSupported ? 'Save' : 'Download', className: 'ck-btn' })
                    ]
                });
                if (result.button.label === 'Cancel')
                    return;
                if (result.button.accept) {
                    await commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.saveNotebookCommand);
                }
            }
            if (!fsaSupported && currentWidget && currentWidget.context.model.dirty) {
                const _hasCache = sessionStorage.getItem(`vfs-cache:${currentWidget.context.path}`) !== null;
                if (!_hasCache) {
                    const _ni = document.createElement('input');
                    _ni.value = currentWidget.context.path.replace(/\.ipynb$/i, '') || 'my-notebook';
                    _ni.style.cssText = 'width:100%;box-sizing:border-box;padding:8px';
                    const _nb = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_7__.Widget();
                    _nb.node.appendChild(_ni);
                    const _r = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showDialog)({
                        title: 'Name your new notebook',
                        body: _nb,
                        buttons: [
                            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' }),
                            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Discard', className: 'ck-btn' }),
                            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.okButton({ label: 'Save to browser', className: 'ck-btn' })
                        ]
                    });
                    if (_r.button.label === 'Cancel')
                        return;
                    if (_r.button.accept) {
                        const _rn = _ni.value.trim() || 'my-notebook';
                        const _fn = _rn.toLowerCase().endsWith('.ipynb') ? _rn : `${_rn}.ipynb`;
                        try {
                            sessionStorage.setItem(`vfs-cache:${_fn}`, JSON.stringify(currentWidget.context.model.toJSON()));
                        }
                        catch (_a) { }
                        (0,_recents__WEBPACK_IMPORTED_MODULE_16__.addRecentNotebook)({ label: _fn, type: 'vfs', path: _fn });
                    }
                }
            }
            if (!(0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.isFileSystemAccessSupported)()) {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.ipynb,application/json';
                input.onchange = async () => {
                    var _a;
                    const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (file) {
                        flushVfsCaches();
                        _ckIntentionalNav = true;
                        tracker.forEach(w => { w.context.model.dirty = false; });
                        await (0,_upload__WEBPACK_IMPORTED_MODULE_14__.handleNotebookUpload)(file);
                    }
                };
                input.click();
                return;
            }
            let picked;
            try {
                picked = await (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.pickNotebookFile)();
            }
            catch (err) {
                await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showErrorMessage)('Failed to open file', err instanceof Error ? err.message : String(err));
                return;
            }
            if (!picked) {
                return;
            }
            const { handle, text } = picked;
            let parsed;
            try {
                parsed = JSON.parse(text);
            }
            catch (_b) {
                await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showErrorMessage)('Invalid notebook', 'The selected file is not a valid notebook.');
                return;
            }
            if (!(0,_upload__WEBPACK_IMPORTED_MODULE_14__.detectNotebookLanguage)(parsed)) {
                await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showErrorMessage)('Please open a valid notebook', 'Only Python and R notebooks are supported.');
                return;
            }
            const uploadId = _lumino_coreutils__WEBPACK_IMPORTED_MODULE_9__.UUID.uuid4();
            localStorage.setItem(`uploaded-notebook:${uploadId}`, text);
            localStorage.setItem(`uploaded-notebook-name:${uploadId}`, handle.name);
            await (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.storeHandleForUpload)(uploadId, handle);
            const recentKey = _lumino_coreutils__WEBPACK_IMPORTED_MODULE_9__.UUID.uuid4();
            await (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.storeRecentHandle)(recentKey, handle);
            (0,_recents__WEBPACK_IMPORTED_MODULE_16__.addRecentNotebook)({ label: handle.name, type: 'file', handleKey: recentKey });
            const target = new URL(window.location.href);
            target.search = '';
            target.searchParams.set('uploaded-notebook', uploadId);
            target.hash = '';
            flushVfsCaches();
            _ckIntentionalNav = true;
            tracker.forEach(w => { w.context.model.dirty = false; });
            window.location.href = target.toString();
        };
        const openRecentNotebook = async (nb) => {
            if (nb.type === 'github' && nb.url) {
                await openNotebookFromProvidedURL(nb.url);
                return;
            }
            if (nb.type === 'vfs' && nb.path) {
                // Fast path: notebook already open
                let existingId = null;
                tracker.forEach(w => {
                    if (!existingId && w.context.path === nb.path)
                        existingId = w.id;
                });
                if (existingId) {
                    app.shell.activateById(existingId);
                    notebookSourceUrl = null;
                    (0,_recents__WEBPACK_IMPORTED_MODULE_16__.addRecentNotebook)(nb);
                    return;
                }
                const cached = sessionStorage.getItem(`vfs-cache:${nb.path}`);
                if (!cached) {
                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Notification.warning('Could not reopen the notebook — try "Open from file" to upload it again.', { autoClose: 4000 });
                    return;
                }
                const uploadId = _lumino_coreutils__WEBPACK_IMPORTED_MODULE_9__.UUID.uuid4();
                localStorage.setItem(`uploaded-notebook:${uploadId}`, cached);
                localStorage.setItem(`uploaded-notebook-name:${uploadId}`, nb.path);
                localStorage.setItem(`uploaded-notebook-from-cache:${uploadId}`, '1');
                (0,_recents__WEBPACK_IMPORTED_MODULE_16__.addRecentNotebook)(nb);
                const target = new URL(window.location.href);
                target.search = '';
                target.searchParams.set('uploaded-notebook', uploadId);
                target.hash = '';
                flushVfsCaches();
                _ckIntentionalNav = true;
                tracker.forEach(w => { w.context.model.dirty = false; });
                window.location.href = target.toString();
                return;
            }
            if (nb.type === 'file' && nb.handleKey) {
                const handle = await (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.retrieveRecentHandle)(nb.handleKey);
                if (!handle) {
                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Notification.warning('Could not find the saved file. Please use "Open from file" instead.', {
                        autoClose: 4000
                    });
                    return;
                }
                try {
                    const fsa = handle;
                    // Check fast path first — activating an already-open widget needs no disk access
                    let existingId = null;
                    const trackerPaths = [];
                    tracker.forEach(w => {
                        trackerPaths.push(`${w.context.path}(dirty=${w.context.model.dirty})`);
                        if (!existingId && w.context.path === handle.name) {
                            existingId = w.id;
                        }
                    });
                    if (existingId) {
                        tracker.forEach(w => { w.context.model.dirty = false; });
                        app.shell.activateById(existingId);
                        notebookSourceUrl = null;
                        (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.setCurrentFileHandle)(handle);
                        (0,_recents__WEBPACK_IMPORTED_MODULE_16__.addRecentNotebook)(nb);
                        return;
                    }
                    // Slow path: need to read file from disk — only read permission required here;
                    // write permission is requested lazily when the user clicks "Save to file"
                    let perm = await fsa.queryPermission({ mode: 'read' });
                    if (perm !== 'granted') {
                        perm = await fsa.requestPermission({ mode: 'read' });
                    }
                    if (perm !== 'granted') {
                        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Notification.warning('Permission denied. Please use "Open from file" instead.', {
                            autoClose: 4000
                        });
                        return;
                    }
                    // File is not currently open. Use the same redirect flow as "Open from file":
                    // writing directly to VFS + docmanager:open causes a spurious "save changes?"
                    // dialog because the fileChanged event from contents.save races with the new
                    // context created by docmanager:open. The redirect flow avoids this entirely.
                    const diskFile = await handle.getFile();
                    const text = await diskFile.text();
                    const uploadId = _lumino_coreutils__WEBPACK_IMPORTED_MODULE_9__.UUID.uuid4();
                    localStorage.setItem(`uploaded-notebook:${uploadId}`, text);
                    localStorage.setItem(`uploaded-notebook-name:${uploadId}`, handle.name);
                    await (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.storeHandleForUpload)(uploadId, handle);
                    (0,_recents__WEBPACK_IMPORTED_MODULE_16__.addRecentNotebook)(nb);
                    const target = new URL(window.location.href);
                    target.search = '';
                    target.searchParams.set('uploaded-notebook', uploadId);
                    target.hash = '';
                    // Warn only if the current notebook has unsaved edits.
                    const currentWidget = tracker.currentWidget;
                    if (currentWidget) {
                        const isDirty = currentWidget.context.model.dirty;
                        if (isDirty) {
                            const result = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showDialog)({
                                title: 'Unsaved Notebook',
                                body: `"${currentWidget.context.path}" has unsaved changes.`,
                                buttons: [
                                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' }),
                                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Discard', className: 'ck-btn' }),
                                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.okButton({ label: fsaSupported ? 'Save' : 'Download', className: 'ck-btn' })
                                ]
                            });
                            if (result.button.label === 'Cancel') {
                                return;
                            }
                            if (result.button.label === 'Save') {
                                await commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.saveNotebookCommand);
                            }
                        }
                    }
                    flushVfsCaches();
                    _ckIntentionalNav = true;
                    tracker.forEach(w => { w.context.model.dirty = false; });
                    window.location.href = target.toString();
                }
                catch (_a) {
                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Notification.warning('Could not open the file. Please use "Open from file" instead.', {
                        autoClose: 4000
                    });
                }
            }
        };
        commands.addCommand(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.saveToFile, {
            label: 'Save as…',
            execute: async () => {
                const panel = tracker.currentWidget;
                if (!panel) {
                    return;
                }
                if (!fsaSupported) {
                    await commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.downloadNotebookCommand);
                    return;
                }
                const content = panel.context.model.toJSON();
                const text = JSON.stringify(content, null, 2);
                let suggestedName = panel.context.path && panel.context.path !== 'Untitled.ipynb'
                    ? panel.context.path
                    : 'notebook.ipynb';
                if (notebookSourceUrl !== null) {
                    suggestedName = suggestedName.replace(/\.ipynb$/i, '_copy.ipynb');
                }
                const handle = await (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.pickSaveLocation)(suggestedName);
                if (!handle) {
                    return;
                }
                try {
                    await (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.saveToHandle)(handle, text);
                    (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.setCurrentFileHandle)(handle);
                    notebookSourceUrl = null;
                    const recentKey = _lumino_coreutils__WEBPACK_IMPORTED_MODULE_9__.UUID.uuid4();
                    await (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.storeRecentHandle)(recentKey, handle);
                    (0,_recents__WEBPACK_IMPORTED_MODULE_16__.addRecentNotebook)({ label: handle.name, type: 'file', handleKey: recentKey });
                    await panel.context.save();
                    (0,_notebook_utils__WEBPACK_IMPORTED_MODULE_17__.showSavedToast)();
                }
                catch (err) {
                    console.error('Failed to save to file:', err);
                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Notification.warning('Could not save to file.', { autoClose: 4000 });
                }
            }
        });
        commands.addCommand(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.closeNotebook, {
            label: 'Close notebook',
            execute: async () => {
                var _a;
                const panel = tracker.currentWidget;
                if (fsaSupported && panel && panel.context.model.dirty) {
                    const result = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showDialog)({
                        title: 'Unsaved Notebook',
                        body: `"${panel.context.path}" has unsaved changes.`,
                        buttons: [
                            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' }),
                            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Discard', className: 'ck-btn' }),
                            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.okButton({ label: 'Save', className: 'ck-btn' })
                        ]
                    });
                    if (result.button.label === 'Cancel')
                        return;
                    if (result.button.accept) {
                        await commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.saveNotebookCommand);
                    }
                }
                if (!fsaSupported && panel) {
                    const _lastDl = sessionStorage.getItem(`ck-last-downloaded:${panel.context.path}`);
                    const _currentCells = JSON.stringify((_a = panel.context.model.toJSON().cells) !== null && _a !== void 0 ? _a : []);
                    const _hasCache = sessionStorage.getItem(`vfs-cache:${panel.context.path}`) !== null;
                    if (_lastDl === null ? _currentCells !== '[]' : _lastDl !== _currentCells) {
                        if (!_hasCache) {
                            const _ni = document.createElement('input');
                            _ni.value = panel.context.path.replace(/\.ipynb$/i, '') || 'my-notebook';
                            _ni.style.cssText = 'width:100%;box-sizing:border-box;padding:8px';
                            const _nb = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_7__.Widget();
                            _nb.node.appendChild(_ni);
                            const _r = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showDialog)({
                                title: 'Name your new notebook',
                                body: _nb,
                                buttons: [
                                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' }),
                                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Discard', className: 'ck-btn' }),
                                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.okButton({ label: 'Save to browser', className: 'ck-btn' })
                                ]
                            });
                            if (_r.button.label === 'Cancel')
                                return;
                            if (_r.button.accept) {
                                const _rn = _ni.value.trim() || 'my-notebook';
                                const _fn = _rn.toLowerCase().endsWith('.ipynb') ? _rn : `${_rn}.ipynb`;
                                try {
                                    sessionStorage.setItem(`vfs-cache:${_fn}`, JSON.stringify(panel.context.model.toJSON()));
                                }
                                catch (_b) { }
                                (0,_recents__WEBPACK_IMPORTED_MODULE_16__.addRecentNotebook)({ label: _fn, type: 'vfs', path: _fn });
                            }
                        }
                        else {
                            const _rd = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showDialog)({
                                title: 'Close notebook',
                                body: 'Download a copy to your device before closing? Your changes are saved in the browser.',
                                buttons: [
                                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' }),
                                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Close', className: 'ck-btn' }),
                                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.okButton({ label: 'Download', className: 'ck-btn' })
                                ]
                            });
                            if (_rd.button.label === 'Cancel')
                                return;
                            if (_rd.button.accept) {
                                await commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.downloadNotebookCommand);
                            }
                        }
                    }
                }
                const handle = (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.getCurrentFileHandle)();
                if (handle) {
                    (0,_recents__WEBPACK_IMPORTED_MODULE_16__.removeRecentNotebook)({ label: handle.name });
                }
                else if (notebookSourceUrl !== null) {
                    (0,_recents__WEBPACK_IMPORTED_MODULE_16__.removeRecentNotebook)({ url: notebookSourceUrl });
                }
                else if (panel) {
                    (0,_recents__WEBPACK_IMPORTED_MODULE_16__.removeRecentNotebook)({ label: panel.context.path });
                }
                const _nextRecents = (0,_recents__WEBPACK_IMPORTED_MODULE_16__.getRecentNotebooks)();
                flushVfsCaches();
                _ckIntentionalNav = true;
                tracker.forEach(w => { w.context.model.dirty = false; });
                for (const _next of _nextRecents) {
                    if (_next.type === 'vfs' && _next.path) {
                        const _cachedNext = sessionStorage.getItem(`vfs-cache:${_next.path}`);
                        if (!_cachedNext)
                            continue; // stale entry — try next recent
                        const _uid = _lumino_coreutils__WEBPACK_IMPORTED_MODULE_9__.UUID.uuid4();
                        localStorage.setItem(`uploaded-notebook:${_uid}`, _cachedNext);
                        localStorage.setItem(`uploaded-notebook-name:${_uid}`, _next.path);
                        localStorage.setItem(`uploaded-notebook-from-cache:${_uid}`, '1');
                        const _t = new URL(window.location.href);
                        _t.search = '';
                        _t.searchParams.set('uploaded-notebook', _uid);
                        _t.hash = '';
                        window.location.href = _t.toString();
                        return;
                    }
                    else if (_next.type === 'github' && _next.url) {
                        const _t = new URL(window.location.href);
                        _t.search = '';
                        _t.searchParams.set('from', _next.url);
                        _t.hash = '';
                        window.location.href = _t.toString();
                        return;
                    }
                    else if (_next.type === 'file') {
                        await openRecentNotebook(_next);
                        return;
                    }
                }
                await createNewNotebook();
            }
        });
        commands.addCommand(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.clearStorage, {
            label: 'Clear storage',
            execute: async () => {
                const dirtyPaths = [];
                tracker.forEach(w => {
                    if (w.context.model.dirty)
                        dirtyPaths.push(w.context.path);
                });
                const body = dirtyPaths.length > 0
                    ? `This will close all notebooks and delete all stored data from your browser. The following notebooks have unsaved changes that will be lost: "${dirtyPaths.join('", "')}".`
                    : 'This will close all notebooks and delete all stored data from your browser. This cannot be undone.';
                const result = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.showDialog)({
                    title: 'Clear storage',
                    body,
                    buttons: [
                        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' }),
                        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.okButton({ label: 'Clear storage', className: 'ck-btn' })
                    ]
                });
                if (!result.button.accept)
                    return;
                // Clear localStorage (notebook content + recents)
                const lsKeys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (k && (k.startsWith('uploaded-notebook') || k === 'jupytereverywhere:recent-notebooks')) {
                        lsKeys.push(k);
                    }
                }
                lsKeys.forEach(k => localStorage.removeItem(k));
                // Clear sessionStorage (VFS caches + download history)
                const ssKeys = [];
                for (let i = 0; i < sessionStorage.length; i++) {
                    const k = sessionStorage.key(i);
                    if (k && (k.startsWith('vfs-cache:') || k.startsWith('ck-last-downloaded:') || k === 'ck-fsa-notice')) {
                        ssKeys.push(k);
                    }
                }
                ssKeys.forEach(k => sessionStorage.removeItem(k));
                // Clear IndexedDB (file handles)
                indexedDB.deleteDatabase('jupytereverywhere-fs');
                (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.setCurrentFileHandle)(null);
                _ckIntentionalNav = true;
                tracker.forEach(w => { w.context.model.dirty = false; });
                const url = new URL(window.location.href);
                url.search = '';
                url.hash = '';
                window.location.href = url.toString();
            }
        });
        commands.addCommand(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.openFromGitHub, {
            label: 'Open from GitHub',
            execute: async () => {
                const widget = new _ui_components_GitHubBrowserDialog__WEBPACK_IMPORTED_MODULE_3__.GitHubBrowserWidget();
                const dialog = new _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog({
                    title: 'Open from GitHub',
                    body: widget,
                    buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Dialog.cancelButton({ label: 'Cancel', className: 'ck-btn' })]
                });
                // Document-level capture fires before the Dialog's own capture listener.
                // When Enter is pressed in the URL input we stop the Dialog from eating
                // it and click the internal Open button directly instead.
                const githubEnterHandler = (e) => {
                    var _a;
                    if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.classList.contains('je-GitHubBrowser-input')) {
                        e.stopImmediatePropagation();
                        const openBtn = (_a = e.target.closest('.je-GitHubBrowser')) === null || _a === void 0 ? void 0 : _a.querySelector('.je-GitHubBrowser-browse-btn');
                        if (openBtn)
                            openBtn.click();
                    }
                };
                document.addEventListener('keydown', githubEnterHandler, true);
                widget.onFileSelected = (url) => {
                    dialog.resolve(0);
                    void openNotebookFromProvidedURL(url);
                };
                await dialog.launch();
                document.removeEventListener('keydown', githubEnterHandler, true);
            }
        });
        commands.addCommand(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.copyShareLink, {
            label: 'Copy link to GitHub source',
            isEnabled: () => { var _a; return notebookSourceUrl !== null && !((_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.context.model.dirty); },
            execute: () => {
                if (!notebookSourceUrl) {
                    return;
                }
                const shareUrl = new URL(window.location.href);
                shareUrl.search = '';
                shareUrl.searchParams.set('from', notebookSourceUrl);
                void navigator.clipboard.writeText(shareUrl.toString()).then(() => {
                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_6__.Notification.success('Share link copied. Recipients will see the GitHub version of this notebook.', { autoClose: 5000 });
                });
            }
        });
        tracker.currentChanged.connect((_, panel) => {
            if (!panel)
                return;
            requestAnimationFrame(() => {
                const toolbar = panel.toolbar;
                const w = toolbar.node.clientWidth;
                const h = toolbar.node.clientHeight;
                if (w > 0) {
                    _lumino_messaging__WEBPACK_IMPORTED_MODULE_8__.MessageLoop.sendMessage(toolbar, new _lumino_widgets__WEBPACK_IMPORTED_MODULE_7__.Widget.ResizeMessage(w, h));
                }
            });
        });
        tracker.widgetAdded.connect(async (_, panel) => {
            var _a;
            console.log('[widgetAdded]', panel.context.path, 'dirty=', panel.context.model.dirty);
            // Kernel init (xr in particular) fires spurious dirty events and also
            // updates notebook metadata (kernelspec, language_info) which changes the
            // full toJSON() output. Compare cells only so metadata updates don't
            // look like real user edits.
            await panel.context.ready;
            const _initialCells = JSON.stringify((_a = panel.context.model.toJSON().cells) !== null && _a !== void 0 ? _a : []);
            panel.context.model.dirty = false;
            panel.context.model.stateChanged.connect(() => {
                var _a;
                if (!panel.context.model.dirty)
                    return;
                const currentCells = JSON.stringify((_a = panel.context.model.toJSON().cells) !== null && _a !== void 0 ? _a : []);
                if (currentCells === _initialCells) {
                    console.log('[CK] spurious dirty (cells unchanged) → clearing', panel.context.path);
                    panel.context.model.dirty = false;
                }
            });
            await panel.sessionContext.ready;
            const url = new URL(window.location.href);
            if (url.searchParams.has('kernel')) {
                url.searchParams.delete('kernel');
                window.history.replaceState({}, '', url.toString());
                console.log('Removed kernel param from URL after kernel init.');
            }
            panel.sessionContext.kernelChanged.connect(patchXeusR);
            patchXeusR(panel.sessionContext);
            panel.sessionContext.kernelChanged.connect(patchPyodideHttp);
            await patchPyodideHttp(panel.sessionContext);
            // Spin the run button while the kernel is busy executing a cell.
            // We snapshot the active cell's run button at the moment busy fires so
            // we remove the class from the right button even if the user navigates
            // away before execution finishes.
            let _executingBtn = null;
            panel.sessionContext.statusChanged.connect((_, status) => {
                var _a, _b;
                if (status === 'busy') {
                    _executingBtn = (_b = (_a = panel.content.activeCell) === null || _a === void 0 ? void 0 : _a.node.querySelector('.je-cell-run-button')) !== null && _b !== void 0 ? _b : null;
                    _executingBtn === null || _executingBtn === void 0 ? void 0 : _executingBtn.classList.add('je-cell-running');
                }
                else {
                    _executingBtn === null || _executingBtn === void 0 ? void 0 : _executingBtn.classList.remove('je-cell-running');
                    _executingBtn = null;
                }
            });
        });
        // Capture-phase beforeunload listener runs before JupyterLab's bubble-phase handler.
        // The xr kernel can set dirty=true asynchronously between our sync dirty-clear and
        // when beforeunload actually fires. Re-clearing here ensures JupyterLab's handler
        // sees dirty=false for intentional recents navigations.
        let _ckIntentionalNav = false;
        window.addEventListener('beforeunload', () => {
            if (_ckIntentionalNav) {
                tracker.forEach(w => { w.context.model.dirty = false; });
            }
        }, true);
        toolbarRegistry.addFactory('Notebook', 'coursekataLogo', () => {
            const widget = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_7__.Widget();
            widget.addClass('ck-logo-button');
            const anchor = document.createElement('a');
            anchor.href = 'https://www.coursekata.org';
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.title = 'Visit CourseKata';
            widget.node.appendChild(anchor);
            return widget;
        });
        toolbarRegistry.addFactory('Notebook', 'run', () => new _ui_components_RunDropdownButton__WEBPACK_IMPORTED_MODULE_1__.RunDropdownButton(commands));
        toolbarRegistry.addFactory('Notebook', 'upload', () => new _ui_components_OpenDropdownButton__WEBPACK_IMPORTED_MODULE_0__.OpenDropdownButton(commands, () => {
            void openLocalFile();
        }, () => {
            void openNotebookFromURL();
        }, () => {
            openNewNotebookWindow('r');
        }, () => {
            openNewNotebookWindow('python');
        }, () => {
            void commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.downloadNotebookCommand);
        }, () => {
            void commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.downloadPDFCommand);
        }, () => {
            void commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.openFromGitHub);
        }, () => {
            void commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.copyShareLink);
        }, () => { var _a; return notebookSourceUrl !== null && !((_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.context.model.dirty); }, () => {
            void commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.saveNotebookCommand);
        }, () => { var _a; return !!((_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.context.model.dirty); }, () => {
            void commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.saveToFile);
        }, () => {
            void commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.closeNotebook);
        }, () => {
            void commands.execute(_commands__WEBPACK_IMPORTED_MODULE_12__.Commands.clearStorage);
        }, () => (0,_recents__WEBPACK_IMPORTED_MODULE_16__.getRecentNotebooks)().map(nb => ({
            label: nb.label,
            open: () => {
                void openRecentNotebook(nb);
            },
            isCurrent: () => {
                var _a;
                const handle = (0,_filesystem__WEBPACK_IMPORTED_MODULE_15__.getCurrentFileHandle)();
                if (nb.type === 'file') {
                    return handle !== null && handle.name === nb.label;
                }
                if (nb.type === 'vfs') {
                    return !handle && ((_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.context.path) === nb.path;
                }
                return handle === null && notebookSourceUrl === nb.url;
            }
        }))));
        toolbarRegistry.addFactory('Notebook', 'jeKernelSwitcher', () => new _ui_components_KernelIndicator__WEBPACK_IMPORTED_MODULE_2__.KernelIndicator(tracker));
        void app.restored.then(() => {
            var _a;
            const url = new URL(window.location.href);
            if (/\/lab\/$/.test(url.pathname)) {
                url.pathname = url.pathname.replace(/\/lab\/$/, '/lab/index.html');
                window.history.replaceState({}, '', url.toString());
            }
            const after = new URL(window.location.href);
            if (after.searchParams.get('tab') === 'notebook') {
                const id = (_a = document.querySelector('.jp-NotebookPanel')) === null || _a === void 0 ? void 0 : _a.id;
                if (id) {
                    app.shell.activateById(id);
                    after.searchParams.delete('tab');
                    const base = ((router === null || router === void 0 ? void 0 : router.base) || '').replace(/\/$/, '');
                    const canonical = new URL(`${base}/lab/index.html`, window.location.origin);
                    canonical.hash = after.hash;
                    if (after.pathname + after.search + after.hash !==
                        canonical.pathname + canonical.search + canonical.hash) {
                        window.history.replaceState(null, 'Notebook', canonical.toString());
                    }
                }
            }
        });
        void contents;
        void mapLanguageToKernel;
    }
};


/***/ },

/***/ "./lib/pdf.js"
/*!********************!*\
  !*** ./lib/pdf.js ***!
  \********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exportNotebookAsPDF: () => (/* binding */ exportNotebookAsPDF)
/* harmony export */ });
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jspdf__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jspdf */ "webpack/sharing/consume/default/jspdf/jspdf");
/* harmony import */ var html2canvas__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! html2canvas */ "./node_modules/html2canvas/dist/html2canvas.js");
/* harmony import */ var html2canvas__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(html2canvas__WEBPACK_IMPORTED_MODULE_2__);
// Adapted from https://github.com/jupyterlite/jupyterlite/pull/1625



async function exportNotebookAsPDF(notebook, fileName) {
    const defaultName = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PathExt.basename(notebook.context.path, _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PathExt.extname(notebook.context.path));
    const name = fileName !== null && fileName !== void 0 ? fileName : defaultName;
    const outputName = name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`;
    const sourceEl = notebook.content.node;
    // Clone into an off-screen container with no overflow/height constraints so
    // html2canvas captures the full content, not just the visible viewport.
    const offscreen = document.createElement('div');
    offscreen.style.cssText = [
        'position:absolute',
        'left:-9999px',
        'top:0',
        `width:${sourceEl.scrollWidth}px`,
        'overflow:visible',
        'background:#fff',
    ].join(';');
    const clone = sourceEl.cloneNode(true);
    clone.style.cssText = [
        'position:static',
        'height:auto',
        'max-height:none',
        'overflow:visible',
        `width:${sourceEl.scrollWidth}px`,
    ].join(';');
    offscreen.appendChild(clone);
    document.body.appendChild(offscreen);
    // Copy canvas pixel data from the live element to the clone so rendered
    // plots appear in the PDF.
    const srcCanvases = Array.from(sourceEl.querySelectorAll('canvas'));
    const dstCanvases = Array.from(clone.querySelectorAll('canvas'));
    srcCanvases.forEach((src, i) => {
        var _a;
        const dst = dstCanvases[i];
        if (!dst)
            return;
        try {
            dst.width = src.width;
            dst.height = src.height;
            (_a = dst.getContext('2d')) === null || _a === void 0 ? void 0 : _a.drawImage(src, 0, 0);
        }
        catch (_b) {
            // Silently skip cross-origin canvases
        }
    });
    // Collect each cell's top y-position (pixels from container top) before
    // we remove the element from the DOM.
    const containerTop = offscreen.getBoundingClientRect().top;
    const cellTopsPx = Array.from(clone.querySelectorAll('.jp-Cell')).map(cell => cell.getBoundingClientRect().top - containerTop);
    let canvas;
    try {
        canvas = await html2canvas__WEBPACK_IMPORTED_MODULE_2___default()(offscreen, { scale: 1, useCORS: true });
    }
    finally {
        document.body.removeChild(offscreen);
    }
    if (canvas.height === 0)
        return;
    const doc = new jspdf__WEBPACK_IMPORTED_MODULE_1__["default"]({ orientation: 'portrait', format: 'a4', unit: 'mm' });
    const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
    const mmPerPx = pageWidth / canvas.width;
    const totalHeightMm = canvas.height * mmPerPx;
    const cellTopsMm = cellTopsPx.map(px => px * mmPerPx);
    // Build page break positions that land at cell boundaries.
    // For each candidate break (cursor + pageHeight), find the latest cell
    // start that falls at or before that point — the cell will then begin
    // fresh on the next page rather than being split.
    const breaks = [0];
    let cursor = 0;
    while (cursor < totalHeightMm) {
        const rawEnd = cursor + pageHeight;
        if (rawEnd >= totalHeightMm)
            break;
        let bestBreak = rawEnd;
        for (const cellTop of cellTopsMm) {
            if (cellTop > cursor && cellTop <= rawEnd) {
                bestBreak = cellTop; // keep updating — want the last one before rawEnd
            }
        }
        breaks.push(bestBreak);
        cursor = bestBreak;
    }
    breaks.push(totalHeightMm);
    // Render each page as an independent canvas slice so that the break
    // position can vary per page.
    for (let i = 0; i < breaks.length - 1; i++) {
        const startPx = Math.round(breaks[i] / mmPerPx);
        const endPx = Math.round(breaks[i + 1] / mmPerPx);
        const sliceHeightPx = endPx - startPx;
        const sliceHeightMm = breaks[i + 1] - breaks[i];
        const slice = document.createElement('canvas');
        slice.width = canvas.width;
        slice.height = sliceHeightPx;
        slice.getContext('2d').drawImage(canvas, 0, startPx, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);
        if (i > 0)
            doc.addPage();
        doc.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pageWidth, sliceHeightMm);
    }
    doc.save(outputName);
}


/***/ },

/***/ "./lib/placeholders.js"
/*!*****************************!*\
  !*** ./lib/placeholders.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EMPTY_MARKDOWN_PLACEHOLDER: () => (/* binding */ EMPTY_MARKDOWN_PLACEHOLDER),
/* harmony export */   placeholderPlugin: () => (/* binding */ placeholderPlugin)
/* harmony export */ });
/* harmony import */ var _codemirror_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @codemirror/view */ "webpack/sharing/consume/default/@codemirror/view");
/* harmony import */ var _codemirror_view__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_codemirror_view__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_codemirror__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/codemirror */ "webpack/sharing/consume/default/@jupyterlab/codemirror");
/* harmony import */ var _jupyterlab_codemirror__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_codemirror__WEBPACK_IMPORTED_MODULE_1__);


const EMPTY_MARKDOWN_PLACEHOLDER = 'This is a text cell. Double-click to edit.';
const placeholderPlugin = {
    id: '@jupyter-everywhere/codemirror-extension:placeholder',
    autoStart: true,
    requires: [_jupyterlab_codemirror__WEBPACK_IMPORTED_MODULE_1__.IEditorExtensionRegistry],
    activate: (app, extensions) => {
        extensions.addExtension(Object.freeze({
            name: 'placeholder',
            default: null,
            factory: () => _jupyterlab_codemirror__WEBPACK_IMPORTED_MODULE_1__.EditorExtensionRegistry.createConfigurableExtension((text) => text ? (0,_codemirror_view__WEBPACK_IMPORTED_MODULE_0__.placeholder)(text) : []),
            schema: {
                type: ['string', 'null'],
                title: 'Placeholder',
                description: 'Placeholder to show.'
            }
        }));
    }
};


/***/ },

/***/ "./lib/recents.js"
/*!************************!*\
  !*** ./lib/recents.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addRecentNotebook: () => (/* binding */ addRecentNotebook),
/* harmony export */   getRecentNotebooks: () => (/* binding */ getRecentNotebooks),
/* harmony export */   removeRecentNotebook: () => (/* binding */ removeRecentNotebook)
/* harmony export */ });
const RECENTS_KEY = 'jupytereverywhere:recent-notebooks';
const MAX_RECENTS = 5;
function getRecentNotebooks() {
    var _a;
    try {
        return JSON.parse((_a = localStorage.getItem(RECENTS_KEY)) !== null && _a !== void 0 ? _a : '[]');
    }
    catch (_b) {
        return [];
    }
}
function addRecentNotebook(nb) {
    const existing = getRecentNotebooks().filter(r => nb.url ? r.url !== nb.url : r.label !== nb.label);
    localStorage.setItem(RECENTS_KEY, JSON.stringify([nb, ...existing].slice(0, MAX_RECENTS)));
}
function removeRecentNotebook(nb) {
    const existing = getRecentNotebooks().filter(r => nb.url ? r.url !== nb.url : r.label !== nb.label);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(existing));
}


/***/ },

/***/ "./lib/routes.js"
/*!***********************!*\
  !*** ./lib/routes.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlite_application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlite/application */ "webpack/sharing/consume/default/@jupyterlite/application/@jupyterlite/application");
/* harmony import */ var _commands__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./commands */ "./lib/commands.js");
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/application */ "webpack/sharing/consume/default/@jupyterlab/application");
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_application__WEBPACK_IMPORTED_MODULE_2__);



const ROUTE_NOT_FOUND_CMD = _commands__WEBPACK_IMPORTED_MODULE_1__.Commands.routeNotFound;
const routesPlugin = {
    id: 'jupytereverywhere:routes',
    autoStart: true,
    optional: [_jupyterlite_application__WEBPACK_IMPORTED_MODULE_0__.ILiteRouter, _jupyterlab_application__WEBPACK_IMPORTED_MODULE_2__.ILabShell],
    activate: (app, router, _labShell) => {
        if (!router) {
            return;
        }
        app.commands.addCommand(ROUTE_NOT_FOUND_CMD, {
            label: 'Open the "Not found" widget (route)',
            execute: async () => {
                await app.restored;
                await app.commands.execute(_commands__WEBPACK_IMPORTED_MODULE_1__.Commands.openNotFound);
            }
        });
        const base = router.base.replace(/\/+$/, '');
        const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const notFoundPathPatterns = [/^\/404(?:\/.*)?$/, new RegExp(`^${esc(base)}\\/404(?:\\/.*)?$`)];
        notFoundPathPatterns.forEach(pattern => router.register({ command: ROUTE_NOT_FOUND_CMD, pattern }));
        router.register({
            command: ROUTE_NOT_FOUND_CMD,
            pattern: new RegExp(`^${esc(base)}\\/?(?:index\\.html)?\\?[^#]*\\btab=404\\b(?:[&#].*)?$`)
        });
        router.register({
            command: ROUTE_NOT_FOUND_CMD,
            pattern: /^\/?(?:index\.html)?\?[^#]*\btab=404\b(?:[&#].*)?$/
        });
        void app.restored.then(() => {
            const search = window.location.search || '';
            const params = new URLSearchParams(search);
            const tab = params.get('tab');
            if (tab === '404') {
                void app.commands.execute(ROUTE_NOT_FOUND_CMD).then(() => {
                    const nfURL = new URL(`${base.replace(/\/$/, '')}/lab/404/`, window.location.origin);
                    nfURL.hash = window.location.hash;
                    window.history.replaceState(null, 'Not Found', nfURL.toString());
                });
                return;
            }
            if (tab === 'notebook') {
                const tryActivate = async () => {
                    var _a;
                    const id = (_a = document.querySelector('.jp-NotebookPanel')) === null || _a === void 0 ? void 0 : _a.id;
                    if (id) {
                        app.shell.activateById(id);
                    }
                    const nbURL = new URL(`${base.replace(/\/$/, '')}/lab/index.html`, window.location.origin);
                    nbURL.hash = window.location.hash;
                    window.history.replaceState(null, 'Notebook', nbURL.toString());
                };
                tryActivate();
            }
        });
        const here = window.location.href;
        if (notFoundPathPatterns.some(p => p.test(here))) {
            void app.restored.then(() => {
                void app.commands.execute(_commands__WEBPACK_IMPORTED_MODULE_1__.Commands.openNotFound);
            });
        }
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (routesPlugin);


/***/ },

/***/ "./lib/run-button.js"
/*!***************************!*\
  !*** ./lib/run-button.js ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InputPromptIndicator: () => (/* binding */ InputPromptIndicator),
/* harmony export */   JEInputPrompt: () => (/* binding */ JEInputPrompt)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./icons */ "./lib/icons.js");
// Most of the code in this file was inspired by the following PRs in JupyterLab upstream:
// 1. https://github.com/jupyterlab/jupyterlab/pull/16602
// 2. https://github.com/jupyterlab/jupyterlab/pull/17775



const INPUT_PROMPT_CLASS = 'jp-InputPrompt';
const INPUT_AREA_PROMPT_INDICATOR_CLASS = 'jp-InputArea-prompt-indicator';
const INPUT_AREA_PROMPT_INDICATOR_EMPTY_CLASS = 'jp-InputArea-prompt-indicator-empty';
const INPUT_AREA_PROMPT_RUN_CLASS = 'jp-InputArea-prompt-run';
class InputPromptIndicator extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__.Widget {
    constructor() {
        super();
        this._executionCount = null;
        this.addClass(INPUT_AREA_PROMPT_INDICATOR_CLASS);
    }
    get executionCount() {
        return this._executionCount;
    }
    set executionCount(value) {
        this._executionCount = value;
        if (value) {
            this.node.textContent = `[${value}]:`;
            this.removeClass(INPUT_AREA_PROMPT_INDICATOR_EMPTY_CLASS);
        }
        else {
            this.node.textContent = '[ ]:';
            this.addClass(INPUT_AREA_PROMPT_INDICATOR_EMPTY_CLASS);
        }
    }
}
class JEInputPrompt extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__.Widget {
    constructor(_app) {
        super();
        this._app = _app;
        this._customExecutionCount = null;
        this.addClass(INPUT_PROMPT_CLASS);
        const layout = (this.layout = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__.PanelLayout());
        this._promptIndicator = new InputPromptIndicator();
        layout.addWidget(this._promptIndicator);
        this._runButton = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.ToolbarButton({
            icon: _icons__WEBPACK_IMPORTED_MODULE_2__.EverywhereIcons.runCell,
            onClick: () => {
                this._app.commands.execute('notebook:run-cell');
            },
            tooltip: 'Run this cell'
        });
        this._runButton.addClass(INPUT_AREA_PROMPT_RUN_CLASS);
        this._runButton.addClass('je-cell-run-button');
        layout.addWidget(this._runButton);
    }
    get executionCount() {
        return this._customExecutionCount;
    }
    set executionCount(value) {
        this._customExecutionCount = value;
        this._promptIndicator.executionCount = value;
    }
}


/***/ },

/***/ "./lib/single-mode.js"
/*!****************************!*\
  !*** ./lib/single-mode.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   singleDocumentMode: () => (/* binding */ singleDocumentMode)
/* harmony export */ });
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/application */ "webpack/sharing/consume/default/@jupyterlab/application");
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Hard-enforce single-document mode after restore and keep the URL param in sync (?todo drop this and figure out the right schema?)
 */
const singleDocumentMode = {
    id: 'jupytereverywhere:force-single-mode',
    autoStart: true,
    optional: [_jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.IRouter, _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.ILabShell],
    activate: (app, router, labShell) => {
        if (!labShell) {
            return;
        }
        const setSingle = () => {
            if (labShell.mode !== 'single-document') {
                labShell.mode = 'single-document';
            }
            _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_1__.PageConfig.setOption('mode', 'single-document');
            const url = new URL(window.location.href);
            if (url.searchParams.get('mode') !== 'single-document') {
                url.searchParams.set('mode', 'single-document');
                const next = `${url.pathname}${url.search}${url.hash}`;
                router === null || router === void 0 ? void 0 : router.navigate(next, { skipRouting: true });
            }
        };
        // 1) After the layout has been restored, assert single mode
        void app.restored.then(() => {
            setSingle();
            // 2) If anything later toggles mode (e.g. a workspace or a command), snap back to single
            labShell.modeChanged.connect((_sender, newMode) => {
                if (newMode !== 'single-document') {
                    setSingle();
                }
            });
            // 3) Now drop mode=single-document URL param from URL
            const url = new URL(window.location.href);
            url.searchParams.delete('mode');
            const next = `${url.pathname}${url.search}${url.hash}`;
            router === null || router === void 0 ? void 0 : router.navigate(next, { skipRouting: true });
        });
    }
};


/***/ },

/***/ "./lib/ui-components/GitHubBrowserDialog.js"
/*!**************************************************!*\
  !*** ./lib/ui-components/GitHubBrowserDialog.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GitHubBrowserWidget: () => (/* binding */ GitHubBrowserWidget)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _github__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../github */ "./lib/github.js");



function GitHubBrowser({ onSelect }) {
    const [recentRepos, setRecentRepos] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(_github__WEBPACK_IMPORTED_MODULE_2__.getRecentRepos);
    const [repoInput, setRepoInput] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [owner, setOwner] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [repo, setRepo] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [breadcrumbs, setBreadcrumbs] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const [items, setItems] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [selectedPath, setSelectedPath] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const loadPath = async (o, r, path, crumbs) => {
        setLoading(true);
        setError(null);
        setSelectedPath(null);
        try {
            const result = await (0,_github__WEBPACK_IMPORTED_MODULE_2__.fetchContents)(o, r, path);
            setItems(result);
            setBreadcrumbs(crumbs);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setItems([]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleOpen = async (slug) => {
        const input = slug !== null && slug !== void 0 ? slug : repoInput;
        const parsed = (0,_github__WEBPACK_IMPORTED_MODULE_2__.parseRepoInput)(input);
        if (!parsed) {
            setError('Enter a valid GitHub repository (e.g. "owner/repo").');
            return;
        }
        const repoSlug = `${parsed.owner}/${parsed.repo}`;
        (0,_github__WEBPACK_IMPORTED_MODULE_2__.addRecentRepo)(repoSlug);
        setRecentRepos((0,_github__WEBPACK_IMPORTED_MODULE_2__.getRecentRepos)());
        setRepoInput(repoSlug);
        setOwner(parsed.owner);
        setRepo(parsed.repo);
        setError(null);
        await loadPath(parsed.owner, parsed.repo, '', [{ name: repoSlug, path: '' }]);
    };
    const handleDirClick = (item) => {
        void loadPath(owner, repo, item.path, [...breadcrumbs, { name: item.name, path: item.path }]);
    };
    const handleFileClick = (item) => {
        if (!item.download_url) {
            return;
        }
        setSelectedPath(item.path);
        onSelect(item.download_url);
    };
    const handleBreadcrumbClick = (crumb, index) => {
        void loadPath(owner, repo, crumb.path, breadcrumbs.slice(0, index + 1));
    };
    const showRecent = recentRepos.length > 0;
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "je-GitHubBrowser" },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "je-GitHubBrowser-input-row" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { className: "je-GitHubBrowser-input", type: "text", placeholder: "owner/repo or GitHub URL", value: repoInput, onChange: e => setRepoInput(e.target.value), onKeyDown: e => {
                    if (e.key === 'Enter') {
                        void handleOpen();
                    }
                }, autoFocus: true }),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { className: "je-GitHubBrowser-browse-btn", onClick: () => void handleOpen(), disabled: loading }, "Open")),
        showRecent && (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "je-GitHubBrowser-recent" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "je-GitHubBrowser-recent-label" }, "Recent:"),
            recentRepos.map(r => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { key: r, className: "je-GitHubBrowser-recent-item", onClick: () => void handleOpen(r) }, r))))),
        breadcrumbs.length > 0 && (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "je-GitHubBrowser-breadcrumb" }, breadcrumbs.map((crumb, i) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), { key: `${crumb.path}-${i}` },
            i > 0 && react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "je-GitHubBrowser-sep" }, " / "),
            i === 0 ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "je-GitHubBrowser-repo-label" }, crumb.name)) : (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "je-GitHubBrowser-crumb", onClick: () => handleBreadcrumbClick(crumb, i) }, crumb.name))))))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "je-GitHubBrowser-list" },
            loading && react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "je-GitHubBrowser-message" }, "Loading\u2026"),
            !loading && error && react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "je-GitHubBrowser-error" }, error),
            !loading && !error && items.length === 0 && breadcrumbs.length > 0 && (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "je-GitHubBrowser-message" }, "No notebooks found here.")),
            !loading &&
                items.map(item => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { key: item.path, className: [
                        'je-GitHubBrowser-item',
                        `je-GitHubBrowser-item--${item.type}`,
                        selectedPath === item.path ? 'je-GitHubBrowser-item--selected' : ''
                    ]
                        .filter(Boolean)
                        .join(' '), onClick: () => (item.type === 'dir' ? handleDirClick(item) : handleFileClick(item)) },
                    item.name,
                    item.type === 'dir' ? '/' : ''))))));
}
class GitHubBrowserWidget extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ReactWidget {
    constructor() {
        super(...arguments);
        this.onFileSelected = null;
    }
    render() {
        return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(GitHubBrowser, { onSelect: url => {
                if (this.onFileSelected) {
                    this.onFileSelected(url);
                }
            } }));
    }
}


/***/ },

/***/ "./lib/ui-components/KernelIndicator.js"
/*!**********************************************!*\
  !*** ./lib/ui-components/KernelIndicator.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KernelIndicator: () => (/* binding */ KernelIndicator)
/* harmony export */ });
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_0__);

class KernelIndicator extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_0__.Widget {
    constructor(tracker) {
        super();
        this.tracker = tracker;
        this.addClass('ck-KernelIndicator');
        tracker.currentChanged.connect(() => {
            this.connectSignals();
            this.refreshIndicator();
        });
        this.connectSignals();
        this.refreshIndicator();
    }
    connectSignals() {
        const panel = this.tracker.currentWidget;
        if (!panel) {
            return;
        }
        panel.sessionContext.statusChanged.connect(() => {
            this.refreshIndicator();
        });
        panel.sessionContext.kernelChanged.connect(() => {
            this.refreshIndicator();
        });
    }
    refreshIndicator() {
        var _a, _b, _c;
        const panel = this.tracker.currentWidget;
        if (!panel) {
            this.node.textContent = '';
            return;
        }
        const kernelName = (_c = (_b = (_a = panel.sessionContext.session) === null || _a === void 0 ? void 0 : _a.kernel) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : '';
        const status = panel.sessionContext.kernelDisplayStatus;
        let label = 'Python';
        if (kernelName === 'xr' || kernelName === 'ir') {
            label = 'R';
        }
        this.node.textContent = label;
        this.node.classList.remove('ck-kernel-starting', 'ck-kernel-ready');
        if (status === 'idle') {
            this.node.classList.add('ck-kernel-ready');
        }
        else {
            this.node.classList.add('ck-kernel-starting');
        }
    }
}


/***/ },

/***/ "./lib/ui-components/OpenDropdownButton.js"
/*!*************************************************!*\
  !*** ./lib/ui-components/OpenDropdownButton.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OpenDropdownButton: () => (/* binding */ OpenDropdownButton)
/* harmony export */ });
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);


class OpenDropdownButton extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ToolbarButton {
    constructor(commands, openFromFile, openFromURL, openNewRNotebook, openNewPythonNotebook, downloadNotebook, downloadPDF, openFromGitHub, copyShareLink, isCopyShareLinkEnabled, saveChanges, isSaveChangesEnabled, saveAs, closeNotebook, clearStorage, getRecentItems) {
        const commandOpenFile = 'jupytereverywhere:file-open-from-file';
        const commandOpenUrl = 'jupytereverywhere:file-open-from-url';
        const commandNewR = 'jupytereverywhere:file-new-r-notebook';
        const commandNewPython = 'jupytereverywhere:file-new-python-notebook';
        const commandDownload = 'jupytereverywhere:file-download-notebook';
        const commandDownloadPDF = 'jupytereverywhere:file-download-pdf';
        const commandOpenGitHub = 'jupytereverywhere:file-open-from-github';
        const commandCopyShareLink = 'jupytereverywhere:file-copy-share-link';
        const commandSaveChanges = 'jupytereverywhere:file-save-changes';
        const commandSaveAs = 'jupytereverywhere:file-save-as';
        const commandCloseNotebook = 'jupytereverywhere:file-close-notebook';
        const commandClearStorage = 'jupytereverywhere:file-clear-storage';
        if (!commands.hasCommand(commandOpenFile)) {
            commands.addCommand(commandOpenFile, {
                label: 'Open from file',
                execute: () => {
                    openFromFile();
                }
            });
        }
        if (!commands.hasCommand(commandOpenUrl)) {
            commands.addCommand(commandOpenUrl, {
                label: 'Open from URL',
                execute: () => {
                    openFromURL();
                }
            });
        }
        if (!commands.hasCommand(commandNewR)) {
            commands.addCommand(commandNewR, {
                label: 'New R notebook',
                execute: () => {
                    openNewRNotebook();
                }
            });
        }
        if (!commands.hasCommand(commandNewPython)) {
            commands.addCommand(commandNewPython, {
                label: 'New Python notebook',
                execute: () => {
                    openNewPythonNotebook();
                }
            });
        }
        if (!commands.hasCommand(commandDownload)) {
            commands.addCommand(commandDownload, {
                label: 'Download notebook',
                execute: () => {
                    downloadNotebook();
                }
            });
        }
        if (!commands.hasCommand(commandDownloadPDF)) {
            commands.addCommand(commandDownloadPDF, {
                label: 'Download as PDF',
                execute: () => {
                    downloadPDF();
                }
            });
        }
        if (!commands.hasCommand(commandOpenGitHub)) {
            commands.addCommand(commandOpenGitHub, {
                label: 'Open from GitHub',
                execute: () => {
                    openFromGitHub();
                }
            });
        }
        if (!commands.hasCommand(commandSaveChanges)) {
            commands.addCommand(commandSaveChanges, {
                label: 'Save changes',
                isEnabled: () => isSaveChangesEnabled(),
                execute: () => {
                    saveChanges();
                }
            });
        }
        if (!commands.hasCommand(commandSaveAs)) {
            commands.addCommand(commandSaveAs, {
                label: 'Save as…',
                execute: () => {
                    saveAs();
                }
            });
        }
        if (!commands.hasCommand(commandCloseNotebook)) {
            commands.addCommand(commandCloseNotebook, {
                label: 'Close notebook',
                execute: () => {
                    closeNotebook();
                }
            });
        }
        if (!commands.hasCommand(commandClearStorage)) {
            commands.addCommand(commandClearStorage, {
                label: 'Clear storage',
                execute: () => {
                    clearStorage();
                }
            });
        }
        if (!commands.hasCommand(commandCopyShareLink)) {
            commands.addCommand(commandCopyShareLink, {
                label: 'Copy link to GitHub source',
                isEnabled: () => isCopyShareLinkEnabled(),
                execute: () => {
                    copyShareLink();
                }
            });
        }
        const commandRecent = 'jupytereverywhere:open-recent';
        if (!commands.hasCommand(`${commandRecent}-0`)) {
            for (let i = 0; i < 5; i++) {
                const idx = i;
                commands.addCommand(`${commandRecent}-${idx}`, {
                    label: () => { var _a, _b; return (_b = (_a = getRecentItems()[idx]) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : ''; },
                    isVisible: () => idx < getRecentItems().length,
                    isToggled: () => { var _a, _b; return (_b = (_a = getRecentItems()[idx]) === null || _a === void 0 ? void 0 : _a.isCurrent()) !== null && _b !== void 0 ? _b : false; },
                    execute: () => {
                        var _a;
                        (_a = getRecentItems()[idx]) === null || _a === void 0 ? void 0 : _a.open();
                    }
                });
            }
        }
        super({
            label: 'File',
            tooltip: 'File actions',
            onClick: () => {
                const menu = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_0__.Menu({ commands });
                menu.addItem({ command: commandNewR });
                menu.addItem({ command: commandNewPython });
                menu.addItem({ type: 'separator' });
                menu.addItem({ command: commandOpenFile });
                menu.addItem({ command: commandOpenUrl });
                menu.addItem({ command: commandOpenGitHub });
                const recents = getRecentItems();
                if (recents.length > 0) {
                    menu.addItem({ type: 'separator' });
                    for (let i = 0; i < recents.length; i++) {
                        menu.addItem({ command: `${commandRecent}-${i}` });
                    }
                }
                menu.addItem({ type: 'separator' });
                menu.addItem({ command: commandSaveChanges });
                menu.addItem({ command: commandSaveAs });
                menu.addItem({ type: 'separator' });
                menu.addItem({ command: commandDownload });
                menu.addItem({ command: commandDownloadPDF });
                menu.addItem({ type: 'separator' });
                menu.addItem({ command: commandCopyShareLink });
                menu.addItem({ type: 'separator' });
                menu.addItem({ command: commandCloseNotebook });
                menu.addItem({ type: 'separator' });
                menu.addItem({ command: commandClearStorage });
                const anchor = this.node.getBoundingClientRect();
                menu.open(anchor.left, anchor.bottom);
                menu.aboutToClose.connect(() => {
                    // Defer dispose to avoid dispose→close→onCloseRequest→aboutToClose→dispose recursion
                    setTimeout(() => { menu.dispose(); }, 0);
                });
            }
        });
        this.addClass('je-OpenDropdownButton');
    }
}


/***/ },

/***/ "./lib/ui-components/RunDropdownButton.js"
/*!************************************************!*\
  !*** ./lib/ui-components/RunDropdownButton.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RunDropdownButton: () => (/* binding */ RunDropdownButton)
/* harmony export */ });
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);


class RunDropdownButton extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ToolbarButton {
    constructor(commands) {
        super({
            label: 'Run',
            tooltip: 'Run notebook cells',
            onClick: () => {
                const menu = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_0__.Menu({ commands });
                menu.addItem({
                    command: 'notebook:run-all-cells'
                });
                menu.addItem({
                    command: 'jupytereverywhere:run-all-above'
                });
                const anchor = this.node.getBoundingClientRect();
                menu.open(anchor.left, anchor.bottom);
                const dispose = () => {
                    menu.dispose();
                };
                menu.aboutToClose.connect(dispose);
            }
        });
        this.addClass('je-RunDropdownButton');
        commands.addCommand('jupytereverywhere:run-all-above', {
            label: 'Run all above',
            execute: async () => {
                await commands.execute('notebook:run-all-above');
            }
        });
    }
}


/***/ },

/***/ "./lib/upload.js"
/*!***********************!*\
  !*** ./lib/upload.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   detectNotebookLanguage: () => (/* binding */ detectNotebookLanguage),
/* harmony export */   handleNotebookUpload: () => (/* binding */ handleNotebookUpload),
/* harmony export */   openNotebookContent: () => (/* binding */ openNotebookContent)
/* harmony export */ });
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/coreutils */ "webpack/sharing/consume/default/@lumino/coreutils");
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Detects the language of the notebook from its metadata.
 * @param notebook - The notebook object to detect the language from.
 * @returns - 'python' if the notebook is a Python notebook, or
 * 'r' if it is an R notebook, or
 * null for indeterminate or unsupported languages (i.e., not Python and not R).
 */
function detectNotebookLanguage(notebook) {
    var _a, _b, _c, _d;
    const language = (((_b = (_a = notebook === null || notebook === void 0 ? void 0 : notebook.metadata) === null || _a === void 0 ? void 0 : _a.kernelspec) === null || _b === void 0 ? void 0 : _b.language) ||
        ((_d = (_c = notebook === null || notebook === void 0 ? void 0 : notebook.metadata) === null || _c === void 0 ? void 0 : _c.language_info) === null || _d === void 0 ? void 0 : _d.name) ||
        '')
        .toString()
        .toLowerCase();
    if (language === 'python') {
        return 'python';
    }
    if (language === 'r') {
        return 'r';
    }
    return null;
}
/**
 * Initialises the notebook upload handler. It dynamically creates a
 * hidden file input, handles reading the IPyNB, stores it in localStorage,
 * and redirects to lab/index.html with its ID.
 * @param {File} file - The notebook file (.ipynb) to upload.
 * @returns {Promise<void>} - A promise that resolves when the upload is complete.
 */
async function openNotebookContent(parsed, sourceUrl, filename) {
    const lang = detectNotebookLanguage(parsed);
    console.log(`Detected notebook language: ${lang}`);
    if (!lang) {
        await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.showErrorMessage)('Please open a valid notebook', 'Only Python and R notebooks are supported.');
        console.warn('Unsupported notebook language:', parsed);
        return;
    }
    const uploadId = _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__.UUID.uuid4();
    const serialised = JSON.stringify(parsed);
    localStorage.setItem(`uploaded-notebook:${uploadId}`, serialised);
    if (sourceUrl) {
        localStorage.setItem(`uploaded-notebook-source:${uploadId}`, sourceUrl);
    }
    if (filename) {
        localStorage.setItem(`uploaded-notebook-name:${uploadId}`, filename);
    }
    const target = new URL(window.location.href);
    target.search = '';
    target.searchParams.set('uploaded-notebook', uploadId);
    target.hash = '';
    window.location.href = target.toString();
}
async function handleNotebookUpload(file) {
    try {
        const content = await file.text();
        const parsed = JSON.parse(content);
        await openNotebookContent(parsed, undefined, file.name);
    }
    catch (err) {
        if (err instanceof DOMException && err.name === 'QuotaExceededError') {
            const result = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.showDialog)({
                title: 'Failed to upload this notebook',
                body: 'The local storage quota was exceeded.',
                buttons: [
                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Dialog.okButton(),
                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Dialog.warnButton({ label: 'Clear local storage', actions: ['clear'] })
                ]
            });
            if (result.button.actions.includes('clear')) {
                localStorage.clear();
            }
        }
        else {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.error('Failed to upload notebook:', errorMessage, err);
            await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.showErrorMessage)('Failed to upload this notebook', errorMessage);
        }
    }
}


/***/ },

/***/ "./style/icons/add.svg"
/*!*****************************!*\
  !*** ./style/icons/add.svg ***!
  \*****************************/
(module) {

module.exports = "<svg width=\"24\" height=\"23\" viewBox=\"0 0 24 23\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path d=\"M2.63806 11.2098H19.8047M11.1805 2.62842V19.7951\" stroke=\"#F47950\" stroke-width=\"4.48944\" stroke-linecap=\"round\"/>\n</svg>\n";

/***/ },

/***/ "./style/icons/fast-forward.svg"
/*!**************************************!*\
  !*** ./style/icons/fast-forward.svg ***!
  \**************************************/
(module) {

module.exports = "<svg width=\"36\" height=\"25\" viewBox=\"0 0 36 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path d=\"M16.8904 10.1358L3.40699 0.874222C2.77545 0.440406 1.95766 0.393822 1.28247 0.749026C0.604367 1.10714 0.182373 1.80882 0.182373 2.57164V22.1283C0.182373 22.894 0.604367 23.5957 1.28247 23.9509C1.95766 24.309 2.77545 24.2595 3.40699 23.8286L16.8904 14.5671C17.6209 14.0634 18.0545 13.2365 18.0545 12.3514C18.0545 11.4663 17.6209 10.6365 16.8904 10.1358Z\" fill=\"#482F87\"/>\n  <path d=\"M34.3495 10.1358L20.8661 0.874222C20.2346 0.440406 19.4168 0.393822 18.7387 0.749026C18.0635 1.10714 17.6415 1.80882 17.6415 2.57164V22.1283C17.6415 22.894 18.0635 23.5957 18.7387 23.9509C19.4168 24.309 20.2346 24.2595 20.8661 23.8286L34.3495 14.5671C35.08 14.0634 35.5136 13.2365 35.5136 12.3514C35.5136 11.4663 35.08 10.6365 34.3495 10.1358Z\" fill=\"#482F87\"/>\n</svg>\n";

/***/ },

/***/ "./style/icons/folder.svg"
/*!********************************!*\
  !*** ./style/icons/folder.svg ***!
  \********************************/
(module) {

module.exports = "<svg width=\"50\" height=\"42\" viewBox=\"0 0 50 42\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<mask id=\"mask0_14_6\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"3\" y=\"0\" width=\"21\" height=\"9\">\n<path d=\"M3.60925 0.863022H23.6871V8.7839H3.60925V0.863022Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask0_14_6)\">\n<mask id=\"mask1_14_6\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"3\" y=\"0\" width=\"21\" height=\"9\">\n<path d=\"M5.13778 0.863022H22.132C22.9759 0.863022 23.6605 1.54407 23.6605 2.38943V7.25749C23.6605 8.1002 22.9759 8.7839 22.132 8.7839H5.13778C4.2939 8.7839 3.60925 8.1002 3.60925 7.25749V2.38943C3.60925 1.54407 4.2939 0.863022 5.13778 0.863022Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask1_14_6)\">\n<path d=\"M3.60925 0.863022H23.6552V8.7839H3.60925V0.863022Z\" fill=\"#D7C1DC\"/>\n</g>\n</g>\n<mask id=\"mask2_14_6\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"19\" y=\"3\" width=\"27\" height=\"6\">\n<path d=\"M19.4121 3.74355H45.6067V8.78386H19.4121V3.74355Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask2_14_6)\">\n<mask id=\"mask3_14_6\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"19\" y=\"3\" width=\"27\" height=\"6\">\n<path d=\"M20.9406 3.74355H44.0622C44.9061 3.74355 45.5908 4.42725 45.5908 5.26995V7.25746C45.5908 8.10016 44.9061 8.78386 44.0622 8.78386H20.9406C20.0968 8.78386 19.4121 8.10016 19.4121 7.25746V5.26995C19.4121 4.42725 20.0968 3.74355 20.9406 3.74355Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask3_14_6)\">\n<path d=\"M19.4121 3.74355H45.5881V8.78386H19.4121V3.74355Z\" fill=\"#D7C1DC\"/>\n</g>\n</g>\n<mask id=\"mask4_14_6\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"10\" width=\"50\" height=\"32\">\n<path d=\"M0.270813 10.774H49.786V41.1298H0.270813V10.774Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask4_14_6)\">\n<mask id=\"mask5_14_6\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"10\" width=\"50\" height=\"32\">\n<path d=\"M3.83737 10.774H46.1743C48.1434 10.774 49.7409 12.3693 49.7409 14.3356V37.5682C49.7409 39.5345 48.1434 41.1298 46.1743 41.1298H3.83737C1.86833 41.1298 0.270813 39.5345 0.270813 37.5682V14.3356C0.270813 12.3693 1.86833 10.774 3.83737 10.774Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask5_14_6)\">\n<path d=\"M0.270813 10.774H49.786V41.1298H0.270813V10.774Z\" fill=\"#482F87\"/>\n</g>\n</g>\n</svg>\n";

/***/ },

/***/ "./style/icons/link.svg"
/*!******************************!*\
  !*** ./style/icons/link.svg ***!
  \******************************/
(module) {

module.exports = "<svg width=\"34\" height=\"16\" viewBox=\"0 0 34 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<mask id=\"mask0_link\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"34\" height=\"16\">\n<path d=\"M0.757935 0.304199H33.1641V15.8983H0.757935V0.304199Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask0_link)\">\n<mask id=\"mask1_link\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"34\" height=\"16\">\n<path d=\"M8.46732 0.304199H25.5042C29.762 0.304199 33.2136 3.75726 33.2136 8.01681C33.2136 12.2764 29.762 15.7294 25.5042 15.7294H8.46732C4.20955 15.7294 0.757935 12.2764 0.757935 8.01681C0.757935 3.75726 4.20955 0.304199 8.46732 0.304199Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask1_link)\">\n<path d=\"M8.46732 0.304199H25.5042C29.762 0.304199 33.2136 3.75726 33.2136 8.01681C33.2136 12.2764 29.762 15.7294 25.5042 15.7294H8.46732C4.20955 15.7294 0.757935 12.2764 0.757935 8.01681C0.757935 3.75726 4.20955 0.304199 8.46732 0.304199Z\" stroke=\"#F47950\" stroke-width=\"6.70462\"/>\n</g>\n</g>\n<path d=\"M22.4252 8.07462H11.6047M13.6855 2.03613H10.2688M13.6797 14.1131H8.42371M24.378 14.0578H20.9613M24.378 2.03613H20.9613\" stroke=\"#F47950\" stroke-width=\"3.35231\" stroke-linecap=\"round\"/>\n</svg>\n";

/***/ },

/***/ "./style/icons/refresh.svg"
/*!*********************************!*\
  !*** ./style/icons/refresh.svg ***!
  \*********************************/
(module) {

module.exports = "<svg width=\"29\" height=\"29\" viewBox=\"10 0 90 90\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path d=\"M 75 25 A 35 35 0 1 1 50 15\"\n        fill=\"none\"\n        stroke=\"#482F87\"\n        stroke-width=\"10\"\n        stroke-linecap=\"round\"/>\n  <path\n     d=\"M 65 15 L 44 2 L 44 28 Z\"\n     fill=\"#482F87\"\n        stroke=\"#482F87\"\n        stroke-width=\"4\"\n        stroke-linecap=\"round\"\n        stroke-linejoin=\"round\" />\n</svg>\n";

/***/ },

/***/ "./style/icons/run-cell.svg"
/*!**********************************!*\
  !*** ./style/icons/run-cell.svg ***!
  \**********************************/
(module) {

module.exports = "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M0 20C0 14.6957 2.10714 9.60859 5.85786 5.85786C9.60859 2.10714 14.6957 0 20 0C25.3043 0 30.3914 2.10714 34.1421 5.85786C37.8929 9.60859 40 14.6957 40 20C40 25.3043 37.8929 30.3914 34.1421 34.1421C30.3914 37.8929 25.3043 40 20 40C14.6957 40 9.60859 37.8929 5.85786 34.1421C2.10714 30.3914 0 25.3043 0 20ZM14.7109 11.4922C14.1172 11.8203 13.75 12.4531 13.75 13.125V26.875C13.75 27.5547 14.1172 28.1797 14.7109 28.5078C15.3047 28.8359 16.0234 28.8281 16.6094 28.4688L27.8594 21.5938C28.4141 21.25 28.7578 20.6484 28.7578 19.9922C28.7578 19.3359 28.4141 18.7344 27.8594 18.3906L16.6094 11.5156C16.0312 11.1641 15.3047 11.1484 14.7109 11.4766V11.4922Z\" fill=\"#F47950\"/>\n</svg>\n";

/***/ },

/***/ "./style/icons/run.svg"
/*!*****************************!*\
  !*** ./style/icons/run.svg ***!
  \*****************************/
(module) {

module.exports = "<svg width=\"20\" height=\"27\" viewBox=\"0 0 20 27\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path d=\"M18.5635 11.1352L3.67151 0.907043C3.03998 0.473227 2.22218 0.426643 1.54699 0.781848C0.868893 1.13705 0.446899 1.83873 0.446899 2.60446V24.0973C0.446899 24.8601 0.868893 25.5618 1.54699 25.9199C2.22218 26.2751 3.03998 26.2285 3.67151 25.7947L18.5635 15.5665C19.294 15.0628 19.7305 14.236 19.7305 13.3509C19.7305 12.4658 19.294 11.636 18.5635 11.1352Z\" fill=\"#482F87\"/>\n</svg>\n";

/***/ },

/***/ "./style/icons/save.svg"
/*!******************************!*\
  !*** ./style/icons/save.svg ***!
  \******************************/
(module) {

module.exports = "<svg width=\"36\" height=\"34\" viewBox=\"0 0 36 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<mask id=\"mask0_0_1\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"2\" y=\"2\" width=\"32\" height=\"32\">\n<path d=\"M2.1217 2.13928H33.2183V33.4439H2.1217V2.13928Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask0_0_1)\">\n<mask id=\"mask1_0_1\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"1\" y=\"1\" width=\"33\" height=\"33\">\n<path d=\"M1.56323 11.6424V23.8125C1.56323 29.3706 6.06547 33.8747 11.6212 33.8747H23.7863C29.342 33.8747 33.8443 29.3706 33.8443 23.8125V11.6424C33.8443 6.08432 29.342 1.5802 23.7863 1.5802H11.6212C6.06547 1.5802 1.56323 6.08432 1.56323 11.6424Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask1_0_1)\">\n<mask id=\"mask2_0_1\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"2\" y=\"2\" width=\"32\" height=\"32\">\n<path d=\"M12.2909 2.24988H23.1172C28.673 2.24988 33.1752 6.75691 33.1752 12.3121V23.1429C33.1752 28.701 28.673 33.2051 23.1172 33.2051H12.2909C6.73805 33.2051 2.23291 28.701 2.23291 23.1429V12.3121C2.23291 6.75691 6.73805 2.24988 12.2909 2.24988Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask2_0_1)\">\n<path d=\"M1.66821 1.68506H33.8736V33.9039H1.66821V1.68506Z\" fill=\"white\"/>\n<path d=\"M1.56628 1.58313V34.0058H33.9754V1.58313H1.56628ZM33.7717 33.802H1.77001V1.78694H33.7717V33.802Z\" fill=\"black\"/>\n</g>\n</g>\n</g>\n<mask id=\"mask3_0_1\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"36\" height=\"21\">\n<path d=\"M0.00012207 0.535034H35.1973V20.6216H0.00012207V0.535034Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask3_0_1)\">\n<path d=\"M0.00012207 0.535034H35.2148V20.6216H0.00012207V0.535034Z\" fill=\"white\"/>\n</g>\n<mask id=\"mask4_0_1\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"3\" y=\"3\" width=\"30\" height=\"30\">\n<path d=\"M3 3H32.3242V32.0133H3V3Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask4_0_1)\">\n<mask id=\"mask5_0_1\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"3\" y=\"3\" width=\"30\" height=\"30\">\n<path d=\"M6.91144 3H28.3254C29.3615 3 30.3568 3.41344 31.0902 4.14714C31.8236 4.88084 32.2369 5.87658 32.2369 6.91308V28.1002C32.2369 29.1396 31.8236 30.1353 31.0902 30.869C30.3568 31.6027 29.3615 32.0133 28.3254 32.0133H6.91144C5.87538 32.0133 4.88005 31.6027 4.14666 30.869C3.41326 30.1353 3 29.1396 3 28.1002V6.91308C3 5.87658 3.41326 4.88084 4.14666 4.14714C4.88005 3.41344 5.87538 3 6.91144 3Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask5_0_1)\">\n<path d=\"M3 3H32.2281V32.0133H3V3Z\" fill=\"#482F87\"/>\n</g>\n</g>\n<mask id=\"mask6_0_1\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"7\" y=\"4\" width=\"18\" height=\"7\">\n<path d=\"M7.61572 4.22607H24.705V10.5412H7.61572V4.22607Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask6_0_1)\">\n<mask id=\"mask7_0_1\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"7\" y=\"4\" width=\"18\" height=\"7\">\n<path d=\"M8.73328 4.22607H23.5816C24.1986 4.22607 24.6992 4.72686 24.6992 5.3441V9.42313C24.6992 10.0404 24.1986 10.5412 23.5816 10.5412H8.73328C8.11629 10.5412 7.61572 10.0404 7.61572 9.42313V5.3441C7.61572 4.72686 8.11629 4.22607 8.73328 4.22607Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask7_0_1)\">\n<path d=\"M7.61572 4.22607H24.705V10.5412H7.61572V4.22607Z\" fill=\"white\"/>\n</g>\n</g>\n<mask id=\"mask8_0_1\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"10\" y=\"16\" width=\"16\" height=\"15\">\n<path d=\"M10.0547 16.2563H25.2348V30.7644H10.0547V16.2563Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask8_0_1)\">\n<mask id=\"mask9_0_1\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"10\" y=\"16\" width=\"16\" height=\"15\">\n<path d=\"M11.1722 16.2563H24.0649C24.6848 16.2563 25.1824 16.7571 25.1824 17.3744V29.6464C25.1824 30.2637 24.6848 30.7644 24.0649 30.7644H11.1722C10.5523 30.7644 10.0547 30.2637 10.0547 29.6464V17.3744C10.0547 16.7571 10.5523 16.2563 11.1722 16.2563Z\" fill=\"white\"/>\n</mask>\n<g mask=\"url(#mask9_0_1)\">\n<path d=\"M10.0547 16.2563H25.1766V30.7644H10.0547V16.2563Z\" fill=\"white\"/>\n</g>\n</g>\n</svg>\n";

/***/ },

/***/ "./style/icons/stop.svg"
/*!******************************!*\
  !*** ./style/icons/stop.svg ***!
  \******************************/
(module) {

module.exports = "<svg width=\"26\" height=\"26\" viewBox=\"0 0 26 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path d=\"M3.90412 0.10791H21.7588C22.7978 0.10791 23.7931 0.521346 24.5265 1.25505C25.2599 1.98875 25.6703 2.98449 25.6703 4.02099V21.4231C25.6703 22.4625 25.2599 23.4583 24.5265 24.192C23.7931 24.9257 22.7978 25.3362 21.7588 25.3362H3.90412C2.86805 25.3362 1.87273 24.9257 1.13933 24.192C0.405938 23.4583 -0.00732422 22.4625 -0.00732422 21.4231V4.02099C-0.00732422 2.98449 0.405938 1.98875 1.13933 1.25505C1.87273 0.521346 2.86805 0.10791 3.90412 0.10791Z\" fill=\"#482F87\"/>\n</svg>\n";

/***/ }

}]);
//# sourceMappingURL=lib_index_js.766e31ca6b4dc97e9065.js.map