import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import AddPlantationSiteScreen from '../screens/AddPlantationSiteScreen/AddPlantationSiteScreen';
import UserProfileScreen from '../screens/UserProfileScreen/UserProfileScreen';
import FaqScreen from '../screens/FaqScreen/FaqScreen';
import TreeDetails from '../screens/TreeDetails/TreeDetails';
import SideDrawerContent from '../shared/SideDrawerContent/SideDrawerContent';
import EditTreeDetails from '../screens/EditTreeDetails/EditTreeDetails';
import PlantationSiteDetails from '../screens/PlantationSiteDetails/PlantationSiteDetails';
import EditPlantationSiteDetails from '../screens/EditPlantationSiteDetails/EditPlantationSiteDetails';
import TreeGroupDetails from '../screens/TreeGroupDetails/TreeGroupDetails';
import AddNewSpotScreen from '../screens/AddNewSpotScreen/AddNewSpotScreen';
import UserActivity from '../screens/UserActivity/UserActivity';
import TreeActivity from '../screens/TreeActivity/TreeActivity';

const MainNavigator = createStackNavigator(
	{
		Home: {
			screen: HomeScreen,
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
		AddNewSpot: {
			screen: AddNewSpotScreen,
		},
		UserActivity: {
			screen: UserActivity,
		},
		TreeActivity: {
			screen: TreeActivity,
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
