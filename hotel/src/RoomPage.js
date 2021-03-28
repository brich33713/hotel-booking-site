import react, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import RoomContext from './RoomContext';
import Hero from './Hero'
import Banner from './Banner'
import {Link} from 'react-router-dom'
import Error from './Error'
import StyledHero from './StyledComponents'
import axios from 'axios'

const RoomPage = () => {
    let {id} = useParams()
    const [loading,changeLoading] = useState(true)
    const [isEmpty,changeIsEmpty] = useState(true)
    const [hotel,changeHotel] = useState({})
    
    // make an api call to pull individual room data
    useEffect(async()=>{
        const data = await axios.get(`http://127.0.0.1:5000/api/hotel/${id}`)
        changeHotel(() => data.data)
        console.log(data)
        if(Object.keys(data.data).length !== 0) changeIsEmpty(false)
        changeLoading(false)
        console.log(hotel)
    },[hotel.data])

    return(
        <div>
            {loading && <div style={{margin:'330px'}}>Loading...</div>}
            {!loading && 
            <div>
            <StyledHero img={hotel.images[0].src}>
                <Banner title={hotel.name} children={<Link to={`/hotel/${id}`} className='btn-primary'>Back To Rooms</Link>} />
            </StyledHero>
            <div className='single-room'>
                <div className='single-room-images'>
                    {hotel.images.map((image,idx) => {
                        return <img key={idx} src={image.src} alt={image.alt} />
                    })}
                </div>
                <div className='single-room-info'>
                    <div className='desc' style={{width:'400px'}}>
                        <h3>details</h3>
                        <p>{hotel.description}</p>
                    </div>
                    <div className='info'>
                        <h3>info</h3>
                        Price feature coming soon
                        {/* <h6>price : ${room.price}</h6> */}
                        <h6>Beds : {(hotel.size > 1) ? `${hotel.size} Beds` : `${hotel.size} Bed`}</h6>
                        <h6>Max Capacity : {(hotel.capacity) > 1 ? `${hotel.capacity} people` : `${hotel.capacity} person`}</h6>
                        <h6>{hotel.pets ? "pets allowed" : 'no pets allowed'}</h6>
                        <h6>{hotel.breakfast && 'free breakfast included'}</h6>
                    </div>
                </div>
            </div>
            </div>}
            {/* </div> */}
                {/* <div className='room-extras'>
                    <h6>extras</h6>
                    <ul className='extras'>
                        {room.extras.map((extra,idx) => {
                            return <li key={idx}>{extra}</li>
                        })}
                    </ul>
                </div> */}
            {!loading && isEmpty && <div>
                <Error />
                </div>}
        </div>
    )
}

export default RoomPage;