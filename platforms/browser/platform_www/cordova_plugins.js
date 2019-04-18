cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/code-push/script/acquisition-sdk.js",
        "id": "code-push.AcquisitionManager",
        "pluginId": "code-push",
        "merges": [
            "window"
        ]
    },
    {
        "file": "plugins/cordova-call/www/CordovaCall.js",
        "id": "cordova-call.CordovaCall",
        "pluginId": "cordova-call",
        "clobbers": [
            "cordova.plugins.CordovaCall"
        ]
    },
    {
        "file": "plugins/cordova-plugin-app-version/www/AppVersionPlugin.js",
        "id": "cordova-plugin-app-version.AppVersionPlugin",
        "pluginId": "cordova-plugin-app-version",
        "clobbers": [
            "cordova.getAppVersion"
        ]
    },
    {
        "file": "plugins/cordova-plugin-appcenter-shared/www/AppCenter.js",
        "id": "cordova-plugin-appcenter-shared.AppCenter",
        "pluginId": "cordova-plugin-appcenter-shared",
        "clobbers": [
            "AppCenter"
        ]
    },
    {
        "file": "plugins/cordova-plugin-appcenter-analytics/www/Analytics.js",
        "id": "cordova-plugin-appcenter-analytics.Analytics",
        "pluginId": "cordova-plugin-appcenter-analytics",
        "clobbers": [
            "AppCenter.Analytics"
        ]
    },
    {
        "file": "plugins/cordova-plugin-appcenter-crashes/www/Crashes.js",
        "id": "cordova-plugin-appcenter-crashes.Crashes",
        "pluginId": "cordova-plugin-appcenter-crashes",
        "clobbers": [
            "AppCenter.Crashes"
        ]
    },
    {
        "file": "plugins/cordova-plugin-appcenter-push/www/Push.js",
        "id": "cordova-plugin-appcenter-push.Push",
        "pluginId": "cordova-plugin-appcenter-push",
        "clobbers": [
            "AppCenter.Push"
        ]
    },
    {
        "file": "plugins/cordova-plugin-calllog/www/calllog.js",
        "id": "cordova-plugin-calllog.CallLog",
        "pluginId": "cordova-plugin-calllog",
        "merges": [
            "window.plugins.callLog"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
        "id": "cordova-plugin-camera.Camera",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
        "id": "cordova-plugin-camera.CameraPopoverOptions",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/Camera.js",
        "id": "cordova-plugin-camera.camera",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/src/browser/CameraProxy.js",
        "id": "cordova-plugin-camera.CameraProxy",
        "pluginId": "cordova-plugin-camera",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/browser/notification.js",
        "id": "cordova-plugin-dialogs.notification_browser",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/src/browser/DeviceProxy.js",
        "id": "cordova-plugin-device.DeviceProxy",
        "pluginId": "cordova-plugin-device",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-code-push/bin/www/codePush.js",
        "id": "cordova-plugin-code-push.codePush",
        "pluginId": "cordova-plugin-code-push",
        "clobbers": [
            "codePush"
        ]
    },
    {
        "file": "plugins/cordova-plugin-code-push/bin/www/localPackage.js",
        "id": "cordova-plugin-code-push.localPackage",
        "pluginId": "cordova-plugin-code-push",
        "clobbers": [
            "LocalPackage"
        ]
    },
    {
        "file": "plugins/cordova-plugin-code-push/bin/www/remotePackage.js",
        "id": "cordova-plugin-code-push.remotePackage",
        "pluginId": "cordova-plugin-code-push",
        "clobbers": [
            "RemotePackage"
        ]
    },
    {
        "file": "plugins/cordova-plugin-code-push/bin/www/syncStatus.js",
        "id": "cordova-plugin-code-push.syncStatus",
        "pluginId": "cordova-plugin-code-push",
        "clobbers": [
            "SyncStatus"
        ]
    },
    {
        "file": "plugins/cordova-plugin-code-push/bin/www/installMode.js",
        "id": "cordova-plugin-code-push.installMode",
        "pluginId": "cordova-plugin-code-push",
        "clobbers": [
            "InstallMode"
        ]
    },
    {
        "file": "plugins/cordova-plugin-code-push/bin/www/codePushUtil.js",
        "id": "cordova-plugin-code-push.codePushUtil",
        "pluginId": "cordova-plugin-code-push",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-code-push/bin/www/fileUtil.js",
        "id": "cordova-plugin-code-push.fileUtil",
        "pluginId": "cordova-plugin-code-push",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-code-push/bin/www/httpRequester.js",
        "id": "cordova-plugin-code-push.httpRequester",
        "pluginId": "cordova-plugin-code-push",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-code-push/bin/www/nativeAppInfo.js",
        "id": "cordova-plugin-code-push.nativeAppInfo",
        "pluginId": "cordova-plugin-code-push",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-code-push/bin/www/package.js",
        "id": "cordova-plugin-code-push.package",
        "pluginId": "cordova-plugin-code-push",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-code-push/bin/www/sdk.js",
        "id": "cordova-plugin-code-push.sdk",
        "pluginId": "cordova-plugin-code-push",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-file/www/DirectoryEntry.js",
        "id": "cordova-plugin-file.DirectoryEntry",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.DirectoryEntry"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/DirectoryReader.js",
        "id": "cordova-plugin-file.DirectoryReader",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.DirectoryReader"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/Entry.js",
        "id": "cordova-plugin-file.Entry",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.Entry"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/File.js",
        "id": "cordova-plugin-file.File",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.File"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileEntry.js",
        "id": "cordova-plugin-file.FileEntry",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileEntry"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileError.js",
        "id": "cordova-plugin-file.FileError",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileReader.js",
        "id": "cordova-plugin-file.FileReader",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileReader"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileSystem.js",
        "id": "cordova-plugin-file.FileSystem",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileSystem"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileUploadOptions.js",
        "id": "cordova-plugin-file.FileUploadOptions",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileUploadOptions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileUploadResult.js",
        "id": "cordova-plugin-file.FileUploadResult",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileUploadResult"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileWriter.js",
        "id": "cordova-plugin-file.FileWriter",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileWriter"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/Flags.js",
        "id": "cordova-plugin-file.Flags",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.Flags"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/LocalFileSystem.js",
        "id": "cordova-plugin-file.LocalFileSystem",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.LocalFileSystem"
        ],
        "merges": [
            "window"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/Metadata.js",
        "id": "cordova-plugin-file.Metadata",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.Metadata"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/ProgressEvent.js",
        "id": "cordova-plugin-file.ProgressEvent",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.ProgressEvent"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/fileSystems.js",
        "id": "cordova-plugin-file.fileSystems",
        "pluginId": "cordova-plugin-file"
    },
    {
        "file": "plugins/cordova-plugin-file/www/requestFileSystem.js",
        "id": "cordova-plugin-file.requestFileSystem",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.requestFileSystem"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/resolveLocalFileSystemURI.js",
        "id": "cordova-plugin-file.resolveLocalFileSystemURI",
        "pluginId": "cordova-plugin-file",
        "merges": [
            "window"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/browser/Preparing.js",
        "id": "cordova-plugin-file.Preparing",
        "pluginId": "cordova-plugin-file",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-file/src/browser/FileProxy.js",
        "id": "cordova-plugin-file.browserFileProxy",
        "pluginId": "cordova-plugin-file",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-file/www/fileSystemPaths.js",
        "id": "cordova-plugin-file.fileSystemPaths",
        "pluginId": "cordova-plugin-file",
        "merges": [
            "cordova"
        ],
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-file/www/browser/FileSystem.js",
        "id": "cordova-plugin-file.firefoxFileSystem",
        "pluginId": "cordova-plugin-file",
        "merges": [
            "window.FileSystem"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file-transfer/www/FileTransferError.js",
        "id": "cordova-plugin-file-transfer.FileTransferError",
        "pluginId": "cordova-plugin-file-transfer",
        "clobbers": [
            "window.FileTransferError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file-transfer/www/FileTransfer.js",
        "id": "cordova-plugin-file-transfer.FileTransfer",
        "pluginId": "cordova-plugin-file-transfer",
        "clobbers": [
            "window.FileTransfer"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file-transfer/www/browser/FileTransfer.js",
        "id": "cordova-plugin-file-transfer.BrowserFileTransfer",
        "pluginId": "cordova-plugin-file-transfer",
        "clobbers": [
            "window.FileTransfer"
        ]
    },
    {
        "file": "plugins/cordova-plugin-globalization/www/GlobalizationError.js",
        "id": "cordova-plugin-globalization.GlobalizationError",
        "pluginId": "cordova-plugin-globalization",
        "clobbers": [
            "window.GlobalizationError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-globalization/www/globalization.js",
        "id": "cordova-plugin-globalization.globalization",
        "pluginId": "cordova-plugin-globalization",
        "clobbers": [
            "navigator.globalization"
        ]
    },
    {
        "file": "plugins/cordova-plugin-globalization/www/browser/moment.js",
        "id": "cordova-plugin-globalization.moment",
        "pluginId": "cordova-plugin-globalization",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-globalization/src/browser/GlobalizationProxy.js",
        "id": "cordova-plugin-globalization.GlobalizationProxy",
        "pluginId": "cordova-plugin-globalization",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/src/browser/InAppBrowserProxy.js",
        "id": "cordova-plugin-inappbrowser.InAppBrowserProxy",
        "pluginId": "cordova-plugin-inappbrowser",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-nativestorage/www/mainHandle.js",
        "id": "cordova-plugin-nativestorage.mainHandle",
        "pluginId": "cordova-plugin-nativestorage",
        "clobbers": [
            "NativeStorage"
        ]
    },
    {
        "file": "plugins/cordova-plugin-nativestorage/www/LocalStorageHandle.js",
        "id": "cordova-plugin-nativestorage.LocalStorageHandle",
        "pluginId": "cordova-plugin-nativestorage"
    },
    {
        "file": "plugins/cordova-plugin-nativestorage/www/NativeStorageError.js",
        "id": "cordova-plugin-nativestorage.NativeStorageError",
        "pluginId": "cordova-plugin-nativestorage"
    },
    {
        "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
        "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
        "pluginId": "phonegap-plugin-barcodescanner",
        "clobbers": [
            "cordova.plugins.barcodeScanner"
        ]
    },
    {
        "file": "plugins/phonegap-plugin-barcodescanner/src/browser/BarcodeScannerProxy.js",
        "id": "phonegap-plugin-barcodescanner.BarcodeScannerProxy",
        "pluginId": "phonegap-plugin-barcodescanner",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "code-push": "2.0.6",
    "cordova-call": "1.1.6",
    "cordova-plugin-app-version": "0.1.9",
    "cordova-plugin-appcenter-shared": "0.3.3",
    "cordova-plugin-appcenter-analytics": "0.3.3",
    "cordova-plugin-appcenter-crashes": "0.3.3",
    "cordova-plugin-appcenter-push": "0.3.3",
    "cordova-plugin-calllog": "1.2.2",
    "cordova-plugin-camera": "4.0.3",
    "cordova-plugin-dialogs": "2.0.1",
    "cordova-plugin-device": "2.0.2",
    "cordova-plugin-code-push": "1.11.17",
    "cordova-plugin-file": "4.0.0",
    "cordova-plugin-file-transfer": "1.6.3",
    "cordova-plugin-geolocation": "4.0.1",
    "cordova-plugin-globalization": "1.11.0",
    "cordova-plugin-inappbrowser": "3.0.0",
    "cordova-plugin-nativestorage": "2.3.2",
    "phonegap-plugin-barcodescanner": "8.0.1"
}
// BOTTOM OF METADATA
});