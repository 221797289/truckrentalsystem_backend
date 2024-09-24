import React, { useContext, useEffect, useState } from "react";
import { deleteCustomerById, finalizePayment, getCustomerById } from "../../services/CustomerProfileService.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
import CustomerSidebar from "./CustomerSidebar.jsx";

const CustomerProfile = () => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pendingPayment, setPendingPayment] = useState(null);
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomerData = async () => {
            if (auth && auth.customerID !== undefined) {
                try {
                    const response = await getCustomerById(auth.customerID);
                    setCustomer(response.data);
                } catch (error) {
                    console.error("Error retrieving customer data:", error);
                } finally {
                    setLoading(false);
                }

                const paymentInfo = localStorage.getItem('paymentInfo');
                if (paymentInfo) {
                    const parsedPaymentInfo = JSON.parse(paymentInfo);
                    if (parsedPaymentInfo && parsedPaymentInfo.customerID === auth.customerID) {
                        setPendingPayment(parsedPaymentInfo);
                    }
                }
            } else {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [auth]);

    const updateCustomer = (customerID) => {
        navigate(`/update-customer/${customerID}`);
    };

    const deleteAccount = async (customerID) => {
        try {
            await deleteCustomerById(customerID);
            setAuth(null);
            localStorage.removeItem('auth');
            navigate('/');
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };

    const handleFinalizePayment = async () => {
        if (pendingPayment) {
            try {
                await finalizePayment(pendingPayment);
                localStorage.removeItem('paymentInfo');
                setPendingPayment(null);
                alert('Payment successfully finalized.');
            } catch (error) {
                console.error('Error finalizing payment:', error);
                alert('Failed to finalize payment.');
            }
        }
    };

    const handleSignOut = () => {
        setAuth(null);
        localStorage.removeItem('auth');
        navigate('/');
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    if (!customer) {
        return <div style={styles.noData}>No customer data available.</div>;
    }

    return (
        <div style={styles.container}>
            <CustomerSidebar handleSignOut={handleSignOut}/>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    h1, h2 {
                        animation: fadeIn 1s ease-out;
                        color: #007bff;
                        font-size: 2.5rem;
                        font-weight: bold;
                    }
                `}
            </style>
            <main style={styles.mainContent}>
                <div style={styles.contentSection}>
                    <section style={styles.profileSection}>
                        <h2 style={styles.heading}>Profile</h2>
                        <div style={styles.card}>
                            <div style={styles.cardBody}>
                                <h4>Customer Details</h4>
                                <div style={styles.details}>
                                    {[
                                        {label: "Customer ID", value: customer.customerID},
                                        {label: "First Name", value: customer.firstName},
                                        {label: "Last Name", value: customer.lastName},
                                        {label: "Email", value: customer.email},
                                        {label: "Password", value: "••••••••"},
                                        {label: "License", value: customer.license},
                                        {label: "Cell Number", value: customer.cellNo}
                                    ].map(({label, value}) => (
                                        <div style={styles.detailItem} key={label}>
                                            <span style={styles.detailLabel}>{label}:</span>
                                            <span style={styles.detailValue}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={styles.actionButtons}>
                                    <button
                                        style={styles.btnSuccess}
                                        onClick={() => updateCustomer(customer.customerID)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        style={styles.btnDanger}
                                        onClick={() => deleteAccount(customer.customerID)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {pendingPayment && (
                        <section style={styles.pendingPaymentSection}>
                            <div style={styles.card}>
                                <div style={styles.cardBody}>
                                    <h4>Pending Payment</h4>
                                    <div style={styles.details}>
                                        {[
                                            {label: "Model", value: pendingPayment.vin.model},
                                            {label: "Pickup Location", value: pendingPayment.pickUp.branchName},
                                            {label: "Drop-off Location", value: pendingPayment.dropOff.branchName},
                                            {label: "Rental Date", value: pendingPayment.rentDate},
                                            {label: "Return Date", value: pendingPayment.returnDate},
                                            {label: "Total Cost", value: `R${pendingPayment.totalCost}`},
                                            {label: "Payment Amount", value: `R${pendingPayment.paymentAmount}`}
                                        ].map(({label, value}) => (
                                            <div style={styles.detailItem} key={label}>
                                                <span style={styles.detailLabel}>{label}:</span>
                                                <span style={styles.detailValue}>{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={styles.actionButtons}>
                                        <button
                                            style={styles.btnPrimary}
                                            onClick={handleFinalizePayment}
                                        >
                                            Finalize Payment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '20px',
    },
    profileSection: {
        maxWidth: '500px',
        margin: '20px 0',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    card: {
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: '5px',
        overflow: 'hidden',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '10px',
        marginBottom: '20px',
    },
    detailItem: {
        display: 'flex',
        alignItems: 'center',  // Align labels and values vertically in the middle
    },
    detailLabel: {
        fontWeight: 'bold',
        marginRight: '10px',
        width: '150px',  // Fixed width to align labels vertically
    },
    detailValue: {
        color: '#6c757d',
        flex: 1,  // Allow the value to take up remaining space
    },
    actionButtons: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    btnSuccess: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#28a745',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
        flex: 1,
        marginRight: '10px',
    },
    btnDanger: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#dc3545',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
        flex: 1,
    },
    loading: {
        textAlign: 'center',
        fontSize: '18px',
    },
    noData: {
        textAlign: 'center',
        fontSize: '18px',
    },
};





export default CustomerProfile;
