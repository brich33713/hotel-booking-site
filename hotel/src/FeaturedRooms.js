import react, { useContext } from 'react'
import RoomContext from './RoomContext'
import Title from './Title'
import Room from './Room'

const FeaturedRooms = () => {
    const {featuredRooms} = useContext(RoomContext)
    return(
        <div>
            <Title title='featured rooms' />
            <div className='featured-rooms-center'>
            {featuredRooms.map(room => {
                return <Room key={room.id} room={room} />
            })}
            </div>
        </div>
    )
}

export default FeaturedRooms;