import react, { useContext } from 'react'
import HotelContext from '../../HotelContext'
import Title from '../../Title'
import Hotel from '../../Hotel'

const FeaturedHotels = () => {
    const {featuredHotels} = useContext(HotelContext)
    return(
        <div>
            <Title title='featured hotels' />
            <div className='featured-rooms-center'>
            {featuredHotels.map(hotel => {
                return <Hotel key={hotel.id} room={hotel} />
            })}
            </div>
        </div>
    )
}

export default FeaturedHotels;