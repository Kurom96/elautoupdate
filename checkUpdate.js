'use strict';

var app = require("electron").app;
var autoUpdater = require("electron").autoUpdater;
var dialog = require("electron").dialog;


function confirmRestart(releaseNotes) {
    return new Promise(function (resolve, reject) {
        dialog.showMessageBox({
            type: "info",
            title: "Update Available",
            message: "アプリの更新があります。",
            detail: releaseNotes,
            buttons: ["Restart", "Later"]
        }, function (response) {
            if (response === 0) {
                resolve();
            } else {
                reject();
            }
        });
    });
}

function checkUpdate() {
    var feedURL = "https://elautoupdate.herokuapp.com/update/darwin_" + process.arch + "/" + app.getVersion();
    console.log(feedURL);

    autoUpdater.on("update-downloaded", function (event, releaseNotes) {
        confirmRestart(releaseNotes).then(function () {
            autoUpdater.quitAndInstall();
        });
    });

    autoUpdater.on("error", function (e) {
        console.error(e.message);
    });

    autoUpdater.setFeedURL(feedURL);
    autoUpdater.checkForUpdates();
}

module.exports = checkUpdate;