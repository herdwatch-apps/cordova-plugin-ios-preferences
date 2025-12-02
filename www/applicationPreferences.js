const exec = require("cordova/exec");

module.exports = {
  /**
   * Reads iOS application preferences
   *
   * @param key {string} The key of the preference
   * @param success {function} The callback invoked after the preference value has been retrieved
   * @param fail {function} The callback invoked if retrieving the preference value has been failed
   */
  get: function (key, success, fail) {
    const args = {key: key};
    exec(success, fail, "ApplicationPreferences", "getSetting", [args]);
  },
  /**
   * Stores iOS application preferences
   *
   * @param key {string} The key of the preference
   * @param value {string} The value of the preference, only string values are supported
   * @param success {function} The callback invoked after the preference value has been stored
   * @param fail {function} The callback invoked if storing the preference value has been failed
   */
  set: function (key, value, success, fail) {
    const args = {key: key, value: value};
    exec(success, fail, "ApplicationPreferences", "setSetting", [args]);
  },
};

module.exports.withPromises = {
  get: function (key) {
    return new Promise(function (resolve, reject) {
      module.exports.get(key, resolve, reject);
    });
  },
  set: function (key, value) {
    return new Promise(function (resolve, reject) {
      module.exports.set(key, value, resolve, reject);
    });
  },
}
