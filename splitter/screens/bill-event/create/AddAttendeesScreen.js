import React, { useState, useEffect, useReducer, useCallback } from "react";
import { View, FlatList, Text, StyleSheet, Button, TextInput, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import * as authActions from "../../../store/actions/auth";
import * as eventActions from "../../../store/actions/bill-event";
import * as Contacts from "expo-contacts";
import ContactDisplay from "../../../components/ContactDisplay";
import {matchUsersWithContacts} from '../../../utils/initialiseContacts'
import Colors from '../../../constants/Colors'

const AddAttendeesScreen = (props) => {
  const [contacts, setContacts] = useState([]);
  const [contactsArr, setContactsArr] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState({});
  const [query, setQuery] = useState('')

  const dispatch = useDispatch();

  var contactsFromStore = useSelector((state) => state.auth.contacts);
  var attendeesFromStore = useSelector(state => state.billEvent.attendees)

  useEffect(() => {
    const attendeesFromStoreArr = Object.keys(attendeesFromStore)
    if (attendeesFromStoreArr.length != 0){
      const tempArr = []
      setSelectedContacts(attendeesFromStore)
      if (contactsFromStore){
        for (const mobileNumber of Object.keys(contactsFromStore)) { 
          contactsFromStore[mobileNumber]["selected"] =
            mobileNumber in attendeesFromStore;
            tempArr.push(contactsFromStore[mobileNumber])
        }
        setContactsArr(tempArr);
        setContact(contactsFromStore)
      }
    }
  }, [])
  

  useEffect(() => {

    async function initialiseContacts() {
      var matched = await matchUsersWithContacts()
      dispatch(authActions.setContacts(matched));
    }

    if (contactsFromStore) {
      const tempArr = []
      const attendeesFromStoreArr = Object.keys(attendeesFromStore)
      if (attendeesFromStoreArr.length != 0){
        for (const mobileNumber of Object.keys(contactsFromStore)) { 
          contactsFromStore[mobileNumber]["selected"] =
            mobileNumber in attendeesFromStore;
            tempArr.push(contactsFromStore[mobileNumber])
        }
      } else {
        for (const mobileNumber of Object.keys(contactsFromStore)) { 
          contactsFromStore[mobileNumber]["selected"] =
            mobileNumber in selectedContacts;
            tempArr.push(contactsFromStore[mobileNumber])
        }
      }
      setContactsArr(tempArr);
      setContacts(contactsFromStore);
    } else {
      initialiseContacts()
    }
  }, [contactsFromStore]);

  const proceedHandler = () => {
    dispatch(eventActions.addAttendees(selectedContacts));
    props.navigation.navigate("AddOrders");
  };

  const removeFromSelectedContacts = (mobileNumber) => {

    const objIndex = contactsArr.findIndex((obj => obj.mobileNumber == mobileNumber));
    contactsArr[objIndex].selected = false
  
    var selectedContactsTemp = { ...selectedContacts };
    delete selectedContactsTemp[mobileNumber];
    setSelectedContacts(selectedContactsTemp);
  };

  const selectContactHandler = (name, mobileNumber) => {

    const objIndex = contactsArr.findIndex((obj => obj.mobileNumber == mobileNumber));
    
    //Update object's name property.
    contactsArr[objIndex].selected = !contactsArr[objIndex].selected
    if (mobileNumber in selectedContacts) {
      // de-select
      var selectedContactsTemp = { ...selectedContacts };
      delete selectedContactsTemp[mobileNumber];
      setSelectedContacts(selectedContactsTemp);
    } else {
      // select
      setSelectedContacts({
        ...selectedContacts,
        [mobileNumber]: { name, mobileNumber },
      });
    }
  };

  const searchContacts = () => {
    
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
      }}
    >
      <View><TextInput style={styles.searchBar} placeholder="Search" onChangeText={searchContacts}/></View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={proceedHandler}
        style={styles.floatingButton}
      />
      <View style={styles.selectedContacts}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={Object.keys(selectedContacts)}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <View>
              <Text onPress={() => removeFromSelectedContacts(selectedContacts[item].mobileNumber)}>
                {selectedContacts[item].name}
              </Text>
            </View>
          )}
        />
      </View>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={contactsArr}
        initialNumToRender={10}
        renderItem={({ item }) => (
          <ContactDisplay
            id={item.mobileNumber}
            selected={item.selected}
            mobileNumber={item.mobileNumber.toString()}
            name={item.name}
            onSelect={selectContactHandler}
          />
        )}
      />
    </View>
  );
};

AddAttendeesScreen.navigationOptions = {
  headerTitle: "Add Attendees",
};

const styles = StyleSheet.create({
  selectedContacts: {
    backgroundColor: "#ccc",
    height: "30%",
  },
  buttonContainer: {
    height: "10%",
  },
  floatingButton: {
    backgroundColor: Colors.primary,
    position: "absolute",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    borderRadius: 40,
    zIndex: 1,
  },
  searchBar:{
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    padding: 10,
    height: 50
  }
});
export default AddAttendeesScreen;
