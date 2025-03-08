import { HomeLoader } from "../apps/mail/cmps/HomeLoader.jsx";
const { useState, useEffect } = React

export function Home() {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a loading time of 2 seconds
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <React.Fragment>
            {isLoading ? (
                <HomeLoader />
            ) : (
                <section className="container home">
                    <h1 className="fade-in">Welcome to Appsus</h1>
                    <p>Where Productivity Meets Simplicity</p>

                    {/* Logo Container - Centered */}
                    <div className="logos-container">
                        <a href="#/mail">
                            <img src="./assets/img/gmail.png" alt="Mail App" className="icon mail bounce-in-left " />
                        </a>

                        <a href="#/about">
                            <img src="./assets/img/about.png" alt="Appsus Logo" className="appsus-logo zoom-in" />
                        </a>

                        <a href="#/note">
                            <img src="./assets/img/icons8-google-keep-new-240.png" alt="Keep App" className="icon keep bounce-in-right" />
                        </a>
                    </div>
                </section>
            )}
        </React.Fragment>
    )
}