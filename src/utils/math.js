export const padWithZeros = (number, length) => {
	let str = String(number);
	while (str.length < length) {
		str = 0 + str;
	}
	return str;
};
