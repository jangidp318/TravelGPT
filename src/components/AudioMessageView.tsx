import { View } from 'react-native'
import React from 'react'
import { PlayPauseButton, RecordedAudioView, WaveformView } from './ChatInputField'

type AudioMessageViewType = {
    onPlayPause: any
    playingAudio: any
    animatedStyle: any
    waveformData: any
    recordDuration: any
}

const AudioMessageView = ({ onPlayPause,
    playingAudio,
    animatedStyle,
    waveformData,
    recordDuration }: AudioMessageViewType) => {
    console.log(onPlayPause)
    return (
        <View style={{ flex: 1, borderRadius: 20, height: 60, borderTopRightRadius: 0, padding: 20, paddingHorizontal: 0, backgroundColor: '#F1EFEF' }}>
            <RecordedAudioView
                waveformData={waveformData}
                playingAudio={playingAudio}
                onPlayPause={onPlayPause}
                onDelete={() => { }}
                animatedStyle={animatedStyle}
                recordDuration={recordDuration}
                showDelete={false}
                recordedAudioContainerStyle={{ flex: 1, backgroundColor: '#F1EFEF' }}
            />
        </View>
    )
}

export default AudioMessageView