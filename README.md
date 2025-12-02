# Application Preferences plugin for Cordova iOS #

Use this Cordova plugin to read and store iOS application preferences.

## Getting started

Once you're familiar with that process, you may install this plugin with the [Cordova CLI](https://cordova.apache.org/docs/en/dev/guide/cli/index.html):


# [Settings.bundle](src/ios/Settings.bundle)

The preference must exist in a settings bundle and Root.plist in your project.
1. Install dependency

```shell
    npm i @herdwatch/cordova-plugin-ios-preferences
```

1. Copy example `resources/ios/Settings.bundle`

```shell
    cp -R  node_modules/@herdwatch/cordova-plugin-ios-preferences/src/ios/Settings.bundle resources/ios
```

1. Update the Settings Bundle  `resources/ios/Settings.bundle/Root.plist`
https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/UserDefaults/Preferences/Preferences.html

1. Install plugin 

```shell
cordova plugin add @herdwatch-apps/cordova-plugin-ios-preferences

ionic cordova plugin add @herdwatch-apps/cordova-plugin-ios-preferences

```

## Using the plugin

The plugin creates the object `applicationPreferences` with two methods `get(key, success, fail)` and 
`set(key, value, success, fail)`. `key` is the name of the setting you want, `value` is the value of the setting you want to set.

`success` and `fail` are callback functions. Success is passed the settings value as a string.

A full get example could be:
```js
    applicationPreferences.get('preferencekey', function(result) {
      alert("We got a setting: " + result);
    }, 
    function(error) {
      alert("Failed to retrieve a setting: " + error);
    });
    // Or using await with promises
    await applicationPreferences.withPromises.get('preferencekey');
```

A full set example could be:
```js
    applicationPreferences.set('preferencekey', 'preferencevalue', function() {
      alert("It is saved");
    }, 
    function(error) {
      alert("Failed to retrieve a setting: " + error);
    });
    // Or using await with promises
    await applicationPreferences.withPromises.set('preferencekey', 'preferencevalue');
```



