/* jslint node: true */
"use strict";

var fileNameParser = (function () {
    return {
        getExtension: function (fileName) {
            var splitedString = fileName.split('.');
            var extension = splitedString[splitedString.length - 1];
            return extension;
        }
    };
})();

module.exports = fileNameParser;
