import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserList from '../components/UserList';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Button title="Thêm người dùng" onPress={() => navigation.navigate('AddUser')} />
      <UserList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1
  },
});

export default HomeScreen;
