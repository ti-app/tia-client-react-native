import { createAppContainer, createDrawerNavigator, createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import AddNewSpotScreen from '../screens/AddNewSpotScreen';
import AddPlantionSiteScreen from '../screens/AddPlantionSiteScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import FaqScreen from '../screens/FaqScreen';
import TreeDetails from '../screens/TreeDetails';
import SideDrawerContent from '../components/Home/SideDrawerContent';

const MainNavigator = createStackNavigator(
	{
		Home: {
			screen: HomeScreen,
		},
		AddNewSpot: {
			screen: AddNewSpotScreen,
		},
		AddPlantionSite: {
			screen: AddPlantionSiteScreen,
		},
		TreeDetails: {
			screen: TreeDetails,
		},
		UserProfile: {
			screen: UserProfileScreen,
		},
		Faq: {
			screen: FaqScreen,
		},
	},
	{
		initialRouteName: 'Home',
	}
);

const DrawerNavigator = createDrawerNavigator(
	{ Main: MainNavigator },
	{ contentComponent: SideDrawerContent, drawerWidth: 300, edgeWidth: 10 }
);

export default createAppContainer(DrawerNavigator);
