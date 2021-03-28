import react, { useState } from 'react'
import Title from './Title'
import {FaCocktail, FaHiking, FaShuttleVan, FaBeer} from 'react-icons/fa'


const Services = () => {
    const [services,updateServices] = useState([{
        icon:<FaCocktail />,
        title:'free cocktails',
        info: 'Lorem ipsum dolor'
    },
    {
        icon:<FaHiking />,
        title:'free hiking',
        info: 'Lorem ipsum dolor'
    },
    {
        icon:<FaShuttleVan />,
        title:'free shuttle',
        info: 'Lorem ipsum dolor'
    },
    {
        icon:<FaBeer />,
        title:'free beer',
        info: 'Lorem ipsum dolor'
    }])

    return (
        <div className='services'>
            <Title title='services' />
            <div className='services-center'>
                {services.map(service => {
                    return (
                        <div className='services' key={service.title}>
                            <span>{service.icon}</span>
                            <h6>{service.title}</h6>
                            <p>{service.info}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Services;