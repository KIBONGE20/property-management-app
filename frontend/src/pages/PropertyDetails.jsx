import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    createPropertyInquiry,
    deleteProperty,
    getProperty,
} from '../services/api';

const API_STORAGE_URL =
    'http://127.0.0.1:8000/storage/';

const fallbackImages = {
    house: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    ],

    apartment: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    ],

    land: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    ],

    office: [
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    ],
};

function PropertyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const [selectedImage, setSelectedImage] =
        useState(null);

    const [deleting, setDeleting] =
        useState(false);

    const [inquiry, setInquiry] =
        useState({
            name: '',
            email: '',
            phone: '',
            message: '',
        });

    const [inquiryLoading, setInquiryLoading] =
        useState(false);

    const [inquirySuccess, setInquirySuccess] =
        useState('');

    const [inquiryError, setInquiryError] =
        useState('');

    /*
    |--------------------------------------------------------------------------
    | FETCH PROPERTY
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        async function loadProperty() {
            try {
                setLoading(true);
                setError('');

                const data =
                    await getProperty(id);

                setProperty(data);
            } catch (err) {
                console.error(
                    'Property details error:',
                    err
                );

                setError(
                    err.message ||
                        'Failed to load property.'
                );
            } finally {
                setLoading(false);
            }
        }

        loadProperty();
    }, [id]);

    /*
    |--------------------------------------------------------------------------
    | PROPERTY IMAGES
    |--------------------------------------------------------------------------
    */

    const propertyImages = useMemo(() => {
        if (!property) {
            return [];
        }

        const images = [];

        /*
        |--------------------------------------------------------------------------
        | MAIN IMAGE
        |--------------------------------------------------------------------------
        */

        if (property.image) {
            images.push(
                `${API_STORAGE_URL}${property.image}`
            );
        }

        /*
        |--------------------------------------------------------------------------
        | GALLERY IMAGES
        |--------------------------------------------------------------------------
        */

        if (
            Array.isArray(property.images)
        ) {
            property.images.forEach(
                (galleryImage) => {
                    if (
                        galleryImage &&
                        galleryImage.image
                    ) {
                        images.push(
                            `${API_STORAGE_URL}${galleryImage.image}`
                        );
                    }
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | REMOVE DUPLICATES
        |--------------------------------------------------------------------------
        */

        const uniqueImages =
            [...new Set(images)];

        /*
        |--------------------------------------------------------------------------
        | FALLBACK IMAGE
        |--------------------------------------------------------------------------
        */

        if (uniqueImages.length === 0) {
            const type =
                String(
                    property.property_type ||
                        'house'
                ).toLowerCase();

            if (
                type.includes('apartment')
            ) {
                return fallbackImages.apartment;
            }

            if (type.includes('land')) {
                return fallbackImages.land;
            }

            if (type.includes('office')) {
                return fallbackImages.office;
            }

            return fallbackImages.house;
        }

        return uniqueImages;
    }, [property]);

    /*
    |--------------------------------------------------------------------------
    | ACTIVE IMAGE
    |--------------------------------------------------------------------------
    */

    const activeImage =
        selectedImage ||
        propertyImages[0];

    /*
    |--------------------------------------------------------------------------
    | CHANGE INQUIRY FIELD
    |--------------------------------------------------------------------------
    */

    function handleInquiryChange(event) {
        const { name, value } =
            event.target;

        setInquiry((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    /*
    |--------------------------------------------------------------------------
    | SEND INQUIRY
    |--------------------------------------------------------------------------
    */

    async function handleInquirySubmit(
        event
    ) {
        event.preventDefault();

        setInquiryError('');
        setInquirySuccess('');
        setInquiryLoading(true);

        try {
            await createPropertyInquiry({
                property_id: property.id,
                name: inquiry.name.trim(),
                email: inquiry.email.trim(),
                phone: inquiry.phone.trim(),
                message:
                    inquiry.message.trim(),
            });

            setInquirySuccess(
                'Your inquiry has been sent successfully.'
            );

            setInquiry({
                name: '',
                email: '',
                phone: '',
                message: '',
            });
        } catch (err) {
            console.error(
                'Inquiry error:',
                err
            );

            setInquiryError(
                err.message ||
                    'Failed to send inquiry.'
            );
        } finally {
            setInquiryLoading(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE PROPERTY
    |--------------------------------------------------------------------------
    */

    async function handleDelete() {
        const token =
            localStorage.getItem(
                'auth_token'
            );

        /*
        |--------------------------------------------------------------------------
        | Require login
        |--------------------------------------------------------------------------
        */

        if (!token) {
            navigate('/login', {
                state: {
                    from: {
                        pathname:
                            `/properties/${id}`,
                    },
                },
            });

            return;
        }

        const confirmed =
            window.confirm(
                'Are you sure you want to delete this property?'
            );

        if (!confirmed) {
            return;
        }

        setDeleting(true);

        try {
            await deleteProperty(id);

            navigate('/properties');
        } catch (err) {
            console.error(
                'Delete property error:',
                err
            );

            alert(
                err.message ||
                    'Failed to delete property.'
            );
        } finally {
            setDeleting(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="property-details-page">
                <div className="property-details-container">
                    <p>
                        Loading property...
                    </p>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    if (error || !property) {
        return (
            <div className="property-details-page">
                <div className="property-details-container">

                    <Link
                        to="/properties"
                        className="back-to-properties"
                    >
                        ← Back to Properties
                    </Link>

                    <div className="property-error">
                        {error ||
                            'Property not found.'}
                    </div>

                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <div className="property-details-page">

            <div className="property-details-container">

                {/* ==========================================================
                    BACK BUTTON
                ========================================================== */}

                <Link
                    to="/properties"
                    className="back-to-properties"
                >
                    ← Back to Properties
                </Link>

                {/* ==========================================================
                    IMAGE GALLERY
                ========================================================== */}

                <div className="property-gallery">

                    <div className="property-details-image-wrapper">

                        <img
                            className="property-details-main-image"
                            src={activeImage}
                            alt={
                                property.title
                            }
                        />

                        <span className="property-details-status">
                            {property.status}
                        </span>

                    </div>

                    {/* ======================================================
                        THUMBNAILS
                    ====================================================== */}

                    {propertyImages.length >
                        1 && (
                        <div className="property-image-thumbnails">

                            {propertyImages.map(
                                (
                                    image,
                                    index
                                ) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        className={`property-image-thumbnail ${
                                            activeImage ===
                                            image
                                                ? 'active'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setSelectedImage(
                                                image
                                            )
                                        }
                                    >
                                        <img
                                            src={
                                                image
                                            }
                                            alt={`${property.title} ${
                                                index +
                                                1
                                            }`}
                                        />
                                    </button>
                                )
                            )}

                        </div>
                    )}

                </div>

                {/* ==========================================================
                    PROPERTY INFORMATION
                ========================================================== */}

                <div className="property-details-content">

                    <div className="property-details-main">

                        <div className="property-details-heading">

                            <div>
                                <span className="property-type-label">
                                    {
                                        property.property_type
                                    }
                                </span>

                                <h1>
                                    {
                                        property.title
                                    }
                                </h1>

                                <p className="property-location">
                                    📍{' '}
                                    {
                                        property.location
                                    }
                                </p>
                            </div>

                            <div className="property-details-price">
                                TZS{' '}
                                {Number(
                                    property.price
                                ).toLocaleString()}
                            </div>

                        </div>

                        {/* ==================================================
                            PROPERTY FEATURES
                        ================================================== */}

                        <div className="property-features">

                            <div className="property-feature">
                                <span>
                                    🛏️
                                </span>

                                <div>
                                    <strong>
                                        {
                                            property.bedrooms ??
                                                0
                                        }
                                    </strong>

                                    <small>
                                        Bedrooms
                                    </small>
                                </div>
                            </div>

                            <div className="property-feature">
                                <span>
                                    🚿
                                </span>

                                <div>
                                    <strong>
                                        {
                                            property.bathrooms ??
                                                0
                                        }
                                    </strong>

                                    <small>
                                        Bathrooms
                                    </small>
                                </div>
                            </div>

                            <div className="property-feature">
                                <span>
                                    📐
                                </span>

                                <div>
                                    <strong>
                                        {
                                            property.area ??
                                                0
                                        }
                                    </strong>

                                    <small>
                                        Sqm
                                    </small>
                                </div>
                            </div>

                        </div>

                        {/* ==================================================
                            DESCRIPTION
                        ================================================== */}

                        <div className="property-description">

                            <h2>
                                Description
                            </h2>

                            <p>
                                {property.description ||
                                    'No description available for this property.'}
                            </p>

                        </div>

                        {/* ==================================================
                            ACTION BUTTONS
                        ================================================== */}

                        <div className="property-actions">

                            <Link
                                to={`/properties/${property.id}/edit`}
                                className="edit-property-button"
                            >
                                Edit Property
                            </Link>

                            <button
                                type="button"
                                className="delete-property-button"
                                onClick={
                                    handleDelete
                                }
                                disabled={
                                    deleting
                                }
                            >
                                {deleting
                                    ? 'Deleting...'
                                    : 'Delete Property'}
                            </button>

                        </div>

                    </div>

                    {/* ======================================================
                        INQUIRY FORM
                    ====================================================== */}

                    <div className="property-inquiry-card">

                        <h2>
                            Interested in this
                            property?
                        </h2>

                        <p>
                            Send us an inquiry and
                            we will get back to you.
                        </p>

                        {inquiryError && (
                            <div className="form-message error">
                                {
                                    inquiryError
                                }
                            </div>
                        )}

                        {inquirySuccess && (
                            <div className="form-message success">
                                {
                                    inquirySuccess
                                }
                            </div>
                        )}

                        <form
                            onSubmit={
                                handleInquirySubmit
                            }
                        >

                            <div className="form-group">
                                <label htmlFor="inquiry-name">
                                    Name
                                </label>

                                <input
                                    id="inquiry-name"
                                    name="name"
                                    type="text"
                                    value={
                                        inquiry.name
                                    }
                                    onChange={
                                        handleInquiryChange
                                    }
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="inquiry-email">
                                    Email
                                </label>

                                <input
                                    id="inquiry-email"
                                    name="email"
                                    type="email"
                                    value={
                                        inquiry.email
                                    }
                                    onChange={
                                        handleInquiryChange
                                    }
                                    placeholder="Your email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="inquiry-phone">
                                    Phone
                                </label>

                                <input
                                    id="inquiry-phone"
                                    name="phone"
                                    type="tel"
                                    value={
                                        inquiry.phone
                                    }
                                    onChange={
                                        handleInquiryChange
                                    }
                                    placeholder="Your phone number"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="inquiry-message">
                                    Message
                                </label>

                                <textarea
                                    id="inquiry-message"
                                    name="message"
                                    value={
                                        inquiry.message
                                    }
                                    onChange={
                                        handleInquiryChange
                                    }
                                    placeholder="I'm interested in this property..."
                                    rows="5"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={
                                    inquiryLoading
                                }
                            >
                                {inquiryLoading
                                    ? 'Sending...'
                                    : 'Send Inquiry'}
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default PropertyDetails;