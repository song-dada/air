import './header.scss'

// hyomin
const Header = () => {
    return(
        <header>
            <div className='titleHeader'>
                <a href='/' ><h1>Weather Air Quality</h1></a>

                <div className='link'>
                    <a href='https://github.com/song-dada/air' className='git' target="_blank"><div>GIT</div></a>
                    <a href='/' className='report'><div>REPORT</div></a>
                </div>
            </div>
        </header>
    )
}

export default Header
