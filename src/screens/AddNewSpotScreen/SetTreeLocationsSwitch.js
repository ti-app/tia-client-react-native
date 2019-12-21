import React from 'react';
import { useSelector } from 'react-redux';
import { selectNewTreeGroup } from '../../store/reducers/tree.reducer';
import config from '../../config/common';
import SetTreeLocationsByLine from './SetTreeLocationsByLine';
import SetTreeLocationsByRandom from './SetTreeLocationsByRandom';

const SetTreeLocationsSwitch = () => {
	const newTreeGroup = useSelector(selectNewTreeGroup);
	const { distribution } = newTreeGroup;

	switch (distribution) {
		case config.distributions.LINE:
			return <SetTreeLocationsByLine />;
		default:
			return <SetTreeLocationsByRandom />;
	}
};

export default SetTreeLocationsSwitch;
