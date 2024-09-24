import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const UpdateUserScreen = ({ route, navigation }) => {
  const { userId } = route.params; // Lấy userId từ params
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDocRef); // Sử dụng getDoc để lấy tài liệu
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUser(userData);
          setName(userData.name);
          setEmail(userData.email);
          setAge(userData.age.toString());
        } else {
          Alert.alert("Error", "User does not exist");
        }
      } catch (error) {
        console.error("Error fetching user: ", error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleUpdate = async () => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        name,
        email,
        age: parseInt(age),
      });
      Alert.alert("Success", "User updated successfully!");
      navigation.goBack(); // Quay lại màn hình trước
    } catch (error) {
      console.error("Error updating user: ", error);
      Alert.alert("Error", "Failed to update user");
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            style={styles.input}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            value={age}
            onChangeText={setAge}
            placeholder="Age"
            style={styles.input}
            keyboardType="numeric"
          />
          <Button title="Update" onPress={handleUpdate} />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 15,
  },
});

export default UpdateUserScreen;
