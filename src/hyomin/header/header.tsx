import './header.scss'



function Header({ onSelect }: any) {
    return(
        <header>
            {/* 로고, 메뉴, 셀렉트 박스, 되나? */}
            <a href='/' className='logo'>logo</a>
            <nav>
                <ul>
                    <li><a href="/">수도권조회</a></li>
                    <li><a href="/">통계데이터</a></li>
                </ul>
            </nav>
            {onSelect}
            {/* <SelectBox>

            </SelectBox> */}
        </header>
    )
}

export default Header