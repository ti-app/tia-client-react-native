export const getDistanceFromLatLon = (endpoints) => {
	const { latitude: lat1, longitude: lon1 } = endpoints[0];
	const { latitude: lat2, longitude: lon2 } = endpoints[1];
	const R = 6371; // Radius of the earth in km
	const dLat = deg2rad(lat2 - lat1); // deg2rad below
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c; // Distance in km
	return d * 1000;
};

const deg2rad = (deg) => {
	return deg * (Math.PI / 180);
};

export const getTreeCoordsByNumberOfTrees = (endpoints, numberOfPlants) => {
	const start = endpoints[0];
	const end = endpoints[1];
	const modifiedCoordinates = [];

	const latDiff = Math.abs(start.latitude - end.latitude);
	const lngDiff = Math.abs(start.longitude - end.longitude);

	const chunks = numberOfPlants - 1;

	const latStep = latDiff / chunks;
	const lngStep = lngDiff / chunks;

	let newLat = start.latitude;
	let newLng = start.longitude;

	for (let i = 1; i < chunks; i += 1) {
		if (start.latitude < end.latitude) {
			newLat += latStep;
		} else {
			newLat -= latStep;
		}
		if (start.longitude < end.longitude) {
			newLng += lngStep;
		} else {
			newLng -= lngStep;
		}
		modifiedCoordinates.push({ latitude: newLat, longitude: newLng });
	}

	return modifiedCoordinates;
};

// spacing is in meters
export const getTreeCoordsBySpacing = (endpoints, spacing) => {
	const start = endpoints[0];
	const end = endpoints[1];
	const modifiedCoordinates = [];

	const latDiff = Math.abs(start.latitude - end.latitude);
	const lngDiff = Math.abs(start.longitude - end.longitude);

	const distance = getDistanceFromLatLon(endpoints);

	const chunks = distance / spacing;

	const latStep = latDiff / chunks;
	const lngStep = lngDiff / chunks;

	let newLat = start.latitude;
	let newLng = start.longitude;

	for (let i = 1; i < chunks; i += 1) {
		if (start.latitude < end.latitude) {
			newLat += latStep;
		} else {
			newLat -= latStep;
		}
		if (start.longitude < end.longitude) {
			newLng += lngStep;
		} else {
			newLng -= lngStep;
		}
		modifiedCoordinates.push({ latitude: newLat, longitude: newLng });
	}

	console.log(distance, chunks, modifiedCoordinates.length);

	return modifiedCoordinates;
};
