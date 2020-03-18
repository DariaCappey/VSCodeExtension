// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
var search_for = [];
var text_array = [];
var range;
var filtered_array = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let register_searching = vscode.commands.registerCommand('extension.markline', function () {
		let options = {
			prompt: "Enter here your String to search for.",
			placeHolder: "Search me"                        
		  }
		vscode.window.showInputBox(options).then(addInput);
	});

	let remove_marker = vscode.commands.registerCommand('extension.removeMarker', function () {
		vscode.window.showInformationMessage('Cleared all markers.');
		search_for = [];
		text_array = [];
		filtered_array = [];
	});

	let delete_lines_with = vscode.commands.registerCommand('extension.deleteLinesWith', function () {
		let editor = vscode.window.activeTextEditor;
		if(editor) {
			getEditorText(editor);
			removeLines(false);
			editor.edit(function(editBuilder){
				editBuilder.replace(range, filtered_array.join('\n'));
			});
		}
		vscode.window.showInformationMessage('Delete Lines With: '+search_for.join(','));
	});

	let delete_lines_without = vscode.commands.registerCommand('extension.deleteLinesWithout', function () {
		let editor = vscode.window.activeTextEditor;
		if(editor) {
			getEditorText(editor);
			removeLines(true);
			editor.edit(function(editBuilder){
				editBuilder.replace(range, filtered_array.join('\n'));
			});
		}
		vscode.window.showInformationMessage('Delete Lines Without: '+search_for.join(','));
	});

	context.subscriptions.push(register_searching);
	context.subscriptions.push(remove_marker);
	context.subscriptions.push(delete_lines_with);
	context.subscriptions.push(delete_lines_without);
}

async function addInput(input) {
	search_for.push(input)
	vscode.window.showInformationMessage('Your searching for: '+search_for.join(','));
}

function getEditorText(editor) {
		let document = editor.document;
		let editor_text = document.getText();
		text_array = editor_text.split('\n');
		const textEditor = vscode.window.activeTextEditor;

		var firstLine = textEditor.document.lineAt(0);
		var lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
		range = new vscode.Range(0,
			firstLine.range.start.character,
			textEditor.document.lineCount - 1,
			lastLine.range.end.character);
}

function removeLines(without) {
	if (search_for && text_array) {
		filtered_array = [];
		text_array.forEach(function(line) {
			var isInLine = checkIsInLine(line);
			if ((!isInLine && !without) || (without && isInLine)) {
				filtered_array.push(line);
			}
		});
	}
}

function checkIsInLine(line){
	var isInLine = false;
	search_for.forEach(function(search){
		var isInText = line.includes(search);
		if(isInText){
			isInLine = true;
		}
	});
	return isInLine;
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
