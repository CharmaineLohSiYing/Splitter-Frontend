import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import * as Contacts from "expo-contacts";
import {matchUsersWithContacts} from '../utils/initialiseContacts'

const StartupScreen = props => {
  const dispatch = useDispatch();
  console.log('startup screen')
  // matchUsersWithContacts = async () => {
  //   const { status } = await Contacts.requestPermissionsAsync();
  //   if (status === "granted") {
  //     const { data } = await Contacts.getContactsAsync({
  //       fields: [Contacts.Fields.PhoneNumbers],
  //     });

  //     const filteredData = data.filter((contact) => {
  //       return contact.phoneNumbers !== undefined;
  //     });

  //     var contactsObj = {};
  //       filteredData.forEach((contactData) => {
  //         contactData.phoneNumbers.forEach(phoneNumber => {
  //           if (phoneNumber.label === 'mobile'){
  //             var number = phoneNumber.number
  //             if (number.startsWith("+65")){
  //               number = number.substr(3)
  //             }
  //             number = number.replace(/ /g, "");
  //             if ((number.startsWith("8") || number.startsWith("9")) && number.length == 8){
  //               const newContactData = {
  //                 mobileNumber: number,
  //                 name: contactData.name,
  //               };
  //               contactsObj[number] = newContactData;
  //             }
              
  //           }
            
  //         })
  //       });
  //       dispatch(authActions.setContacts(contactsObj))

  //   }
  // };

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

    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default StartupScreen;
