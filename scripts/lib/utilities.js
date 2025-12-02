/**
 * Utilities and shared functionality for the build hooks.
 */
var fs = require('fs');
var path = require("path");
var parser = require('xml-js');

var _configXml;
const PLUGIN_ID = '@herdwatch/cordova-plugin-ios-preferences';

var Utilities = {};

Utilities.parseConfigXml = function () {
  if (_configXml) return _configXml;
  _configXml = Utilities.parseXmlFileToJson("config.xml");
  return _configXml;
};

Utilities.parseXmlFileToJson = function (filepath, parseOpts) {
  parseOpts = parseOpts || {compact: true};
  return JSON.parse(parser.xml2json(fs.readFileSync(path.resolve(filepath), 'utf-8'), parseOpts));
};

Utilities.getAppName = function () {
  return Utilities.parseConfigXml().widget.name._text.toString().trim();
};

Utilities.getPreferenceValue = function (name) {
  var config = Utilities.parseConfigXml()
  var retainAssetsPattern = config.widget.preference.find(preference => preference._attributes.name === name);
  if (retainAssetsPattern) {
    return retainAssetsPattern._attributes.value
  }
  return null;
}

Utilities.directoryExists = function (dirPath) {
  try {
    return fs.statSync(path.resolve(dirPath)).isDirectory();
  } catch (e) {
    return false;
  }
};

Utilities.log = function (msg) {
  console.log(PLUGIN_ID + ': ' + msg);
};

Utilities.warn = function (msg) {
  console.warn(PLUGIN_ID + ': ' + msg);
};

Utilities.error = function (msg) {
  console.error(PLUGIN_ID + ': ' + msg);
};

module.exports = Utilities;
