# markline VS Code Extension

This is an extenstion for VisualStudio Code.

You can mark lines containing special words or strings and delete all lines with or all lines without them.

![demo](https://github.com/DariaCappey/VSCodeExtension/blob/master/markline/demo_new.gif?raw=true)

## Features

*markline* : Opens Input window. Type in your word/string you search for. You can add as many words/strings as you want to. - all markers will each time be shown in an info window in the right bottom corner.

*clearMarkers* : Clears all the markers.

*reloadEditor* : You need to do this, if you change the editor-window to reload the document into the extension.

*deleteLinesWith* : Deletes all lines containing one of the searched for strings.

*deleteLinesWithout* : Deletes all lines NOT containing one of the searched for strings.

Your new file content will be automatically copied to your clipboard. 

## Release Notes

### 1.0.0

- Initial release of marline extension. 

### 1.0.1

- Added text highlighting for searched strings 

### 1.0.2

- Your new texteditor content is also automatically copied to your clipboard

### 2.0.1
- Fixed issues with copying to clipboard

### 2.0.2
- Fixed Bug: opening new window or changing content of active Window - when you clearMarks, you can start searching again in new/updated file
- With "reloadEditor" you can reload the active editor but the marks will stay saved

## Known Issues

For any bugs or requests, please open an Issue in my Git Repo: https://github.com/DariaCappey/VSCodeExtension . Thanks for using!