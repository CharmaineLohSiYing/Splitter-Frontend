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
import ViewEventDisplay from "../../components/ViewEventDisplay";
import LogDisplay from "../../components/LogDisplay";
import * as eventActions from "../../store/actions/bill-event";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class ViewEventScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      currUserId: null,
      hasError: false,
      loans: [],
      userEvents: [],
      matchedContacts: {},
      event: null,
      logs: [],
    };
  }

  matchUsersWithContacts = async (userEvents) => {
    const currUserId = this.props.userId;
    const contacts = this.props.contacts;

    userEvents.forEach(async (userEvent) => {
      const userId = userEvent.user._id;
      if (userId !== currUserId) {
        var mobileNum;
        userEvent.user.isRegistered
          ? (mobileNum = userEvent.user.mobileNumber)
          : (mobileNum = userEvent.user.mobileNumberTemp);

        let matchedContact = contacts[mobileNum];

        if (matchedContact) {
          console.log("MATCHED", matchedContact.name);
          // userEvent.user.name = matchedContact.name;
          await this.setState({
            matchedContacts: {
              ...this.state.matchedContacts,
              [userId]: matchedContact.name,
            },
          });
        } else {
          console.log("UNMATCHED", mobileNum);
          // userEvent.user.name = mobileNum;
          await this.setState({
            matchedContacts: {
              ...this.state.matchedContacts,
              [userId]: mobileNum,
            },
          });
        }
      } else {
        console.log("curr user", userId);
        // userEvent.user.name = "CURRENT_USER";
        await this.setState({
          matchedContacts: {
            ...this.state.matchedContacts,
            [userId]: "CURRENT_USER",
          },
        });
      }
    });
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch(
      "http://192.168.1.190:5000/event/details/" +
        this.props.route.params.eventId,
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
          userEvents: resData.userEvents,
          loans: filteredLoans,
          event: resData.event,
          logs: resData.logs,
        });
        let promise2 = this.matchUsersWithContacts(resData.userEvents);
        Promise.all([promise1, promise2]).then(() => {
          this.setState({ isLoading: false });
        });
      })
      .catch(() => this.setState({ hasError: true }));
  }

  editEventHandler = async () => {
    const { retrieveForEdit } = this.props.actions;
    await retrieveForEdit(
      this.props.route.params.eventId,
      this.state.matchedContacts
    );
    this.props.navigation.navigate("AddOrders", { isEdit: true });
  };

  renderHeader = () => {
    if (this.state.event) {
      return (
        <View>
          <Text>Event Name: {this.state.event.eventName}</Text>
          <Text>
            Event Date:{" "}
            {moment(new Date(this.state.event.date)).format("D MMM YYYY")}
          </Text>
          <Text>
            Created By: {this.state.matchedContacts[this.state.event.createdBy]}
          </Text>
          <Text>Net Bill: ${this.state.event.netBill}</Text>
          <Button title="Edit Event" onPress={this.editEventHandler} />
          <Button
            title="Go Back"
            onPress={() => {
              this.props.navigation.goBack();
            }}
          />
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
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={this.state.logs}
        renderItem={({ item }) => (
          <LogDisplay
            matchedName = {this.state.matchedContacts[item.updatedBy]}
            updatedAt = {item.updatedAt}
            details={item.details}
          />
        )}
      />
    );
  };

  render() {
    return (
      <View>
        {!this.state.isLoading ? (
          <View>
            <View style={styles.userEvents}>
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={this.state.userEvents}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter}
                renderItem={({ item }) => (
                  <ViewEventDisplay
                    sharedOrders={item.sharedOrders}
                    editEvent={this.editEventHandler}
                    eventId={item.event._id}
                    individualOrderAmount={item.individualOrderAmount}
                    amountPaid={item.amountPaid}
                    loans={this.state.loans}
                    userId={item.user._id}
                    matchedContacts={this.state.matchedContacts}
                  />
                )}
              />
            </View>
          </View>
        ) : (
          <ActivityIndicator size="small" color={Colors.primary} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  textHeader: {
    textAlign: "center",
  },
});
const mapStateToProps = (state) => {
  const { userId, contacts } = state.auth;
  return { userId, contacts };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(eventActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewEventScreen);
