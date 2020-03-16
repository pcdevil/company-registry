'use strict';

function nullishOperator (head, or) {
	return head !== undefined && head !== null
		? head
		: or;
}

module.exports = { nullishOperator };
