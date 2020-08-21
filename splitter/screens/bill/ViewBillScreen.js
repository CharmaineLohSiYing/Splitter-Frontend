import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import * as Contacts from "expo-contacts";
import moment from "moment";
import Colors from "../../constants/Colors";
import ViewUserBillDisplay from "../../components/ViewUserBillDisplay";
import LogDisplay from "../../components/LogDisplay";
import * as billActions from "../../store/actions/bill";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Item, HeaderButtons } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Screen from "../../components/UI/Screen";
import GlobalStyles from "../../assets/style";
import FlatListLineSeparator from "../../components/UI/FlatListLineSeparator"

const FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: 10,
        width: "100%",
        backgroundColor: "transparent",
      }}
    />
  );
};

class ViewBillScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      currUserId: null,
      hasError: false,
      loans: [],
      userBills: [],
      matchedContacts: {},
      bill: null,
      logs: [],
    };
  }

  matchUsersWithContacts = async (userBills) => {
    const currUserId = this.props.userId;
    const contacts = this.props.contacts;

    userBills.forEach(async (userBill) => {
      const userId = userBill.user._id;
      if (userId !== currUserId) {
        var mobileNum;
        userBill.user.isRegistered
          ? (mobileNum = userBill.user.mobileNumber)
          : (mobileNum = userBill.user.mobileNumberTemp);

        let matchedContact = contacts[mobileNum];

        if (matchedContact) {
          // userBill.user.name = matchedContact.name;
          await this.setState({
            matchedContacts: {
              ...this.state.matchedContacts,
              [userId]: matchedContact.name,
            },
          });
        } else {
          await this.setState({
            matchedContacts: {
              ...this.state.matchedContacts,
              [userId]: mobileNum,
            },
          });
        }
      } else {
        await this.setState({
          matchedContacts: {
            ...this.state.matchedContacts,
            [userId]: "Me",
          },
        });
      }
    });
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch(
      "http://192.168.1.190:5000/api/bill/details/" +
        this.props.route.params.billId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (res) => {
        const resData = await res.json();
        const filteredLoans = resData.loans.filter((loan) => {
          return loan.isCancelled === false;
        });

        let promise1 = this.setState({
          userBills: resData.userBills,
          loans: filteredLoans,
          bill: resData.bill,
          logs: resData.logs,
        });
        let promise2 = this.matchUsersWithContacts(resData.userBills);
        Promise.all([promise1, promise2]).then(() => {
          this.setState({ isLoading: false });
        });
      })
      .catch(() => this.setState({ hasError: true }));
  }

  editBillHandler = async () => {
    const { retrieveForEdit } = this.props.actions;
    await retrieveForEdit(
      this.props.route.params.billId,
      this.state.matchedContacts
    );
    this.props.navigation.navigate("AddOrders", { isEdit: true });
  };

  renderHeader = () => {
    if (this.state.bill) {
      return (
        <View>
          <View style={styles.billDetailsContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.billName}>
                {this.state.bill.billName ? this.state.bill.billName : "Bill"}
              </Text>
              <Text style={styles.netBillText}>${this.state.bill.netBill.toFixed(2)}</Text>
            </View>

            <Text>
              {moment(new Date(this.state.bill.date)).format("D MMM YYYY")}
            </Text>
            <Text>
              Created By {this.state.matchedContacts[this.state.bill.createdBy]}
            </Text>
          </View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>
              {this.state.userBills.length} Attendees
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
  };

  renderFooter = () => {
    return (
      <View style={styles.logsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Bill Logs</Text>
        </View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={FlatListItemSeparator}
          data={this.state.logs}
          renderItem={({ item }) => (
            <LogDisplay
              matchedName={this.state.matchedContacts[item.updatedBy]}
              updatedAt={item.updatedAt}
              details={item.details}
            />
          )}
        />
      </View>
    );
  };

  render() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconName="edit"
            onPress={this.editBillHandler}
            iconSize={28}
            IconComponent={MaterialIcons}
          />
        </HeaderButtons>
      ),
      // headerLeft: () => (
      //   <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      //     <Item
      //       iconName="md-arrow-back"
      //       onPress={() => this.props.navigation.goBack()}
      //       iconSize={28}
      //       IconComponent={Ionicons}
      //     />
      //   </HeaderButtons>
      // ),
    });

    return (
      <Screen>
        {!this.state.isLoading && this.state.bill ? (
          <FlatList
            ItemSeparatorComponent={FlatListLineSeparator}
            style={{...GlobalStyles.flatlist}}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.userBills.concat(this.state.userBills)}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            renderItem={({ item }) => (
              <ViewUserBillDisplay
                sharedOrders={item.sharedOrders}
                editBill={this.editBillHandler}
                billId={item.bill._id}
                individualOrderAmount={item.individualOrderAmount}
                amountPaid={item.amountPaid}
                loans={this.state.loans}
                userId={item.user._id}
                matchedContacts={this.state.matchedContacts}
              />
            )}
          />
        ) : (
          <ActivityIndicator size="small" color={Colors.blue1} />
        )}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  sectionHeader: {
    marginVertical: 10,
    paddingHorizontal: 10
  },
  sectionHeaderText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  billDetailsContainer: {
    marginVertical: 20,
    paddingTop: 10,
    paddingHorizontal:10
  },
  netBillText:{
    fontSize: 24,
    fontWeight: "bold",
    fontStyle:'italic'
  },
  buttonContainer: {
    marginTop: 10,
  },
  textHeader: {
    textAlign: "center",
  },
  billName: {
    textTransform: "uppercase",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    flexDirection: "row",
  },
  logsContainer: {
    marginVertical: 10,
  },
});
const mapStateToProps = (state) => {
  const { userId, contacts } = state.auth;
  return { userId, contacts };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(billActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewBillScreen);
3;
