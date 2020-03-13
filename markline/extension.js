// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
var search_for = [];
var text_array = [];
var filtered_array = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "markline" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let register_searching = vscode.commands.registerCommand('extension.markline', function () {
		openInput();
	});

	let deleteLinesWith = vscode.commands.registerCommand('extension.deleteLinesWith', function () {
		vscode.window.showInformationMessage('Delete Lines With');
		getEditorText();
		removeLines(false);
	});

	let deleteLinesWithOut = vscode.commands.registerCommand('extension.deleteLinesWithout', function () {
		vscode.window.showInformationMessage('Delete Lines Without');
		getEditorText();
		removeLines(true);
	});

	context.subscriptions.push(register_searching);
	context.subscriptions.push(deleteLinesWith);
	context.subscriptions.push(deleteLinesWithOut);
}

async function openInput() {
	let input = await vscode.window.showInputBox();
	console.log(input);
	search_for.push(input)
	console.log(search_for);
}

function getEditorText() {
	let editor = vscode.window.activeTextEditor;

	if(editor) {
		let document = editor.document;
		let editor_text = document.getText();
		text_array = editor_text.split('\n');
		console.log(text_array);
	}
}

function removeLines(without) {
	if (search_for && text_array) {
		filtered_array = [];
		text_array.forEach(function(line) {
			var isInLine = checkIsInLine(line);
			if (!isInLine || without) {
				filtered_array.push(line);
			}
		});
		console.log(filtered_array);
	}
}

function checkIsInLine(line){
	search_for.forEach(function(search){
		var isInText = line.includes(search);
		if(isInText){
			return true;
		}
	});
	return false;
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
