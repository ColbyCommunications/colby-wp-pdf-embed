/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*global ActiveXObject, window, console, define, module, jQuery */
//jshint unused:false, strict: false

/*
    PDFObject v2.0.201604172
    https://github.com/pipwerks/PDFObject
    Copyright (c) 2008-2016 Philip Hutchison
    MIT-style license: http://pipwerks.mit-license.org/
    UMD module pattern from https://github.com/umdjs/umd/blob/master/templates/returnExports.js
*/

(function (root, factory) {
    if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.PDFObject = factory();
    }
})(undefined, function () {

    "use strict";
    //jshint unused:true

    //PDFObject is designed for client-side (browsers), not server-side (node)
    //Will choke on undefined navigator and window vars when run on server
    //Return boolean false and exit function when running server-side

    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return false;
    }

    var pdfobjectversion = "2.0.201604172",
        supportsPDFs,


    //declare functions
    createAXO,
        isIE,
        supportsPdfMimeType = typeof navigator.mimeTypes['application/pdf'] !== "undefined",
        supportsPdfActiveX,
        buildFragmentString,
        log,
        embedError,
        _embed,
        getTargetElement,
        generatePDFJSiframe,
        isIOS = function () {
        return (/iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase())
        );
    }(),
        generateEmbedElement;

    /* ----------------------------------------------------
       Supporting functions
       ---------------------------------------------------- */

    createAXO = function createAXO(type) {
        var ax;
        try {
            ax = new ActiveXObject(type);
        } catch (e) {
            ax = null; //ensure ax remains null
        }
        return ax;
    };

    //IE11 still uses ActiveX for Adobe Reader, but IE 11 doesn't expose
    //window.ActiveXObject the same way previous versions of IE did
    //window.ActiveXObject will evaluate to false in IE 11, but "ActiveXObject" in window evaluates to true
    //so check the first one for older IE, and the second for IE11
    //FWIW, MS Edge (replacing IE11) does not support ActiveX at all, both will evaluate false
    //Constructed as a method (not a prop) to avoid unneccesarry overhead -- will only be evaluated if needed
    isIE = function isIE() {
        return !!(window.ActiveXObject || "ActiveXObject" in window);
    };

    //If either ActiveX support for "AcroPDF.PDF" or "PDF.PdfCtrl" are found, return true
    //Constructed as a method (not a prop) to avoid unneccesarry overhead -- will only be evaluated if needed
    supportsPdfActiveX = function supportsPdfActiveX() {
        return !!(createAXO("AcroPDF.PDF") || createAXO("PDF.PdfCtrl"));
    };

    //Determines whether PDF support is available
    supportsPDFs = supportsPdfMimeType || isIE() && supportsPdfActiveX();

    //Create a fragment identifier for using PDF Open parameters when embedding PDF
    buildFragmentString = function buildFragmentString(pdfParams) {

        var string = "",
            prop;

        if (pdfParams) {

            for (prop in pdfParams) {
                if (pdfParams.hasOwnProperty(prop)) {
                    string += encodeURIComponent(prop) + "=" + encodeURIComponent(pdfParams[prop]) + "&";
                }
            }

            //The string will be empty if no PDF Params found
            if (string) {

                string = "#" + string;

                //Remove last ampersand
                string = string.slice(0, string.length - 1);
            }
        }

        return string;
    };

    log = function log(msg) {
        if (typeof console !== "undefined" && console.log) {
            console.log("[PDFObject] " + msg);
        }
    };

    embedError = function embedError(msg) {
        log(msg);
        return false;
    };

    getTargetElement = function getTargetElement(targetSelector) {

        //Default to body for full-browser PDF
        var targetNode = document.body;

        //If a targetSelector is specified, check to see whether
        //it's passing a selector, jQuery object, or an HTML element

        if (typeof targetSelector === "string") {

            //Is CSS selector
            targetNode = document.querySelector(targetSelector);
        } else if (typeof jQuery !== "undefined" && targetSelector instanceof jQuery && targetSelector.length) {

            //Is jQuery element. Extract HTML node
            targetNode = targetSelector.get(0);
        } else if (typeof targetSelector.nodeType !== "undefined" && targetSelector.nodeType === 1) {

            //Is HTML element
            targetNode = targetSelector;
        }

        return targetNode;
    };

    generatePDFJSiframe = function generatePDFJSiframe(targetNode, url, pdfOpenFragment, PDFJS_URL, id) {

        var fullURL = PDFJS_URL + "?file=" + encodeURIComponent(url) + pdfOpenFragment;
        var scrollfix = isIOS ? "-webkit-overflow-scrolling: touch; overflow-y: scroll; " : "overflow: hidden; ";
        var iframe = "<div style='" + scrollfix + "position: absolute; top: 0; right: 0; bottom: 0; left: 0;'><iframe  " + id + " src='" + fullURL + "' style='border: none; width: 100%; height: 100%;' frameborder='0'></iframe></div>";
        targetNode.className += " pdfobject-container";
        targetNode.style.position = "relative";
        targetNode.style.overflow = "auto";
        targetNode.innerHTML = iframe;
        return targetNode.getElementsByTagName("iframe")[0];
    };

    generateEmbedElement = function generateEmbedElement(targetNode, targetSelector, url, pdfOpenFragment, width, height, id) {

        var style = "";

        if (targetSelector && targetSelector !== document.body) {
            style = "width: " + width + "; height: " + height + ";";
        } else {
            style = "position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%;";
        }

        targetNode.className += " pdfobject-container";
        targetNode.innerHTML = "<embed " + id + " class='pdfobject' src='" + url + pdfOpenFragment + "' type='application/pdf' style='overflow: auto; " + style + "'/>";

        return targetNode.getElementsByTagName("embed")[0];
    };

    _embed = function embed(url, targetSelector, options) {

        //Ensure URL is available. If not, exit now.
        if (typeof url !== "string") {
            return embedError("URL is not valid");
        }

        //If targetSelector is not defined, convert to boolean
        targetSelector = typeof targetSelector !== "undefined" ? targetSelector : false;

        //Ensure options object is not undefined -- enables easier error checking below
        options = typeof options !== "undefined" ? options : {};

        //Get passed options, or set reasonable defaults
        var id = options.id && typeof options.id === "string" ? "id='" + options.id + "'" : "",
            page = options.page ? options.page : false,
            pdfOpenParams = options.pdfOpenParams ? options.pdfOpenParams : {},
            fallbackLink = typeof options.fallbackLink !== "undefined" ? options.fallbackLink : true,
            width = options.width ? options.width : "100%",
            height = options.height ? options.height : "100%",
            forcePDFJS = typeof options.forcePDFJS === "boolean" ? options.forcePDFJS : false,
            PDFJS_URL = options.PDFJS_URL ? options.PDFJS_URL : false,
            targetNode = getTargetElement(targetSelector),
            fallbackHTML = "",
            pdfOpenFragment = "",
            fallbackHTML_default = "<p>This browser does not support inline PDFs. Please download the PDF to view it: <a href='[url]'>Download PDF</a></p>";

        //If target element is specified but is not valid, exit without doing anything
        if (!targetNode) {
            return embedError("Target element cannot be determined");
        }

        //page option overrides pdfOpenParams, if found
        if (page) {
            pdfOpenParams.page = page;
        }

        //Stringify optional Adobe params for opening document (as fragment identifier)
        pdfOpenFragment = buildFragmentString(pdfOpenParams);

        //Do the dance
        if (forcePDFJS && PDFJS_URL) {

            return generatePDFJSiframe(targetNode, url, pdfOpenFragment, PDFJS_URL, id);
        } else if (supportsPDFs) {

            return generateEmbedElement(targetNode, targetSelector, url, pdfOpenFragment, width, height, id);
        } else {

            if (PDFJS_URL) {

                return generatePDFJSiframe(targetNode, url, pdfOpenFragment, PDFJS_URL, id);
            } else if (fallbackLink) {

                fallbackHTML = typeof fallbackLink === "string" ? fallbackLink : fallbackHTML_default;
                targetNode.innerHTML = fallbackHTML.replace(/\[url\]/g, url);
            }

            return embedError("This browser does not support embedded PDFs");
        }
    };

    return {
        embed: function embed(a, b, c) {
            return _embed(a, b, c);
        },
        pdfobjectversion: function () {
            return pdfobjectversion;
        }(),
        supportsPDFs: function () {
            return supportsPDFs;
        }()
    };
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _pdfobject = __webpack_require__(0);

var _pdfobject2 = _interopRequireDefault(_pdfobject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var init = function init() {
  Array.prototype.forEach.call(document.querySelectorAll('[data-pdf-embed]'), function (container) {
    _pdfobject2.default.embed(container.getAttribute('data-url'), '#' + container.getAttribute('id'), {
      height: '600px',
      pdfOpenParams: { view: 'FitV' }
    });
  });
};

window.addEventListener('load', init);

/***/ })
/******/ ]);