var fs = require("fs");
var path = require("path");
var xcode = require("xcode");
var utilities = require("../lib/utilities");

module.exports = {

  getAppFolderName: function () {
    var configName = utilities.getAppName();
    if (fs.existsSync(path.join("platforms", "ios", configName))) {
      return configName;
    }
    // Since cordova-ios 8.0.0 the generated Xcode project/target is always named "App",
    // regardless of the <name> set in config.xml.
    return "App";
  },

  getXcodeProjectPath: function () {
    return path.join("platforms", "ios", module.exports.getAppFolderName() + ".xcodeproj", "project.pbxproj");
  },

  addSettingsBundle: function (context, xcodeProjectPath) {
    const appName = module.exports.getAppFolderName();
    const settingsDirectorySource = `${context.opts.projectRoot}/resources/ios/Settings.bundle`;
    const settingsDirectoryTarget = `platforms/ios/${appName}/Resources/Settings.bundle`;
    const xcodeProject = xcode.project(xcodeProjectPath);
    xcodeProject.parseSync();

    if (utilities.directoryExists(settingsDirectorySource)) {
      utilities.log(`Preparing Settings.bundle on iOS`);
      try {
        fs.cpSync(settingsDirectorySource, settingsDirectoryTarget, {recursive: true});
        const appPBXGroup = xcodeProject.findPBXGroupKey({name: 'Resources'}) || xcodeProject.findPBXGroupKey({path: 'Resources'});
        const resourceFile = xcodeProject.addResourceFile('Settings.bundle', {
          lastKnownFileType: 'wrapper.plug-in',
          name: 'Settings.bundle',
        }, appPBXGroup);
        // addResourceFile answers false when the reference is already in the project, which is
        // every prepare after the first.
        if (resourceFile) {
          // `xcode` writes every field of its file reference, so an option it was not given lands
          // in project.pbxproj as the bare token `undefined` -- which Xcode reads as a file type
          // name. The bundle is copied either way; this keeps the generated project honest.
          const fileReference = xcodeProject.pbxFileReferenceSection()[resourceFile.fileRef];
          delete fileReference.fileEncoding;
          delete fileReference.explicitFileType;
        }
        fs.writeFileSync(path.resolve(xcodeProjectPath), xcodeProject.writeSync());
      } catch (error) {
        utilities.error(error);
      }
    }
  },

  removeSettingsBundle: function (context, xcodeProjectPath) {
    const appName = module.exports.getAppFolderName();
    const appSettingsDirectoryDirectory = `platforms/ios/${appName}/Resources/Settings.bundle`;
    const xcodeProject = xcode.project(xcodeProjectPath);
    xcodeProject.parseSync();
    if (utilities.directoryExists(appSettingsDirectoryDirectory)) {
      utilities.log(`Remove Settings.bundle`);
      const appPBXGroup = xcodeProject.findPBXGroupKey({name: 'Resources'}) || xcodeProject.findPBXGroupKey({path: 'Resources'});
      xcodeProject.removeResourceFile('Settings.bundle', {
        lastKnownFileType: 'wrapper.plug-in',
        name: 'Settings.bundle',
      }, appPBXGroup);
      fs.writeFileSync(path.resolve(xcodeProjectPath), xcodeProject.writeSync());
      fs.rmSync(appSettingsDirectoryDirectory, {recursive: true});
    }
  },

};
