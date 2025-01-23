import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import Animated, { ZoomIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AVModeIOSOption,
    AudioEncoderAndroidType,
    AudioSet,
} from 'react-native-audio-recorder-player';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.1);

interface ChatInputFieldProps {
    audioFiles: any;
    setAudioFiles: Dispatch<SetStateAction<any>>;
    setWaveformDataToLocal: Dispatch<SetStateAction<any>>
    setRecordDurationToLocal: Dispatch<SetStateAction<any>>
    setOnPlayPauseToLocal: Dispatch<SetStateAction<null | (() => void)>>
}

const ChatInputField: React.FC<ChatInputFieldProps> = ({ audioFiles, setAudioFiles, setWaveformDataToLocal, setRecordDurationToLocal, setOnPlayPauseToLocal }) => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isRecorded, setIsRecorded] = useState<boolean>(false);
    const [playingAudio, setPlayingAudio] = useState<boolean>(false);
    const [waveformData, setWaveformData] = useState<number[]>([1]);
    const waveformRef = useRef<number[]>([1]);
    const [recordDuration, setRecordDuration] = useState<string>("00:00");

    const width = useSharedValue<number>(10);

    const animatedStyle = useAnimatedStyle(() => ({
        width: withTiming(width.value, { duration: 1000 }),
        backgroundColor: 'transparent',
    }));

    const audioSet: AudioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: 6, // MIC
        AVModeIOS: AVModeIOSOption.measurement,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    const startRecording = async () => {
        try {
            const result = await audioRecorderPlayer.startRecorder(undefined, audioSet);
            audioRecorderPlayer.addRecordBackListener((e) => {
                setRecordDuration(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
                setRecordDurationToLocal(recordDuration);
                if (e.currentMetering !== undefined) {
                    const smoothedAmplitude = Math.max((e.currentMetering + 70) * 1.2, 10);
                    waveformRef.current = [
                        ...waveformRef.current.slice(-50),
                        smoothedAmplitude
                    ];
                    setWaveformData([...waveformRef.current]);
                    width.value += 15;
                }
            });
            console.log("Result => ", result);
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = async () => {
        try {
            const result = await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
            setIsRecording(false);
            setIsRecorded(true);
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    };

    const toggleRecording = () => {
        isRecording ? stopRecording() : startRecording();
    };

    const togglePlayback = async () => {
        if (playingAudio) {
            await audioRecorderPlayer.stopPlayer();
            setPlayingAudio(false);
        } else {
            await audioRecorderPlayer.startPlayer();
            setPlayingAudio(true);
        }
    };

    const deleteAudio = () => {
        setIsRecorded(false);
        setWaveformData([1]);
        waveformRef.current = [1];
        setPlayingAudio(false);
    };

    const handleSendAudio = () => {
        setAudioFiles([...audioFiles, waveformData])
        setOnPlayPauseToLocal(togglePlayback)
        deleteAudio();
    }

    return (
        <View style={[styles.container, { backgroundColor: 'white' }]}>
            {isRecorded ? (
                <RecordedAudioView
                    waveformData={waveformData}
                    playingAudio={playingAudio}
                    onPlayPause={togglePlayback}
                    onDelete={deleteAudio}
                    animatedStyle={animatedStyle}
                    recordDuration={recordDuration}
                />
            ) : (
                <RecordingView
                    isRecording={isRecording}
                    waveformData={waveformData}
                    onRecord={toggleRecording}
                    animatedStyle={animatedStyle}
                    playingAudio={playingAudio}
                    recordDuration={recordDuration}
                />
            )}
            <SendButton onPress={handleSendAudio} />
        </View>
    );
};

interface RecordedAudioViewProps {
    waveformData: number[];
    playingAudio: boolean;
    onPlayPause: () => void;
    onDelete: () => void;
    animatedStyle: any;
    showDelete?: boolean;
    recordDuration: any
    recordedAudioContainerStyle?: ViewStyle
}

export const RecordedAudioView: React.FC<RecordedAudioViewProps> = ({
    waveformData,
    playingAudio,
    onPlayPause,
    onDelete,
    animatedStyle,
    showDelete = true,
    recordDuration,
    recordedAudioContainerStyle
}) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
        {showDelete && <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
            <Icon name="delete-outline" size={24} color="black" />
        </TouchableOpacity>}
        <View style={[styles.recordedAudioContainer, recordedAudioContainerStyle]}>
            <PlayPauseButton playingAudio={playingAudio} onPlayPause={onPlayPause} />
            <WaveformView waveformData={waveformData} animatedStyle={animatedStyle} playingAudio={playingAudio} />
            {recordDuration && (
                <Text style={{ color: 'black', marginLeft: 10 }}>{recordDuration}</Text>
            )}
        </View>
    </View>
);

interface RecordingViewProps {
    isRecording: boolean;
    waveformData: number[];
    onRecord: () => void;
    animatedStyle: any;
    playingAudio: any,
    recordDuration: any
}

const RecordingView: React.FC<RecordingViewProps> = ({
    isRecording,
    waveformData,
    onRecord,
    animatedStyle,
    playingAudio,
    recordDuration
}) => (
    <View style={styles.recordingView}>
        <Text style={styles.placeholderText}>Ask Anything...</Text>
        <WaveformView waveformData={waveformData} animatedStyle={animatedStyle} playingAudio={playingAudio} />
        <TouchableOpacity onPress={onRecord} style={styles.recordButton}>
            <Icon name={isRecording ? 'stop' : 'microphone'} size={25} color="black" />
        </TouchableOpacity>
    </View>
);

interface WaveformViewProps {
    waveformData: number[];
    animatedStyle: any;
    playingAudio: any

}

export const WaveformView: React.FC<WaveformViewProps> = ({ waveformData, animatedStyle, playingAudio }) => (
    <View style={styles.waveformContainer}>
        <Animated.View style={[styles.waveformBackground, animatedStyle,]}>
            {waveformData.map((height, index) => (
                <Animated.View
                    key={index}
                    entering={ZoomIn}
                    style={[styles.waveformBar, { height: Platform.OS === 'ios' ? height * 0.1 : height, backgroundColor: playingAudio ? '#F2BF42' : 'black', }]}
                />
            ))}
        </Animated.View>
    </View>
);

interface PlayPauseButtonProps {
    playingAudio: boolean;
    onPlayPause: () => void;
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({ playingAudio, onPlayPause }) => (
    <TouchableOpacity onPress={onPlayPause} style={styles.playPauseButton}>
        <Icon name={playingAudio ? 'pause' : 'play'} size={18} color="black" />
    </TouchableOpacity>
);

interface SendButtonProps {
    onPress: () => void
}

const SendButton: React.FC<SendButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.sendButton} onPress={onPress}>
            <Icon name="arrow-up" size={20} color="white" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        elevation: 4,
        borderRadius: 20,
        padding: 15,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
    },
    recordedAudioContainer: {
        flex: 1,
        backgroundColor: '#E7F8F8',
        height: 40,
        borderRadius: 50,
        marginHorizontal: 15,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    recordingView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    waveformContainer: {
        flex: 1,
        marginHorizontal: 20,
        height: 40,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    waveformBackground: {
        backgroundColor: '#E7F8F8',
        height: '80%',
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    waveformBar: {
        width: 2,
        borderRadius: 200,
        backgroundColor: withTiming('black', { duration: 1000 }),
        marginHorizontal: 2,
    },
    playPauseButton: {
        width: 25,
        height: 25,
        borderRadius: 15,
        backgroundColor: '#F2BF42',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recordButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButton: {
        backgroundColor: '#52B0BD',
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    placeholderText: {
        color: 'grey',
        fontSize: 16,
        fontWeight: '400',
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ChatInputField;
