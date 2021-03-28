import react, { useContext } from 'react'
import RoomContext from './RoomContext';
import Room from './Room'

const RoomsList = () => {
    let {sortedRooms} = useContext(RoomContext)

    if(!sortedRooms.length) return (
        <div className='empty-search'>
            <h3>No rooms match your search</h3>
        </div>
    )

    return(
        <div className="roomslist">
            <div className='roomslist-center'>
                {sortedRooms.map(room => {
                    return <Room key={room.id} room={room} />
                })}
            </div>
        </div>
    )
}

export default RoomsList;