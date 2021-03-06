import { IMessage } from "react-native-gifted-chat/lib/GiftedChat";

export interface Course {
    uid?: string;
	enseignants: BasicUserInfos[];
	nom: string;
	skills: Skill[];
    etudiants: BasicUserInfos[];
    color: string;
    messages: IMessage[],
    tokens: string[],
    documents: Document[];
}

export interface CourseWithoutUID {
	enseignants: BasicUserInfos[];
	nom: string;
	skills: Skill[];
    etudiants: BasicUserInfos[];
    color: string;
    messages: IMessage[],
    tokens: string[];
    documents: Document[];
}

export interface User {
    uid: string;
    annee: string | null;
    filiere: string | null;
    nom: string;
    prenom: string;
    etudiant: boolean;
    token: string;
    avatar: string;
    notifications: Notification[];
}

export interface Notification {
    type: TypeNotification;
    message : string;
    date: Date;
    from : string; 
}

export enum TypeNotification {
    MESSAGE = "Nouveau message",
    JOINCOURSE = "Nouveau membre",
    SKILLDONE = "Skill acquis"
}
export interface BasicUserInfos {
    uid: string | null | undefined;
    displayName: string | null | undefined;
    token: string;
    avatar: string;
}


export interface Quizz {
	question: string;
	propositions: string[];
	solution: string;
}

export interface Skill {
	nom: string;
	autoEvaluate: boolean;
	isSoftSkill: boolean;
    quizz: Quizz[] | null;
    check: string[];
}

export interface Reward {
    id: number;
    src: any;
    name: string;
    func: string;
    done: boolean;
}

export interface CardQuizz{
    question: string,
    cards: Card[]
}

export interface Card{
    number: string;
    question: string;
    value: boolean;
    revealed: boolean;
    picked: boolean;
}

export interface Document{
    titre:string;
    url:string;
}