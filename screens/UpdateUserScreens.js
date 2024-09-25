import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import Button from '../components/Button';
import { validationSchema } from '../yup';


const UpdateUserScreen = ({ route, navigation }) => {
  const { userId } = route.params; // Lấy userId từ params
  const [initialValues, setInitialValues] = useState({ name: '', email: '', age: '' });

  useEffect(() => {
   
    const fetchUser = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDocRef); // Sử dụng getDoc để lấy tài liệu
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setInitialValues({
            name: userData.name,
            email: userData.email,
            age: userData.age.toString(),
          });
        } else {
          Alert.alert("Lỗi", "Người dùng không tồn tại");
        }
      } catch (error) {
        console.error("Lỗi khi lấy người dùng: ", error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleUpdate = async (values) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        name: values.name,
        email: values.email,
        age: parseInt(values.age),
      });
      Alert.alert("Thành công", "Cập nhật người dùng thành công!");
      navigation.goBack(); // Quay lại màn hình trước
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng: ", error);
      Alert.alert("Lỗi", "Cập nhật người dùng không thành công");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleUpdate}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.list}>
            <TextInput
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              placeholder="Tên"
              style={styles.input}
            />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
            
            <TextInput
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
            
            <TextInput
              value={values.age}
              onChangeText={handleChange('age')}
              onBlur={handleBlur('age')}
              placeholder="Tuổi"
              style={styles.input}
              keyboardType="numeric"
            />
            {touched.age && errors.age && <Text style={styles.error}>{errors.age}</Text>}
            <Button title={'Cập nhập'} onPress={handleSubmit}/>
            
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 20,
  },
  
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
  },
});

export default UpdateUserScreen;
