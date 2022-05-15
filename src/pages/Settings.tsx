import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

type Props = {}


const Settings = (props: Props) => {
  const [count, setCount] = useState(1)

  return (
    <View>
      <Pressable onPress={() => setCount(p => p + 1)} >
        <Text>{count}</Text>
      </Pressable>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({})