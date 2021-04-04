import react from 'react'
import { Link } from 'react-router-dom';
import Banner from './Banner';
import FeaturedHotels from './AuxRoutes/FilterData/FeaturedHotels';
import Hero from './Hero';
import Services from './AuxRoutes/Services';

const Home = () => {
    
    return(
        <div>
            <Hero>
                <Banner title="Your Next Destination Awaits" subtitle="send a text, get a hotel. It's that easy" children={<h3>Get Started Below!</h3>} />
            </Hero>
            <Services />
            {/* Feature Coming soon for listing 3 highlighted hotels */}
            {/* <FeaturedHotels /> */}
        </div>
        
    )
}

export default Home;