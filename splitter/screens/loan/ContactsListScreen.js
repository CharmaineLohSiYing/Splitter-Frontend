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
  import * as authActions from "../../store/actions/auth"
  import * as billActions from "../../store/actions/bill";
  import * as Contacts from "expo-contacts";
  import ContactDisplay from "../../components/ContactDisplay";
  import { matchUsersWithContacts } from "../../utils/initialiseContacts";
  import Colors from "../../constants/Colors";
  import { SearchableFlatList } from "react-native-searchable-list";
  import { Item, HeaderButtons } from "react-navigation-header-buttons";
  import { MaterialIcons, Ionicons } from "@expo/vector-icons";
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
  
  const compare = (a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  };
  
  const ContactsListScreen = (props) => {
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
            tempArr.push(contactsFromStore[mobileNumber]);
          }
        } else {
          for (const mobileNumber of Object.keys(contactsFromStore)) {
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
    };
  
    const selectContactHandler = (name, mobileNumber) => {
      console.log('before navigate', name, mobileNumber)
        props.navigation.navigate("ViewContactLoans", {
            matchedName: name,
            friendMobileNumber: mobileNumber
          })
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
          <View>
            <TextInput
                style={styles.searchBar}
                placeholder="Search"
                onChangeText={handleSearch}
                value={query}
              />
          </View>
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
              selected={false}
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

    floatingButton: {
      backgroundColor: Colors.blue1,
      position: "absolute",
      width: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      right: 30,
      bottom: 30,
      borderRadius: 30,
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
  export default ContactsListScreen;
  