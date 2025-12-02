var fs = require("fs");
var path = require("path");
var xcode = require("xcode");
var utilities = require("../lib/utilities");

module.exports = {

  getXcodeProjectPath: function () {
    return path.join("platforms", "ios", utilities.getAppName() + ".xcodeproj", "project.pbxproj");
  },

  addSettingsBundle: function (context, xcodeProjectPath) {
    const appName = utilities.getAppName();
    const settingsDirectorySource = `${context.opts.projectRoot}/resources/ios/Settings.bundle`;
    const settingsDirectoryTarget = `platforms/ios/${appName}/Resources/Settings.bundle`;
    const xcodeProject = xcode.project(xcodeProjectPath);
    xcodeProject.parseSync();

    if (utilities.directoryExists(settingsDirectorySource)) {
      utilities.log(`Preparing Settings.bundle on iOS`);
      try {
        fs.cpSync(settingsDirectorySource, settingsDirectoryTarget, {recursive: true});
        const appPBXGroup = xcodeProject.findPBXGroupKey({name: 'Resources'});
        const addResourceFile = xcodeProject.addResourceFile('Settings.bundle', {
          lastKnownFileType: 'wrapper.plug-in',
          name: 'Settings.bundle',
        }, appPBXGroup);
        console.log(addResourceFile);
        fs.writeFileSync(path.resolve(xcodeProjectPath), xcodeProject.writeSync());
      } catch (error) {
        utilities.error(error);
      }
    }
  },

  removeSettingsBundle: function (context, xcodeProjectPath) {
    const appName = utilities.getAppName();
    const appSettingsDirectoryDirectory = `platforms/ios/${appName}/Resources/Settings.bundle`;
    const xcodeProject = xcode.project(xcodeProjectPath);
    xcodeProject.parseSync();
    if (utilities.directoryExists(appSettingsDirectoryDirectory)) {
      utilities.log(`Remove Settings.bundle`);
      const appPBXGroup = xcodeProject.findPBXGroupKey({name: 'Resources'});
      xcodeProject.removeResourceFile('Settings.bundle', {
        lastKnownFileType: 'wrapper.plug-in',
        name: 'Settings.bundle',
      }, appPBXGroup);
      fs.writeFileSync(path.resolve(xcodeProjectPath), xcodeProject.writeSync());
      fs.rmSync(appSettingsDirectoryDirectory, {recursive: true});
    }
  },

};
