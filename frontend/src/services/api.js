const API_URL = 'http://127.0.0.1:8000/api';

/*
|--------------------------------------------------------------------------
| AUTHENTICATION HELPER
|--------------------------------------------------------------------------
*/

function getAuthHeaders() {
    const token = localStorage.getItem('auth_token');

    return {
        Accept: 'application/json',

        ...(token
            ? {
                  Authorization: `Bearer ${token}`,
              }
            : {}),
    };
}

/*
|--------------------------------------------------------------------------
| UNAUTHORIZED HANDLER
|--------------------------------------------------------------------------
*/

function handleUnauthorized(response) {
    if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');

        window.dispatchEvent(
            new Event('auth-change')
        );

        window.location.href = '/login';

        return true;
    }

    return false;
}

/*
|--------------------------------------------------------------------------
| GET ALL PROPERTIES
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

export async function getProperties() {
    const response = await fetch(
        `${API_URL}/properties`,
        {
            method: 'GET',

            headers: {
                Accept: 'application/json',
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
                'Failed to fetch properties.'
        );
    }

    return data;
}

/*
|--------------------------------------------------------------------------
| GET SINGLE PROPERTY
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

export async function getProperty(id) {
    const response = await fetch(
        `${API_URL}/properties/${id}`,
        {
            method: 'GET',

            headers: {
                Accept: 'application/json',
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
                'Failed to fetch property.'
        );
    }

    return data;
}

/*
|--------------------------------------------------------------------------
| CREATE PROPERTY
|--------------------------------------------------------------------------
| Protected
| Uses FormData because properties can contain images.
|--------------------------------------------------------------------------
*/

export async function createProperty(property) {
    const formData = new FormData();

    formData.append(
        'title',
        property.title
    );

    formData.append(
        'description',
        property.description || ''
    );

    formData.append(
        'price',
        property.price
    );

    formData.append(
        'location',
        property.location
    );

    formData.append(
        'property_type',
        property.property_type
    );

    formData.append(
        'bedrooms',
        property.bedrooms || ''
    );

    formData.append(
        'bathrooms',
        property.bathrooms || ''
    );

    formData.append(
        'area',
        property.area || ''
    );

    formData.append(
        'status',
        property.status
    );

    /*
    |--------------------------------------------------------------------------
    | MAIN IMAGE
    |--------------------------------------------------------------------------
    */

    if (property.image) {
        formData.append(
            'image',
            property.image
        );
    }

    /*
    |--------------------------------------------------------------------------
    | GALLERY IMAGES
    |--------------------------------------------------------------------------
    */

    if (
        Array.isArray(property.images) &&
        property.images.length > 0
    ) {
        property.images.forEach((image) => {
            if (image) {
                formData.append(
                    'images[]',
                    image
                );
            }
        });
    }

    const response = await fetch(
        `${API_URL}/properties`,
        {
            method: 'POST',

            headers: {
                ...getAuthHeaders(),
            },

            body: formData,
        }
    );

    if (handleUnauthorized(response)) {
        throw new Error(
            'Your session has expired. Please login again.'
        );
    }

    const data = await response.json();

    if (!response.ok) {
        console.error(
            'Laravel create property error:',
            data
        );

        const validationErrors =
            data.errors
                ? Object.values(
                      data.errors
                  )
                      .flat()
                      .join(' ')
                : '';

        throw new Error(
            validationErrors ||
                data.message ||
                'Failed to create property.'
        );
    }

    return data;
}

/*
|--------------------------------------------------------------------------
| UPDATE PROPERTY
|--------------------------------------------------------------------------
| Protected
| Uses POST because the Laravel route is POST.
| Uses FormData because properties can contain images.
|--------------------------------------------------------------------------
*/

export async function updateProperty(
    id,
    property
) {
    const formData = new FormData();

    formData.append(
        'title',
        property.title
    );

    formData.append(
        'description',
        property.description || ''
    );

    formData.append(
        'price',
        property.price
    );

    formData.append(
        'location',
        property.location
    );

    formData.append(
        'property_type',
        property.property_type
    );

    formData.append(
        'bedrooms',
        property.bedrooms || ''
    );

    formData.append(
        'bathrooms',
        property.bathrooms || ''
    );

    formData.append(
        'area',
        property.area || ''
    );

    formData.append(
        'status',
        property.status
    );

    /*
    |--------------------------------------------------------------------------
    | NEW MAIN IMAGE
    |--------------------------------------------------------------------------
    */

    if (property.image) {
        formData.append(
            'image',
            property.image
        );
    }

    /*
    |--------------------------------------------------------------------------
    | NEW GALLERY IMAGES
    |--------------------------------------------------------------------------
    */

    if (
        Array.isArray(property.images) &&
        property.images.length > 0
    ) {
        property.images.forEach((image) => {
            if (image) {
                formData.append(
                    'images[]',
                    image
                );
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | SEND UPDATE REQUEST
    |--------------------------------------------------------------------------
    | IMPORTANT:
    | Do NOT use _method = PUT here.
    |
    | Laravel route:
    | POST /api/properties/{property}
    |--------------------------------------------------------------------------
    */

    const response = await fetch(
        `${API_URL}/properties/${id}`,
        {
            method: 'POST',

            headers: {
                ...getAuthHeaders(),
            },

            body: formData,
        }
    );

    if (handleUnauthorized(response)) {
        throw new Error(
            'Your session has expired. Please login again.'
        );
    }

    const data =
        await response.json();

    if (!response.ok) {
        console.error(
            'Laravel update property error:',
            data
        );

        const validationErrors =
            data.errors
                ? Object.values(
                      data.errors
                  )
                      .flat()
                      .join(' ')
                : '';

        throw new Error(
            validationErrors ||
                data.message ||
                'Failed to update property.'
        );
    }

    return data;
}

/*
|--------------------------------------------------------------------------
| DELETE PROPERTY
|--------------------------------------------------------------------------
| Protected
|--------------------------------------------------------------------------
*/

export async function deleteProperty(id) {
    const response = await fetch(
        `${API_URL}/properties/${id}`,
        {
            method: 'DELETE',

            headers: {
                ...getAuthHeaders(),
            },
        }
    );

    if (handleUnauthorized(response)) {
        throw new Error(
            'Your session has expired. Please login again.'
        );
    }

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
                'Failed to delete property.'
        );
    }

    return data;
}

/*
|--------------------------------------------------------------------------
| LOGIN USER
|--------------------------------------------------------------------------
*/

export async function loginUser(
    email,
    password
) {
    const response = await fetch(
        `${API_URL}/login`,
        {
            method: 'POST',

            headers: {
                Accept: 'application/json',
                'Content-Type':
                    'application/json',
            },

            body: JSON.stringify({
                email,
                password,
            }),
        }
    );

    const data =
        await response.json();

    if (!response.ok) {
        const validationErrors =
            data.errors
                ? Object.values(
                      data.errors
                  )
                      .flat()
                      .join(' ')
                : '';

        throw new Error(
            validationErrors ||
                data.message ||
                'Login failed.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE AUTHENTICATION INFORMATION
    |--------------------------------------------------------------------------
    */

    if (data.token) {
        localStorage.setItem(
            'auth_token',
            data.token
        );
    }

    if (data.user) {
        localStorage.setItem(
            'auth_user',
            JSON.stringify(data.user)
        );
    }

    window.dispatchEvent(
        new Event('auth-change')
    );

    return data;
}

/*
|--------------------------------------------------------------------------
| REGISTER USER
|--------------------------------------------------------------------------
*/

export async function registerUser(
    name,
    email,
    password,
    password_confirmation
) {
    const response = await fetch(
        `${API_URL}/register`,
        {
            method: 'POST',

            headers: {
                Accept: 'application/json',
                'Content-Type':
                    'application/json',
            },

            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation,
            }),
        }
    );

    const data =
        await response.json();

    if (!response.ok) {
        const validationErrors =
            data.errors
                ? Object.values(
                      data.errors
                  )
                      .flat()
                      .join(' ')
                : '';

        throw new Error(
            validationErrors ||
                data.message ||
                'Registration failed.'
        );
    }

    return data;
}

/*
|--------------------------------------------------------------------------
| LOGOUT USER
|--------------------------------------------------------------------------
| Protected
|--------------------------------------------------------------------------
*/

export async function logoutUser() {
    const token =
        localStorage.getItem(
            'auth_token'
        );

    /*
    |--------------------------------------------------------------------------
    | No token
    |--------------------------------------------------------------------------
    */

    if (!token) {
        localStorage.removeItem(
            'auth_user'
        );

        window.dispatchEvent(
            new Event('auth-change')
        );

        return;
    }

    const response = await fetch(
        `${API_URL}/logout`,
        {
            method: 'POST',

            headers: {
                ...getAuthHeaders(),
            },
        }
    );

    /*
    |--------------------------------------------------------------------------
    | CLEAR LOCAL AUTHENTICATION
    |--------------------------------------------------------------------------
    */

    localStorage.removeItem(
        'auth_token'
    );

    localStorage.removeItem(
        'auth_user'
    );

    window.dispatchEvent(
        new Event('auth-change')
    );

    if (!response.ok) {
        const data =
            await response.json();

        throw new Error(
            data.message ||
                'Logout failed.'
        );
    }

    return true;
}

/*
|--------------------------------------------------------------------------
| GET PROPERTY INQUIRIES
|--------------------------------------------------------------------------
| Protected
|--------------------------------------------------------------------------
*/

export async function getPropertyInquiries() {
    const response = await fetch(
        `${API_URL}/property-inquiries`,
        {
            method: 'GET',

            headers: {
                ...getAuthHeaders(),
            },
        }
    );

    if (handleUnauthorized(response)) {
        throw new Error(
            'Your session has expired. Please login again.'
        );
    }

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
                'Failed to fetch inquiries.'
        );
    }

    return data;
}

/*
|--------------------------------------------------------------------------
| UPDATE PROPERTY INQUIRY STATUS
|--------------------------------------------------------------------------
| Protected
|--------------------------------------------------------------------------
*/

export async function updatePropertyInquiryStatus(
    id,
    status
) {
    const response = await fetch(
        `${API_URL}/property-inquiries/${id}`,
        {
            method: 'PUT',

            headers: {
                Accept: 'application/json',
                'Content-Type':
                    'application/json',

                ...getAuthHeaders(),
            },

            body: JSON.stringify({
                status,
            }),
        }
    );

    if (handleUnauthorized(response)) {
        throw new Error(
            'Your session has expired. Please login again.'
        );
    }

    const data =
        await response.json();

    if (!response.ok) {
        const validationErrors =
            data.errors
                ? Object.values(
                      data.errors
                  )
                      .flat()
                      .join(' ')
                : '';

        throw new Error(
            validationErrors ||
                data.message ||
                'Failed to update inquiry status.'
        );
    }

    return data;
}

/*
|--------------------------------------------------------------------------
| CREATE PROPERTY INQUIRY
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

export async function createPropertyInquiry(
    inquiry
) {
    const response = await fetch(
        `${API_URL}/property-inquiries`,
        {
            method: 'POST',

            headers: {
                Accept: 'application/json',
                'Content-Type':
                    'application/json',
            },

            body: JSON.stringify({
                property_id:
                    inquiry.property_id,

                name:
                    inquiry.name,

                email:
                    inquiry.email,

                phone:
                    inquiry.phone || '',

                message:
                    inquiry.message,
            }),
        }
    );

    const data =
        await response.json();

    if (!response.ok) {
        const validationErrors =
            data.errors
                ? Object.values(
                      data.errors
                  )
                      .flat()
                      .join(' ')
                : '';

        throw new Error(
            validationErrors ||
                data.message ||
                'Failed to send inquiry.'
        );
    }

    return data;
}