import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AudioList from '../screens/AudioList';
import AudioPlayer from '../screens/AudioPlayer';
import PlayList from '../screens/PlayList';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import constants from '../config/constants';
import { createStackNavigator } from '@react-navigation/stack';
import PlayListDetail from '../components/PlayListDetail';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PlayListScreen = () => {
    return <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={constants.PlayListHome} component={PlayList} />
        <Stack.Screen name={constants.PlayListDetail} component={PlayListDetail} />
    </Stack.Navigator>
}

const Navigation = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name={constants.AudioList} component={AudioList} options={{
                tabBarIcon: () => (
                    <MaterialIcons name='headset' size={24} color='black' />
                )
            }} />
            <Tab.Screen name={constants.AudioPlayer} component={AudioPlayer} options={{
                tabBarIcon: () => (
                    <FontAwesome5 name='compact-disc' size={24} color='black' />
                )
            }} />
            <Tab.Screen name={constants.PlayList} component={PlayListScreen} options={{
                tabBarIcon: () => (
                    <MaterialIcons name='library-music' size={24} color='black' />
                )
            }} />
        </Tab.Navigator>
    );
};

export default Navigation;
