import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getProperty,
    updateProperty,
} from '../services/api';

const STORAGE_URL =
    'http://127.0.0.1:8000/storage/';

function EditProperty() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        property_type: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        status: 'available',
    });

    const [currentImage, setCurrentImage] =
        useState('');

    const [currentGalleryImages, setCurrentGalleryImages] =
        useState([]);

    const [mainImage, setMainImage] =
        useState(null);

    const [galleryImages, setGalleryImages] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState('');

    const [error, setError] =
        useState('');

    /*
    |--------------------------------------------------------------------------
    | LOAD PROPERTY
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadProperty();
    }, [id]);

    async function loadProperty() {
        try {
            setLoading(true);
            setError('');

            const property =
                await getProperty(id);

            setFormData({
                title:
                    property.title || '',

                description:
                    property.description || '',

                price:
                    property.price || '',

                location:
                    property.location || '',

                property_type:
                    property.property_type || '',

                bedrooms:
                    property.bedrooms ?? '',

                bathrooms:
                    property.bathrooms ?? '',

                area:
                    property.area ?? '',

                status:
                    property.status ||
                    'available',
            });

            /*
            |--------------------------------------------------------------------------
            | CURRENT MAIN IMAGE
            |--------------------------------------------------------------------------
            */

            if (property.image) {
                setCurrentImage(
                    `${STORAGE_URL}${property.image}`
                );
            } else {
                setCurrentImage('');
            }

            /*
            |--------------------------------------------------------------------------
            | CURRENT GALLERY IMAGES
            |--------------------------------------------------------------------------
            */

            if (
                Array.isArray(
                    property.images
                )
            ) {
                const gallery =
                    property.images
                        .filter(
                            (item) =>
                                item &&
                                item.image
                        )
                        .map((item) => ({
                            id: item.id,
                            image: item.image,
                            url: `${STORAGE_URL}${item.image}`,
                        }));

                setCurrentGalleryImages(
                    gallery
                );
            } else {
                setCurrentGalleryImages(
                    []
                );
            }
        } catch (err) {
            console.error(
                'Load property error:',
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

    /*
    |--------------------------------------------------------------------------
    | HANDLE TEXT CHANGES
    |--------------------------------------------------------------------------
    */

    function handleChange(event) {
        const { name, value } =
            event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    }

    /*
    |--------------------------------------------------------------------------
    | HANDLE MAIN IMAGE
    |--------------------------------------------------------------------------
    */

    function handleMainImageChange(event) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setMainImage(file);
    }

    /*
    |--------------------------------------------------------------------------
    | HANDLE GALLERY IMAGES
    |--------------------------------------------------------------------------
    */

    function handleGalleryImagesChange(
        event
    ) {
        const files = Array.from(
            event.target.files || []
        );

        if (files.length === 0) {
            return;
        }

        setGalleryImages((previous) => [
            ...previous,
            ...files,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Reset input so the same file can
        | be selected again if necessary.
        |--------------------------------------------------------------------------
        */

        event.target.value = '';
    }

    /*
    |--------------------------------------------------------------------------
    | REMOVE NEW GALLERY IMAGE
    |--------------------------------------------------------------------------
    */

    function removeGalleryImage(index) {
        setGalleryImages((previous) =>
            previous.filter(
                (_, imageIndex) =>
                    imageIndex !== index
            )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE PROPERTY
    |--------------------------------------------------------------------------
    */

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage('');
        setError('');
        setSaving(true);

        try {
            /*
            |--------------------------------------------------------------------------
            | IMPORTANT
            |--------------------------------------------------------------------------
            | updateProperty() in api.js creates
            | the FormData for us.
            |--------------------------------------------------------------------------
            */

            const propertyData = {
                ...formData,

                image: mainImage,

                images: galleryImages,
            };

            await updateProperty(
                id,
                propertyData
            );

            setMessage(
                'Property updated successfully!'
            );

            setTimeout(() => {
                navigate(
                    `/properties/${id}`
                );
            }, 1000);
        } catch (err) {
            console.error(
                'Update property error:',
                err
            );

            setError(
                err.message ||
                    'Failed to update property.'
            );
        } finally {
            setSaving(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="page-loading">
                <p>
                    Loading property...
                </p>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    if (
        error &&
        !formData.title
    ) {
        return (
            <div className="page-error">
                <h2>
                    Unable to load property
                </h2>

                <p>
                    {error}
                </p>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | PAGE
    |--------------------------------------------------------------------------
    */

    return (
        <div className="add-property-page">

            <div className="add-property-container">

                {/* ======================================================
                    PAGE HEADER
                ====================================================== */}

                <div className="add-property-header">

                    <h1>
                        Edit Property
                    </h1>

                    <p>
                        Update the property
                        information, photos and
                        specifications.
                    </p>

                </div>

                {/* ======================================================
                    SUCCESS MESSAGE
                ====================================================== */}

                {message && (
                    <div className="form-message success">
                        {message}
                    </div>
                )}

                {/* ======================================================
                    ERROR MESSAGE
                ====================================================== */}

                {error && (
                    <div className="form-message error">
                        {error}
                    </div>
                )}

                <form
                    className="property-form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    {/* ==================================================
                        PROPERTY INFORMATION
                    ================================================== */}

                    <div className="form-section">

                        <h2>
                            Property Information
                        </h2>

                        <div className="form-grid">

                            <div className="form-group">

                                <label htmlFor="title">
                                    Property Title
                                </label>

                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="location">
                                    Location
                                </label>

                                <input
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={
                                        formData.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="price">
                                    Price (TZS)
                                </label>

                                <input
                                    id="price"
                                    type="number"
                                    name="price"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="property_type">
                                    Property Type
                                </label>

                                <select
                                    id="property_type"
                                    name="property_type"
                                    value={
                                        formData.property_type
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select property type
                                    </option>

                                    <option value="House">
                                        House
                                    </option>

                                    <option value="Apartment">
                                        Apartment
                                    </option>

                                    <option value="Land">
                                        Land
                                    </option>

                                    <option value="Office">
                                        Office
                                    </option>

                                    <option value="Commercial">
                                        Commercial
                                    </option>

                                </select>

                            </div>

                            <div className="form-group">

                                <label htmlFor="status">
                                    Status
                                </label>

                                <select
                                    id="status"
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="available">
                                        Available
                                    </option>

                                    <option value="sold">
                                        Sold
                                    </option>

                                    <option value="rented">
                                        Rented
                                    </option>

                                </select>

                            </div>

                            <div className="form-group">

                                <label htmlFor="bedrooms">
                                    Bedrooms
                                </label>

                                <input
                                    id="bedrooms"
                                    type="number"
                                    name="bedrooms"
                                    value={
                                        formData.bedrooms
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="bathrooms">
                                    Bathrooms
                                </label>

                                <input
                                    id="bathrooms"
                                    type="number"
                                    name="bathrooms"
                                    value={
                                        formData.bathrooms
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="area">
                                    Area (m²)
                                </label>

                                <input
                                    id="area"
                                    type="number"
                                    name="area"
                                    value={
                                        formData.area
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                />

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        DESCRIPTION
                    ================================================== */}

                    <div className="form-section">

                        <h2>
                            Description
                        </h2>

                        <div className="form-group">

                            <label htmlFor="description">
                                Property Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Describe the property..."
                                rows="6"
                            />

                        </div>

                    </div>

                    {/* ==================================================
                        MAIN PROPERTY IMAGE
                    ================================================== */}

                    <div className="form-section">

                        <h2>
                            Main Property Photo
                        </h2>

                        <p className="image-help-text">
                            Replace the main
                            property photo if
                            necessary.
                        </p>

                        {currentImage && (
                            <div
                                style={{
                                    marginBottom:
                                        '20px',
                                }}
                            >

                                <p
                                    style={{
                                        marginBottom:
                                            '10px',
                                        fontWeight:
                                            '600',
                                        color:
                                            '#243b53',
                                    }}
                                >
                                    Current Main
                                    Photo
                                </p>

                                <img
                                    src={
                                        currentImage
                                    }
                                    alt={
                                        formData.title
                                    }
                                    style={{
                                        width:
                                            '100%',
                                        maxWidth:
                                            '500px',
                                        height:
                                            '280px',
                                        objectFit:
                                            'cover',
                                        borderRadius:
                                            '10px',
                                        display:
                                            'block',
                                    }}
                                />

                            </div>
                        )}

                        <div className="image-upload-box">

                            <label
                                htmlFor="edit-main-image"
                                className="image-upload-button"
                            >
                                Choose New Main
                                Photo
                            </label>

                            <input
                                id="edit-main-image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={
                                    handleMainImageChange
                                }
                                hidden
                            />

                            {mainImage && (
                                <div className="selected-image-name">
                                    <strong>
                                        New Main
                                        Photo:
                                    </strong>{' '}
                                    {
                                        mainImage.name
                                    }
                                </div>
                            )}

                        </div>

                    </div>

                    {/* ==================================================
                        EXISTING GALLERY
                    ================================================== */}

                    <div className="form-section">

                        <h2>
                            Existing Gallery Photos
                        </h2>

                        <p className="image-help-text">
                            These are the photos
                            currently saved for
                            this property.
                        </p>

                        {currentGalleryImages.length >
                            0 ? (
                            <div className="gallery-preview-grid">

                                {currentGalleryImages.map(
                                    (
                                        image
                                    ) => (
                                        <div
                                            className="gallery-preview-item"
                                            key={
                                                image.id
                                            }
                                        >

                                            <img
                                                src={
                                                    image.url
                                                }
                                                alt={
                                                    formData.title
                                                }
                                            />

                                            <div className="gallery-preview-info">

                                                <span>
                                                    Existing
                                                    Photo
                                                </span>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        ) : (
                            <p
                                style={{
                                    color:
                                        '#627d98',
                                    fontSize:
                                        '14px',
                                }}
                            >
                                No gallery photos
                                have been added
                                yet.
                            </p>
                        )}

                    </div>

                    {/* ==================================================
                        ADD NEW GALLERY PHOTOS
                    ================================================== */}

                    <div className="form-section">

                        <h2>
                            Add More Gallery Photos
                        </h2>

                        <p className="image-help-text">
                            Select one or more new
                            photos to add to the
                            existing gallery.
                        </p>

                        <div className="image-upload-box">

                            <label
                                htmlFor="edit-gallery-images"
                                className="image-upload-button"
                            >
                                Choose Multiple
                                Photos
                            </label>

                            <input
                                id="edit-gallery-images"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={
                                    handleGalleryImagesChange
                                }
                                hidden
                            />

                        </div>

                        {/* ==================================================
                            NEW GALLERY PREVIEW
                        ================================================== */}

                        {galleryImages.length >
                            0 && (
                            <div className="selected-gallery">

                                <h3>
                                    New Photos (
                                    {
                                        galleryImages.length
                                    }
                                    )
                                </h3>

                                <div className="gallery-preview-grid">

                                    {galleryImages.map(
                                        (
                                            image,
                                            index
                                        ) => (
                                            <div
                                                className="gallery-preview-item"
                                                key={`${image.name}-${index}`}
                                            >

                                                <img
                                                    src={URL.createObjectURL(
                                                        image
                                                    )}
                                                    alt={`New gallery photo ${
                                                        index +
                                                        1
                                                    }`}
                                                />

                                                <div className="gallery-preview-info">

                                                    <span>
                                                        {
                                                            image.name
                                                        }
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeGalleryImage(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>

                            </div>
                        )}

                    </div>

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate(
                                    `/properties/${id}`
                                )
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={saving}
                        >
                            {saving
                                ? 'Saving Changes...'
                                : 'Save Changes'}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditProperty;