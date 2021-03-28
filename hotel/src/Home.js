import react from 'react'
import { Link } from 'react-router-dom';
import Banner from './Banner';
import FeaturedRooms from './FeaturedRooms';
import Hero from './Hero';
import Services from './Services';

const Home = () => {
    
    return(
        <div>
            <Hero>
                <Banner title="luxiurious rooms" subtitle="deluxe rooms starting at $299" children={<Link to="/rooms" className='btn-primary' />} />
                {/* <Link to="/rooms" className='btn-primary' /> */}
                {/* </Banner> */}
            </Hero>
            <Services />
            <FeaturedRooms />
        </div>
        
    )
}

export default Home;