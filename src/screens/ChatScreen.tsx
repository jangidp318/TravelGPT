import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import IconLabel from '../components/IconLabel'
import Icon from 'react-native-vector-icons/FontAwesome'
import ChatInputField, { RecordedAudioView } from '../components/ChatInputField'
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import AudioMessageView from '../components/AudioMessageView'

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
    const audioRecorderPlayer = new AudioRecorderPlayer();
    audioRecorderPlayer.setSubscriptionDuration(0.1);
    const [audioFiles, setAudioFiles] = useState<number[][]>([]);
    const [playingAudio, setPlayingAudio] = useState<boolean>(false);
    const [waveformData, setWaveformData] = useState<number[] | null>(null);
    const [recordDuration, setRecordDuration] = useState("00:00")
    const [onPlayPause, setOnPlayPause] = useState<null | (() => void)>(null);

    const width = useSharedValue<number>(10);

    const animatedStyle = useAnimatedStyle(() => ({
        width: withTiming(width.value, { duration: 1000 }),
        backgroundColor: 'transparent',
    }));

    useEffect(() => {
        console.log("Data => ", waveformData)
    }, [waveformData])


    const togglePlayback = async () => {
        if (playingAudio) {
            await audioRecorderPlayer.stopPlayer();
            setPlayingAudio(false);
        } else {
            await audioRecorderPlayer.startPlayer();
            setPlayingAudio(true);
        }
    };
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View style={{ flex: 1 }}>
                <SafeAreaView />
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
                {
                    audioFiles.length > 0
                        ? <View style={{ flex: 1, paddingTop: 50, alignItems: 'flex-end' }}>
                            <FlatList
                                data={audioFiles}
                                style={{ flex: 1, width: 300 }}
                                renderItem={({ item }) => {
                                    console.log('item =>', item)
                                    return (
                                        <View style={{ flex: 1, marginVertical: 5 }}>
                                            <AudioMessageView animatedStyle={animatedStyle} onPlayPause={togglePlayback} playingAudio={playingAudio} waveformData={item} recordDuration={recordDuration} />
                                        </View>
                                    )
                                }}
                            />

                        </View>
                        : <View style={{ flex: 1 }}>
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
                }
            </View>

            <ChatInputField audioFiles={audioFiles} setAudioFiles={setAudioFiles} setWaveformDataToLocal={setWaveformData} setRecordDurationToLocal={setRecordDuration} setOnPlayPauseToLocal={setOnPlayPause} />
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