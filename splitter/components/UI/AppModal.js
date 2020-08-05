import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";

const App = (props) => {
  const [modalVisible, setModalVisible] = useState(true);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{props.title}</Text>
            </View>
            <View style={styles.contents}>
              {props.children}
            </View>
            
            <View style={styles.bottomBar}>
              <TouchableOpacity style={{...styles.button, ...styles.leftButton}} onPress={() => {
                setModalVisible(!modalVisible);
                props.onClose()
              }}>
                <Text style={styles.buttonText}>{props.leftButton ? props.leftButton : "Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={styles.button} onPress={props.onSubmit}>
                <Text style={styles.buttonText}>{props.rightButton ? props.rightButton : "Submit"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    width: '80%',
    margin: 20,
    minHeight:'70%',
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow:'hidden'
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  header:{
    height: 50,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
    alignItems:'center',
    justifyContent:'center'    
  },
  headerText:{

  },
  bottomBar:{
    height: 50,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
    flexDirection:'row',
  },
  button:{
    width:'50%',
    height: '100%',
    alignItems:"center",
    justifyContent:'center',
    borderTopWidth:1,
    borderTopColor:'#ccc',
  },
  leftButton:{
    borderRightWidth:1,
    borderRightColor:'#ccc'
  },
  contents:{
    paddingVertical: 20,
    flex:1,
    width:'90%',
  }
});

export default App;
