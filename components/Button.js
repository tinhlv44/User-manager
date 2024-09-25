import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function Button({ title, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={style || styles.btn}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    backgroundColor: "#1abc9c",
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
