import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreens';
import AddUserScreen from './screens/AddUserScreens';
import UpdateUserScreen from './screens/UpdateUserScreens';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        
      >
        <Stack.Screen name="Home" component={HomeScreen} 
          options={{
            headerShown:false,
          }} 
        />
        <Stack.Screen name="AddUser"  component={AddUserScreen} 
          options={{
            title:"Thêm người dùng",
          }} 
        />
        <Stack.Screen name="UpdateUser" component={UpdateUserScreen} 
          options={{
            title:"Cập nhật người dùng",
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
