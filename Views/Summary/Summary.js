import React, {Component} from 'react';
import {StyleSheet, ScrollView, Dimensions, Platform, Text, View} from 'react-native';

const DeviceWidth = Dimensions.get('window').width;
type Props = {};

export default class Summary extends Component<Props> {

  static navigationOptions = {
    title: 'Order',
  };

  constructor(props){
    super(props)

    this.state = {
    }
  }

  render() {
    const {navigation} = this.props;
    const {roomData} = navigation.state.params;
    console.log('room data:' + roomData);
    const {Name, Surname, BirthDate, StartDate, EndDate, Beds, Room, Breakfast, Height, TelNumber} = roomData;
    return (
      <ScrollView  style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.leftName}>Name:</Text>
          <Text>{Name}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.leftName}>Surname:</Text>
          <Text>{Surname}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.leftName}>Birthday:</Text>
          <Text>{new Date(BirthDate).toDateString()}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.leftName}>Height:</Text>
          <Text>{Height} cm</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.leftName}>Tel number:</Text>
          <Text>{TelNumber}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.leftName}>Start day:</Text>
          <Text>{new Date(StartDate).toDateString()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.leftName}>End day:</Text>
          <Text>{new Date(EndDate).toDateString()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.leftName}>Beds amount:</Text>
          <Text>{Beds}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.leftName}>Romm class:</Text>          
          <Text>{Room}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.leftName}>Breakfast:</Text>
          <Text>{Breakfast === 'true' ? 'With breakfast' : 'Without breakfast'}</Text>
        </View>
      </ScrollView>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  row: {
    marginLeft: 20,
    flexDirection: 'row',
    textAlign: 'left',
    marginBottom:20,
    height:50,
    alignItems:'center'
  },
  leftName:{
    fontWeight:'bold',
    width: DeviceWidth * 0.3
  }
});
