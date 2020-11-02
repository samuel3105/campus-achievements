import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PromosScreen from '../screens/auth/PromosScreen';

//creation de la stack
const AuthStack = createStackNavigator();

const RegisterStack = createStackNavigator();

const RegisterStackScreen = ({ navigation }: any) => (
	<RegisterStack.Navigator initialRouteName="RegisterStackPromo">
		<RegisterStack.Screen
			name="RegisterStackPromos"
			component={PromosScreen}
			options={{
				title: '',
				headerTransparent: true,
				headerLeft: () => (
					<TouchableOpacity
						style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}
						onPress={() => navigation.goBack()}
					>
						<Feather name="arrow-left-circle" size={25} color="black" />
					</TouchableOpacity>
				),
				headerTitleAlign: 'center',
			}}
		/>
		<RegisterStack.Screen
			name="RegisterStackRegister"
			component={RegisterScreen}
			options={{
				title: '',
				headerTransparent: true,
				headerLeft: () => (
					<TouchableOpacity
						style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}
						onPress={() => navigation.goBack()}
					>
						<Feather name="arrow-left-circle" size={25} color="black" />
					</TouchableOpacity>
				),
				headerTitleAlign: 'center',
			}}
		/>
	</RegisterStack.Navigator>
);

//stack qui s'appelera AuthStackNavigator
//Pas de header car pas besoin pour l'authentification
//deux screens dans cette stack :
// -LoginScreen   =>   (lancer en première)
// -RegisterScreen
export default function AuthStackNavigator() {
	return (
		<AuthStack.Navigator
			mode={'modal'}
			initialRouteName="Login"
			screenOptions={{
				headerShown: false,
			}}
		>
			<AuthStack.Screen name={'Login'} component={LoginScreen} />
			<AuthStack.Screen name={'Register'} component={RegisterStackScreen} />
		</AuthStack.Navigator>
	);
}