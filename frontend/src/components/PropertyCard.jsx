import { Link } from 'react-router-dom';

function PropertyCard({ property }) {

    const propertyType =
        property.property_type?.toLowerCase().trim() || '';

    const fallbackImages = {
        house:
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',

        apartment:
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=85',

        land:
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=85',

        office:
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85',
    };

    let fallbackImage = fallbackImages.house;

    if (propertyType.includes('land')) {
        fallbackImage = fallbackImages.land;
    } else if (propertyType.includes('apartment')) {
        fallbackImage = fallbackImages.apartment;
    } else if (propertyType.includes('office')) {
        fallbackImage = fallbackImages.office;
    } else if (propertyType.includes('house')) {
        fallbackImage = fallbackImages.house;
    }

    const image = property.image
        ? `http://127.0.0.1:8000/storage/${property.image}`
        : fallbackImage;

    return (
        <article className="property-card">

            {/* PROPERTY IMAGE */}
            <div className="property-image-container">

                <img
                    src={image}
                    alt={property.title}
                    className="property-image"
                />

                <span className="property-status">
                    {property.status}
                </span>

            </div>

            {/* PROPERTY CONTENT */}
            <div className="property-card-content">

                <h3>
                    {property.title}
                </h3>

                <p className="property-description">
                    {property.description}
                </p>

                <div className="property-price">
                    TZS {Number(property.price).toLocaleString()}
                </div>

                {/* PROPERTY FEATURES */}
                <div className="property-features">

                    <div className="feature">

                        <span className="feature-icon">
                            ⌖
                        </span>

                        <div>
                            <small>
                                Location
                            </small>

                            <strong>
                                {property.location}
                            </strong>
                        </div>

                    </div>

                    <div className="feature">

                        <span className="feature-icon">
                            ⌂
                        </span>

                        <div>
                            <small>
                                Type
                            </small>

                            <strong>
                                {property.property_type}
                            </strong>
                        </div>

                    </div>

                    <div className="feature">

                        <span className="feature-icon">
                            ▣
                        </span>

                        <div>
                            <small>
                                Bedrooms
                            </small>

                            <strong>
                                {property.bedrooms ?? 'N/A'}
                            </strong>
                        </div>

                    </div>

                    <div className="feature">

                        <span className="feature-icon">
                            ♨
                        </span>

                        <div>
                            <small>
                                Bathrooms
                            </small>

                            <strong>
                                {property.bathrooms ?? 'N/A'}
                            </strong>
                        </div>

                    </div>

                    <div className="feature">

                        <span className="feature-icon">
                            ↗
                        </span>

                        <div>
                            <small>
                                Area
                            </small>

                            <strong>
                                {property.area ?? 'N/A'} m²
                            </strong>
                        </div>

                    </div>

                    <div className="feature">

                        <span className="feature-icon status-dot">
                            ●
                        </span>

                        <div>
                            <small>
                                Status
                            </small>

                            <strong>
                                {property.status}
                            </strong>
                        </div>

                    </div>

                </div>

                {/* DETAILS BUTTON */}
                <Link
                    to={`/properties/${property.id}`}
                    className="view-details-button"
                >
                    View Details

                    <span>
                        →
                    </span>

                </Link>

            </div>

        </article>
    );
}

export default PropertyCard;