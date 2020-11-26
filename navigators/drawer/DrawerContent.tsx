import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import { Feather, Entypo } from '@expo/vector-icons';
import Fire from '../../config/Fire';
import { TouchableOpacity } from 'react-native-gesture-handler';



const DrawerContent = ({ navigation }: any) => {

    const updateAvatar = () => {
        
    }

	return (
		<View style={styles.container}>
			<DrawerContentScrollView>
				<View>
                    <TouchableOpacity onPress={() => updateAvatar()}>
                        <Image
                            style={{ width: 150, height: 150, alignSelf:"center", borderRadius: 100, marginVertical: 15 }}
                            source={ Fire.shared.photoURL? {uri: Fire.shared.photoURL} : require('../../assets/avatars/1.png')}
                        />
                        <Feather style={styles.change} name="camera" size={18} color="black" />
                    </TouchableOpacity>
                    <Text style={{fontSize:18, textAlign: "center", fontWeight:"bold", marginVertical: 15}}>{Fire.shared.displayName}</Text>
                    <Text style={{fontSize:15, textAlign: "center", marginBottom: 15}}>{Fire.shared.student ? "étudiant" : "Enseignant"}</Text>
				</View>
				<DrawerItem
					icon={({ color, size }) => <Feather name="home" color={color} size={size} />}
					label="Accueil"
					onPress={() => {
						navigation.navigate('Accueil');
					}}
				/>
				<DrawerItem
					icon={({ color, size }) => <Entypo name="notification" color={color} size={size} />}
					label="Notifications"
					onPress={() => {
						navigation.navigate('Notifications');
					}}
				/>
				<DrawerItem
					icon={({ color, size }) => <Feather name="settings" color={color} size={size} />}
					label="Paramètres"
					onPress={() => {
						navigation.navigate('Paramètres');
					}}
				/>
			</DrawerContentScrollView>
			<View>
				<DrawerItem
					icon={({ color, size }) => <Feather name="log-out" color={color} size={size} />}
					label={'Déconnexion'}
					onPress={() => {
						{
							Fire.shared.signOut();
						}
					}}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
    change: {
        position: "absolute",
        alignSelf:"center",
        top: 145,
        right:55
    }
});
export default DrawerContent;
