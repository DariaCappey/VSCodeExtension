// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

var search_for = [];   		// array containing all strings, we search for
var text_array = [];		// array containing each line of text in editor as string
var range;					// range of full file
var filtered_array = [];	// array for new file content, after being filtered
var highlighting = [];		// array for all text parts, which should be highlighted

const highlighting_definition = vscode.window.createTextEditorDecorationType({
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: 'orange'
});


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let editor = vscode.window.activeTextEditor;

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	/**
	 * registers all words and strings, we search for
	 */
	let register_searching = vscode.commands.registerCommand('extension.markline', function () {

		// when extension is activated for the first time, when there is no editor, the editor won't load again.
		// so quick and dirty fix
		if (!editor){
			editor = vscode.window.activeTextEditor;
		}
		// first get the text of the editor. We need this to provide highlighting
		if(editor) {
			getEditorText(editor);
			let options = {
				prompt: "Enter here your String to search for.",
				placeHolder: "Search me"                        
			}
			// showInputBox works with promise. When it run successfully, 
			// the function addInput(input) will be called with the parameter of the submitted input
			vscode.window.showInputBox(options).then(addInput);
		} else {
			vscode.window.showInformationMessage('Please open a new text editor or a file!');
		}
		
	});

	/**
	 * removes all saved markers. Also clears all arrays and constants and resets the highlighting
	 */
	let remove_marker = vscode.commands.registerCommand('extension.removeMarker', function () {
		vscode.window.showInformationMessage('Cleared all markers.');
		search_for = [];
		text_array = [];
		filtered_array = [];
		highlighting = [];
		editor.setDecorations(highlighting_definition, []);
	});

	/**
	 * deletes all lines containing one of the strings we searched for
	 * additionally it copies the new content of the file to the clipboard
	 */
	let delete_lines_with = vscode.commands.registerCommand('extension.deleteLinesWith', function () {
		if(editor) {
			changeEditor(false ,editor);
		}
	});

	/**
	 * deletes all lines NOT containing one of the strings we searched for
	 * 
	 * additionally it copies the new content of the file to the clipboard
	 */
	let delete_lines_without = vscode.commands.registerCommand('extension.deleteLinesWithout', function () {
		if(editor) {
			changeEditor(true,editor);
		}		
	});

	// register commands
	context.subscriptions.push(register_searching);
	context.subscriptions.push(remove_marker);
	context.subscriptions.push(delete_lines_with);
	context.subscriptions.push(delete_lines_without);
}

/**
 * adds string, for which should be searched, to the array for the strings that should be searched
 * 
 * highlights the strings in the text
 */
function addInput(input) {
	let editor = vscode.window.activeTextEditor;
	search_for.push(input)

	if (search_for && text_array) {
		var linect = 0;
		text_array.forEach(function(line) {
			var isInText = line.indexOf(input);
			if(isInText != -1){
				var l = input.length;
				// get the exact postion of the word in this line
				var start = new vscode.Position(linect,isInText);
				var end = new vscode.Position(linect,isInText + l);
				// add new range decorator
				const decoration = {
					range: new vscode.Range(start,end)
				};
				highlighting.push(decoration);
			}
			linect++;
		});
	}
	// apply highlighting on the editor
	editor.setDecorations(highlighting_definition, highlighting);
	vscode.window.showInformationMessage('Your searching for: '+search_for.join(','));
}

/**
 * gets the text of the opened text editor.
 * 
 * sets the range for selection to the full range of the file (first char to very last char)
 * 
 * @param {vscode.window.activeTextEditor} editor opened activeTextEditor
 */
function getEditorText(editor) {
	let editor_text = editor.document.getText();
	text_array = editor_text.split('\n');

	var firstLine = editor.document.lineAt(0);
	var lastLine = editor.document.lineAt(editor.document.lineCount - 1);
	range = new vscode.Range(0,
		firstLine.range.start.character,
		editor.document.lineCount - 1,
		lastLine.range.end.character);
}

/**
 * removes lines from the editors text and pushes new lines into filtered_array
 * 
 * @param without set true, if all lines without the strings to search for, should be deleted
 */
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
/**
 * checks if one of the searched strings is in the submitted line
 * 
 * returns true, if contains, otherwhise false
 * 
 * @param line line which should be checked, if it includes one of the strings, we search for
 */
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

/**
 * changes the text in the activeEditor
 * 
 * @param without true, if lines should be deleted without containing the string, otherwise false
 * @param {vscode.window.activeTextEditor} editor opened activeTextEditor
 */
function changeEditor(without, editor) {
	if (without) {
		var str_wo = 'Without';
	} else {
		var str_wo = 'With';
	}

	getEditorText(editor);
	removeLines(without);
	var newText = filtered_array.join('\n')
	editor.edit(function(editBuilder){
		editBuilder.replace(range, newText);
	});
	// Copy new file content to clipboard
	vscode.env.clipboard.writeText(newText);
	vscode.window.showInformationMessage('Delete Lines '+ str_wo +': ' + search_for.join(','));
	editor.setDecorations(highlighting_definition, []);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
