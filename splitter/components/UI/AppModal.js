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
import Colors from "../../constants/Colors"

const App = (props) => {
  const [modalVisible, setModalVisible] = useState(true);
  return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, props.modalViewStyle]}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{props.title}</Text>
            </View>
            <View style={[styles.contents, props.contentsStyle]}>
              {props.children}
            </View>
            
            <View style={styles.bottomBar}>
              <TouchableOpacity style={{...styles.button, ...styles.leftButton}} onPress={() => {
                setModalVisible(!modalVisible);
                props.onClose()
              }}>
                <Text style={{...styles.buttonText, color:Colors.blue1}}>{props.leftButton ? props.leftButton : "Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={styles.button} onPress={props.onSubmit}>
                <Text style={styles.buttonText}>{props.rightButton ? props.rightButton : "Submit"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    // flex: 1,
    maxHeight: '80%',
    width: '80%',
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
    overflow:'hidden',
    alignSelf:'center',
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
    width:'90%',
  }
});

export default App;
