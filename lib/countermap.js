/***
 * Based on the counter map by Dan Klein from the stanford NLP package.
 */

var Counter = function(){
/* Entries for counting, each entry has the structure {key : value} where
 * the entry is also indexed within the object */
this.entries = {};
/* If the map has been added to */
this.dirty = true;
/* the cache total */
this.cacheTotal = 0;
};



/**
 * An array of all of the keys in the counter set.
 */
Counter.prototype.keySet = function() {
	var ret = [];
	for (var entry in this.entries) {
		ret.push(entry['key']);
	}
	return ret;
};
/**
 * Return the size of the counter collection.
 * @return the length of the entries
 */
Counter.prototype.size = function() {
	
	return Object.keys(this.entries).length;
};

/**
 * Return whether the size of the entry map is empty.
 * @return true if the size is 0, false otherwise
 */
Counter.prototype.isEmpty = function() {
	var size = this.size();
	return size == 0;
};
/**
 * Checks to see whether the given key
 * exists in the entries.
 * @return true if the key exists, false otherwise
 */
Counter.prototype.containsKey = function(key) {
	var check = this.entries[key];
	return check != null;
};
/**
 * Return a count for the given key.
 * Object keys are assumed to be strings.
 * @param key, the key to get the count for
 * @return the count for the given key
 */
Counter.prototype.getCount = function(key) {

	var check = this.entries[key];
	if (check == null || typeof check=='undefined')
		return 0;
	return check['value'];
};
/**
 * Normalize the counts in the counter.
 */
Counter.prototype.normalize = function() {
	var count = this.totalCount();
	for (var e in this.entries) {
		var entry = this.entries[e];
		setCount(e, getCount(e) / count);
	}

};
/**
 * Set the count for the given key with the new
 * value.
 */
Counter.prototype.setCount = function(key, value) {
	var entry=this.entries[key];
	if(entry != null) {
		delete this.entries[key];
	}
	this.entries[key] = {
		'key' : key,
		'value' : value
	};
	this.dirty = true;
};
/**
 * Incrment the count by the given amount.
 * @param key the key to increment
 * @param incrementBy the value to increment the
 * given key by
 */
Counter.prototype.incrementCount = function(key, incrementBy) {
	this.setCount(key, this.getCount(key) + incrementBy);
};

/**
 * Return the element with the max count in entries.
 *
 */
Counter.prototype.argMax = function() {
	var max = Number.MAX_VALUE, ret = null;
	for (var key in this.entries) {
		var entry = this.entries[key], val = entry['value'];
		if (val > max || ret == null) {
			ret = entry;
			max = val;
		}
	}
	return ret;
};

/**
 * Get the total count of everything in the counter
 * @return the total count of every entry in the map
 */
Counter.prototype.totalCount = function() {
	var dirty = this.dirty;
	if (dirty==false) {
	return this.cacheTotal;

	}
	else {
		var ret = 0;
		/* sum total count for each entry where each entry is an object with key */
		
		for (var entry in this.entries) {
			ret += this.getCount(entry);
		}
		this.cacheTotal = ret;
		this.dirty = false;
		return ret;
	}
};
/**
 * Increment all of the counts of the given keys
 * by the given amount.
 * @param entries an object or array of keys to increment a count by.
 * @param count the count to increment by
 */
Counter.prototype.incrementAll = function(entries, count) {
	if ( typeof entries == 'array') {
		for (var i = 0; i < entries.length; i++) {
			var curr = entries[i];
			this.incrementCount(curr, count);
		}
	} else if ( typeof entries == 'object') {
		for (var o in entries) {
			this.incrementCount(o, count);

		}
	}
};

var CounterMap = function() {
	this.counterMap={};
};

/**
 * Returns the counter for the given key, and if needed
 * creates a new counter to return for the key.
 * @param {Object} key the key to get a counter for
 */
CounterMap.prototype.ensureCounter = function(key) {
	var valCounter = this.counterMap[key];
	if (valCounter == null) {
		valCounter = new Counter();
		
		this.counterMap[key] = valCounter;
		return valCounter;
	}

	return valCounter;
};
/**
 * Returns all of the keys for this
 * counter map
 * @param the keyset for this counter map
 */
CounterMap.prototype.keys = function() {
	var ret = [];
	for (var key in this.counterMap) {
		ret.push(key);
	}
	return ret;
};
/**
 * Set the count for the given key and valye pair
 * @param {Object} key the key to set
 * @param {Object} value the valueto set the counter for
 * @param {Object} count the count to set
 */
CounterMap.prototype.incrementCount = function(key, value, count) {
	var counter = this.ensureCounter(key);
	counter.setCount(value, count);
};
/**
 * Get the count for the given key value pair
 * @param {Object} key the key to get the count for
 * @param {Object} value the value to get the count for
 * @return the count for the key value pair
 */
CounterMap.prototype.getCountFor = function(key, value) {

	var counter = this.ensureCounter(key);

	if (counter == null) {
		return 0;

	}
	var countret=counter.getCount(value);
	return countret;
};

/**
 * This is equivalent to callling ensureCounter(key)
 * @param {Object} key te key to get the counter for
 */
CounterMap.prototype.getCounter = function(key) {
	return this.ensureCounter(key);
};
/**
 * Get the total count for the given key.
 * @param {Object} key the key to get the total count for
 */
CounterMap.prototype.getCount = function(key) {
	var counter = this.counterMap[key];
	if (counter == null)
		return 0;
	return counter.totalCount();
};
/**
 * Return the total count for every entry in the map.
 * @return the total count for every entry in the map.
 */
CounterMap.prototype.totalCount=function() {
	var ret=0;
	var key=Object.keys(this.counterMap);

	for(var key in this.counterMap) {
		var counter=this.counterMap[key];
		ret+=counter.totalCount();
	}
	return ret;
};
/**
 * Return the total size for the map
 * @return the total size for the map
 */
CounterMap.prototype.totalSize=function() {
	var ret=0;
	for(var key in this.counterMap) {
		var counter=this.counterMap[key];
		ret+=counter.size();
	}
	return ret;
};
/**
 * Returns the argmax for the whole map.
 * @return the argmax for the whole map, the argmax is an object such that:
 * {key : key, value : value}
 */
CounterMap.prototype.argMax=function() {
	var max=Number.MAX_VALUE,ret=null;
	for(var key in this.counterMap) {
		var counter=this.counterMap[key],count=counter.getValue(),
		localMax=counter.argMax();
		if(counter.getCount(localMax) > max || ret==null) {
			ret={
				'key' : key,
				'value' : localMax
			};
			max=counter.getCount(localMax);
		}
		return ret;
	}
};
/**
 * Returns the size of the counter map
 */
CounterMap.prototype.size=function() {
	return Object.keys(this.counterMap).length;
};
/**
 * Returns whether the counter map is empty
 */
CounterMap.prototype.isEmpty=function() {
	var size=this.size();
	return size==0;
};
module.exports.Counter=Counter;
module.exports.CounterMap=CounterMap;
