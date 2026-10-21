
import { useEffect, useState } from 'react';
import {
    getPropertyInquiries,
    updatePropertyInquiryStatus,
} from '../services/api';

function Inquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    // Filter
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadInquiries();
    }, []);

    async function loadInquiries() {
        try {
            setLoading(true);
            setError('');

            const data = await getPropertyInquiries();

            setInquiries(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(inquiryId, status) {
        try {
            setUpdatingId(inquiryId);
            setError('');

            const data = await updatePropertyInquiryStatus(
                inquiryId,
                status
            );

            setInquiries((previousInquiries) =>
                previousInquiries.map((inquiry) =>
                    inquiry.id === inquiryId
                        ? data.inquiry
                        : inquiry
                )
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setUpdatingId(null);
        }
    }

    const totalInquiries = inquiries.length;

    const newInquiries = inquiries.filter(
        (inquiry) => inquiry.status === 'new'
    ).length;

    const contactedInquiries = inquiries.filter(
        (inquiry) => inquiry.status === 'contacted'
    ).length;

    const closedInquiries = inquiries.filter(
        (inquiry) => inquiry.status === 'closed'
    ).length;

    // Filter inquiries
    const filteredInquiries =
        statusFilter === 'all'
            ? inquiries
            : inquiries.filter(
                  (inquiry) =>
                      inquiry.status === statusFilter
              );

    if (loading) {
        return (
            <div className="page-loading">
                <p>Loading inquiries...</p>
            </div>
        );
    }

    if (error && inquiries.length === 0) {
        return (
            <div className="page-error">
                <h2>Unable to load inquiries</h2>

                <p>{error}</p>

                <button
                    type="button"
                    onClick={loadInquiries}
                    className="retry-button"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="inquiries-page">

            {/* PAGE HEADER */}
            <div className="inquiries-header">

                <div>
                    <span className="property-details-label">
                        ADMINISTRATION
                    </span>

                    <h1>Property Inquiries</h1>

                    <p>
                        Manage messages received from customers
                        interested in your properties.
                    </p>
                </div>

            </div>

            {/* INQUIRY STATISTICS */}
            <div className="inquiry-statistics">

                <div className="inquiry-stat-card">

                    <div className="inquiry-stat-icon">
                        ✉
                    </div>

                    <div>
                        <strong>{totalInquiries}</strong>
                        <span>Total Inquiries</span>
                    </div>

                </div>

                <div className="inquiry-stat-card">

                    <div className="inquiry-stat-icon">
                        ●
                    </div>

                    <div>
                        <strong>{newInquiries}</strong>
                        <span>New</span>
                    </div>

                </div>

                <div className="inquiry-stat-card">

                    <div className="inquiry-stat-icon">
                        ✓
                    </div>

                    <div>
                        <strong>{contactedInquiries}</strong>
                        <span>Contacted</span>
                    </div>

                </div>

                <div className="inquiry-stat-card">

                    <div className="inquiry-stat-icon">
                        ✓
                    </div>

                    <div>
                        <strong>{closedInquiries}</strong>
                        <span>Closed</span>
                    </div>

                </div>

            </div>

            {error && inquiries.length > 0 && (
                <div className="inquiry-error">
                    {error}
                </div>
            )}

            {/* FILTER */}
            {inquiries.length > 0 && (
                <div className="inquiry-filter">

                    <div>
                        <label htmlFor="status-filter">
                            Filter by Status
                        </label>

                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                        >
                            <option value="all">
                                All Statuses
                            </option>

                            <option value="new">
                                New
                            </option>

                            <option value="contacted">
                                Contacted
                            </option>

                            <option value="closed">
                                Closed
                            </option>
                        </select>
                    </div>

                    <span className="inquiry-filter-count">
                        Showing {filteredInquiries.length}{' '}
                        {filteredInquiries.length === 1
                            ? 'inquiry'
                            : 'inquiries'}
                    </span>

                </div>
            )}

            {/* INQUIRIES */}
            {inquiries.length === 0 ? (

                <div className="empty-inquiries">

                    <div className="empty-inquiries-icon">
                        ✉
                    </div>

                    <h2>No inquiries yet</h2>

                    <p>
                        Customer inquiries will appear here when
                        someone contacts you about a property.
                    </p>

                </div>

            ) : filteredInquiries.length === 0 ? (

                <div className="empty-inquiries">

                    <div className="empty-inquiries-icon">
                        ○
                    </div>

                    <h2>No matching inquiries</h2>

                    <p>
                        There are no inquiries with the selected
                        status.
                    </p>

                    <button
                        type="button"
                        className="retry-button"
                        onClick={() =>
                            setStatusFilter('all')
                        }
                    >
                        Show All Inquiries
                    </button>

                </div>

            ) : (

                <div className="inquiries-list">

                    {filteredInquiries.map((inquiry) => (

                        <article
                            key={inquiry.id}
                            className="inquiry-card"
                        >

                            <div className="inquiry-card-header">

                                <div>
                                    <h2>
                                        {inquiry.name}
                                    </h2>

                                    <p className="inquiry-property">
                                        {inquiry.property?.title ||
                                            'Property unavailable'}
                                    </p>
                                </div>

                                <span
                                    className={`inquiry-status ${inquiry.status}`}
                                >
                                    {inquiry.status}
                                </span>

                            </div>

                            <div className="inquiry-contact">

                                <div>
                                    <small>Email</small>

                                    <strong>
                                        {inquiry.email}
                                    </strong>
                                </div>

                                <div>
                                    <small>Phone</small>

                                    <strong>
                                        {inquiry.phone ||
                                            'Not provided'}
                                    </strong>
                                </div>

                            </div>

                            <div className="inquiry-message">

                                <small>Message</small>

                                <p>
                                    {inquiry.message}
                                </p>

                            </div>

                            {/* STATUS MANAGEMENT */}
                            <div className="inquiry-status-management">

                                <label
                                    htmlFor={`status-${inquiry.id}`}
                                >
                                    Update Status
                                </label>

                                <select
                                    id={`status-${inquiry.id}`}
                                    value={inquiry.status}
                                    onChange={(event) =>
                                        handleStatusChange(
                                            inquiry.id,
                                            event.target.value
                                        )
                                    }
                                    disabled={
                                        updatingId === inquiry.id
                                    }
                                >
                                    <option value="new">
                                        New
                                    </option>

                                    <option value="contacted">
                                        Contacted
                                    </option>

                                    <option value="closed">
                                        Closed
                                    </option>
                                </select>

                                {updatingId === inquiry.id && (
                                    <span className="status-updating">
                                        Updating...
                                    </span>
                                )}

                            </div>

                            <div className="inquiry-card-footer">

                                <span>
                                    Received:{' '}
                                    {new Date(
                                        inquiry.created_at
                                    ).toLocaleString()}
                                </span>

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Inquiries;
