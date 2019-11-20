import format from 'date-fns/format';
import getTime from 'date-fns/getTime';

export const formatTimestamp = (timestamp) => {
	const date = format(new Date(timestamp), 'dd MMM yyyy');
	const time = format(new Date(timestamp), 'hh:mm a');
	return { date, time };
};

export const getCurrentUnixTimestamp = () => {
	return getTime(new Date());
};
