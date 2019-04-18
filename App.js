import {createStackNavigator, createAppContainer} from 'react-navigation';

import Form from './Views/Form/Form'
import Summary from './Views/Summary/Summary'
import List from "./Views/List/List";

const MainNavigator = createStackNavigator({
  List: {screen: List},
  Form: {screen: Form},
  Summary: {screen: Summary}
});

const App = createAppContainer(MainNavigator);

export default App;