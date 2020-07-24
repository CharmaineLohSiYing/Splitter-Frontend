import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {SafeAreaView} from 'react-native'
import {
  AuthNavigator,
  EventsNavigator,
  SplitterNavigator,
} from "./SplitterNavigator";
import StartupScreen from "../screens/StartupScreen";
import { useSelector } from "react-redux";

const AppNavigator = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        {isAuth && <SplitterNavigator />}
        {!isAuth && didTryAutoLogin && <AuthNavigator />}
        {!isAuth && !didTryAutoLogin && <StartupScreen />}
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default AppNavigator;
