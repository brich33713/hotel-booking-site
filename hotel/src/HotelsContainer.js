import react from 'react'
import HotelsFilter from './HotelsFilter'
import HotelsList from './HotelsList'

const HotelsContainer = () => {
    return(
        <div>
            <HotelsFilter />
            <HotelsList />
        </div>
    )
}

export default HotelsContainer;