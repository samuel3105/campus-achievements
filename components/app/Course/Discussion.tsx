import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Keyboard, FlatList, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GiftedChat, IMessage, Message, Send } from 'react-native-gifted-chat';
import Fire from '../../../config/Fire';

export interface DiscussionProps {
	messagesProps: IMessage[];
	uidCourse: string;
}

const Discussion = ({ messagesProps, uidCourse }: DiscussionProps) => {
	const [messages, setMessages] = useState<IMessage[]>(messagesProps.reverse());
	const [minInputToolbarHeight, setMinInputToolbarHeight] = useState(45);

	useEffect(() => {
		let keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
		let keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

		return () => {
			keyboardDidShowListener;
			keyboardDidHideListener;
		};
	}, []);

	const _keyboardDidShow = (e) => {
		let keyboardHeight = e.endCoordinates.height;
		setMinInputToolbarHeight(45 + keyboardHeight);
	};

	const _keyboardDidHide = () => {
		setMinInputToolbarHeight(45);
	};

	/*
	const onSend = useCallback((messages = []) => {
		setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    }, []);
    */
	const onSend = async (message: IMessage[]) => {
		setMessages((previousMessages) => GiftedChat.append(previousMessages, message));
		Fire.shared.sendMessage(message[0], uidCourse);
	};

	const renderSendButton = (props) => {
		return (
			<Send
				{...props}
				containerStyle={{
					paddingHorizontal: 12,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Feather name="send" size={27} color="black" />
			</Send>
		);
    };

	return (
		<View style={{ height: '100%'}}>
				<GiftedChat
					scrollToBottom
					showAvatarForEveryMessage
					renderSend={renderSendButton}
					alwaysShowSend
					placeholder="Votre message..."
					renderUsernameOnMessage
					messages={messages}
					onSend={(message: IMessage[]) => onSend(message)}
					user={{
						_id: Fire.shared.uid ? Fire.shared.uid : 1,
						name: Fire.shared.displayName ? Fire.shared.displayName : ' ',
						avatar: Fire.shared.photoURL ? Fire.shared.photoURL : ' ',
                    }}
                    renderMessage={(props) => {
                        return (
                          <View>
                            <Message {... props} />
                            <FlatList
                              nestedScrollEnabled={true}
                              data={[]}
                              renderItem={() => <View />}
                            />
                          </View>
                        );
                      }}
                      listViewProps={{
                        nestedScrollEnabled: true
                      }}
				/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default Discussion;
