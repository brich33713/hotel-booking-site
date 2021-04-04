import react, { useContext } from 'react'
import HotelContext from './HotelContext';
import Hotel from './Hotel'

const HotelsList = () => {
    let {sortedHotels} = useContext(HotelContext)
    if(!sortedHotels.length) return (
        <div className='empty-search'>
            <h3>No hotels match your search</h3>
        </div>
    )

    return(
        <div className="hotelslist">
            <div className='hotelslist-center'>
                {sortedHotels.map(hotel => {
                    return <Hotel key={hotel.id} room={hotel} />
                })}
            </div>
        </div>
    )
}

export default HotelsList;