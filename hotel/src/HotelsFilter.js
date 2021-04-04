import react, { useContext, useState } from 'react'
import HotelContext from './HotelContext';
import Title from './Title';

const HotelsFilter = () => {
    const hotelData = useContext(HotelContext)
    const [data,updateData] = useState(hotelData)
    // const filterRooms = () => {
    //     let filteredRooms = [...roomData.rooms]
    //     if(roomData.type !== 'all'){
    //         filteredRooms = filteredRooms.filter(room => room.type === roomData.type)
    //         roomData['sortedRooms'] = filteredRooms;
    //         updateData({...data,['sortedRooms']:filteredRooms})
    //     }
    // }
    // const handleChange = (e) => {
    //     const {name,type,value} = e.target
    //     roomData[name] = value
    //     updateData(() => ({...data,[name]:value}),filterRooms())
    // }

    const getUnique = (data,value) => {
        return [...new Set(data.map(data => data[value]))]
    }

    //filter data, so no duplicate inputs
    let types = ['all',...getUnique(hotelData.hotels,'type')]
    
    return (
        <div className='filter-container'>
            <Title title='search rooms' />
            <form className='filter-form'>
                {/* select type */} 
                    <div className='form-group'>
                        <label htmlFor='type'>hotel type</label>
                        <select name="type" id="type" className='form-control' onChange={hotelData.handleChange}>
                            {types.map(type => { 
                             return <option value={type} key={type}>{type}</option>
                            })}
                        </select>
                    </div>
                {/* end select type */}
                {/* select capacity */} 
                <div className='form-group'>
                        <label htmlFor='capacity'># guests</label>
                        <input name='capacity' id='capacity' type='text' onChange={hotelData.handleChange} value={hotelData.capacity} />
                        
                        {/* <select name="capacity" id="capacity" className='form-control' onChange={roomData.handleChange}>
                            {capacities.map(capacity => { 
                             return <option value={capacity} key={capacity}>{capacity}</option>
                            })}
                        </select> */}
                    </div>
                {/* end select type */}
            </form>
        </div>
    )
}

export default HotelsFilter;