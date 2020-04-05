export function defaultEqualityCheck(currentVal, previousVal) {
	return currentVal === previousVal;
}

export function shallowEqual(objA, objB, compare, compareContext) {
	var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

	if (ret !== void 0) {
		return !!ret;
	}

	if (objA === objB) {
		return true;
	}

	if (typeof objA !== 'object' || !objA || typeof objB !== 'object' || !objB) {
		return false;
	}

	var keysA = Object.keys(objA);
	var keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

	// Test for A's keys different from B.
	for (var idx = 0; idx < keysA.length; idx++) {
		var key = keysA[idx];

		if (!bHasOwnProperty(key)) {
			return false;
		}

		var valueA = objA[key];
		var valueB = objB[key];

		ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

		if (ret === false || (ret === void 0 && valueA !== valueB)) {
			return false;
		}
	}

	return true;
}

export function resultCheckMemoize(
	func,
	resultCheck = defaultEqualityCheck,
	argsCheck = defaultEqualityCheck
) {
	let lastArgs = null;
	let lastResult = null;
	return (...args) => {
		if (
			lastArgs !== null &&
			lastArgs.length === args.length &&
			args.every((value, index) => argsCheck(value, lastArgs[index]))
		) {
			return lastResult;
		}
		lastArgs = args;
		let result = func(...args);
		return resultCheck(lastResult, result) ? lastResult : (lastResult = result);
	};
}
