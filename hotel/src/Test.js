import react, { useEffect } from 'react'
import axios from "axios";

const Test = () => {

useEffect(async()=>{
    let data = await getCityId()
    let cityId = (data.data.suggestions[0].entities[0].destinationId)
    let hotels = await getHotels(cityId)
    let hotelData = (hotels.data.data.body.searchResults.results)
    console.log(hotelData)
    let hotelDetails = await getHotelDetails(hotelData[0].id)
    // let propertyDescription = (hotelDetails.data.data.body.propertyDescription.tagline[0])
},[])

// data for accessing city id
// const options = {
//   method: 'GET',
//   url: 'https://hotels4.p.rapidapi.com/locations/search',
//   params: {query: 'new york', locale: 'en_US'},
//   headers: {
//     'x-rapidapi-key': 'bda788308fmsh78144b62705d0f9p18ffb6jsn34c349cac67a',
//     'x-rapidapi-host': 'hotels4.p.rapidapi.com'
//   }
// };

async function getCityId(){
const response = await axios.get('https://hotels4.p.rapidapi.com/locations/search',{
    params: {query: 'new york', locale: 'en_US'},
    headers: {
      'x-rapidapi-key': 'bda788308fmsh78144b62705d0f9p18ffb6jsn34c349cac67a',
      'x-rapidapi-host': 'hotels4.p.rapidapi.com'
    } 
})
return response
}

async function getHotels(cityId){
    const response = await axios.get('https://hotels4.p.rapidapi.com/properties/list',{
        params: {
            destinationId: cityId,
            pageNumber: '1',
            checkIn: '2021-05-30',
            checkOut: '2021-06-02',
            pageSize: '25',
            adults1: '1',
          },
          headers: {
            'x-rapidapi-key': 'bda788308fmsh78144b62705d0f9p18ffb6jsn34c349cac67a',
            'x-rapidapi-host': 'hotels4.p.rapidapi.com'
          }   
    })

    return response;
}

async function getHotelDetails(hotelId){
    const response = await axios.get('https://hotels4.p.rapidapi.com/properties/get-details',{
        params: {
            id: hotelId
          },
          headers: {
            'x-rapidapi-key': 'bda788308fmsh78144b62705d0f9p18ffb6jsn34c349cac67a',
            'x-rapidapi-host': 'hotels4.p.rapidapi.com'
          }
    })

    return response
}


// hotel data
// const options = {
//     method: 'GET',
//     url: 'https://hotels4.p.rapidapi.com/properties/list',
//     params: {
//       destinationId: '1506246',
//       pageNumber: '1',
//       checkIn: '2020-01-08',
//       checkOut: '2020-01-15',
//       pageSize: '25',
//       adults1: '1',
//       currency: 'USD',
//       locale: 'en_US',
//       sortOrder: 'PRICE'
//     },
//     headers: {
//       'x-rapidapi-key': 'bda788308fmsh78144b62705d0f9p18ffb6jsn34c349cac67a',
//       'x-rapidapi-host': 'hotels4.p.rapidapi.com'
//     }
//   };

  const options = {
    method: 'GET',
    url: 'https://hotels4.p.rapidapi.com/properties/get-details',
    params: {
      id: '424023',
      locale: 'en_US',
      currency: 'USD',
      checkOut: '2020-01-15',
      adults1: '1',
      checkIn: '2020-01-08'
    },
    headers: {
      'x-rapidapi-key': 'bda788308fmsh78144b62705d0f9p18ffb6jsn34c349cac67a',
      'x-rapidapi-host': 'hotels4.p.rapidapi.com'
    }
  };


// axios.request(options).then(function (response) {
// 	console.log(response.data);
// }).catch(function (error) {
// 	console.error(error);
// });


return(
    <div>

    </div>
)
}

export default Test;