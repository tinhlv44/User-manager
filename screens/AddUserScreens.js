import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, Text } from "react-native";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import { Formik } from "formik";
import { validationSchema } from "../yup";

const AddUserScreen = ({ navigation }) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    age: "",
  });

  const addUser = async (values) => {
    try {
      await addDoc(collection(db, "users"), {
        name: values.name,
        email: values.email,
        age: parseInt(values.age),
      });
      Alert.alert("Thành công", "Người dùng đã được thêm thành công!");
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi thêm người dùng: ", error);
      Alert.alert("Lỗi", "Thêm người dùng không thành công");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={addUser}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.list}>
            <TextInput
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              placeholder="Tên"
              style={styles.input}
            />
            {touched.name && errors.name && (
              <Text style={styles.error}>{errors.name}</Text>
            )}

            <TextInput
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <TextInput
              value={values.age}
              onChangeText={handleChange("age")}
              onBlur={handleBlur("age")}
              placeholder="Tuổi"
              style={styles.input}
              keyboardType="numeric"
            />
            {touched.age && errors.age && (
              <Text style={styles.error}>{errors.age}</Text>
            )}

            <Button title={"Thêm"} onPress={handleSubmit} />
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20},
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
  },
});

export default AddUserScreen;
