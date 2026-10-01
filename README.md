# Application Preferences plugin for Cordova iOS #

## Why this fork exists

Forked from [upstream](https://github.com/escio/cordova-ios-application-preferences) because the original plugin used a deprecated `writeJavascript` callback bridge and had no automated way to wire a `Settings.bundle` into the host app's Xcode project.

Published as [`@herdwatch/cordova-plugin-ios-preferences`](https://www.npmjs.com/package/@herdwatch/cordova-plugin-ios-preferences).

Changes from upstream:
- Rewrote the native iOS plugin (`applicationPreferences` → `ApplicationPreferences.h`/`.m`) to reply via `CDVPluginResult`/`commandDelegate` instead of the deprecated `writeJavascript` bridge.
- Added a `withPromises` wrapper (`get`/`set`) to the JS API alongside the original callback style.
- Added Cordova install/uninstall hook scripts (`scripts/ios/*`, new `xcode`/`xml-js` dependencies) that automatically add a `Settings.bundle` to the host app's Xcode project.
- Added `package.json` (none existed upstream), an example `Settings.bundle`, and an MIT `LICENSE`.
- Reported a failed `get` or `set` with `CDVCommandStatus_ERROR` rather than `CDVCommandStatus_NO_RESULT`, so the failure actually reaches the caller — see [Failures](#failures).
- Added an [example app](example) that exercises both the success and the failure path on a simulator or a device.

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

## Failures

A `get` for a key that no `Settings.bundle` declares, and anything else the native side cannot do,
reaches the `fail` callback — and rejects the `withPromises` form. The reason is a string, for
example `Key not found`.

This used to be reported with `CDVCommandStatus_NO_RESULT`, which cordova-ios documents as
"remove a callback from the list without calling the callbacks": neither callback fired, so a
`withPromises` call never settled and `await` on it waited forever with nothing reporting why.
Measured on an iPhone 16 running iOS 26.3 with cordova-ios 8.1.1, before and after: a missing key
went from no callback at all within four seconds to `fail` with `Key not found` in one millisecond.

If you support versions of this plugin older than 1.0.8, put a timeout around the read rather than
relying on a `catch`, because there is nothing to catch.

## Example app

[`example/`](example) is a one-screen Cordova app that calls the plugin directly and shows which
callback each call actually invoked. Use it to check a native change on a simulator or a device
without a host app around it. See [its README](example/README.md) for the commands.
