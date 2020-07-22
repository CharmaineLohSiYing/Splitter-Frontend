import React from "react";
import {NavigationContainer} from '@react-navigation/native'
import {AuthNavigator, EventsNavigator, SplitterNavigator } from './SplitterNavigator'
import StartupScreen from '../screens/StartupScreen'
import { useSelector } from "react-redux";

const AppNavigator = props => {
    const st = useSelector(state => state.auth)
    const isAuth = useSelector(state => !!state.auth.token);
    const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);
  
    return <NavigationContainer>
        {isAuth && <SplitterNavigator/>}
        {!isAuth && didTryAutoLogin && <AuthNavigator/>}
        {!isAuth && !didTryAutoLogin && <StartupScreen/>}
        {/* <EventsNavigator/> */}
    </NavigationContainer>
  
  
  };
  
  export default AppNavigator;
  