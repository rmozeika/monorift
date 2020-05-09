const { PerformanceObserver, performance } = require('perf_hooks');

const obs = new PerformanceObserver(items => {
	console.log('PERFORMANCE: FUNCTION TOOK');
	console.log(items.getEntries()[0].duration * 0.001);
	performance.clearMarks();
});

obs.observe({ entryTypes: ['measure'] });

function start() {
	performance.mark('A');
}

function end() {
	performance.mark('B');
	performance.measure('A to B', 'A', 'B');
}

async function testPerformanceTiming(func) {
	start();
	const result = await func();
	end();
	return result;
}

module.exports = testPerformanceTiming;
