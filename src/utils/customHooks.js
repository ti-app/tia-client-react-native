import { useRef, useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const usePrevious = (value) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};

export const useKeyboardHideHook = () => {
	const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

	const keyboardDidShow = () => {
		setIsKeyboardOpen(true);
	};

	const keyboardDidHide = () => {
		setIsKeyboardOpen(false);
	};

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	return [isKeyboardOpen, setIsKeyboardOpen];
};
