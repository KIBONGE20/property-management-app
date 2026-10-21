import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';

function Properties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(
        searchParams.get('search') || ''
    );

    useEffect(() => {
        loadProperties();
    }, []);

    async function loadProperties() {
        try {
            setLoading(true);
            setError('');

            const data = await getProperties();

            setProperties(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch(event) {
        event.preventDefault();

        const search = searchTerm.trim();

        if (search) {
            setSearchParams({
                search,
            });
        } else {
            setSearchParams({});
        }
    }

    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    function clearSearch() {
        setSearchTerm('');
        setSearchParams({});
    }

    const filteredProperties = properties.filter((property) => {
        const search = searchTerm
            .toLowerCase()
            .trim();

        if (!search) {
            return true;
        }

        return (
            property.title
                ?.toLowerCase()
                .includes(search) ||
            property.location
                ?.toLowerCase()
                .includes(search) ||
            property.property_type
                ?.toLowerCase()
                .includes(search) ||
            property.description
                ?.toLowerCase()
                .includes(search)
        );
    });

    if (loading) {
        return (
            <div className="page-loading">
                <div className="loading-spinner"></div>
                <p>Loading properties...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-error">
                <h2>Unable to load properties</h2>
                <p>{error}</p>
                <button
                    type="button"
                    onClick={loadProperties}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="properties-page">

            {/* HERO */}

            <section className="property-hero">

                <div className="hero-overlay"></div>

                <div className="hero-content">

                    <div className="hero-text">

                        <span className="hero-label">
                            PROPERTY COLLECTION
                        </span>

                        <h1>
                            Find a property
                            <br />
                            <span>that feels like home.</span>
                        </h1>

                        <p>
                            Explore quality homes, apartments,
                            land and commercial spaces across Tanzania.
                        </p>

                    </div>

                    <form
                        className="hero-search"
                        onSubmit={handleSearch}
                    >

                        <span className="hero-search-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search location, property type or keyword..."
                        />

                        <button type="submit">
                            Search
                        </button>

                    </form>

                    <div className="hero-quick-links">

                        <span>Popular:</span>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('House');
                                setSearchParams({
                                    search: 'House',
                                });
                            }}
                        >
                            Houses
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('Apartment');
                                setSearchParams({
                                    search: 'Apartment',
                                });
                            }}
                        >
                            Apartments
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('Land');
                                setSearchParams({
                                    search: 'Land',
                                });
                            }}
                        >
                            Land
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('Office');
                                setSearchParams({
                                    search: 'Office',
                                });
                            }}
                        >
                            Offices
                        </button>

                    </div>

                </div>

            </section>


            {/* PROPERTIES */}

            <section className="available-properties">

                <div className="properties-section-top">

                    <div className="section-heading">

                        <span className="section-label">
                            EXPLORE PROPERTIES
                        </span>

                        <h2>
                            Available Properties
                        </h2>

                        <p>
                            Browse our latest listings and discover
                            properties that match your needs.
                        </p>

                    </div>

                    <div className="property-count">

                        <strong>
                            {filteredProperties.length}
                        </strong>

                        <span>
                            {filteredProperties.length === 1
                                ? 'Property'
                                : 'Properties'}
                        </span>

                    </div>

                </div>


                {searchTerm && (

                    <div className="search-results-message">

                        <div>
                            <span className="result-label">
                                SEARCH RESULTS
                            </span>

                            <strong>
                                "{searchTerm}"
                            </strong>
                        </div>

                        <button
                            type="button"
                            onClick={clearSearch}
                        >
                            Clear search
                        </button>

                    </div>

                )}


                {filteredProperties.length === 0 ? (

                    <div className="empty-properties">

                        <div className="empty-properties-icon">
                            ⌕
                        </div>

                        <h3>
                            {searchTerm
                                ? 'No properties found'
                                : 'No properties available'}
                        </h3>

                        <p>
                            {searchTerm
                                ? 'Try another location, property type or keyword.'
                                : 'Add a property to start building your listings.'}
                        </p>

                        {searchTerm && (
                            <button
                                type="button"
                                className="clear-search-button"
                                onClick={clearSearch}
                            >
                                Clear Search
                            </button>
                        )}

                    </div>

                ) : (

                    <div className="properties-grid">

                        {filteredProperties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                            />
                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}

export default Properties;