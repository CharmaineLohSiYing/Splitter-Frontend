import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import {
  AuthNavigator,
  BillsNavigator,
  SplitterNavigator,
} from "./SplitterNavigator";
import StartupScreen from "../screens/StartupScreen";
import { useSelector } from "react-redux";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";

const AppNavigator = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
   
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1 }}>
            {isAuth && <SplitterNavigator />}
            {!isAuth && didTryAutoLogin && <AuthNavigator />}
            {!isAuth && !didTryAutoLogin && <StartupScreen />}
          </SafeAreaView>
        </NavigationContainer>
 
    </ApplicationProvider>
  );
};

export default AppNavigator;
