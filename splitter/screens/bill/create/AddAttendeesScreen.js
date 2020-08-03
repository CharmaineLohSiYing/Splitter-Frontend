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
  TouchableHighlight,
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
import MyAppText from "../../../components/UI/MyAppText";
import CreateBillHeader from "../../../components/CreateBillHeader";
const screenWidth = Dimensions.get("window").width;

const HEADER_HEIGHT = 160;

// height of each contact container + flatlist separator
const ITEM_HEIGHT = 61;
const ContactListItemSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "#ccc",
      }}
    />
  );
};
const SelectedContactListItemSeparator = () => {
  return (
    <View
      style={{
        width: 10,
        backgroundColor: "transparent",
      }}
    />
  );
};

const compare = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const AddAttendeesScreen = (props) => {
  const [contactsArr, setContactsArr] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [displaySearchBar, setDisplaySearchBar] = useState(false);
  const dispatch = useDispatch();

  var contactsFromStore = useSelector((state) => state.auth.contacts);
  var attendeesFromStore = useSelector((state) => state.bill.attendees);

  const selectedContactsRef = useRef(null);
  const shadowOpt = {
    width: screenWidth,
    height: HEADER_HEIGHT,
    color: "#000",
    border: 2,
    radius: 3,
    opacity: 0.1,
    x: 0,
    y: 1,
  };

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

  const closeSearchbar = () => {
    setQuery("");
    setDisplaySearchBar(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
      }}
    >
      {!displaySearchBar && (
        <TouchableOpacity
          // disabled={selectedContacts.length === 0}
          activeOpacity={0.9}
          onPress={() => setDisplaySearchBar(true)}
          style={[
            styles.floatingButton,
            // selectedContacts.length === 0 && styles.disabledButton,
          ]}
        >
          <Ionicons name="md-search" size={24} color="white" />
        </TouchableOpacity>
      )}
      <CreateBillHeader
        displayProceed={selectedContacts.length > 0}
        progress={1}
        proceedHandler={proceedHandler}
        title={
          selectedContacts.length === 0
            ? "Who are you splitting\nthe bill with?"
            : selectedContacts.length + " friends selected"
        }
      >
        <View>
          {displaySearchBar && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{ paddingRight: 5 }}
                onPress={closeSearchbar}
              >
                <Ionicons name="md-arrow-back" size={20} />
              </TouchableOpacity>
              <TextInput
                autoFocus={true}
                style={styles.searchBar}
                placeholder="Search"
                onChangeText={handleSearch}
                value={query}
              />
            </View>
          )}
          {!displaySearchBar && (
            <FlatList
              contentContainerStyle={{
                alignItems: "center",
                paddingVertical: 10,
              }}
              ItemSeparatorComponent={SelectedContactListItemSeparator}
              keyExtractor={(item, index) => item.mobileNumber}
              data={selectedContacts}
              extraData={selectedContacts}
              initialNumToRender={10}
              ref={selectedContactsRef}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              onContentSizeChange={(contentWidth) => {
                if (
                  contentWidth <= screenWidth &&
                  selectedContacts.length > 0
                ) {
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
                <SelectedContactDisplay
                  name={item.name}
                  onPress={removeFromSelectedContacts}
                  mobileNumber={item.mobileNumber}
                />
              )}
            />
          )}
        </View>
      </CreateBillHeader>
      <SearchableFlatList
        data={contactsArr}
        keyboardShouldPersistTaps={"handled"}
        ItemSeparatorComponent={ContactListItemSeparator}
        searchTerm={query}
        searchAttribute="name"
        ignoreCase={true}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
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
    paddingTop: 10,
    paddingBottom: 5,
    justifyContent: "center",
    paddingLeft: 10,
  },
  floatingButton: {
    backgroundColor: Colors.blue1,
    position: "absolute",
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    borderRadius: 35,
    zIndex: 1,
    flexDirection: "row",
  },
  disabledButton: {
    backgroundColor: "#619995",
  },
  searchBar: {
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.blue1,
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
  numAttendeesContainer: {
    paddingHorizontal: 10,
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    position: "relative",
    width: "100%",
    height: HEADER_HEIGHT,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
});
export default AddAttendeesScreen;
