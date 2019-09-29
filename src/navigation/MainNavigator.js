import { createAppContainer, createDrawerNavigator, createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import AddNewSpotScreen from '../screens/AddNewSpotScreen';
import AddPlantationSiteScreen from '../screens/AddPlantationSiteScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import FaqScreen from '../screens/FaqScreen';
import TreeDetails from '../screens/TreeDetails';
import SideDrawerContent from '../components/Home/SideDrawerContent';
import EditTreeDetails from '../screens/EditTreeDetails';
import PlantationSiteDetails from '../screens/PlantationSiteDetails';
import EditPlantationSiteDetails from '../screens/EditPlantationSiteDetails';
import TreeGroupDetails from '../screens/TreeGroupDetails';

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
		PlantationSiteDetails: {
			screen: PlantationSiteDetails,
		},
		EditPlantationSiteDetails: {
			screen: EditPlantationSiteDetails,
		},
		TreeDetails: {
			screen: TreeDetails,
		},
		TreeGroupDetails: {
			screen: TreeGroupDetails,
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
