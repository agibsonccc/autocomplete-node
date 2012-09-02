var fs = require('fs'), trie = require('./trie.js'), lazy = require('lazy'), countermap = require('./countermap.js'),rabbitClient=require('./RabbitMQMessageClient.js');

var QuickSearch = function() {
	this.patriciatree = new trie.Trie();
};
QuickSearch.prototype.chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
/**
 * Load the file in to the patricia tree
 * @param path the path of the file to load
 */
QuickSearch.prototype.load = function(path) {
	var self = this;
	fs.readFile(path, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var split=data.split('\n');
  for(var i=0;i<split.length;i++) {
  	var lineSplit=split[i].split(' ');
  	console.log(lineSplit);
  	self.patriciatree.insert(lineSplit[0]);
  	self.patriciatree.insert(lineSplit[0], parseInt(lineSplit[1]));
  }
  
});
	
	/*
	new lazy(fs.createReadStream(path)).lines.forEach(function(line) {
		var split = line.toString().split(' ');
		console.log(line.toString());
		if (split.length < 2)
			throw 'Wrong size split for file';
		self.patriciatree.insert(split[0], parseInt(split[1]));
	});*/
};

/**
 * Get the probability of the prefix up to a length of m
 * @param {Object} word the word to get the proability for
 * @param {Object} m the length of word to stop at
 */
QuickSearch.prototype.probabilityOfWord = function(word, m) {
	var counterMap = new countermap.CounterMap();
	for (var i = 0; i < m; i++) {
		var sorted = this.patriciatree.search(word.substring(0, i), i);
		if (i >= word.length)
			continue;
		var c = word.charAt(i);
		for (var j = 0; j < sorted.length; j++) {
			var node = sorted[j], value = node.value, key = node.key;
			counterMap.incrementCount(c, key, value);
		}
	}
};
/**
 * Returns the most likely next word relative to the context of a length m
 * @param {Object} words the words to get the most likely word for
 * @param {Object} m the length of the word to get the most likely word for
 * @param {Object} context the context of the current word
 */
QuickSearch.prototype.mostLikely = function(m, context) {
	var counterMap = new countermap.CounterMap(), mostLikely = null, count = 0, ret = null;
	for (var i = 0; i < this.charSplit.length; i++) {
		var s = this.charSplit[i], test = context + s, sorted = trie.getPrefixedBy(test), size = sorted == null ? 0 : sorted.size();
		if (size > 0) {
			counter.incrementCount(s, s, sorted.length);
		}
	}
	return counter.argMax() != null ? counter.argMax()['value'] : "";
};
module.exports.QuickSearch = QuickSearch;
