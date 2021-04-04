import react from 'react'
import Hero from './Hero';
import Banner from './Banner'
import {Link} from 'react-router-dom'
import RoomsContainer from './HotelsContainer'


const Hotels = () => {
    return(
        <div>
        <Hero hero="roomsHero">
            <Banner title="our hotels" children={<Link to="/" className='btn-primary' />} />
        </Hero>
        <RoomsContainer />
        </div>
    )
}

export default Hotels;