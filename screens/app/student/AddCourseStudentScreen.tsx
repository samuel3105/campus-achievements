import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import Fire from '../../../config/Fire';
import { useHeaderHeight } from '@react-navigation/stack';

import { Course } from '../../../config/constantType';
import SearchItems from '../../../components/common/SearchItems';
import SearchCoursesItem from '../../../components/common/SearchCoursesItem';
import { colors } from '../../../config/constants';

const AddCourseStudentScreen = ({ navigation }: any) => {
	const [courses, setCourses] = useState<Course[]>([]);
	const [search, setSearch] = useState('');
	const [coursesSearch, setCoursesSearch] = useState<Course[]>([]);

    const headerHeight = useHeaderHeight();
    


	useEffect(() => {
		Fire.shared
			.getAllCourses()
			.then(async (coursesRes: Course[]) => {
				const otherCourses = deleteCourseWhereImIn(coursesRes);
				setCourses(deleteCourseWhereImIn(otherCourses));
				setCoursesSearch(trierListeParNom(otherCourses));
			})
			.catch((err) => {
				alert(err);
			});
	}, []);

	const sanitizeToSort = (str: string) => {
		str = str
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();
		if (str.charAt(0) == '(') {
			var end = str.indexOf(')');
			str = str.slice(end + 2, str.length);
		}
		return str;
	};

	const sortByProperty = (arr: any, property: string, order = 'ASC') => {
		arr.forEach((item: any) => (item.tempProp = sanitizeToSort(item[property])));
		arr.sort((a: any, b: any) =>
			order === 'ASC'
				? a.tempProp > b.tempProp
					? 1
					: a.tempProp < b.tempProp
					? -1
					: 0
				: a.tempProp > b.tempProp
				? -1
				: a.tempProp < b.tempProp
				? 1
				: 0
		);

		arr.forEach((item: any) => delete item.tempProp);
		return arr;
	};

	const trierListeParNom = (courses: Course[]) => {
		return sortByProperty(courses, 'nom');
	};

	const filterCourses = async (text: string): Promise<Course[]> => {
		return new Promise((resolve) => {
			const newData = courses.filter((item: any) => {
				const itemData = `${item.nom.toUpperCase()}`;
				const textData = text.trim().toUpperCase();
				return itemData.toUpperCase().includes(textData);
			});
			resolve(newData);
		});
	};

	const deleteCourseWhereImIn = (courses: Course[]) => {
        const myUid = Fire.shared.uid;
        let newCourses = courses.filter(x => 
            x.etudiants.findIndex(y => y.uid == myUid) === -1)
        return newCourses
	};

	const onChangeSearch = (newSearch: string) => {
		setSearch(newSearch);
		filterCourses(newSearch).then(async (res: Course[]) => {
			const temp = trierListeParNom(res);
			setCoursesSearch(temp);
		});
    };
    
    const deleteCourse = (course: Course) => {
        const newArr = courses.filter(item => item.uid !== course.uid)
        setCourses(newArr)
        const newArrSearch = coursesSearch.filter(item => item.uid !== course.uid)
        setCoursesSearch(newArrSearch)
    }

	return (
		<View style={[styles.container, { marginTop: headerHeight }]}>
			<SearchItems search={search} onChangeSearch={onChangeSearch} />
			{courses.length == 0 ? (
				<Text style={styles.warningTextEmpty}>Pas de cours à rejoindre</Text>
			) : coursesSearch.length == 0 ? (
				<Text style={styles.warningText}>Aucun résultat...</Text>
			) : (
				<FlatList
					extraData={coursesSearch}
					removeClippedSubviews={false}
					data={coursesSearch}
					renderItem={(item) => <SearchCoursesItem deleteItemOnParent={(res:Course) => deleteCourse(res)} item={item.item} navigation={navigation} />}
					keyExtractor={(item, index) => index.toString()}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	warningText: {
		fontSize: 17,
		alignSelf: 'center',
        color: 'red',
        marginTop: 200
    },
    warningTextEmpty: {
        alignSelf: "center",
        marginTop: 200
    }
});

export default AddCourseStudentScreen;