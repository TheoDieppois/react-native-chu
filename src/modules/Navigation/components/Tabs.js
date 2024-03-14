import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import ActivityPage from "../../ActivityPage/ActivityPage";

//import ActivityPage from "./src/modules/ActivityPage/ActivityPage";

import StatsPage from "../../StatsPage/StatsPage";
import AccountPage from "../../AccountPage/AccountPage";
import SettingsPage from "../../SettingsPage/SettingsPage";
import NotificationsButton from "../../Navigation/components/NotificationsButton";
import SettingsButton from "../../Navigation/components/SettingsButton";
import {View, Button, IconButton, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function Tabs() {
    const navigation = useNavigation();
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'ActivityPage') {
              iconName = 'walk';
            } else if (route.name === 'StatsPage') {
              iconName = 'chart-bar';
            } else if (route.name === 'AccountPage') {
              iconName = 'account';
            } else if (route.name === 'Notifications') {
              iconName = 'bell';
            } else if (route.name === 'Settings') {
              iconName = 'cog';
            }
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
         <Tab.Screen name="ActivityPage" component={ActivityPage}
         options={({navigation}) => ({
             tabBarLabel: 'Activité',
            headerLeft: () => (
                <NotificationsButton/>
                ),
            headerRight: () => (
                <SettingsButton/>
                ),
            headerTitle: ''
            })}/>
         <Tab.Screen name="StatsPage" component={StatsPage}
         options={({navigation}) => ({
             tabBarLabel: 'Stats',
            headerLeft: () => (
                <NotificationsButton/>
                ),
            headerRight: () => (
                <SettingsButton/>
                ),
            headerTitle: ''
            })}/>
         <Tab.Screen name="AccountPage" component={AccountPage}
         options={({navigation}) => ({
             tabBarLabel: 'Compte',
            headerLeft: () => (
                <NotificationsButton/>
                ),
            headerRight: () => (
                <SettingsButton/>
                ),
            headerTitle: ''
            })}/>
    </Tab.Navigator>
  );
}