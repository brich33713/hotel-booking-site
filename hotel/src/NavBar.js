import react, { useState } from 'react'
import logo from './images/logo.svg'
import {FaAlignRight} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import './App.css'

const NavBar = () => {
    const [isOpen,changeOpen] = useState(false)

    const handleClick = () => {
        changeOpen(!isOpen)
    }

    let ulClass = (isOpen) ? 'nav-links show-nav' : 'nav-links'
    
    return(
        <div className='navbar'>
            <div className='nav-center'>
                <div className='nav-header'>
                    <Link to="/"><img src={logo} /></Link>
                    <button className='nav-btn' onClick={handleClick}><FaAlignRight className='nav-icon' /></button>
                </div>
                <ul className={ulClass}>
                    <li>
                        <Link to="/">Home</Link>
                        <Link to="/rooms">Rooms</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default NavBar;