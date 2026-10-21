import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    function handleSearch(event) {
        event.preventDefault();

        const search = searchTerm.trim();

        if (search) {
            navigate(
                `/properties?search=${encodeURIComponent(search)}`
            );
        } else {
            navigate('/properties');
        }
    }

    return (
        <div className="home-page">

            {/* HERO */}
            <section className="home-hero">

                <div className="home-hero-overlay"></div>

                <div className="home-hero-content">

                    <span className="home-hero-label">
                        FIND YOUR NEXT HOME
                    </span>

                    <h1>
                        Find a place
                        <br />
                        <span>you'll love.</span>
                    </h1>

                    <p>
                        Discover quality properties across Tanzania.
                    </p>

                    <form
                        className="home-search"
                        onSubmit={handleSearch}
                    >
                        <div className="home-search-icon">
                            ⌕
                        </div>

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            placeholder="Search location or property type..."
                        />

                        <button type="submit">
                            Search
                        </button>
                    </form>

                    <div className="home-quick-search">
                        <span>Popular:</span>

                        <Link to="/properties?search=House">
                            Houses
                        </Link>

                        <Link to="/properties?search=Apartment">
                            Apartments
                        </Link>

                        <Link to="/properties?search=Land">
                            Land
                        </Link>

                        <Link to="/properties?search=Office">
                            Offices
                        </Link>
                    </div>

                </div>

            </section>


            {/* PROPERTY TYPES */}
            <section className="property-types">

                <div className="home-section-heading">

                    <span>
                        PROPERTY TYPES
                    </span>

                    <h2>
                        Find what you need
                    </h2>

                    <p>
                        Explore properties by category.
                    </p>

                </div>

                <div className="property-type-grid">

                    <Link
                        to="/properties?search=House"
                        className="property-type-card"
                    >
                        <div className="type-icon">
                            ⌂
                        </div>

                        <h3>
                            Houses
                        </h3>

                        <p>
                            Homes for comfortable living.
                        </p>

                        <span className="type-arrow">
                            →
                        </span>
                    </Link>


                    <Link
                        to="/properties?search=Apartment"
                        className="property-type-card"
                    >
                        <div className="type-icon">
                            ▦
                        </div>

                        <h3>
                            Apartments
                        </h3>

                        <p>
                            Modern spaces in great locations.
                        </p>

                        <span className="type-arrow">
                            →
                        </span>
                    </Link>


                    <Link
                        to="/properties?search=Land"
                        className="property-type-card"
                    >
                        <div className="type-icon">
                            ◇
                        </div>

                        <h3>
                            Land
                        </h3>

                        <p>
                            Opportunities for investment.
                        </p>

                        <span className="type-arrow">
                            →
                        </span>
                    </Link>


                    <Link
                        to="/properties?search=Office"
                        className="property-type-card"
                    >
                        <div className="type-icon">
                            ▤
                        </div>

                        <h3>
                            Offices
                        </h3>

                        <p>
                            Professional business spaces.
                        </p>

                        <span className="type-arrow">
                            →
                        </span>
                    </Link>

                </div>

            </section>


            {/* FEATURED */}
            <section className="home-featured">

                <div className="home-section-heading">

                    <span>
                        FEATURED
                    </span>

                    <h2>
                        Properties worth seeing
                    </h2>

                    <p>
                        Explore selected properties available now.
                    </p>

                </div>

                <div className="home-featured-content">

                    <div className="featured-image">

                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85"
                            alt="Modern luxury house"
                        />

                        <div className="featured-image-badge">
                            FEATURED
                        </div>

                    </div>

                    <div className="featured-text">

                        <span className="featured-label">
                            MODERN LIVING
                        </span>

                        <h2>
                            Your next property starts here.
                        </h2>

                        <p>
                            Find homes, apartments, land and
                            commercial properties that fit your needs.
                        </p>

                        <div className="featured-points">

                            <div>
                                <strong>✓</strong>
                                Verified information
                            </div>

                            <div>
                                <strong>✓</strong>
                                Great locations
                            </div>

                            <div>
                                <strong>✓</strong>
                                Easy property search
                            </div>

                        </div>

                        <Link
                            to="/properties"
                            className="home-primary-button"
                        >
                            View Properties
                            <span>→</span>
                        </Link>

                    </div>

                </div>

            </section>


            {/* CTA */}
            <section className="home-cta">

                <div className="home-cta-content">

                    <span>
                        PROPERTY OWNERS
                    </span>

                    <h2>
                        List your property with us.
                    </h2>

                    <p>
                        Reach buyers and tenants looking for their
                        next property.
                    </p>

                </div>

                <Link
                    to="/add-property"
                    className="home-cta-button"
                >
                    List Property
                    <span>→</span>
                </Link>

            </section>

        </div>
    );
}

export default Home;