import { createAppContainer, createDrawerNavigator, createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import AddNewSpotScreen from '../screens/AddNewSpotScreen';
import AddPlantationSiteScreen from '../screens/AddPlantationSiteScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import FaqScreen from '../screens/FaqScreen';
import TreeDetails from '../screens/TreeDetails';
import SideDrawerContent from '../components/Home/SideDrawerContent';
import EditTreeDetails from '../screens/EditTreeDetails';

const MainNavigator = createStackNavigator(
	{
		Home: {
			screen: HomeScreen,
		},
		AddNewSpot: {
			screen: AddNewSpotScreen,
		},
		AddPlantationSite: {
			screen: AddPlantationSiteScreen,
		},
		TreeDetails: {
			screen: TreeDetails,
		},
		EditTree: {
			screen: EditTreeDetails,
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
