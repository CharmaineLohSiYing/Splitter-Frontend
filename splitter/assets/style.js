import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export default StyleSheet.create({
  flatlist: {
    width: "100%",
    paddingHorizontal: "5%",
    paddingBottom: 20,
  },
  floatingButton: {
    backgroundColor: Colors.blue2,
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
    elevation: 1,
  },
  searchBar: {
    height: 40,
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.gray6,
    width: "90%",
    paddingHorizontal: "5%",
    marginBottom: 10,
  },
  flatListLineSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: "#ccc",
    opacity: 0.5,
  },
  modalTextInput:{
    backgroundColor:Colors.gray5,
    borderRadius: 15,
    height: 40,
    paddingHorizontal: 10
  }
});
