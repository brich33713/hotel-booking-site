import react, { useContext } from 'react'
import HotelContext from './HotelContext';
import {Link} from 'react-router-dom'

const Hotel = ({hotel}) => {
    const {name,id,images,price} = hotel;
    return(
        <div className="room">
            <div className='img-container'>
                <img src={images[0]} alt={name} />
                <div className="price-top">
                    <h6>${price}</h6>
                    <p>per night</p>
                </div>
                <Link to={`/hotel/${id}`} className='btn-primary room-link'>
                    View
                </Link>
            </div>
            <p className="room-info">{name}</p>
        </div>
    )
}

export default Hotel;