const assert = require('assert');
const { forEach } = require('../index');

let nums;
beforeEach(() => {
	nums = [ 1, 2, 3 ];
});

it('should sum an array', () => {
	let total = 0;
	forEach(nums, (val) => {
		total += val;
	});
	assert.strictEqual(total, 6);
});
