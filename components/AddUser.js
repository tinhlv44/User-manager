import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../firebase';

const AddUser = ({ onUserAdded }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(false);


    const addUser = async (name, email, age) => {
        try {
          const newUser = {
            name,
            email,
            age
          };
          await db.collection('users').add(newUser);
          console.log("User added successfully");
        } catch (error) {
          console.error("Error adding user: ", error);
        }
      };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const user = { name, email, age: parseInt(age) };
            await db.collection('users').add(user);
            onUserAdded();
            alert('Thêm người dùng thành công!');
        } catch (error) {
            console.error("Error adding user: ", error);
            alert('Lỗi thêm người dùng!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <Text>Thêm người dùng mới</Text>
            <TextInput
                placeholder="Tên"
                value={name}
                onChangeText={(text) => setName(text)} // Sử dụng onChangeText để cập nhật giá trị
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)} // Sử dụng onChangeText
                keyboardType="email-address" // Đặt loại bàn phím cho email
            />
            <TextInput
                placeholder="Tuổi"
                value={age}
                onChangeText={(text) => setAge(text)} // Sử dụng onChangeText
                keyboardType="numeric" // Đặt loại bàn phím cho tuổi
            />
            <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                <Text>{loading ? 'Đang thêm...' : 'Thêm người dùng'}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddUser;
