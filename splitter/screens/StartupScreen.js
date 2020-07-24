import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
  Text
} from 'react-native';
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import * as Contacts from "expo-contacts";
import {matchUsersWithContacts} from '../utils/initialiseContacts'

const StartupScreen = props => {
  const dispatch = useDispatch();
  console.log('startup screen')

  useEffect(() => {
    const tryLogin = async () => {
      
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        dispatch(authActions.setDidTryAutoLogin())
        return;
      }
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate, name, mobileNumber } = transformedData;
      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !token || !userId) {
        dispatch(authActions.setDidTryAutoLogin())
        return;
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime();
      const matchedContacts = matchUsersWithContacts();
      dispatch(authActions.setContacts(matchedContacts));
      dispatch(authActions.authenticate(userId, token, name, mobileNumber));
    };
    setTimeout(() => {
      tryLogin()
    }, 2000)
   //  tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>SPLITTER</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#2C2B2B'
  },
  text:{
    letterSpacing: 5,
    fontSize: 25,
    color:'#00B8AB'
  }
});

export default StartupScreen;
