import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    MoreHorizontal,
    CheckCircle,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import masterCardLogo from '../assets/logos/master-card.svg';
import CardForm from '../components/CardForm';

export default function CardPayment() {
    const navigate = useNavigate();
    const location = useLocation();

    // State for personal details
    const [personalDetails, setPersonalDetails] = useState({
        addressLine: '',
        city: '',
        state: '',
        postalCode: ''
    });

    // State for card details
    const [cardDetails, setCardDetails] = useState({
        cardholderName: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    // Checkboxes
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [saveCard, setSaveCard] = useState(false);

    // Active payment method
    const [selectedMethod, setSelectedMethod] = useState('visa');

    // Submit states
    const [isProcessing, setIsProcessing] = useState(false);

    // Form errors
    const [errors, setErrors] = useState({});

    // Handle personal details inputs
    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setPersonalDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Helper to format Card Number (XXXX XXXX XXXX XXXX)
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length > 0) {
            return parts.join('  ');
        } else {
            return v;
        }
    };

    // Helper to format Expiry Date (MM/YY)
    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
        }
        return v;
    };

    // Handle card details inputs with live validations
    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            formattedValue = formatCardNumber(value).slice(0, 22); // 16 digits + 6 spaces
            
            const cleanCard = formattedValue.replace(/\s+/g, '');
            if (cleanCard.length === 16) {
                if (validateLuhn(cleanCard)) {
                    setErrors(prev => {
                        const next = { ...prev };
                        delete next.cardNumber;
                        return next;
                    });
                } else {
                    setErrors(prev => ({
                        ...prev,
                        cardNumber: 'Invalid card number (Luhn check failed)'
                    }));
                }
            } else if (cleanCard.length > 0 && cleanCard.length < 16) {
                setErrors(prev => ({
                    ...prev,
                    cardNumber: 'Card number must be 16 digits'
                }));
            } else {
                setErrors(prev => {
                    const next = { ...prev };
                    delete next.cardNumber;
                    return next;
                });
            }
        } else if (name === 'expiry') {
            formattedValue = formatExpiry(value).slice(0, 5); // MM/YY
            
            if (formattedValue.length === 5) {
                if (validateExpiry(formattedValue)) {
                    setErrors(prev => {
                        const next = { ...prev };
                        delete next.expiry;
                        return next;
                    });
                } else {
                    setErrors(prev => ({
                        ...prev,
                        expiry: 'Invalid expiry date (MM/YY)'
                    }));
                }
            } else if (formattedValue.length > 0) {
                setErrors(prev => ({
                    ...prev,
                    expiry: 'Expiry date must be MM/YY'
                }));
            } else {
                setErrors(prev => {
                    const next = { ...prev };
                    delete next.expiry;
                    return next;
                });
            }
        } else if (name === 'cvc') {
            formattedValue = value.replace(/[^0-9]/g, '').slice(0, 4);
            
            if (formattedValue.length === 3 || formattedValue.length === 4) {
                setErrors(prev => {
                    const next = { ...prev };
                    delete next.cvc;
                    return next;
                });
            } else if (formattedValue.length > 0) {
                setErrors(prev => ({
                    ...prev,
                    cvc: 'CVC must be 3 or 4 digits'
                }));
            } else {
                setErrors(prev => {
                    const next = { ...prev };
                    delete next.cvc;
                    return next;
                });
            }
        } else if (name === 'cardholderName') {
            if (value.trim()) {
                setErrors(prev => {
                    const next = { ...prev };
                    delete next.cardholderName;
                    return next;
                });
            }
        }

        setCardDetails(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    // Determine card type based on number
    const getCardType = (number) => {
        const cleaned = number.replace(/\s+/g, '');
        if (cleaned.startsWith('4')) return 'visa';
        if (/^5[1-5]/.test(cleaned)) return 'mastercard';
        return 'generic';
    };

    const cardType = getCardType(cardDetails.cardNumber);

    // Client-side Luhn Algorithm validator
    const validateLuhn = (cardNumber) => {
        const cleaned = cardNumber.replace(/\D/g, '');
        if (cleaned.length < 13 || cleaned.length > 19) return false;

        let sum = 0;
        let shouldDouble = false;

        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i], 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }

        return sum % 10 === 0;
    };

    // Client-side Expiry date validator
    const validateExpiry = (expiry) => {
        if (!expiry || !expiry.includes('/')) return false;
        const parts = expiry.split('/');
        if (parts.length !== 2) return false;

        const month = parseInt(parts[0], 10);
        const yearPart = parseInt(parts[1], 10);

        if (isNaN(month) || isNaN(yearPart)) return false;
        if (month < 1 || month > 12) return false;

        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (yearPart < currentYear) return false;
        if (yearPart === currentYear && month < currentMonth) return false;

        return true;
    };

    // Validate form on frontend before submission
    const validateForm = () => {
        const newErrors = {};
        if (!personalDetails.addressLine.trim()) newErrors.addressLine = 'Address is required';
        if (!personalDetails.city.trim()) newErrors.city = 'City is required';
        if (!personalDetails.state.trim()) newErrors.state = 'District is required';
        if (!personalDetails.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

        if (!cardDetails.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';

        const cleanCard = cardDetails.cardNumber.replace(/\s+/g, '');
        if (!cleanCard) {
            newErrors.cardNumber = 'Card number is required';
        } else if (!validateLuhn(cardDetails.cardNumber)) {
            newErrors.cardNumber = 'Invalid card number';
        }

        if (!cardDetails.expiry) {
            newErrors.expiry = 'Expiry is required';
        } else if (!validateExpiry(cardDetails.expiry)) {
            newErrors.expiry = 'Invalid expiry date (MM/YY)';
        }

        if (!cardDetails.cvc) {
            newErrors.cvc = 'CVC is required';
        } else if (cardDetails.cvc.replace(/\D/g, '').length < 3) {
            newErrors.cvc = 'CVC must be 3 or 4 digits';
        }

        if (!agreeTerms) newErrors.agreeTerms = 'You must agree to the Terms and Conditions';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getInitialAmount = () => {
        if (location.state?.amount !== undefined) return location.state.amount;
        const pendingStr = sessionStorage.getItem('pending_payment');
        if (pendingStr) {
            try {
                const pending = JSON.parse(pendingStr);
                if (pending.totalAmount !== undefined) return pending.totalAmount;
            } catch (e) {}
        }
        return undefined;
    };

    const passedAmount = getInitialAmount();
    const passedCurrency = location.state?.currency || 'LKR';
    const passedPaymentMethod = location.state?.paymentMethod || 'CARD';
    const passedDescription = location.state?.description || 'Card payment via Gamage-Pay';

    if (passedAmount === undefined) {
        return (
            <div className="min-h-screen antialiased pb-12 flex items-center justify-center bg-[#F8FAFC]">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-[#0A192F] mb-2">Invalid Checkout Session</h2>
                    <p className="text-sm text-slate-500 mb-6">
                        No active payment details or amount was specified. Please start your payment from the payment request page.
                    </p>
                    <button
                        onClick={() => navigate('/payment')}
                        className="w-full text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity bg-[#0A192F] text-sm"
                    >
                        Go to Payment Page
                    </button>
                </div>
            </div>
        );
    }

    const subtotal = passedAmount;
    const platformFee = 0;
    const totalAmount = subtotal + platformFee;

    const formattedTotalAmount = totalAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const executePayment = async (paymentData) => {
        setIsProcessing(true);
        setErrors({});

        const { cardDetails: details, paymentId, transactionId } = paymentData;
        const cleanCardNumber = details.cardNumber.replace(/\s+/g, '');
        const lastFour = cleanCardNumber.slice(-4);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:5000/api/payments/${paymentId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    status: 'COMPLETED',
                    transactionId: transactionId,
                    cardLastFourDigits: lastFour
                })
            });

            const data = await response.json();

            if (data.success && data.data) {
                sessionStorage.removeItem('pending_payment');
                sessionStorage.removeItem('payment_initiated');
                
                // Navigate to /payment-success passing paymentId in query parameters
                navigate(`/payment-success?paymentId=${data.data.paymentId}`);
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    setErrors({ submit: data.message || 'Payment completion failed.' });
                }
            }
        } catch (err) {
            console.error('Backend payment status update failed:', err.message);
            setErrors({ submit: 'Unable to complete the payment on the server. Please contact out support team.' });
        }

        setIsProcessing(false);
    };

    // Handle Pay Action with Backend Integration
    const handlePayment = async (e) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setIsProcessing(true);
        setErrors({});

        try {
            // 1. Create a PENDING payment in the backend
            const token = localStorage.getItem("token");
            const cleanCardNumber = cardDetails.cardNumber.replace(/\s+/g, '');
            const response = await fetch('http://localhost:5000/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    currency: passedCurrency,
                    description: passedDescription,
                    paymentMethod: passedPaymentMethod,
                    cardDetails: {
                        cardholderName: cardDetails.cardholderName,
                        cardNumber: cleanCardNumber,
                        expiry: cardDetails.expiry,
                        cvc: cardDetails.cvc
                    }
                })
            });

            const data = await response.json();
            if (!response.ok || !data.success || !data.data) {
                throw new Error(data.message || 'Failed to initialize payment on server');
            }

            const paymentId = data.data.paymentId;
            const transactionId = data.data.transactionId;

            // 2. Save current form state, paymentId, and transactionId to sessionStorage
            const pendingPayment = {
                personalDetails,
                cardDetails,
                agreeTerms,
                saveCard,
                selectedMethod,
                totalAmount,
                paymentId,
                transactionId,
                description: passedDescription,
                currency: passedCurrency,
                paymentMethod: passedPaymentMethod
            };
            sessionStorage.setItem('pending_payment', JSON.stringify(pendingPayment));
            sessionStorage.setItem('payment_initiated', 'true');

            setIsProcessing(false);

            // 3. Get user info from localStorage to pass as query params for reliability
            const userStr = localStorage.getItem("user");
            let userId = "";
            let email = "";
            if (userStr) {
                try {
                    const u = JSON.parse(userStr);
                    userId = u.id || u._id || "";
                    email = u.email || "";
                } catch (e) {}
            }

            // 4. Redirect to OTP verification page
            navigate(`/otp-verification?purpose=payment&userId=${userId}&email=${email}`);

        } catch (err) {
            console.error('Failed to create pending payment:', err.message);
            setErrors({ submit: 'Unable to connect to the payment server. Please ensure the backend is running and try again.' });
            setIsProcessing(false);
        }
    };

    // Effect to check if we just returned from successful OTP verification
    useEffect(() => {
        if (location.state?.verified) {
            const pendingStr = sessionStorage.getItem('pending_payment');
            if (pendingStr) {
                try {
                    const pending = JSON.parse(pendingStr);
                    setPersonalDetails(pending.personalDetails);
                    setCardDetails(pending.cardDetails);
                    setAgreeTerms(pending.agreeTerms);
                    setSaveCard(pending.saveCard);
                    setSelectedMethod(pending.selectedMethod);

                    // Execute payment submission automatically
                    executePayment(pending);
                } catch (e) {
                    console.error('Failed to parse pending payment data', e);
                }
            }
        }
    }, [location.state]);

    return (
        <div className="min-h-screen antialiased pb-12" style={{ backgroundColor: '#F8FAFC', color: '#0A192F', fontFamily: 'Inter, sans-serif' }}>
            {/* Main Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                
                {/* Back Button */}
                <button
                    onClick={() => navigate('/payment')}
                    className="flex items-center gap-2 text-[#64748B] hover:text-[#0A192F] transition-colors text-sm font-bold mb-8 group focus:outline-none"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span>Back to Payment Request</span>
                </button>

                {/* Checkout Payment Form Screen */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* Left Column: Form Details extracted to CardForm */}
                    <CardForm
                        personalDetails={personalDetails}
                        handlePersonalChange={handlePersonalChange}
                        selectedMethod={selectedMethod}
                        setSelectedMethod={setSelectedMethod}
                        cardDetails={cardDetails}
                        handleCardChange={handleCardChange}
                        agreeTerms={agreeTerms}
                        setAgreeTerms={setAgreeTerms}
                        saveCard={saveCard}
                        setSaveCard={setSaveCard}
                        errors={errors}
                        handlePayment={handlePayment}
                    />

                    {/* Right Column: Card Visualization & Summary */}
                    <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">

                        {/* Card visual wrapper */}
                        <div 
                            className="hidden sm:flex relative aspect-[1.586/1] w-full rounded-2xl shadow-xl p-6 flex-col justify-between text-white overflow-hidden group hover:scale-[1.01] hover:shadow-2xl transition-all duration-300"
                            style={{ background: 'linear-gradient(135deg, #024e3b 0%, #115e59 50%, #042f2e 100%)' }}
                        >
                            {/* Glossy card lines */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl translate-y-12 -translate-x-12 pointer-events-none"></div>

                            {/* Top card row */}
                            <div className="flex justify-between items-center z-10">
                                <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 select-none font-mono text-white">
                                    Card
                                </span>
                                <div className="flex items-center gap-2">
                                    {/* Brand Badge */}
                                    {cardType === 'visa' && (
                                        <img src="https://img.icons8.com/?size=96&id=13608&format=png" className="h-5 w-auto brightness-200 contrast-200" alt="Visa" />
                                    )}
                                    {cardType === 'mastercard' && (
                                        <img src={masterCardLogo} className="h-5 w-auto brightness-200 contrast-200" alt="MasterCard" />
                                    )}
                                    <button className="text-white/80 hover:text-white transition-colors">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Card number */}
                            <div className="my-auto z-10">
                                <span className="text-lg md:text-xl font-bold tracking-[0.2em] font-mono text-white select-all block">
                                    {cardDetails.cardNumber || '•••• •••• •••• ••••'}
                                </span>
                            </div>

                            {/* Bottom row: holder & expiry */}
                            <div className="flex justify-between items-end z-10">
                                <div className="flex flex-col">
                                    <span className="text-[8px] uppercase tracking-wider opacity-60 font-mono text-white select-none">
                                        Card Holder
                                    </span>
                                    <span className="text-xs md:text-sm font-semibold tracking-wide font-sans truncate max-w-[180px] text-white">
                                        {cardDetails.cardholderName}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] uppercase tracking-wider opacity-60 font-mono text-white select-none">
                                        Expires
                                    </span>
                                    <span className="text-xs md:text-sm font-semibold tracking-wide font-mono text-white">
                                        {cardDetails.expiry || 'MM/YY'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary details */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100/50 space-y-4">
                            <h3 className="text-base font-bold pb-2 border-b border-slate-100" style={{ color: '#0A192F' }}>Order Summary</h3>
                            
                            <div className="space-y-2.5">
                                <div className="flex justify-between text-xs font-medium" style={{ color: '#64748B' }}>
                                    <span>Subtotal</span>
                                    <span className="font-mono text-slate-800">LKR {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-xs font-medium" style={{ color: '#64748B' }}>
                                    <span>Platform Fee</span>
                                    <span className="font-mono text-slate-800">LKR {platformFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-slate-200 pt-4 flex flex-col gap-1">
                                <div className="flex justify-between items-end pt-1 font-sans">
                                    <span className="text-base font-bold" style={{ color: '#0A192F' }}>Total Amount</span>
                                    <span className="text-2xl font-black font-mono" style={{ color: '#0A192F' }}>Rs.{totalAmount}</span>
                                </div>
                            </div>

                            {/* Primary checkout action button */}
                            <button
                                type="submit"
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full min-h-[56px] text-white rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-slate-900/10 flex items-center justify-center gap-2.5 transition-all text-sm font-bold disabled:opacity-85 disabled:cursor-not-allowed group active:scale-[0.99] hover:opacity-90"
                                style={{ backgroundColor: '#0A192F' }}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="h-4.5 w-4.5 animate-spin text-[#10B981]" />
                                        <span>Processing Secure Payment...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4 text-[#10B981] fill-[#10B981]/25 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <span>Pay LKR {formattedTotalAmount}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}