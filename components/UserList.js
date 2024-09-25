import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ToastAndroid } from 'react-native';
import { db } from '../firebase';
import { collection, query, limit, startAfter, endBefore, onSnapshot, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Button from './Button';

const PAGE_SIZE = 6; 

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderByName, setOrderByName] = useState(true);
  const [lastVisible, setLastVisible] = useState(null); 
  const [firstVisible, setFirstVisible] = useState(null); 
  const navigation = useNavigation();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true); 
      const usersCollectionRef = collection(db, 'users');
      let userQuery;
  
      if (currentPage === 1) {
        userQuery = query(
          usersCollectionRef,
          orderBy(orderByName ? 'name':'age'),
          limit(PAGE_SIZE)
        );
      } else if (currentPage > 1 && lastVisible) {
        userQuery = query(
          usersCollectionRef,
          orderBy(orderByName ? 'name':'age'),
          startAfter(lastVisible),
          limit(PAGE_SIZE)
        );
      } else if (currentPage < totalPages && firstVisible) {
        userQuery = query(
          usersCollectionRef,
          orderBy(orderByName ? 'name':'age'),
          endBefore(firstVisible),
          limit(PAGE_SIZE)
        );
      }
  
      const unsubscribe = onSnapshot(userQuery, async (snapshot) => {
        if (!snapshot || !snapshot.docs.length) {
          throw new Error('No data found');
        }
  
        const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(fetchedUsers);
        setFirstVisible(snapshot.docs[0]); 
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]); 
  
        const totalUsers = await getTotalUsers();
        setTotalPages(Math.ceil(totalUsers / PAGE_SIZE));
        setLoading(false); 
      });
  
      return () => unsubscribe();
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi lấy dữ liệu người dùng: ", error);
    }
  };
  

  const getTotalUsers = async () => {
    try {
      const usersCollectionRef = collection(db, 'users');
      const snapshot = await new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(usersCollectionRef, resolve, reject);
        return () => unsubscribe();
      });
      return snapshot.size;
    } catch (error) {
      console.error("Lỗi khi lấy tổng số người dùng: ", error);
      return 0;
    }
  };

  const deleteUser = (id) => {
    Alert.alert(
      "Xác nhận xóa", 
      "Bạn có chắc chắn muốn xóa người dùng này?", 
      [
        {
          text: "Hủy", 
          onPress: () => console.log("Hủy bỏ xóa"),
          style: "cancel",
        },
        {
          text: "Xóa", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', id)); 
              ToastAndroid.showWithGravityAndOffset(
                "Người dùng đã được xóa!",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
              fetchUsers(); 
            } catch (error) {
              console.error("Lỗi khi xóa người dùng: ", error);
            }
          },
          style: "destructive", 
        },
      ],
      { cancelable: true }
    );
  };
  const changeOrderBy = () =>{
    setOrderByName(!orderByName)
    fetchUsers()
    fetchUsers()
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setLoading(true); 
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{flex: 1}}>
      {/* <View style={{flexDirection: 'row', alignItems:"center", padding: 4}}>
        <Text>Xếp theo: </Text>
        <Button title={'Tên'} style={[styles.btn, {backgroundColor: orderByName? 'blue': 'gray'}]} onPress={changeOrderBy}/>
        <Button title={'Tuổi'} style={[styles.btn, {backgroundColor: !orderByName? 'blue': 'gray'}]} onPress={changeOrderBy}/>
      </View> */}
      {users.map(user => (
        <View key={user.id} style={styles.userContainer}>
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
      <View style={styles.pagination}>
        <TouchableOpacity onPress={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={styles.paginationButton}>
          <Text style={styles.paginationText}>Trước</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>Trang {currentPage} / {totalPages}</Text>
        <TouchableOpacity onPress={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} style={styles.paginationButton}>
          <Text style={styles.paginationText}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  name: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold'
  },
  detail: {
    width: '75%'
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    bottom: 0
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  paginationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  btn:{
    backgroundColor:'gray',
    padding: 12,
    borderRadius: 20,
    marginRight: 8
  }
});

export default UserList;
