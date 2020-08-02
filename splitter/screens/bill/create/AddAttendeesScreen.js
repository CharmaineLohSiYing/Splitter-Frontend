import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useRef,
} from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import * as authActions from "../../../store/actions/auth";
import * as billActions from "../../../store/actions/bill";
import * as Contacts from "expo-contacts";
import ContactDisplay from "../../../components/ContactDisplay";
import { matchUsersWithContacts } from "../../../utils/initialiseContacts";
import Colors from "../../../constants/Colors";
import { SearchableFlatList } from "react-native-searchable-list";
import SelectedContactDisplay from "../../../components/SelectedContactDisplay";
import { Item, HeaderButtons } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../../components/UI/CustomHeaderButton";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AddBillProgress from "../../../components/AddBillProgress"

// height of each contact container + flatlist separator
const ITEM_HEIGHT = 61
const FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "#A9B7DB",
      }}
    />
  );
};

const compare = ( a, b ) => {
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}


const AddAttendeesScreen = (props) => {
  const [contactsArr, setContactsArr] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [screenWidth, setScreenWidth] = useState(
    () => Dimensions.get("window").width
  );
  const dispatch = useDispatch();

  // console.log('render')

  var contactsFromStore = useSelector((state) => state.auth.contacts);
  var attendeesFromStore = useSelector((state) => state.bill.attendees);

  const selectedContactsRef = useRef(null);

  // props.navigation.setOptions({
  //   headerTitle: 'Add Attendees',
  //   headerTitleStyle: {
  //     fontFamily: "roboto-regular",
  //     flex: 1,
  //     alignSelf: "center",
  //   },
  //   headerRight: () => {
  //     return (
  //       <View style={styles.numAttendeesContainer}>
  //         <Text style={{color: 'white'}}>{selectedContacts.length} selected</Text>
  //       </View>
  //     );
  //   },
  // });

  useEffect(() => {
    const attendeesFromStoreArr = Object.keys(attendeesFromStore);
    if (attendeesFromStoreArr.length != 0) {
      const tempArr = [];
      const tempSelectedArr = [];
      attendeesFromStoreArr.forEach((key) => {
        const attendee = attendeesFromStore[key];
        if (!attendee.currentUser) {
          tempSelectedArr.push(attendee);
        }
      });
      // setSelectedContacts(attendeesFromStore);
      setSelectedContacts(tempSelectedArr);
      if (contactsFromStore) {
        for (const mobileNumber of Object.keys(contactsFromStore)) {
          contactsFromStore[mobileNumber]["selected"] =
            mobileNumber in attendeesFromStore;
          tempArr.push(contactsFromStore[mobileNumber]);
        }
        tempArr.sort(compare);
        setContactsArr(tempArr);
      }
    }
  }, []);

  useEffect(() => {
    async function initialiseContacts() {
      var matched = await matchUsersWithContacts();
      dispatch(authActions.setContacts(matched));
    }

    if (contactsFromStore) {
      const tempArr = [];
      const attendeesFromStoreArr = Object.keys(attendeesFromStore);
      if (attendeesFromStoreArr.length != 0) {
        for (const mobileNumber of Object.keys(contactsFromStore)) {
          contactsFromStore[mobileNumber]["selected"] =
            mobileNumber in attendeesFromStore;
          tempArr.push(contactsFromStore[mobileNumber]);
        }
      } else {
        for (const mobileNumber of Object.keys(contactsFromStore)) {
          contactsFromStore[mobileNumber]["selected"] =
            selectedContacts.findIndex((obj) => {
              obj.mobileNumber == mobileNumber;
            }) > -1;
          // contactsFromStore[mobileNumber]["selected"] =
          //   mobileNumber in selectedContacts;
          tempArr.push(contactsFromStore[mobileNumber]);
        }
      }
      tempArr.sort(compare);
      setContactsArr(tempArr);
    } else {
      initialiseContacts();
    }
  }, [contactsFromStore]);

  const proceedHandler = () => {
    dispatch(billActions.addAttendees(selectedContacts));
    props.navigation.navigate("AddOrders");
    // props.navigation.navigate("Test");
  };

  const removeFromSelectedContacts = (mobileNumber) => {
    const objIndex = contactsArr.findIndex(
      (obj) => obj.mobileNumber == mobileNumber
    );
    contactsArr[objIndex].selected = false;
    setContactsArr(contactsArr);

    setSelectedContacts(
      selectedContacts.filter((contact) => contact.mobileNumber != mobileNumber)
    );
  };

  const selectContactHandler = (name, mobileNumber) => {
    const objIndex = contactsArr.findIndex(
      (obj) => obj.mobileNumber == mobileNumber
    );

    //Update object's name property.
    contactsArr[objIndex].selected = !contactsArr[objIndex].selected;
    setContactsArr(contactsArr);

    const selectedObjIndex = selectedContacts.findIndex(
      (obj) => obj.mobileNumber == mobileNumber
    );
    if (selectedObjIndex > -1) {
      // deselect
      const copiedArr = [...selectedContacts];
      copiedArr.splice(selectedObjIndex, 1);
      setSelectedContacts(copiedArr);
    } else {
      // select
      setSelectedContacts(selectedContacts.concat({ name, mobileNumber }));
    }
  };

  const handleSearch = (text) => {
    setQuery(text);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
      }}
    > 
      <AddBillProgress progress={3}/>
      <View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          onChangeText={handleSearch}
          value={query}
        />
      </View>
      <TouchableOpacity
        disabled={selectedContacts.length === 0}
        activeOpacity={0.9}
        onPress={proceedHandler}
        style={[styles.floatingButton, selectedContacts.length === 0 && styles.disabledButton]}
      >
          <Ionicons name="md-arrow-forward" size={24} color="white" />
       </TouchableOpacity>
      {selectedContacts.length > 0 && (
          <View style={styles.selectedContacts}>
            <FlatList
              contentContainerStyle={{ alignItems: "center" }}
              keyExtractor={(item, index) => item.mobileNumber}
              data={selectedContacts}
              extraData={selectedContacts}
              initialNumToRender={10}
              ref={selectedContactsRef}
              horizontal={true}
              onContentSizeChange={(contentWidth) => {
                if (contentWidth <= screenWidth) {
                  selectedContactsRef.current.scrollToIndex({
                    index: 0,
                    animated: false,
                  });
                } else {
                  selectedContactsRef.current.scrollToEnd({
                    index: 0,
                    animated: true,
                  });
                }
              }}
              renderItem={({ item }) => (
                <View>
                  <SelectedContactDisplay
                    name={item.name}
                    onPress={removeFromSelectedContacts}
                    mobileNumber={item.mobileNumber}
                  />
                </View>
              )}
            />
          </View>

      )}

      <SearchableFlatList
        data={contactsArr}
        ItemSeparatorComponent={FlatListItemSeparator}
        searchTerm={query}
        searchAttribute="name"
        ignoreCase={true}
        getItemLayout={(data, index) => (
          {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
        )}
      
        renderItem={({ item }) => (
          <ContactDisplay
            selected={item.selected}
            mobileNumber={item.mobileNumber}
            name={item.name}
            onSelect={selectContactHandler}
          />
        )}
        keyExtractor={(item, index) => item.mobileNumber}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  selectedContacts: {
    height: 50,
    justifyContent: "center",
    // width: "80%",
  },
  floatingButton: {
    backgroundColor: Colors.primary,
    position: "absolute",
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    borderRadius: 35,
    zIndex: 1,
    flexDirection:'row',
  },
  disabledButton:{
    backgroundColor:'#619995'
  },
  searchBar: {
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.primary,
    padding: 10,
    height: 50,
  },
  selected: {
    backgroundColor: "yellow",
  },
  notSelected: {
    backgroundColor: "white",
  },
  container: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  numSelected: {
    color: "white",
    fontSize: 24,
  },
  numAttendeesContainer: {
    paddingHorizontal: 10,
    // width: "20%",
  },
  selectedContactsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
export default AddAttendeesScreen;
