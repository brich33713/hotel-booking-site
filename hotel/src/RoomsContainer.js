import react from 'react'
import RoomsFilter from './RoomsFilter'
import RoomsList from './RoomsList'

const RoomsContainer = () => {
    return(
        <div>
            <RoomsFilter />
            <RoomsList />
        </div>
    )
}

export default RoomsContainer;