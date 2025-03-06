const { useState } = React

export function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About Appsus</h1>

        <section className="about-app">
          <h2>Our Application</h2>
          <p>
            Appsus is a productivity suite inspired by Google's applications. It
            features a notes app similar to Google Keep and an email client
            similar to Gmail. Our goal is to provide a seamless experience for
            managing your notes and communications.
          </p>
        </section>

        <section className="team-section">
          <h2>Meet The Team</h2>
          <div className="team-members">
            <div className="team-member">
              <img
                src="assets/img/Shmuel.jpg"
                alt="Team Member"
                className="member-img"
              />
              <h3>Shmuel Levy</h3>
              <p>Front-end Developer</p>
              <p>Responsible for the Keep application and About page.</p>
              <div className="social-links">
                <a
                  href="https://github.com/shmuel-levy?tab=repositories"
                  target="_blank"
                >
                  GitHub
                </a>
                <a href="https://linkedin.com/" target="_blank">
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="team-member">
              <img
                src="assets/img/SHOHAM PICTURE.jpg"
                alt="Team Member"
                className="member-img"
              />
              <h3>Shoham Shitler</h3>
              <p>Front-end Developer</p>
              <p>Responsible for the Mail application and Home page.</p>
              <div className="social-links">
                <a href="https://github.com/" target="_blank">
                  GitHub
                </a>
                <a href="https://linkedin.com/" target="_blank">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="technologies">
          <h2>Technologies Used</h2>
          <ul className="tech-list">
            <li>React</li>
            <li>React Router</li>
            <li>CSS</li>
            <li>Javascript</li>
            <li>Lottie</li>
            <li>SVG</li>

          </ul>
        </section>

        <footer className="about-footer">
          <p>© 2025 Appsus | Made by Shmuel and Shoham</p>
        </footer>
      </div>
    </div>
  )
}
