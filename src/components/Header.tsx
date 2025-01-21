import { View, Text } from 'react-native'
import React from 'react'

type HeaderProps = {
    leftItem?: any
    centerItem?: any
    rightItem?: any
}

const Header = ({ leftItem, centerItem, rightItem }: HeaderProps) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {leftItem}
            {centerItem}
            {rightItem}
        </View>
    )
}

export default Header