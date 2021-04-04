import react, { useState } from 'react'

const HotelContext = react.createContext()

// To pass into Provider. For providing sorted data.

// const formatData = (data) => {
//     let formattedRoom = data.map(room => {
//       let id = room.sys.id
//       let images = room.fields.images.map(image => image.fields.file.url)
//       let roomObj = {id,...room.fields,images}
//       return roomObj
//     })
//     return formattedRoom
//   }

//   let rooms = formatData(data)
//   let featuredRooms = rooms.filter(room => room.featured === true)
//   let maxPrice = Math.max(...rooms.map(room => room.price))
//   let maxSize = Math.max(...rooms.map(room => room.size))

    

//     const handleChange = async (e) => {
//         const {name,type,value} = e.target
//         updateData((roomData) => (
//           {...roomData,[name]: value}
//           ))
//     }

//     const [roomData,updateData] = useState({
//       rooms,
//       featuredRooms,
//       sortedRooms: rooms,
//       loading: false,
//       type: 'all',
//       capacity: 1,
//       price: 0,
//       minPrice: 0,
//       maxPrice,
//       minSize: 0,
//       maxSize,
//       breakfast: false,
//       pets: false
//     })

//     useEffect(()=>{
//       let filteredRooms = [...roomData.rooms]
//         if(roomData.type !== 'all'){
//           filteredRooms = filteredRooms.filter(room => room.type === roomData.type)
//           updateData({...roomData,['sortedRooms']:filteredRooms})
//         } else {
//           updateData({...roomData,['sortedRooms']:roomData.rooms})
//         }

//         if(roomData.capacity !== 1){
//           filteredRooms =filteredRooms.filter(room => room.capacity >= roomData.capacity)
//           updateData({...roomData,['sortedRooms']:filteredRooms})
//         }
//     },[roomData.type,roomData.capacity])





export default HotelContext;