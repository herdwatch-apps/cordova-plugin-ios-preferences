# Example app

A one-screen Cordova app that exercises the plugin on an iOS simulator or a device. It exists so a
question about the plugin can be answered without the host app around it, and so a change to the
native side can be measured rather than argued about.

It reads `preferencekey`, the key declared by the example `Settings.bundle` this repository ships,
and it also reads a key no `Settings.bundle` declares — so both the success and the failure path are
exercised on every launch.

## Running it

```shell
cd example
npm install
npm run setup          # copies ../src/ios/Settings.bundle into resources/ios
npx cordova platform add ios --nosave
npm run build
```

`npm run setup` has to run before the platform is added: the install hook copies
`resources/ios/Settings.bundle` into the generated Xcode project, and does nothing at all when that
directory is absent.

Install and launch the built app on a booted simulator:

```shell
xcrun simctl install booted platforms/ios/build/Debug-iphonesimulator/PrefsExample.app
xcrun simctl launch booted com.example.iospreferences
```

## What it reports

Each call records which callback the plugin actually invoked, and the page re-reads whenever the app
comes back to the foreground. The outcome of a call is one of:

| Outcome | Meaning |
| --- | --- |
| `success` | the success callback fired, and `value` is what the plugin returned |
| `fail` | the error callback fired, and `value` is the reason |
| `NEITHER CALLBACK FIRED` | nothing was called within four seconds, so the promise a caller awaits would never settle |

That last row is the one worth watching. A plugin result sent with `CDVCommandStatus_NO_RESULT` is
documented by cordova-ios as "remove a callback from the list without calling the callbacks", so a
caller is left waiting forever with nothing reporting it. Reading a key that does not exist should
report `fail`, never `NEITHER CALLBACK FIRED`.

## Checking a value set outside the app

The page is also the quickest way to see that a change made in the Settings app reaches a running
process:

1. launch the app and note the value it reports;
2. open **Settings > Apps > Prefs** and change the preference;
3. return to the app — it re-reads on `resume` and shows the new value.

iOS does not restart an app when a `Settings.bundle` value changes, so an app that reads the
preference only once, at startup, will not notice step 2 at all.
