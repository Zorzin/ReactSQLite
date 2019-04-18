import {openDatabase, DEBUG, enablePromise, echoTest} from 'react-native-sqlite-storage';
import {NavigationEvents} from 'react-navigation';
import React, {Component} from 'react';
import {StyleSheet, ScrollView, Dimensions, Platform, Text, View, TouchableOpacity, Alert, Image} from 'react-native';

const DeviceWidth = Dimensions.get('window').width;
type Props = {};

DEBUG(true);
enablePromise(true);

function errorCB(err) {
  console.log("SQL Error: " + err);
}

function success() {
  console.log("SQL executed fine");
}

function openCB() {
  console.log("Database OPENED");
}

export default class List extends Component<Props> {

  static navigationOptions = {
    title: 'Hotel Marmur',
  };


  state = {
    records: []
  }

  db = null;

  componentWillMount(): void {
    console.log("[MainView | componentWillMount] initalizating db");
    this.initializeDb();
  }

  initializeDb = async () => {
    try {
      await echoTest();
      this.db = await openDatabase("marmur.db", "1.0", "Booking Database", 200000, openCB, errorCB);
      await this.db.executeSql('CREATE TABLE IF NOT EXISTS Orders ' +
        '(' +
        '    Id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '    Name TEXT NOT NULL,' +
        '    Surname TEXT NOT NULL,' +
        '    BirthDate INTEGER NOT NULL,' +
        '    StartDate INTEGER NOT NULL,' +
        '    EndDate INTEGER NOT NULL,' +
        '    Beds INTEGER NOT NULL,' +
        '    Room TEXT NOT NULL,' +
        '    Breakfast BOOLEAN NOT NULL,' +
        '    Height INTEGER NOT NULL,' +
        '    TelNumber INTEGER NOT NULL' +
        ') ');
    } catch (e) {
      console.warn("[MainView | initializeDb] Exception occured", e);
    }
  };

  getRecordsFormDb = async () => {
    const resultsInfo = await this.db.executeSql('SELECT * FROM Orders');
    const results = resultsInfo[0];
    const len = results.rows.length;
    const records = [];
    for (let i = 0; i < len; i++) {
      let row = results.rows.item(i);
      records.push(row);
    }
    this.setState({records})
    console.log(resultsInfo);
  };

  onViewPress = (item) => {
    const {navigation} = this.props;
    const {navigate} = navigation;
    navigate("Summary", {roomData: item})
  };

  onEditPress = (item) => {
    const {navigation} = this.props;
    const {navigate} = navigation;
    navigate("Form", {db: this.db, roomData: item})
  };

  onDeletePress = (item) => {
    Alert.alert("Usunięcie rezerwacji", "Czy na pewno chcesz usunąć tę rezerwację?",
      [
        {
          text: 'Nie',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Tak',
          onPress: () => this.deleteItem(item)
        },
      ],
      {cancelable: false},
    )
  };

  deleteItem = async (item) => {
    await this.db.executeSql(`DELETE FROM Orders WHERE id = ${item.Id}`);
    await this.getRecordsFormDb();
  };

  formatDate(dateToFormat) {
    let dd = dateToFormat.getDate();
    let mm = dateToFormat.getMonth() + 1; //January is 0!

    const yyyy = dateToFormat.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    dateToFormat = dd + '.' + mm + '.' + yyyy;
    return dateToFormat;
  }

  render() {
    const {navigation} = this.props;
    const {navigate} = navigation;
    const {records} = this.state;

    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={() => this.getRecordsFormDb()}
        />
        <ScrollView styles={{flex: 1}}>
          {records.map(record => {
            const startDate = new Date(record.StartDate);
            const endDate = new Date(record.EndDate);
            return (<View key={record.Id} style={styles.record}>
              <TouchableOpacity onPress={() => this.onViewPress(record)}>
                <Text style={{fontSize: 20}}>{`${record.Name} ${record.Surname}`}</Text>
                <Text>{`${this.formatDate(startDate)} - ${this.formatDate(endDate)}`}</Text>
                <Text>{`Typ pokoju: ${record.Room}`}</Text>
              </TouchableOpacity>
              <View style={styles.recordButtons}>
                <TouchableOpacity onPress={() => this.onEditPress(record)} style={{marginRight: 20}}>
                  <Text>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onDeletePress(record)}>
                  <Text>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>)
          })}

        </ScrollView>

        <TouchableOpacity style={styles.addButton}
                          onPress={() => navigate("Form", {db: this.db, roomData: null})}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e4e4e4',
  },
  record: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    padding: 10
  },
  recordButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  recordButtonIcon: {
    width: 35,
    height: 35,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dd585a',
    position: 'absolute',
    bottom: 25,
    right: 25,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  addButtonText: {
    color: "#fff6f4",
    fontSize: 32
  },
  test: {
    height: 30
  }
});
