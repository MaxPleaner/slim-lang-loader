var getRemainingRequest = require("loader-utils").getRemainingRequest;
var getOptions = require('loader-utils').getOptions;
var execSync = require('child_process').execSync
var fs = require("fs")
var path = require("path")
var defaults = require('lodash.defaults')


function prepareArguments(slimOptions) {
	return Object.entries(slimOptions).map(function(option_with_value) {
		// Appends options like:
		// -o "foo=bar" -o "baz=blah"
		return "-o \"" + option_with_value.join("=") + "\"";
	}).join(" ");
}

function compileToSlim(remainingRequest, slimOptions) {
	var additionalArguments = prepareArguments(slimOptions);
	return execSync(`slimrb ${additionalArguments} ${remainingRequest}`)
}

module.exports = function(source) {
	var loader = this;

	loader.cacheable && loader.cacheable();

	var remainingRequest = getRemainingRequest(loader);
	var config = defaults({}, getOptions(loader), {
		slimOptions: {}
	});
	var result;
	try {
		result = compileToSlim(remainingRequest, config['slimOptions']);
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
