export function HomeLoader() {
    return (
        <div id="home-loader">
            <div className="home-loader-bg"></div>
            <img src="./assets/img/header.png" alt="Loading Appsus" className="appsus-logo-loading" />
            <div className="home-progress"></div>
            <p className="home-text">Loading Appsus…</p>
        </div>
    )
}