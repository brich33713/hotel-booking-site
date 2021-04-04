import react from 'react'
import Hero from './Hero';
import Banner from './Banner'
import {Link} from 'react-router-dom'

const Error = () => {
    return(
        <Hero>
            <Banner title="404" subtitle="Page Not Found" children={<Link to="/" className='btn-primary'>Return Home</Link>} />
        </Hero>
    )
}

export default Error;