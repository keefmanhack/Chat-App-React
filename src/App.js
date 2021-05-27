import React from 'react';
import { Switch} from 'react-router';
import 'rsuite/dist/styles/rsuite-default.css';
import PrivateRoute from './Components/PrivateRoute';
import PublicRoute from './Components/PublicRoute';
import SignIn from './Pages/SignIn';
import './styles/main.scss';
import './styles/override.scss';
import './styles/utility.scss';
import './styles/utility_colors.scss';
import { ProfileProvider } from './Context/profile.context';
import Home from './Pages/Home/Index';


function App() {
  return (
    <ProfileProvider>
      <Switch>
        <PublicRoute path='/signin'>
          <SignIn/>
        </PublicRoute>
        <PrivateRoute path='/'>
          <Home/>
        </PrivateRoute>
      </Switch>
    </ProfileProvider>
  );
}

export default App;
