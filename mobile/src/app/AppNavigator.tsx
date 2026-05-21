import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RegisterScreen from "../screens/auth/RegisterScreen";

export type RootStackParamList = {
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Register">
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "Регистрация",
        }}
      />
    </Stack.Navigator>
  );
}