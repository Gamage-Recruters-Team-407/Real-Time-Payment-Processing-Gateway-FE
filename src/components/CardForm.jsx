import React from 'react';
import masterCardLogo from '../assets/logos/master-card.svg';

export default function CardForm({
    personalDetails,
    handlePersonalChange,
    selectedMethod,
    setSelectedMethod,
    cardDetails,
    handleCardChange,
    agreeTerms,
    setAgreeTerms,
    saveCard,
    setSaveCard,
    errors,
    handlePayment
}) {
    return (
        <form onSubmit={handlePayment} className="lg:col-span-7 space-y-8">
            {/* Header Title */}
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: '#0A192F', fontFamily: 'Inter, sans-serif' }}>
                    Complete registration payment
                </h1>
            </div>

            {/* SECTION: Personal Details */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1.5">
                    <h2 className="text-lg font-bold" style={{ color: '#0A192F' }}>Personal details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Address line */}
                    <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#64748B' }}>
                            Address line
                        </label>
                        <input
                            type="text"
                            name="addressLine"
                            placeholder="P.o.Box 1223"
                            value={personalDetails.addressLine}
                            onChange={handlePersonalChange}
                            className={`w-full bg-white border ${errors.addressLine ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#10B981]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/25 transition-all text-[#0A192F] placeholder-gray-300 font-sans`}
                        />
                        {errors.addressLine && <p className="text-red-500 text-[10px] font-semibold font-mono mt-0.5">{errors.addressLine}</p>}
                    </div>

                    {/* City */}
                    <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#64748B' }}>
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            placeholder="Arusha"
                            value={personalDetails.city}
                            onChange={handlePersonalChange}
                            className={`w-full bg-white border ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#10B981]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/25 transition-all text-[#0A192F] placeholder-gray-300 font-sans`}
                        />
                        {errors.city && <p className="text-red-500 text-[10px] font-semibold font-mono mt-0.5">{errors.city}</p>}
                    </div>

                    {/* State */}
                    <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#64748B' }}>
                            State
                        </label>
                        <input
                            type="text"
                            name="state"
                            placeholder="Arusha ,Tanzania"
                            value={personalDetails.state}
                            onChange={handlePersonalChange}
                            className={`w-full bg-white border ${errors.state ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#10B981]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/25 transition-all text-[#0A192F] placeholder-gray-300 font-sans`}
                        />
                        {errors.state && <p className="text-red-500 text-[10px] font-semibold font-mono mt-0.5">{errors.state}</p>}
                    </div>

                    {/* Postal code */}
                    <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#64748B' }}>
                            Postal code
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            placeholder="9090"
                            value={personalDetails.postalCode}
                            onChange={handlePersonalChange}
                            className={`w-full bg-white border ${errors.postalCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#10B981]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/25 transition-all text-[#0A192F] placeholder-gray-300 font-sans`}
                        />
                        {errors.postalCode && <p className="text-red-500 text-[10px] font-semibold font-mono mt-0.5">{errors.postalCode}</p>}
                    </div>
                </div>
            </div>

            {/* SECTION: Payment Methods */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5">
                    <h2 className="text-lg font-bold" style={{ color: '#0A192F' }}>Payment methods</h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Visa Selection */}
                    <button
                        type="button"
                        onClick={() => setSelectedMethod('visa')}
                        className="flex items-center justify-center p-2 rounded-lg border bg-white min-h-[44px] px-5 transition-all focus:outline-none hover:bg-slate-50"
                        style={{ 
                            borderColor: selectedMethod === 'visa' ? '#10B981' : '#E2E8F0',
                            boxShadow: selectedMethod === 'visa' ? '0 0 0 2px rgba(16, 185, 129, 0.15)' : 'none',
                            backgroundColor: selectedMethod === 'visa' ? 'rgba(16, 185, 129, 0.02)' : '#FFFFFF'
                        }}
                    >
                        <img src="https://img.icons8.com/?size=96&id=13608&format=png" className="h-6 w-auto" alt="Visa" />
                    </button>

                    {/* Stripe Selection */}
                    <button
                        type="button"
                        onClick={() => setSelectedMethod('stripe')}
                        className="flex items-center justify-center p-2 rounded-lg border bg-white min-h-[44px] px-5 transition-all focus:outline-none hover:bg-slate-50"
                        style={{ 
                            borderColor: selectedMethod === 'stripe' ? '#10B981' : '#E2E8F0',
                            boxShadow: selectedMethod === 'stripe' ? '0 0 0 2px rgba(16, 185, 129, 0.15)' : 'none',
                            backgroundColor: selectedMethod === 'stripe' ? 'rgba(16, 185, 129, 0.02)' : '#FFFFFF'
                        }}
                    >
                        <img src="https://img.icons8.com/?size=96&id=iouv9vHfqHvP&format=png" className="h-6 w-auto" alt="Stripe" />
                    </button>

                    {/* PayPal Selection */}
                    <button
                        type="button"
                        onClick={() => setSelectedMethod('paypal')}
                        className="flex items-center justify-center p-2 rounded-lg border bg-white min-h-[44px] px-5 transition-all focus:outline-none hover:bg-slate-50"
                        style={{ 
                            borderColor: selectedMethod === 'paypal' ? '#10B981' : '#E2E8F0',
                            boxShadow: selectedMethod === 'paypal' ? '0 0 0 2px rgba(16, 185, 129, 0.15)' : 'none',
                            backgroundColor: selectedMethod === 'paypal' ? 'rgba(16, 185, 129, 0.02)' : '#FFFFFF'
                        }}
                    >
                        <img src="https://img.icons8.com/?size=96&id=13611&format=png" className="h-6 w-auto" alt="PayPal" />
                    </button>

                    {/* MasterCard Selection */}
                    <button
                        type="button"
                        onClick={() => setSelectedMethod('mastercard')}
                        className="flex items-center justify-center p-2 rounded-lg border bg-white min-h-[44px] px-5 transition-all focus:outline-none hover:bg-slate-50"
                        style={{ 
                            borderColor: selectedMethod === 'mastercard' ? '#10B981' : '#E2E8F0',
                            boxShadow: selectedMethod === 'mastercard' ? '0 0 0 2px rgba(16, 185, 129, 0.15)' : 'none',
                            backgroundColor: selectedMethod === 'mastercard' ? 'rgba(16, 185, 129, 0.02)' : '#FFFFFF'
                        }}
                    >
                        <img src={masterCardLogo} className="h-6 w-auto" alt="MasterCard" />
                    </button>

                    {/* Google Pay Selection */}
                    <button
                        type="button"
                        onClick={() => setSelectedMethod('googlepay')}
                        className="flex items-center justify-center p-2 rounded-lg border bg-white min-h-[44px] px-5 transition-all focus:outline-none hover:bg-slate-50"
                        style={{ 
                            borderColor: selectedMethod === 'googlepay' ? '#10B981' : '#E2E8F0',
                            boxShadow: selectedMethod === 'googlepay' ? '0 0 0 2px rgba(16, 185, 129, 0.15)' : 'none',
                            backgroundColor: selectedMethod === 'googlepay' ? 'rgba(16, 185, 129, 0.02)' : '#FFFFFF'
                        }}
                    >
                        <img src="https://img.icons8.com/?size=96&id=XYVoikUs9vba&format=png" className="h-6 w-auto" alt="Google Pay" />
                    </button>
                </div>
            </div>

            {/* SECTION: Card Details */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                    <h2 className="text-lg font-bold" style={{ color: '#0A192F' }}>Card details</h2>
                </div>

                <div className="space-y-4">
                    {/* Cardholder name */}
                    <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#64748B' }}>
                            Cardholder's name
                        </label>
                        <input
                            type="text"
                            name="cardholderName"
                            placeholder="Seen on your card"
                            value={cardDetails.cardholderName}
                            onChange={handleCardChange}
                            className={`w-full bg-white border ${errors.cardholderName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#10B981]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/25 transition-all text-[#0A192F] placeholder-gray-300 font-sans`}
                        />
                        {errors.cardholderName && <p className="text-red-500 text-[10px] font-semibold font-mono mt-0.5">{errors.cardholderName}</p>}
                    </div>

                    {/* Card number */}
                    <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#64748B' }}>
                            Card number
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="Seen on your card"
                                value={cardDetails.cardNumber}
                                onChange={handleCardChange}
                                className={`w-full bg-white border ${errors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#10B981]'} rounded-lg p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/25 transition-all text-[#0A192F] placeholder-gray-300 font-sans`}
                            />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center" style={{ color: '#64748B' }}>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </span>
                        </div>
                        {errors.cardNumber && <p className="text-red-500 text-[10px] font-semibold font-mono mt-0.5">{errors.cardNumber}</p>}
                    </div>

                    {/* Expiry / CVC */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#64748B' }}>
                                Expiry
                            </label>
                            <input
                                type="text"
                                name="expiry"
                                placeholder="20/23"
                                value={cardDetails.expiry}
                                onChange={handleCardChange}
                                className={`w-full bg-white border ${errors.expiry ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#10B981]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/25 transition-all text-[#0A192F] placeholder-gray-300 font-sans`}
                            />
                            {errors.expiry && <p className="text-red-500 text-[10px] font-semibold font-mono mt-0.5">{errors.expiry}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#64748B' }}>
                                CVC
                            </label>
                            <input
                                type="password"
                                name="cvc"
                                placeholder="654"
                                value={cardDetails.cvc}
                                onChange={handleCardChange}
                                className={`w-full bg-white border ${errors.cvc ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#10B981]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/25 transition-all text-[#0A192F] placeholder-gray-300 font-sans`}
                            />
                            {errors.cvc && <p className="text-red-500 text-[10px] font-semibold font-mono mt-0.5">{errors.cvc}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 border-gray-300 rounded cursor-pointer"
                        style={{ accentColor: '#10B981' }}
                    />
                    <span className="text-xs leading-normal select-none" style={{ color: '#64748B' }}>
                        I agree to the <a href="#terms" className="text-blue-500 hover:text-blue-700 underline font-medium">Terms and Conditions</a>
                    </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-[10px] font-semibold font-mono pl-7">{errors.agreeTerms}</p>}

                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="mt-1 w-4 h-4 border-gray-300 rounded cursor-pointer"
                        style={{ accentColor: '#10B981' }}
                    />
                    <span className="text-xs leading-normal select-none" style={{ color: '#64748B' }}>
                        Save card details
                    </span>
                </label>

                {errors.submit && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs font-semibold font-mono border border-red-200 mt-2">
                        ⚠️ {errors.submit}
                    </div>
                )}
            </div>
        </form>
    );
}
