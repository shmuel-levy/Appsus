export function GmailLoader() {
    return (
        <div id="gmail-loader">
            <div className="gmail-loader-bg"></div>
            <img src="./assets/img/gmail.png" alt="Gmail Loading" className="gmail-logo-loading" />
            <div className="gmail-progress"></div>
            <p className="gmail-text">Loading Gmail…</p>
        </div>
    );
}