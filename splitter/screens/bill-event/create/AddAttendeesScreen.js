import React, { useState, useEffect, useReducer, useCallback } from "react";
import { View, FlatList, Text, StyleSheet, Button } from "react-native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import * as authActions from "../../../store/actions/auth";
import * as eventActions from "../../../store/actions/bill-event";
import * as Contacts from "expo-contacts";
import ContactDisplay from "../../../components/ContactDisplay";
import {matchUsersWithContacts} from '../../../utils/initialiseContacts'

const AddAttendeesScreen = (props) => {
  const [contacts, setContacts] = useState({});
  const [selectedContacts, setSelectedContacts] = useState({});

  const dispatch = useDispatch();

  var contactsFromStore = useSelector((state) => state.auth.contacts);
  var attendeesFromStore = useSelector(state => state.billEvent.attendees)

  useEffect(() => {
    const attendeesFromStoreArr = Object.keys(attendeesFromStore)
    if (attendeesFromStoreArr.length != 0){
      setSelectedContacts(attendeesFromStore)
      if (contactsFromStore){
        for (const mobileNumber of Object.keys(contactsFromStore)) { 
          contactsFromStore[mobileNumber]["selected"] =
            mobileNumber in attendeesFromStore;
        }
        setContacts(contactsFromStore);
      }
    }
  }, [])
  

  useEffect(() => {

    async function initialiseContacts() {
      var matched = await matchUsersWithContacts()
      dispatch(authActions.setContacts(matched));
    }

    if (contactsFromStore) {
      const attendeesFromStoreArr = Object.keys(attendeesFromStore)
      if (attendeesFromStoreArr.length != 0){
        for (const mobileNumber of Object.keys(contactsFromStore)) { 
          contactsFromStore[mobileNumber]["selected"] =
            mobileNumber in attendeesFromStore;
        }
      } else {
        for (const mobileNumber of Object.keys(contactsFromStore)) { 
          contactsFromStore[mobileNumber]["selected"] =
            mobileNumber in selectedContacts;
        }
      }
      
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
    if (mobileNumber in contacts) {
      const originalContact = contacts[mobileNumber];
      const updatedContact = {
        ...originalContact,
        selected: !originalContact.selected,
      };
      setContacts({ ...contacts, [mobileNumber]: updatedContact });
      var selectedContactsTemp = { ...selectedContacts };
      delete selectedContactsTemp[mobileNumber];
      setSelectedContacts(selectedContactsTemp);
    }
  };

  const selectContactHandler = (name, mobileNumber) => {
    const originalContact = contacts[mobileNumber];
    const updatedContact = {
      ...originalContact,
      selected: !originalContact.selected,
    };
    setContacts({ ...contacts, [mobileNumber]: updatedContact });

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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
      }}
    >
      <View style={styles.buttonContainer}>
        <Button title="Proceed" onPress={proceedHandler} />
      </View>
      <View style={styles.selectedContacts}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={Object.keys(selectedContacts)}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <View>
              <Text onPress={() => removeFromSelectedContacts(item)}>
                {selectedContacts[item].name}
              </Text>
            </View>
          )}
        />
      </View>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={Object.keys(contacts)}
        initialNumToRender={10}
        renderItem={({ item }) => (
          <ContactDisplay
            id={item}
            selected={contacts[item].selected}
            mobileNumber={contacts[item].mobileNumber.toString()}
            name={contacts[item].name}
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
});
export default AddAttendeesScreen;
