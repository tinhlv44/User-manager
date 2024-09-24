import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { db } from '../firebase'; // Đảm bảo bạn đã export đúng `db` từ firebaseConfig
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore'; // Import đúng từ Firestore
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Hook để sử dụng navigation

  useEffect(() => {
    const usersCollectionRef = collection(db, 'users');

    // Sử dụng onSnapshot để lắng nghe thay đổi theo thời gian thực
    const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
      const updatedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(updatedUsers);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users: ", error);
      setLoading(false);
    });

    // Cleanup listener khi component bị unmounted
    return () => unsubscribe();
  }, []);

  const deleteUser = async (id) => {
    try {
      // Sử dụng doc và deleteDoc để xóa người dùng
      await deleteDoc(doc(db, 'users', id));
      Alert.alert("Success", "User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      {users.map(user => (
        <View key={user.id} style={styles.userContainer}>
          {/* <View style={styles.vImage}>
            <Image
              source={require('../assets/avatar.png')}
              style={styles.image}
            />
          </View> */}
          <View style={styles.detail}>

            <Text style={styles.name}>Tên: {user.name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Tuổi: {user.age}</Text>
            <Text>ID: {user.id}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('UpdateUser', { userId: user.id })} style={styles.updateButton}>
            <FontAwesome5 name="user-edit" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteUser(user.id)} style={styles.deleteButton}>
            <MaterialCommunityIcons name="delete" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    paddingVertical:10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection:'row',
    alignItems:'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
    marginHorizontal:4,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginHorizontal:4,
  },
  vImage:{
    marginHorizontal:6
  },
  image:{
    borderRadius: 25,
  },
  name:{
    color: 'blue',
    fontSize: 16,
    fontWeight:'bold'
  },
  detail:{
    width: '75%'
  }
});

export default UserList;
