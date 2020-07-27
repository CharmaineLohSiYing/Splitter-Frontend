import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import {
  ScrollView,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SectionList,
} from "react-native";

import IndividualOrders from "../../../components/IndividualOrders";
import SharedOrders from "../../../components/SharedOrders";

import Colors from "../../../constants/Colors";
import * as eventActions from "../../../store/actions/bill-event";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import AddOrdersSubSectionHeader from "../../../components/AddOrdersSubSectionHeader";
import OrderDisplay from "../../../components/OrderDisplay";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import ProceedBottomButton from "../../../components/UI/ProceedBottomButton";

const Test = () => {
  console.log("BOO");
  return (
    <View>
      <Text>Boo</Text>
    </View>
  );
};
const AddOrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState(null);
  const sharedOrders = useSelector((state) => state.billEvent.sharedOrders);
  const [orders, setOrders] = useState(sharedOrders);
  const dispatch = useDispatch();

  const { navigation } = props;

  console.log("add orders");
  props.navigation.setOptions({
    headerTitle: "Add Orders",
    headerTitleStyle: {
      fontFamily: "roboto-regular",
      flex: 1,
      alignSelf: "center",
    },
  });

  const Products = [
    {
      id: 1,
      name: 'Product 1'
    },
    {
      id: 2,
      name: 'Product 2'
    },
    {
      id: 3,
      name: 'Product 3'
    },
    {
      id: 4,
      name: 'Product 4'
    },
  ];
  
  const Supervisors = [
    {
      belongsToPruduct: 1,
      name: 'SuperVisor 1' 
    },
    {
      belongsToPruduct: 3,
      name: 'SuperVisor 2' 
    },
    {
      belongsToPruduct: 2,
      name: 'SuperVisor 3' 
    },
    {
      belongsToPruduct: 4,
      name: 'SuperVisor 4' 
    }
  ];

  const proceedHandler = useCallback(() => {
    navigation.navigate("BillDetails", { isEdit });
  }, []);

  useEffect(() => {
    if (props.route.params && props.route.params.isEdit) {
      console.log("isEdit - add orders screen", props.route.params.isEdit);
      setIsEdit(true);
    }
  }, []);

  useEffect(() => {
    setOrders(sharedOrders);
  }, [sharedOrders]);

  const deleteSharedOrderHandler = (id) => {
    dispatch(eventActions.removeSharedOrder(id));
  };

  const addSharedOrderHandler = () => {
    props.navigation.navigate("SelectSharers");
  };

  const emptyListComponent = () => {
    return (
      <View style={styles.emptyFlatlist}>
        <Text style={styles.noOrdersText}>No shared orders added yet</Text>
        <TouchableOpacity
          onPress={addSharedOrderHandler}
          style={styles.emptyAddButton}
        >
          <Text>Add a shared order</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const updateSharedOrderHandler = useCallback((id, sharers) => {
    navigation.navigate("SelectSharers", {
      updateSharedOrder: true,
      orderId: id,
      sharers: sharers,
    });
  }, []);

  const updateIndividualOrderHandler = useCallback((id) => {
    navigation.navigate("Calculator", {
      updateIndividualOrder: true,
      userId: id,
    });
  }, []);

  function footerComponent() {
    return (
      <>
        <AddOrdersSubSectionHeader header="Individual Orders" />
        <IndividualOrders
          updateIndividualOrder={updateIndividualOrderHandler}
        />
        <ProceedBottomButton
          proceedHandler={proceedHandler}
          style={{ marginBottom: 20 }}
        />
        <ProceedBottomButton text="heloo" />
        <Test />
      </>
    );
  }

  const headerComponent = () => {
    return (
      <>
        <View style={{ flexDirection: "row", paddingRight: 10 }}>
          <AddOrdersSubSectionHeader
            header="Shared Orders"
            style={{ paddingVertical: 5, flex: 1 }}
          />
          <Ionicons
            name="md-add-circle-outline"
            size={28}
            color="black"
            onPress={addSharedOrderHandler}
          />
        </View>
      </>
    );
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <View style={{ width: "90%" }}>
        {/* <FlatList
          // ListFooterComponent={footerComponent}
          ListHeaderComponent={headerComponent}
          keyExtractor={(item, index) => index.toString()}
          data={orders}
          ListEmptyComponent={emptyListComponent}
          initialNumToRender={5}
          renderItem={({ item }) => (
            <OrderDisplay
              id={item.id}
              sharers={item.users}
              amount={item.amount}
              onSelect={updateSharedOrderHandler}
              delete={deleteSharedOrderHandler}
            />
          )}
        /> */}
        <SectionList
          renderSectionHeader={({ section: { title } }) => (
            <Text style={{ fontWeight: "bold" }}>{title}</Text>
          )}
          sections={[
            {
              title: "Products",
              data: Products,
              renderItem: ({ item, index, section: { title, data } }) => (
                <Text>{item.name}</Text>
              ),
            },
            {
              title: "Supervisors",
              data: Supervisors,
              renderItem: ({ item, index, section: { title, data } }) => (
                <Text>{item.name}</Text>
              ),
            },
          ]}
          keyExtractor={(item, index) => item.name + index}
        />
      </View>
    </View>
  );
};

AddOrdersScreen.navigationOptions = {
  headerTitle: "Add Orders",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  emptyAddButton: {
    alignSelf: "center",
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: 40,
    backgroundColor: Colors.lightBlue,
  },
  emptyFlatlist: {
    borderWidth: 1,
    borderColor: Colors.lightBlue,
    height: 90,
    padding: 10,
  },
  noOrdersText: {
    alignSelf: "center",
  },
});

export default AddOrdersScreen;
