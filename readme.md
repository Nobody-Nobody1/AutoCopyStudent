Extension Documentation: https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts

Note: Make sure developer mode is turned on to do the steps below!

When creating a Google Classroom assignment, attach the file as usual. The
extension watches the attachment sharing controls and automatically changes
`Students can view file` to `Make a copy for each student`. Keep the Classroom
assignment page open while the attachment controls are being created.

How to pack source code into .crx:
go to chrome://extensions
click on Pack extension
Put the directory path of the extension source code
optionally put the associated pem file
Output: a .crx file that is the packaged extension

How to unpack source code directly:
go to chrome://extensions
click on Load unpacked
Put the directory path of the extension source code

How to use a .crx file to install a extension:
go to chrome://extensions
open the file explorer
drag the .crx file into chrome://extensions
Accept the popup to add the extension into chrome