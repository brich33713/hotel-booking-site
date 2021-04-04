import './App.css';
import Home from './Home'
import HotelPage from './HotelPage'
import Error from './Error'
import NavBar from './NavBar'
import {BrowserRouter, Route, Switch} from 'react-router-dom'


function App() {
  
  

  return (
    // roomData and handleChange are on HotelContext file. Copy and paste above return
    // <RoomContext.Provider value={{...roomData,handleChange}}>
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/"><Home /></Route>        
          {/* <Route exact path="/hotels"><Rooms /></Route>         */}
          <Route exact path="/hotel/:id"><HotelPage /></Route>
          <Route><Error /></Route>
        </Switch>
      </BrowserRouter>
    </div>
    // {/* </ RoomContext.Provider> */}
  );
}

export default App;
