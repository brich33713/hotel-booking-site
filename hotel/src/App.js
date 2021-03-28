import './App.css';
import Home from './Home'
import RoomPage from './RoomPage'
import Rooms from './Rooms'
import Error from './Error'
import NavBar from './NavBar'
import data from './data'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import { useContext, useEffect, useState } from 'react';
import RoomContext from './RoomContext';
import Test from './Test'


function App() {
  
  const formatData = (data) => {
    let formattedRoom = data.map(room => {
      let id = room.sys.id
      let images = room.fields.images.map(image => image.fields.file.url)
      let roomObj = {id,...room.fields,images}
      return roomObj
    })
    return formattedRoom
  }

  let rooms = formatData(data)
  let featuredRooms = rooms.filter(room => room.featured === true)
  let maxPrice = Math.max(...rooms.map(room => room.price))
  let maxSize = Math.max(...rooms.map(room => room.size))

  // const [data,updateData] = useState(roomData)
    // const filterRooms = () => {
        // let filteredRooms = [...roomData.rooms]
        // if(roomData.type !== 'all'){
        //     filteredRooms = filteredRooms.filter(room => room.type === roomData.type)
        //     roomData['sortedRooms'] = filteredRooms;
        //     updateData({...data,['sortedRooms']:filteredRooms})
        // }
    // }

    

    const handleChange = async (e) => {
        const {name,type,value} = e.target
        updateData((roomData) => (
          {...roomData,[name]: value}
          ))
      //   let filteredRooms = [...roomData.rooms]
      //   if(roomData.type !== 'all'){
      //     filteredRooms = filteredRooms.filter(room => room.type === roomData.type)
      //     roomData['sortedRooms'] = filteredRooms;
      //     updateData({...roomData,['sortedRooms']:filteredRooms})
      // }
    }

    // const getUnique = (data,value) => {
    //     return [...new Set(data.map(data => data[value]))]
    // }

    // let types = ['all',...getUnique(roomData.rooms,'type')]
    const [roomData,updateData] = useState({
      rooms,
      featuredRooms,
      sortedRooms: rooms,
      loading: false,
      type: 'all',
      capacity: 1,
      price: 0,
      minPrice: 0,
      maxPrice,
      minSize: 0,
      maxSize,
      breakfast: false,
      pets: false
    })

    useEffect(()=>{
      let filteredRooms = [...roomData.rooms]
        if(roomData.type !== 'all'){
          filteredRooms = filteredRooms.filter(room => room.type === roomData.type)
          updateData({...roomData,['sortedRooms']:filteredRooms})
        } else {
          updateData({...roomData,['sortedRooms']:roomData.rooms})
        }

        if(roomData.capacity !== 1){
          filteredRooms =filteredRooms.filter(room => room.capacity >= roomData.capacity)
          updateData({...roomData,['sortedRooms']:filteredRooms})
        }
    },[roomData.type,roomData.capacity])

  return (
    <RoomContext.Provider value={{...roomData,handleChange}}>
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/"><Home /></Route>        
          <Route exact path="/rooms"><Rooms /></Route>        
          <Route exact path="/room/:id"><RoomPage /></Route>
          <Route exact path='/test'><Test /></Route>
          <Route><Error /></Route>
        </Switch>
      </BrowserRouter>
    </div>
    </ RoomContext.Provider>
  );
}

export default App;
