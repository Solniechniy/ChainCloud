import { useState } from "react";
import { Link } from "react-router";
import "./App.css";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="header">
        <div className="container header-content">
          <a href="/" className="logo">
            <img src="/images/logo.svg" alt="SAN" />
            <span className="logo-text">SAN</span>
          </a>

          <button
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <nav className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
            <div className="nav-links">
              <a href="#" className="nav-link">
                Home
              </a>
              <a href="#features" className="nav-link">
                Features
              </a>
              <a href="#pricing" className="nav-link">
                Pricing
              </a>
              <a href="#contact" className="nav-link">
                Contact
              </a>
            </div>

            <div className="header-buttons">
              <a href="#download" className="nav-link">
                Download app
              </a>
              <Link to="/dashboard" className="nav-link">
                Log in
              </Link>
              <Link to="/dashboard" className="btn btn-outline">
                Try it free
              </Link>
            </div>
          </nav>

          <nav className="nav-links desktop-nav">
            <a href="#" className="nav-link">
              Home
            </a>
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#pricing" className="nav-link">
              Pricing
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </nav>

          <div className="header-buttons desktop-buttons">
            <a href="#download" className="nav-link">
              Download app
            </a>
            <Link to="/dashboard" className="nav-link">
              Log in
            </Link>
            <Link to="/dashboard" className="btn btn-outline">
              Try it free
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h1>
              Distributed data with
              <br />
              unified access.
            </h1>
            <a href="#get-started" className="btn btn-primary">
              Get Started
            </a>

            <div className="hero-cards">
              <div className="hero-card-header hero-card-first">
                <img src="/images/logo.svg" alt="SAN" />
                <span>SAN</span>
              </div>
              <div className="hero-card hero-card-second">
                <div className="hero-card-header">
                  <div className="flex items-center justify-center h-full">
                    <img src="/images/access.svg" alt="SAN" />
                  </div>
                  <div className="hero-card-content">
                    <h3>Start providing storage data</h3>
                    <p>Download client. Provide data. Get paid.</p>
                  </div>
                </div>

                <a href="#join" className="btn btn-outline">
                  Download app
                </a>
              </div>

              <div className="hero-card hero-card-third">
                <div className="hero-card-header">
                  <div className="flex items-center justify-center h-full">
                    <img src="/images/staking.svg" alt="SAN" />
                  </div>
                  <div className="hero-card-content">
                    <h3>Staking</h3>
                    <p>Start earn more.</p>
                  </div>
                </div>
                <a href="#stake" className="btn btn-outline">
                  Start staking
                </a>
              </div>

              <div className="hero-card hero-card-fourth">
                <div className="hero-card-header">
                  <div className="flex items-center justify-center h-full">
                    <img src="/images/people.svg" alt="SAN" />
                  </div>
                  <div className="hero-card-content">
                    <h3>Get Access to Solana RPC Node</h3>
                    <p>Create token. Made request. Get result.</p>
                  </div>
                </div>
                <a href="#create" className="btn btn-outline">
                  Create account
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="container">
            <div className="features-header">
              <h2>Earn While You Store</h2>
              <p>
                Connect to true DePIN network by starting providing storage
                data.
                <br />
                Download client. Provide data. Get paid.
              </p>
              <a href="#join-now" className="btn btn-primary">
                Join Now
              </a>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div>
                  <h1>Start Balancing</h1>
                  <p>Keep storage actual with balancing</p>
                </div>
                <img src="/images/ui-snippet.svg" alt="Start Balancing" />
              </div>
              <div className="feature-card">
                <div>
                  <h1>Provide uptime</h1>
                  <p>Keep storage connected to the network</p>
                </div>
                <img src="/images/ui-snippet-2.svg" alt="Provide uptime" />
              </div>
              <div className="feature-card">
                <div>
                  <h1>Use staking</h1>
                  <p>Staking help to increase the profit</p>
                </div>
                <img src="/images/ui-snippet-3.svg" alt="High uptime" />
              </div>
            </div>
          </div>
        </section>

        <section className="features flex flex-col items-center" id="features">
          <div className="container">
            <div className="features-header">
              <h2>Access Made Easy</h2>
              <p>
                Get Access to Solana RPC Node <br /> Create token. Made request.
                Get result.
              </p>
            </div>

            <div className="grid grid-rows-2 grid-cols-2 gap-4 ">
              <div className="feature-card-access flex flex-1 flex-col flex-start min-h-[200px] p-[24px] bg-neutral-100 rounded-lg  w-full">
                <div>
                  <img src="/images/placeholder.svg" alt="Start Balancing" />
                </div>
                <div className="mt-3">
                  <h2>
                    Unlimited scalability of network. Up to 10000 light clients
                    supported.
                  </h2>
                </div>
              </div>
              <div className="feature-card-access flex flex-1 flex-col flex-start min-h-[200px] p-[24px] bg-neutral-100 rounded-lg w-full">
                <div>
                  <img src="/images/placeholder.svg" alt="Start Balancing" />
                </div>
                <div className="mt-3">
                  <h2>
                    Failover mechanisms. We will deliver your information.
                  </h2>
                </div>
              </div>
              <div className="feature-card-access flex flex-col min-h-[200px] flex-start flex-1 p-[24px]  bg-neutral-100 rounded-lg w-full">
                <div>
                  <img src="/images/placeholder.svg" alt="Start Balancing" />
                </div>
                <div className="mt-3">
                  <h2>
                    High uptime throw network request. Stimulate to have more
                    than 90% uptime.
                  </h2>
                </div>
              </div>
              <div className="feature-card-access flex flex-1 flex-col flex-start min-h-[200px] p-[24px] bg-neutral-100 rounded-lg w-full">
                <div>
                  <img src="/images/placeholder.svg" alt="Start Balancing" />
                </div>
                <div className="mt-3">
                  <h2>Free for hobby projects, low-price for production</h2>
                </div>
              </div>
            </div>
          </div>

          <a href="#create" className="btn btn-outline mt-10">
            Create account
          </a>
        </section>

        <section className="how-it-works">
          <div className="container">
            <h2>How SAN works?</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <p>
                  We creating the server that handles all light clients and API
                  requests.
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <p>
                  Light clients start working and registering in the network.
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <p>
                  Server balancing the light clients storage with advanced
                  techniques.
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <p>
                  Server handles the request and redirects request to light
                  client
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">5</div>
                <p>Server return the data while saving temp cache at itself</p>
              </div>
              <div className="step-card">
                <div className="step-number">6</div>
                <p>Light client get paid for success request.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-column">
            <a href="/" className="logo footer-logo">
              <img src="/images/logo.svg" alt="SAN" />
              <span className="logo-text">SAN</span>
            </a>
          </div>
          <div className="footer-column">
            <a href="#about" className="footer-link">
              App
            </a>
          </div>
          <div className="footer-column">
            <a href="#about" className="footer-link">
              Dashboard
            </a>
          </div>
          <div className="footer-column">
            <a href="#about" className="footer-link">
              Links
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
