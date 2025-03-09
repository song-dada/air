import './header.scss';
import { FaGithub } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
// hyomin

function Header() {
    return(
        <header>
            <a href='/' className='titleHeader'>
                 <h1>Weather Air Quality</h1>
            </a>

            <div className='link'>
                <a href='https://github.com/song-dada/air' className='git' target="_blank">
                    <div><FaGithub /></div>
                </a>
                <a href='/' className='report'>
                    <div><IoDocumentTextOutline /></div>
                </a>
            </div>
        </header>
    )
}

export default Header