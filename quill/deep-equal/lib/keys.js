let objectKeys = typeof Object.keys === 'function'
  ? Object.keys : shim;

function shim (obj) {
  var keys = [];
  for (var key in obj)
	  keys.push(key);
  return keys;
}

export default objectKeys;