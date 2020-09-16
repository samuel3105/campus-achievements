import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthStackNavigator from './navigators/AuthStackNavigator';

import { View, Text } from 'react-native';

const RootStack = createStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<RootStack.Navigator
				screenOptions={{
					headerShown: false,
				}}
			>
				<RootStack.Screen name={'AuthStack'} component={AuthStackNavigator} />
			</RootStack.Navigator>
		</NavigationContainer>
	);
}
