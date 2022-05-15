import React from 'react';
import {Provider} from 'react-redux';
import AppInner from './AppInner';
import store from './src/store';

function App() {
  // const [isLoggedIn, setLoggedIn] = useState(true);
  // const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}

export default App;
