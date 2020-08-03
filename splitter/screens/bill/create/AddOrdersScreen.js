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
  InteractionManager,
  ActivityIndicator,
  TouchableOpacity,
  SectionList,
} from "react-native";

import IndividualOrders from "../../../components/IndividualOrders";
import SharedOrders from "../../../components/SharedOrders";
import CreateBillHeader from "../../../components/CreateBillHeader";
import Colors from "../../../constants/Colors";
import * as billActions from "../../../store/actions/bill";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import AddOrdersSubSectionHeader from "../../../components/AddOrdersSubSectionHeader";
import OrderDisplay from "../../../components/OrderDisplay";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import ProceedBottomButton from "../../../components/UI/ProceedBottomButton";

const EmptyListComponent = (props) => (
  <View style={styles.emptyFlatlist}>
    <Text style={styles.noOrdersText}>Nope, everyone got their own stuff.</Text>
  </View>
);

const ItemSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: Colors.gray3,
      }}
    />
  );
};

const AddOrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState(null);
  const sharedOrders = useSelector((state) => state.bill.sharedOrders);
  const attendeesFromStore = useSelector((state) => state.bill.attendees);
  const [attendees, setAttendees] = useState(attendeesFromStore);
  const [orders, setOrders] = useState(sharedOrders);
  const [ready, setReady] = useState(false);
  const dispatch = useDispatch();

  const { navigation } = props;

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      // 2: Component is done animating
      // 3: Start fetching the team / or render the view
      // this.props.dispatchTeamFetchStart();
      setReady(true);
    });
  }, []);

  useEffect(() => {
    setAttendees(attendeesFromStore);
  }, [attendeesFromStore]);

  props.navigation.setOptions({
    headerTitle: "Add Orders",
    headerTitleStyle: {
      fontFamily: "roboto-regular",
      flex: 1,
      alignSelf: "center",
    },
  });

  const proceedHandler = useCallback(() => {
    navigation.navigate("BillDetails", { isEdit });
  }, []);

  useEffect(() => {
    if (props.route.params && props.route.params.isEdit) {
      // console.log("isEdit - add orders screen", props.route.params.isEdit);
      setIsEdit(true);
    }
  }, []);

  useEffect(() => {
    setOrders(sharedOrders);
  }, [sharedOrders]);

  const deleteSharedOrderHandler = (id) => {
    dispatch(billActions.removeSharedOrder(id));
  };

  const addSharedOrderHandler = useCallback(() => {
    navigation.navigate("SelectSharers");
  }, [navigation]);

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
          <TouchableOpacity onPress={addSharedOrderHandler}>
            <Ionicons name="md-add-circle-outline" size={28} color="black" />
          </TouchableOpacity>
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

  if (!ready) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <CreateBillHeader
        displayProceed={true}
        progress={2}
        proceedHandler={proceedHandler}
        title="How much was each order?"
        subtitle="Don’t worry about the GST and service charges, we will get to that later"
      ></CreateBillHeader>
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
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={{ paddingTop: 20 }}
          ListFooterComponent={
            <ProceedBottomButton proceedHandler={proceedHandler} />
          }
          renderSectionFooter={({ section }) => {
            if (section.data.length === 0) {
              return <EmptyListComponent onPress={addSharedOrderHandler} />;
            }
            return <View></View>;
          }}
          renderSectionHeader={({ section: { title, data, type } }) => (
            <View style={styles.header}>
              <AddOrdersSubSectionHeader header={title} style={{ flex: 1 }} />
              {type === "Shared" && (
                <TouchableOpacity
                  style={styles.addSharedOrderButton}
                  onPress={addSharedOrderHandler}
                >
                  <Text style={styles.addSharedOrderText}>Create</Text>
                  <Ionicons
                    name="md-add-circle"
                    size={20}
                    color={Colors.blue1}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          sections={[
            {
              title:
                orders.length > 0
                  ? orders.length + " shared orders"
                  : "Any shared orders?",
              type: "Shared",
              data: orders,
              renderItem: ({ item }) => (
                <OrderDisplay
                  id={item.id}
                  sharers={item.users}
                  amount={item.amount}
                  onSelect={updateSharedOrderHandler}
                  onDelete={deleteSharedOrderHandler}
                />
              ),
            },
            {
              type: "Individual",
              title: "Individual Orders",
              data: Object.keys(attendees),
              renderItem: ({ item }) => (
                <OrderDisplay
                  onSelect={updateIndividualOrderHandler}
                  id={item}
                  name={attendees[item].name}
                  amount={attendees[item].amount}
                />
              ),
            },
          ]}
          keyExtractor={(item, index) => index.toString()}
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
  emptyFlatlist: {
    padding: 20,
    backgroundColor: "#ccc",
  },
  noOrdersText: {
    alignSelf: "center",
    fontStyle: "italic",
  },
  header: {
    flexDirection: "row",
    paddingRight: 10,
    paddingBottom: 10,
  },
  addSharedOrderButton: {
    backgroundColor: Colors.blue4Rgba,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    width: 80,
  },
  addSharedOrderText: {
    color: Colors.blue1,
  },
});

export default AddOrdersScreen;
