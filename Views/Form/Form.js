import React, {Component} from 'react';
import {TouchableFeedback, Slider, ToastAndroid, ScrollView, CheckBox, Dimensions, Platform, StyleSheet, Text, View, Button, TextInput, DatePickerAndroid, Picker, TouchableWithoutFeedback} from 'react-native';

const DeviceWidth = Dimensions.get('window').width;
type Props = {};
export default class Form extends Component<Props> {

  static navigationOptions = {
    title: 'Book a room in Hotel Marmur',
  };

  constructor(props)
  {
    super(props);
    this.openBirthdayDatePicker = this.openBirthdayDatePicker.bind(this);
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const {navigation} = this.props;
    const params = navigation.state.params;
    const {roomData} = params;

    this.state = {
      nameText: '',
      surnameText: '',
      birthday: new Date(1997,1,1),
      startDate: today,
      endDate: tomorrow,
      beds: '1',
      room : 'standard',
      breakfast : true,
      height : 180,
      telNumber : ''
    };

    if (roomData != null) {
      console.log("BREAKFAST: " + roomData.Breakfast);
      this.state = {
        id: roomData.Id,
        nameText: roomData.Name,
        surnameText: roomData.Surname,
        birthday: new Date(roomData.BirthDate),
        startDate: new Date(roomData.StartDate),
        endDate: new Date(roomData.EndDate),
        beds: roomData.Beds.toString(),
        room : roomData.Room,
        breakfast : roomData.Breakfast === 'true',
        height : parseInt(roomData.Height),
        telNumber : roomData.TelNumber.toString()
      }
    }
  }

  openBirthdayDatePicker = async(birthday) => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: birthday,
        maxDate: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        this.setState({birthday: new Date(year,month,day)});
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }
  
  openStartDatePicker = async(startDate) => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: startDate,
        minDate: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        this.setState({startDate: new Date(year,month,day)});
        
        if (this.state.startDate > this.state.endDate){
          let newEndDate = new Date();
          newEndDate.setDate(this.state.startDate.getDate() +1);
          this.setState({endDate: newEndDate});
        }
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }
  
  openEndDatePicker = async(endDate) => {
    try {
      let mindate = new Date();
      mindate = mindate.setDate(this.state.startDate.getDate() + 1);
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: endDate,
        minDate: mindate
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        this.setState({endDate: new Date(year,month,day)});
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  onBedsTextChanged(text) {
    // code to remove non-numeric characters from text
    this.setState({
        beds: text.replace(/[^0-9]/g, ''),
    });
  }
  
  onTelTextChanged(text) {
    // code to remove non-numeric characters from text
    this.setState({
        telNumber: text.replace(/[^0-9]/g, ''),
    });
  }

  update = async ()=>{
    let age = this.getAge(this.state.birthday);

    if(this.state.nameText && this.state.surnameText && age >= 18 && this.state.telNumber && this.state.telNumber.length === 9){
      const {id, nameText, surnameText, birthday, startDate, endDate, beds, room, breakfast, height, telNumber} = this.state;
      const {navigation} = this.props;
      const params = navigation.state.params;
      const db = params.db;

      await db.executeSql(`UPDATE Orders Set 
      Name = '${nameText}', 
      Surname = '${surnameText}', 
      BirthDate = '${birthday.getTime()}', 
      StartDate = '${startDate.getTime()}', 
      EndDate = '${endDate.getTime()}', 
      Beds = '${beds}', 
      Room = '${room}', 
      Breakfast = '${breakfast}', 
      Height = '${height}', 
      TelNumber = '${telNumber}'
      WHERE Id = '${id}';`);

      const {navigate} = this.props.navigation;
      navigate('List');
    }
    else{
      if (!this.state.nameText)
      {
        ToastAndroid.showWithGravity('Insert name', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
      else if (!this.state.surnameText)
      {
        ToastAndroid.showWithGravity('Insert surname', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
      else if (age < 18)
      {
        ToastAndroid.showWithGravity('You must be at least 18 years old', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
      else if (!this.state.telNumber || this.state.telNumber.length !== 9)
      {
        ToastAndroid.showWithGravity('Insert tel number', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
      else{
        ToastAndroid.showWithGravity('Fill all fields', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
    }
  }

  insert = async()=>{

    let age = this.getAge(this.state.birthday);

    if(this.state.nameText && this.state.surnameText && age >= 18 && this.state.telNumber && this.state.telNumber.length === 9){
      const {nameText, surnameText, birthday, startDate, endDate, beds, room, breakfast, height, telNumber} = this.state;
      const {navigation} = this.props;
      const params = navigation.state.params;
      const db = params.db;

      await db.executeSql('INSERT INTO Orders (Name, Surname, BirthDate, StartDate, EndDate, Beds, Room, Breakfast, Height, TelNumber) VALUES ' +
        `('${nameText}', '${surnameText}', '${birthday.getTime()}', '${startDate.getTime()}', '${endDate.getTime()}', '${beds}', '${room}', '${breakfast}', '${height}', '${telNumber}')`);

      const {navigate} = this.props.navigation;
      navigate('List');
    }
    else{
      if (!this.state.nameText)
      {
        ToastAndroid.showWithGravity('Insert name', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
      else if (!this.state.surnameText)
      {
        ToastAndroid.showWithGravity('Insert surname', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
      else if (age < 18)
      {
        ToastAndroid.showWithGravity('You must be at least 18 years old', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
      else if (!this.state.telNumber || this.state.telNumber.length !== 9)
      {
        ToastAndroid.showWithGravity('Insert tel number', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
      else{
        ToastAndroid.showWithGravity('Fill all fields', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
    }
  }
  
  getAge(DOB) {
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }    
    return age;
}

  render() {
    const {navigation} = this.props;
    const params = navigation.state.params;

    let buttonAction = null;
    let isInsert = false;

    if (params.roomData == null) {
      buttonAction = this.insert;
      isInsert = true;
    } else {
      buttonAction = this.update;
      isInsert = false;
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.leftName}>Name</Text>
          <TextInput 
          style={styles.input}
          placeholder={'Type name'}
          onChangeText={(nameText)=>this.setState({nameText})}
          value={this.state.nameText}/>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.leftName}>Surname</Text>
          <TextInput 
          style={styles.input}
          placeholder={'Type surname'}
          onChangeText={(surnameText)=>this.setState({surnameText})}
          value={this.state.surnameText}/>
        </View>

        <View style={styles.row}>
          <Text style={styles.leftName}>Height</Text>
          <Text>{this.state.height}</Text>
          <Slider
            style={{ width: DeviceWidth*0.5 }}
            minimumValue = {0}
            maximumValue = {300}
            onValueChange = {(value)=>this.setState({height: value})}
            step = {1} 
            value={this.state.height}/>
        </View>
        
        {/* <View style={styles.row}>
          <Text style={styles.leftName}>Tel number</Text>
          <Text>{this.state.telNumber}</Text>
          <Slider
            style={{ width: DeviceWidth*0.5 }}
            minimumValue = {100000000}
            maximumValue = {999999999}
            onValueChange = {(value)=>this.setState({telNumber: value})}
            step = {1} 
            value={this.state.telNumber}/>
        </View> */}
        
        <View style={styles.row}>
          <Text style={styles.leftName}>Birthday</Text>
          <TouchableWithoutFeedback onPress={this.openBirthdayDatePicker.bind(this,this.state.birthday)}>
            <Text style={styles.dateFormat}>{this.state.birthday.toDateString()}</Text>
          </TouchableWithoutFeedback>
          {/* <Button style={styles.dateButton} title={this.state.birthdayButtonText} onPress={this.openBirthdayDatePicker.bind(this,this.state.birthday)}/> */}
        </View>
        
        <View style={styles.row}>
          <Text style={styles.leftName}>Start day</Text>
          <TouchableWithoutFeedback onPress={this.openStartDatePicker.bind(this,this.state.startDate)}>
            <Text style={styles.dateFormat}>{this.state.startDate.toDateString()}</Text>            
          </TouchableWithoutFeedback>
          {/* <Button style={styles.dateButton} title={this.state.startdayButtonText} onPress={this.openStartDatePicker.bind(this,this.state.startDate)}/> */}
        </View>

        <View style={styles.row}>
          <Text style={styles.leftName}>End day</Text>
          <TouchableWithoutFeedback onPress={this.openEndDatePicker.bind(this,this.state.endDate)}>
            <Text style={styles.dateFormat}>{this.state.endDate.toDateString()}</Text>
          </TouchableWithoutFeedback>
          {/* <Button style={styles.dateButton} title={this.state.enddayButtonText} onPress={this.openEndDatePicker.bind(this,this.state.endDate)}/> */}
        </View>
        
        <View style={styles.row}>
          <Text style={styles.leftName}>Beds amount</Text>
          <TextInput 
            style={styles.input}
            keyboardType = 'numeric'
            onChangeText = {(text)=> this.onBedsTextChanged(text)}
            value = {this.state.beds.toString()}
          /> 
        </View>
        
        <View style={styles.row}>
          <Text style={styles.leftName}>Tel number</Text>
          <TextInput 
            style={styles.input}
            keyboardType = 'numeric'
            onChangeText = {(text)=> this.onTelTextChanged(text)}
            maxLength = {9}
            value = {this.state.telNumber.toString()}
          /> 
        </View>
        
        <View style={styles.row}>
          <Text style={styles.leftName}>Room class</Text>
          <Picker
            selectedValue={this.state.room}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({room: itemValue})
            }>
            <Picker.Item label="Standard" value="standard" />
            <Picker.Item label="Premium" value="premium" />
          </Picker>
        </View>
        
        <View style={styles.row}>
            <Text style={styles.leftName}>Breakfast</Text>
            <CheckBox
              title='Breakfast'
              value={this.state.breakfast}
              onValueChange={() => this.setState({breakfast: !this.state.breakfast})}
            />
        </View>
        
        <View>
          <Button 
            style={styles.sendButton}
            title={isInsert ? "Save" : "Update"}
            onPress={buttonAction}/>
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
  sendButton:{
    marginBottom: 20
  },
  leftName: {
    width: DeviceWidth * 0.2
  },
  dateFormat:{
    width: DeviceWidth * 0.5,
    borderBottomColor: 'gray',
    borderBottomWidth: 1
  },
  dateButton:{
    width: DeviceWidth*0.2
  },
  input: {
    paddingBottom:-10,
    width: DeviceWidth * 0.5,
    borderBottomColor: 'gray',
    borderBottomWidth: 1
  },
  picker:{
    height: 50, 
    width: DeviceWidth * 0.5
  }
});