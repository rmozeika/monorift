const Jimp = require('jimp');

class Computations {
	constructor(sizeMultiplier) {
		this.sizeMultiplier = sizeMultiplier;
	}
	scale = input => {
		return this.sizeMultiplier * input;
	};
	negSpaceLimitsAndHalves(baseLimits) {
		const { scale, calcHalfwayPoint } = this;
		const limits = {
			x: {
				min: scale(16),
				max: scale(24)
			},
			y: {
				min: scale(5),
				max: scale(12)
			}
		};
		const halves = {
			x: calcHalfwayPoint(limits.x),
			y: calcHalfwayPoint(limits.y)
		};
		return { limits, halves };
	}
	generateDiagnolLinesCheck(limits, halves) {
		return function(x, y, idx) {
			if (x < limits.x.min || x > limits.x.max) return false;
			if (y < limits.y.min || y > limits.y.max) return false;
			const xHalfwayDistance = Math.abs(x - halves.x);
			const yHalfwayDistance = Math.abs(y - halves.y);
			const xLog = Math.log(xHalfwayDistance);
			const yLog = Math.log(yHalfwayDistance);
			if (yHalfwayDistance < xHalfwayDistance) {
				return false;
			}
			return true;
		};
	}
	generateInverseCircle(limits, halves) {
		const { inCircle, calcRadius, scale } = this;
		const circumcenterLeft = {
			x: limits.x.min,
			y: halves.y
		};
		const circumcenterRight = {
			x: limits.x.max,
			y: halves.y
		};
		const radius = calcRadius(limits.y) - scale(1);
		return function(x, y, idx) {
			if (x < limits.x.min || x > limits.x.max) return false;
			if (y < limits.y.min || y > limits.y.max) return false;

			if (inCircle(circumcenterRight, radius, x, y)) {
				return false;
			}
			if (inCircle(circumcenterLeft, radius, x, y)) {
				return false;
			}
			// const xHalfwayDistance = Math.abs(x - halves.x);
			// const yHalfwayDistance = Math.abs(y - halves.y);
			// const xLog = Math.log(xHalfwayDistance);
			// const yLog = Math.log(yHalfwayDistance);
			// if (yHalfwayDistance < xHalfwayDistance) {
			// 	return false;
			// }
			return true;
		};
	}
	inCircle = (circumcenter, radius, x, y) => {
		const xDistance = Math.abs(circumcenter.x - x);
		const yDistance = Math.abs(circumcenter.y - y);
		const distance = this.pythagorean(xDistance, yDistance);
		return radius > distance;
	};
	pythagorean(sideA, sideB) {
		return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
	}
	calcRadius({ min, max }) {
		const diff = max - min;
		return diff / 2;
	}
	calcHalfwayPoint({ min, max }) {
		const diff = max - min;
		const half = diff / 2;
		const point = min + half;
		return point;
	}
}

module.exports = Computations;
