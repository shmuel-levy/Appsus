import { showSuccessMsg } from '../services/event-bus.service.js'
const { useState, useEffect } = React

export function Home() {
    return (
        <section className="container home">
            <h1 className="fade-in">Welcome to Appsus</h1>

            {/* Logo Container - Centered */}
            <div className="logos-container">
                <a href="#/mail">
                    <img src="./assets/img/gmail.png" alt="Mail App" className="icon mail bounce-in-left " />
                </a>

                <a href="#/about">
                    <img src="./assets/img/horse.png" alt="Appsus Logo" className="appsus-logo zoom-in" />
                </a>

                <a href="#/note">
                    <img src="./assets/img/icons8-google-keep-new-240.png" alt="Keep App" className="icon keep bounce-in-right" />
                </a>
            </div>
        </section>
    );
}