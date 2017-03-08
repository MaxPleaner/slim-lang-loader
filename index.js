var loaderUtils = require("loader-utils");
var execSync = require('child_process').execSync
var fs = require("fs")
var path = require("path")

function compileToSlim(remainingRequest) {
	return execSync(`slimrb ${remainingRequest}`)
}

module.exports = function(source) {
	this.cacheable && this.cacheable();
	var remainingRequest = loaderUtils.getRemainingRequest(this);
	var result;
	try {
		result = compileToSlim(remainingRequest);
	} catch (e) {
		var err = "";
		if (e.location == null || e.location.first_column == null || e.location.first_line == null) {
			err += "Got an unexpected exception from the slim-lang-script compiler. The original exception was: " + e + "\n";
		} else {
			var codeLine = source.split("\n")[e.location.first_line];
			var offendingCharacter = (e.location.first_column < codeLine.length) ? codeLine[e.location.first_column] : "";
			err += e + "\n";
			// log erroneous line and highlight offending character
			err += "    L" + e.location.first_line + ": " + codeLine.substring(0, e.location.first_column) + offendingCharacter + codeLine.substring(e.location.first_column + 1) + "\n";
			err += "         " + (new Array(e.location.first_column + 1).join(" ")) + "^\n";
		}
		throw new Error(err);
	}
	this.callback(null, result);
}
