import react, { useContext } from 'react'
import RoomContext from './RoomContext';
import {Link} from 'react-router-dom'

const Room = ({room}) => {
    const {name,id,images,price} = room;
    return(
        <div className="room">
            <div className='img-container'>
                <img src={images[0]} alt={name} />
                <div className="price-top">
                    <h6>${price}</h6>
                    <p>per night</p>
                </div>
                <Link to={`/room/${id}`} className='btn-primary room-link'>
                    View
                </Link>
            </div>
            <p className="room-info">{name}</p>
        </div>
    )
}

export default Room;