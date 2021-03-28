import react from 'react'
import Hero from './Hero';
import Banner from './Banner'
import {Link} from 'react-router-dom'
import RoomsContainer from './RoomsContainer'


const Rooms = () => {
    return(
        <div>
        <Hero hero="roomsHero">
            <Banner title="our rooms" children={<Link to="/" className='btn-primary' />} />
        </Hero>
        <RoomsContainer />
        </div>
    )
}

export default Rooms;