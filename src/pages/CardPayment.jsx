import React, { useState } from 'react';
import {
    Lock,
    MoreHorizontal,
    CheckCircle,
    Loader2
} from 'lucide-react';
import masterCardLogo from '../assets/logos/master-card.svg';
import CardForm from '../components/CardForm';

export default function CardPayment() {
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
    const [paymentSuccess, setPaymentSuccess] = useState(false);

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

    // Handle card details inputs
    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            formattedValue = formatCardNumber(value).slice(0, 22); // 16 digits + 6 spaces
        } else if (name === 'expiry') {
            formattedValue = formatExpiry(value).slice(0, 5); // MM/YY
        } else if (name === 'cvc') {
            formattedValue = value.replace(/[^0-9]/g, '').slice(0, 4);
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

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!personalDetails.addressLine.trim()) newErrors.addressLine = 'Address is required';
        if (!personalDetails.city.trim()) newErrors.city = 'City is required';
        if (!personalDetails.state.trim()) newErrors.state = 'State is required';
        if (!personalDetails.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

        if (!cardDetails.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';

        const cleanCard = cardDetails.cardNumber.replace(/\s+/g, '');
        if (cleanCard.length < 16) newErrors.cardNumber = 'Enter a valid 16-digit card number';

        if (cardDetails.expiry.length < 5) newErrors.expiry = 'Expiry date must be MM/YY';
        if (cardDetails.cvc.length < 3) newErrors.cvc = 'CVC is required';
        if (!agreeTerms) newErrors.agreeTerms = 'You must agree to the Terms and Conditions';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle Pay Action
    const handlePayment = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsProcessing(true);

        // Simulate real-time gateway communication delay
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentSuccess(true);
        }, 2500);
    };

    // Dynamic values
    const subtotal = 5550;
    const platformFee = 40;
    const totalAmount = subtotal + platformFee;

    return (
        <div className="min-h-screen antialiased pb-12" style={{ backgroundColor: '#F8FAFC', color: '#0A192F', fontFamily: 'Inter, sans-serif' }}>
            {/* Main Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {paymentSuccess ? (
                    /* Payment Success State Screen */
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 md:p-16 max-w-xl mx-auto text-center border border-gray-100">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#10B981]">
                            <CheckCircle className="h-12 w-12 stroke-[2.5]" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#0A192F' }}>Payment Successful!</h2>
                        <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: '#64748B' }}>
                            Your registration payment has been processed successfully. A confirmation receipt has been sent to your registered email.
                        </p>
                        <div className="rounded-xl p-6 text-left mb-8 border border-emerald-500/10" style={{ backgroundColor: 'rgba(16, 185, 129, 0.03)' }}>
                            <div className="flex justify-between items-center py-2 border-b border-emerald-500/10">
                                <span className="text-xs font-medium uppercase font-mono" style={{ color: '#64748B' }}>Transaction ID</span>
                                <span className="text-xs font-bold font-mono" style={{ color: '#0A192F' }}>TXN-8240-9092</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-emerald-500/10">
                                <span className="text-xs font-medium uppercase font-mono" style={{ color: '#64748B' }}>Total Paid</span>
                                <span className="text-xs font-bold font-mono" style={{ color: '#0A192F' }}>LKR 8,240.00</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-xs font-medium uppercase font-mono" style={{ color: '#64748B' }}>Card Used</span>
                                <span className="text-xs font-bold flex items-center gap-1.5 font-mono" style={{ color: '#0A192F' }}>
                                    <span className="capitalize">{cardType}</span> •••• {cardDetails.cardNumber.slice(-4) || '4242'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setPaymentSuccess(false);
                                setCardDetails({ cardholderName: '', cardNumber: '', expiry: '', cvc: '' });
                                setPersonalDetails({ addressLine: '', city: '', state: '', postalCode: '' });
                                setAgreeTerms(false);
                            }}
                            className="w-full text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity shadow-lg text-sm"
                            style={{ backgroundColor: '#0A192F', fontFamily: 'Inter, sans-serif' }}
                        >
                            Make Another Payment
                        </button>
                    </div>
                ) : (
                    /* Checkout Payment Form Screen */
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
                                className="relative aspect-[1.586/1] w-full rounded-2xl shadow-xl p-6 flex flex-col justify-between text-white overflow-hidden group hover:scale-[1.01] hover:shadow-2xl transition-all duration-300"
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

                                {/* Card Number display */}
                                <div className="my-auto py-4 z-10">
                                    <p className="text-xl md:text-2xl font-mono tracking-[0.18em] font-medium leading-none text-center select-all select-none text-white">
                                        {cardDetails.cardNumber || '••••  ••••  ••••  ••••'}
                                    </p>
                                </div>

                                {/* Bottom card row */}
                                <div className="flex justify-between items-end z-10">
                                    <div className="space-y-0.5 text-left">
                                        <span className="text-[8px] uppercase tracking-wider text-emerald-300 font-bold opacity-80 font-mono">
                                            Cardholder Name
                                        </span>
                                        <p className="text-sm font-semibold uppercase tracking-wider truncate max-w-[200px] font-mono text-white">
                                            {cardDetails.cardholderName || 'Cardholder Name'}
                                        </p>
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                        <span className="text-[8px] uppercase tracking-wider text-emerald-300 font-bold opacity-80 font-mono">
                                            MM/YY
                                        </span>
                                        <p className="text-sm font-semibold font-mono tracking-wider text-white">
                                            {cardDetails.expiry || 'MM/YY'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order breakdown */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                                <div className="flex justify-between items-center font-sans" style={{ color: '#64748B' }}>
                                    <span className="text-sm font-medium">Subtotal</span>
                                    <span className="text-base font-bold font-mono" style={{ color: '#0A192F' }}>Rs.{subtotal}</span>
                                </div>

                                <div className="flex justify-between items-center font-sans" style={{ color: '#64748B' }}>
                                    <span className="text-sm font-medium">Platform Fee</span>
                                    <span className="text-base font-bold font-mono" style={{ color: '#0A192F' }}>Rs.{platformFee}</span>
                                </div>

                                {/* Border line separator - themed secondary */}
                                <div className="h-0.5 w-full rounded" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}></div>

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
                                        <Lock className="h-4 w-4 text-[#10B981] fill-[#10B981]/25 group-hover:scale-110 transition-transform" />
                                        <span>Pay LKR 0.00</span>
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}
