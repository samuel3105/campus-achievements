import React, { createRef, useEffect, useState } from 'react';
import { StyleSheet, View, Animated, StatusBar, ScrollView, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { CardQuizz, Quizz, Reward } from '../../config/constantType';
import QuizCard from '../../components/app/Course/Quizz/QuizCard';
import { colors } from '../../config/constants';
import Toast from 'react-native-toast-message';
import Fire from '../../config/Fire';
import CustomToastQuizz from '../../components/app/Course/Quizz/CustomToastQuizz';
import { getDataRewards, storeDataRewards } from '../../config/localDatabase';

const { width } = Dimensions.get('window');

export interface QuizzScreenProps {
	navigation: any;
	route: any;
}


const toastConfig = {
    good: (internalState) => <CustomToastQuizz internalState={internalState} status={'good'}></CustomToastQuizz>,
    bad: (internalState) => <CustomToastQuizz internalState={internalState} status={'bad'}></CustomToastQuizz>,
    wait: (internalState) => <CustomToastQuizz internalState={internalState} status={'wait'}></CustomToastQuizz>,
};


const QuizzScreen = ({ navigation, route }: QuizzScreenProps) => {
	const [cardsQuizz, setCardsQuizz] = useState<CardQuizz[]>([]);
	const [headerResponse, setHeaderResponse] = useState<number[]>([]);
	const [animations, setAnimations] = useState<Animated.Value[]>([]);
	const [nbResponse, setNbResponse] = useState<number>(0);
    const toast = createRef<any>();


	React.useLayoutEffect(() => {}, [navigation]);

	useEffect(() => {
		var tempArr: CardQuizz[] = [];
		route.params.skill.quizz?.map((q: Quizz) => {
			var temp: CardQuizz = {
				question: q.question,
				cards: [
					{ number: 'x', question: q.solution, value: true, revealed: false, picked: false },
					{ number: 'x', question: q.propositions[0], value: false, revealed: false, picked: false },
					{ number: 'x', question: q.propositions[1], value: false, revealed: false, picked: false },
					{ number: 'x', question: q.propositions[2], value: false, revealed: false, picked: false },
				],
			};
			shuffle(temp.cards);
			temp.cards[0].number = 'A';
			temp.cards[1].number = 'B';
			temp.cards[2].number = 'C';
			temp.cards[3].number = 'D';
			tempArr.push(temp);
		});
		shuffle(tempArr);
		setCardsQuizz(tempArr);

		var arr = Array(route.params.skill.quizz.length).fill(0);
		setHeaderResponse(arr);
		var arrAnim = Array(route.params.skill.quizz.length).fill(new Animated.Value(0));
		setAnimations(arrAnim);
	}, []);

	function shuffle(array) {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.iconLeft}
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Feather name="x" size={32} color="#000" />
				</TouchableOpacity>
				<View style={styles.headerContent}>
					{headerResponse.map((x, index) => {
						return (
							<View
								key={index.toString()}
								style={[
									styles.headerContentBar,
									{
										width: (width - 50 * 2) / cardsQuizz.length - 4,
										backgroundColor: '#bbbbbb',
									},
								]}
							>
								<Animated.View
									style={[
										{
											height: '100%',
											backgroundColor: x == 0 ? 'red' : x == 1 ? '#1da75d' : '#ff5e6b',
											borderRadius: 3,
										},
										{
											transform: [
												{
													scaleX: animations[index].interpolate({
														inputRange: [0, 0.5, 1],
														outputRange: [0, 0.8, 1],
													}),
												},
											],
										},
									]}
								></Animated.View>
							</View>
						);
					})}
				</View>
				<TouchableOpacity
					style={styles.iconRight}
					onPress={() => {
						if (nbResponse == route.params.skill.quizz.length) {
                            //si il y a des erreurs
                            if(headerResponse.includes(2)){
                                navigation.navigate('CourseScreen');
                            }
                            //si il y a pas d'erreurs
                            else{
                                Fire.shared.updateSkillBySkillName(route.params.skill.nom, route.params.uidCourse).then(() => {
                                    navigation.navigate('CourseScreen');
                                })
                            }
                            
						} else {
							toast.current.show({
								type: 'wait',
								position: 'bottom',
								text1: 'Pas si vite...',
                                text2: "Tu n'as pas terminé de remplir le quiz",
							});
						}
					}}
				>
					<MaterialIcons name="navigate-next" size={32} color="black" />
				</TouchableOpacity>
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				{cardsQuizz.map((data, index: number, arr) => (
					<QuizCard
						data={data}
						num={index}
						key={data.question}
						cardsAmount={arr.length}
						respond={(correct, index) => {
							const newarr = [...headerResponse];
							newarr[index] = correct;
							setHeaderResponse(newarr);

							const newarrA = [...animations];
							newarrA[index] = new Animated.Value(0);
							Animated.timing(newarrA[index], {
								toValue: 1,
								duration: 500,
								useNativeDriver: true,
							}).start();
							setAnimations(newarrA);
                            setNbResponse(nbResponse + 1);

                            //moins un parce que le state c'est pas encore à jours ?
                            if(nbResponse == route.params.skill.quizz.length - 1){
                                if(headerResponse.includes(2)){
                                    toast.current.show({
                                        type: 'bad',
                                        position: 'bottom',
                                        text1: 'Aïe aïe aïe...',
                                        text2: "Tu as encore des choses à revoir...",
                                    });
                                }else{
                                    toast.current.show({
                                        type: 'good',
                                        position: 'bottom',
                                        text1: 'Hip hip hip',
                                        text2: "Houra !! Tu peux passer à la suite maintenant",
                                    });
                                    getDataRewards().then((rewards: Reward[]) => {
                                        console.log(rewards)
                                        if(rewards[7].done != true){
                                            rewards[7].done = true;
                                            storeDataRewards(rewards)
                                            Fire.shared.updateRewardByName(rewards[7].name)
                                        }else{
                                            if(rewards[8].done != true){
                                                rewards[8].done = true;
                                                storeDataRewards(rewards)
                                                Fire.shared.updateRewardByName(rewards[8].name)
                                            }else{
                                                if(rewards[9].done != true){
                                                    rewards[9].done = true;
                                                    storeDataRewards(rewards)
                                                    Fire.shared.updateRewardByName(rewards[9].name)
                                                }
                                            }
                                        }
                                    });
                                }
                            }
						}}
					/>
				))}
			</ScrollView>
			<StatusBar backgroundColor={colors.background}></StatusBar>
			<Toast ref={toast} config={toastConfig} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		height: 50,
		flexDirection: 'row',
	},
	iconLeft: {
		height: 50,
		width: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconRight: {
		height: 50,
		width: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	headerContentBar: {
		height: 10,
		marginHorizontal: 2,
		borderRadius: 3,
	},
});

export default QuizzScreen;
