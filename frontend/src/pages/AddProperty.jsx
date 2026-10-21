import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../services/api';

function AddProperty() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        property_type: 'House',
        bedrooms: '',
        bathrooms: '',
        area: '',
        status: 'available',
    });

    const [mainImage, setMainImage] =
        useState(null);

    const [galleryImages, setGalleryImages] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState('');

    const [success, setSuccess] =
        useState('');

    /*
    |--------------------------------------------------------------------------
    | HANDLE TEXT INPUTS
    |--------------------------------------------------------------------------
    */

    function handleChange(event) {
        const { name, value } =
            event.target;

        setFormData((previous) => ({
            ...previous,
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
    | HANDLE MULTIPLE GALLERY IMAGES
    |--------------------------------------------------------------------------
    */

    function handleGalleryImagesChange(
        event
    ) {
        const files = Array.from(
            event.target.files || []
        );

        setGalleryImages(files);
    }

    /*
    |--------------------------------------------------------------------------
    | REMOVE GALLERY IMAGE
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
    | SUBMIT PROPERTY
    |--------------------------------------------------------------------------
    */

    async function handleSubmit(event) {
        event.preventDefault();

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const property = {
                ...formData,

                image: mainImage,

                images: galleryImages,
            };

            await createProperty(property);

            setSuccess(
                'Property added successfully.'
            );

            /*
            |--------------------------------------------------------------------------
            | Redirect after successful creation
            |--------------------------------------------------------------------------
            */

            setTimeout(() => {
                navigate('/properties');
            }, 1000);
        } catch (err) {
            console.error(
                'Create property error:',
                err
            );

            setError(
                err.message ||
                    'Failed to add property.'
            );
        } finally {
            setLoading(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <div className="add-property-page">
            <div className="add-property-container">

                <div className="add-property-header">
                    <h1>
                        Add Property
                    </h1>

                    <p>
                        Add a new property to
                        your real estate
                        collection.
                    </p>
                </div>

                {error && (
                    <div className="form-message error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="form-message success">
                        {success}
                    </div>
                )}

                <form
                    className="property-form"
                    onSubmit={handleSubmit}
                >

                    {/* ======================================================
                        BASIC INFORMATION
                    ====================================================== */}

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
                                    name="title"
                                    type="text"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Modern 4 Bedroom House"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="location">
                                    Location
                                </label>

                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={
                                        formData.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Dodoma"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">
                                    Price (TZS)
                                </label>

                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 150000000"
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
                                >
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
                                <label htmlFor="bedrooms">
                                    Bedrooms
                                </label>

                                <input
                                    id="bedrooms"
                                    name="bedrooms"
                                    type="number"
                                    value={
                                        formData.bedrooms
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 4"
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="bathrooms">
                                    Bathrooms
                                </label>

                                <input
                                    id="bathrooms"
                                    name="bathrooms"
                                    type="number"
                                    value={
                                        formData.bathrooms
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 3"
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="area">
                                    Area (sqm)
                                </label>

                                <input
                                    id="area"
                                    name="area"
                                    type="number"
                                    value={
                                        formData.area
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 300"
                                    min="0"
                                />
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

                        </div>

                    </div>

                    {/* ======================================================
                        DESCRIPTION
                    ====================================================== */}

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

                    {/* ======================================================
                        MAIN IMAGE
                    ====================================================== */}

                    <div className="form-section">

                        <h2>
                            Main Property Photo
                        </h2>

                        <p className="image-help-text">
                            Choose the main photo
                            that will appear on
                            property cards.
                        </p>

                        <div className="image-upload-box">

                            <label
                                htmlFor="main-image"
                                className="image-upload-button"
                            >
                                Choose Main Photo
                            </label>

                            <input
                                id="main-image"
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
                                        Selected:
                                    </strong>{' '}
                                    {mainImage.name}
                                </div>
                            )}

                        </div>

                    </div>

                    {/* ======================================================
                        GALLERY IMAGES
                    ====================================================== */}

                    <div className="form-section">

                        <h2>
                            Property Gallery
                        </h2>

                        <p className="image-help-text">
                            Select multiple photos
                            to show different views
                            of this property.
                        </p>

                        <div className="image-upload-box">

                            <label
                                htmlFor="gallery-images"
                                className="image-upload-button"
                            >
                                Choose Multiple Photos
                            </label>

                            <input
                                id="gallery-images"
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
                            SELECTED GALLERY IMAGES
                        ================================================== */}

                        {galleryImages.length >
                            0 && (
                            <div className="selected-gallery">

                                <h3>
                                    Selected Photos (
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
                                                    alt={`Preview ${
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

                    {/* ======================================================
                        FORM ACTIONS
                    ====================================================== */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate(
                                    '/properties'
                                )
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? 'Adding Property...'
                                : 'Add Property'}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default AddProperty;