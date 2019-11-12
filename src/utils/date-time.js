import { padWithZeros } from './math';

export const formatTimestamp = (timestamp) => {
	// const hour = new Date(timestamp).toLocaleTimeString('en-GB', {
	// 	hour12: '2-digit',
	// });
	// const minute = new Date(timestamp).toLocaleTimeString('en-GB', {
	// 	minute: '2-digit',
	// });

	const hourMinute = new Date(timestamp).toLocaleTimeString('en-GB', {
		hour12: true,
		timeStyle: 'short',
	});

	const month = new Date(timestamp).toLocaleDateString('en-GB', {
		month: 'short',
	});
	const day = new Date(timestamp).toLocaleDateString('en-GB', {
		day: '2-digit',
	});

	return `${month} ${day}, ${hourMinute}`;
	// return `${month} ${day}, ${padWithZeros(hour, 2)}:${padWithZeros(minute, 2)}`;
};
