import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import UserList from '../components/UserList';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button title="Add New User" onPress={() => navigation.navigate('AddUser')} />
      <UserList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
});

export default HomeScreen;
