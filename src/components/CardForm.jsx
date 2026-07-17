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

                    {/* District */}
                    <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#64748B' }}>
                            District
                        </label>
                        <select
                            name="state"
                            value={personalDetails.state}
                            onChange={handlePersonalChange}
                            className={`w-full bg-white border ${errors.state ? 'border-red-500 focus:ring-red-500 text-red-500' : 'border-gray-200 focus:border-[#10B981]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/25 transition-all text-[#0A192F] font-sans`}
                        >
                            <option value="">Select District</option>
                            {[
                                "Colombo", "Gampaha", "Kalutara",
                                "Kandy", "Matale", "Nuwara Eliya",
                                "Galle", "Matara", "Hambantota",
                                "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu",
                                "Batticaloa", "Ampara", "Trincomalee",
                                "Kurunegala", "Puttalam",
                                "Anuradhapura", "Polonnaruwa",
                                "Badulla", "Moneragala",
                                "Ratnapura", "Kegalle"
                            ].map(dist => (
                                <option key={dist} value={dist}>{dist}</option>
                            ))}
                        </select>
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
                        <div className="relative flex items-center">
                            {/* Left Brand Icon */}
                            <span className="absolute left-3 flex items-center pointer-events-none">
                                {(() => {
                                    const cleanNum = (cardDetails.cardNumber || '').replace(/\s+/g, '');
                                    if (cleanNum.startsWith('4')) {
                                        return <img src="https://img.icons8.com/?size=96&id=13608&format=png" className="h-4 w-auto" alt="Visa" />;
                                    }
                                    if (/^(5[1-5]|2[2-7])/.test(cleanNum)) {
                                        return <img src="https://img.icons8.com/?size=96&id=13610&format=png" className="h-4 w-auto" alt="MasterCard" />;
                                    }
                                    return (
                                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    );
                                })()}
                            </span>

                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="Seen on your card"
                                value={cardDetails.cardNumber}
                                onChange={handleCardChange}
                                className={`w-full bg-white border ${errors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#10B981]'} rounded-lg p-3 pl-12 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/25 transition-all text-[#0A192F] placeholder-gray-300 font-sans`}
                            />

                            {/* Right Secure Lock Icon */}
                            <span className="absolute right-3 flex items-center" style={{ color: '#64748B' }}>
                                <svg className="h-4 w-4 text-emerald-500 fill-emerald-500/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
