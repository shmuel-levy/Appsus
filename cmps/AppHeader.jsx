const { Link, NavLink } = ReactRouterDOM

export function AppHeader() {
    return <header className="app-header">
        <Link to="/" className="logo-text">
            <img src='./assets/img/header.png' className='header-logo'></img>
        </Link>
        <nav>
                <NavLink to="/" className={({ isActive }) => isActive ? "active" : "home-link"}>
                    <i className="fa-solid fa-house"></i> Home
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? "active" : "about-link"}>
                    <i className="fa-solid fa-circle-info"></i> About
                </NavLink>
                <NavLink to="/mail" className={({ isActive }) => isActive ? "active" : "mail-link"}>
                    <i className="fa-solid fa-envelope"></i> Mail
                </NavLink>
                <NavLink to="/note" className={({ isActive }) => isActive ? "active" : "note-link"}>
                    <i className="fa-solid fa-lightbulb"></i> Note
                </NavLink>
            </nav>
    </header>
}
