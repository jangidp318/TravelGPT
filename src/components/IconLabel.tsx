import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type IconLabelProps = {
    label: string
    iconName: string
    isActive: boolean
    onPress: () => void
    iconColor: string
}

const IconLabel = ({ label, iconName, isActive, onPress, iconColor }: IconLabelProps) => {
    return (
        <TouchableOpacity
            style={[styles.chip, isActive ? styles.activeChip : styles.inactiveChip]}
            onPress={onPress}
        >
            <Icon
                name={iconName}
                size={20}
                color={iconColor}
                style={styles.icon}
            />
            <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    flatListContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1, // Ensures proper spacing and centering
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        margin: 8, // Add spacing between chips
        width: 110, // Ensure consistent size for alignment
        justifyContent: 'center',
    },
    activeChip: {
        backgroundColor: 'white',
        borderColor: '#E6E6E6',
    },
    inactiveChip: {
        backgroundColor: 'white',
        borderColor: '#F3F3F3',
    },
    label: {
        fontSize: 14,
        marginLeft: 6,
    },
    activeLabel: {
        color: 'black',
        fontWeight: '600'
    },
    inactiveLabel: {
        color: 'grey',
        fontWeight: '400'
    },
    icon: {
        marginRight: 4,
    },
});

export default IconLabel;
