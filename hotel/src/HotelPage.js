import react, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router';
import Banner from './Banner'
import {Link} from 'react-router-dom'
import Error from './Error'
import StyledHero from './StyledComponents'
import axios from 'axios'

const HotelPage = () => {
    let {id} = useParams()
    let paragraphRef = useRef()
    const [loading,changeLoading] = useState(true)
    const [isEmpty,changeIsEmpty] = useState(true)
    const [hotel,changeHotel] = useState({})
    const ngrok_url = ''

    
    // make an api call to pull individual room data
    useEffect(async()=>{
        const data = await axios.get(`/api/hotel/${id}`)
        changeHotel(() => data.data)
        if(Object.keys(data.data).length !== 0) {
            changeIsEmpty(false)
            changeLoading(false)
            paragraphRef.current.innerHTML = data.data.description
        } else {
            changeLoading(false)
        }
        
    },[hotel.data])


    return(
        <div>
            {loading && <div style={{margin:'330px'}}>Loading...</div>}
            {!loading && !isEmpty &&
            <div>
            <StyledHero img={hotel.images[0].src}>
                <Banner title={hotel.name} children={<Link to={`/hotel/${id}`} className='btn-primary'>Back To Rooms</Link>} />
            </StyledHero>
            <div className='single-room'>
                <div className='single-room-images'>
                    {hotel.images.map((image,idx) => {
                        return <a href={image.src}><img key={idx} src={image.src} alt={image.alt} /></a>
                    })}
                </div>
                <div className='single-room-info'>
                    <div className='desc' style={{width:'400px'}}>
                        <h3><b>details</b></h3>
                        <p ref={paragraphRef}></p>
                    </div>
                    <div className='info'>
                        <h3>info</h3>
                        {/* Price feature coming soon */}
                        {/* <h6>price : ${room.price}</h6> */}
                        <h6>Beds : {(hotel.size > 1) ? `${hotel.size} Beds` : `${hotel.size} Bed`}</h6>
                        <h6>Max Capacity : {(hotel.capacity) > 1 ? `${hotel.capacity} people` : `${hotel.capacity} person`}</h6>
                        <h6>{hotel.pets ? "pets allowed" : 'no pets allowed'}</h6>
                        <h6>{hotel.breakfast && 'free breakfast included'}</h6>
                    </div>
                </div>
            </div>
            </div>}
            {/* Future feature for adding specific amenities */}
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

export default HotelPage;