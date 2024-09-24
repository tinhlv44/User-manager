import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

const AddUserScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  const addUser = async () => {
    try {
      await addDoc(collection(db, 'users'), {
        name,
        email,
        age: parseInt(age),
      });
      //fetchUsers();
      Alert.alert("Success", "User added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding user: ", error);
      Alert.alert("Error", "Failed to add user");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" style={styles.input} />
      <Button title="Add User" onPress={addUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 }
});

export default AddUserScreen;
