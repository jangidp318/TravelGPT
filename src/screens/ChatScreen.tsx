import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import IconLabel from '../components/IconLabel'
import Icon from 'react-native-vector-icons/FontAwesome'
import ChatInputField from '../components/ChatInputField'

const chipsData = [
    {
        title: 'Holiday',
        iconName: 'umbrella-beach',
        isActive: true,
        iconColor: '#B338B3',
    },
    {
        title: 'Flight',
        iconName: 'airplane',
        isActive: false,
        iconColor: '#9ED8DF',
    },
    {
        title: 'Transfer',
        iconName: 'car',
        isActive: false,
        iconColor: '#D1AE90',
    },
    {
        title: 'Activity',
        iconName: 'run-fast',
        isActive: false,
        iconColor: '#A1A5AB',
    },
    {
        title: 'Hotel',
        iconName: 'office-building',
        isActive: false,
        iconColor: '#F7DFA3',
    }

]

const ChatScreen = () => {
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View style={{ flex: 1 }}>
                <Header
                    leftItem={
                        <TouchableOpacity style={{ height: 15, justifyContent: 'space-between', margin: 10 }}>
                            <View style={[styles.menuButtonLine, { width: 30 }]} />
                            <View style={[styles.menuButtonLine, { width: 20 }]} />
                            <View style={[styles.menuButtonLine, { width: 10 }]} />
                        </TouchableOpacity>
                    }
                    centerItem={
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={require('../assets/TraveGPT-Logo.jpeg')}
                                resizeMode='cover'
                                style={{ width: 28, height: 28 }}
                            />
                            <Text style={styles.headerTitle}>Travel GPT</Text>
                        </View>
                    }
                    rightItem={<View style={{ width: 30 }} />}
                />
                <View style={{ flex: 1 }}>
                    <View>
                        <Text style={styles.description}>Hi there! 👋 My name is Tratoli. How can I assist you today?</Text>
                    </View>
                    <View style={styles.chipsContainer}>
                        <FlatList
                            data={chipsData}
                            numColumns={3}
                            keyExtractor={(item) => item.title}
                            renderItem={({ item }) => (
                                <IconLabel
                                    label={item.title}
                                    iconName={item.iconName}
                                    isActive={item.isActive}
                                    onPress={() => { }}
                                    iconColor={item.iconColor}
                                />
                            )}
                            contentContainerStyle={styles.flatListContent}
                        />
                    </View>
                </View>
            </View>
            <ChatInputField />
        </View>
    )
}

export default ChatScreen;

const styles = StyleSheet.create({
    menuButtonLine: {
        width: 10,
        height: 3,
        backgroundColor: '#19B2BF',
        borderRadius: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginHorizontal: 5,
        color: 'grey'
    },
    description: {
        textAlign: 'center',
        marginHorizontal: 50,
        marginTop: 70
    },
    chipsContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    flatListContent: {
        alignItems: 'center',
        flexGrow: 1,
    }
})