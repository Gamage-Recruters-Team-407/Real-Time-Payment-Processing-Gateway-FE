// src/pages/RefundRequest.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, X, ArrowLeft, Loader2, CheckCircle2, AlertCircle, CloudUpload } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { uploadImageToCloudinary } from "../services/cloudinaryService";

export default function RefundRequest() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [name, setName] = useState("");
  const [txnId, setTxnId] = useState(transactionId || "");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [photoFile, setPhotoFile] = useState(null); // Raw File object
  const [photoPreview, setPhotoPreview] = useState(null); // Local object URL for preview
  const [photoName, setPhotoName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100
  const [uploading, setUploading] = useState(false);

  // UI Status
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (transactionId) {
      setTxnId(transactionId);
    }
  }, [transactionId]);

  // Handle Photo Selection — stores file + creates local preview URL
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB");
        return;
      }
      // Revoke previous preview URL to avoid memory leaks
      if (photoPreview) URL.revokeObjectURL(photoPreview);

      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setPhotoName(file.name);
      setUploadProgress(0);
      setError(null);
    }
  };

  const removePhoto = (e) => {
    e.stopPropagation();
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoName("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit Form — uploads image to Cloudinary first, then POSTs the URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    if (txnId.length !== 12) {
      setError("Transaction ID must be exactly 12 characters.");
      return;
    }
    if (!photoFile) {
      setError("Please upload a photo of the item to proceed.");
      return;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Step 1 — Upload image to Cloudinary
      setUploading(true);
      setUploadProgress(0);
      const cloudinaryUrl = await uploadImageToCloudinary(photoFile, (pct) => {
        setUploadProgress(pct);
      });
      setUploading(false);

      // Step 2 — Submit refund request with the Cloudinary URL
      const response = await api.post("/refunds", {
        name,
        transactionId: txnId,
        phone,
        amount: Number(amount),
        reason,
        itemPhoto: cloudinaryUrl,
      });

      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      setUploading(false);
      console.error(err);
      setError(
        err.message?.startsWith("Cloudinary")
          ? err.message
          : err.response?.data?.message || "Failed to submit refund request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = name.trim() && txnId.trim().length === 12 && phone.trim().length === 10 && amount.trim() && Number(amount) > 0 && reason.trim() && photoFile;

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-[#0A192F]">
      {/* ---------------- Sidebar ---------------- */}
      <Sidebar />

      {/* ---------------- Main ---------------- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top nav */}
        <Navbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">

            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Go back"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Transactions
                </p>
                <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
                  Refund items form
                </h1>
                <p className="text-sm text-slate-500">
                  Request a refund for your transaction.
                </p>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">

                {success ? (
                  // Success State
                  <div className="flex flex-col items-center text-center py-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle2 size={36} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-4">
                      Refund Request Submitted
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 max-w-sm">
                      Your request has been successfully submitted to the refund-management team. We will review it shortly.
                    </p>

                    <div className="mt-8 flex gap-3 w-full max-w-xs">
                      <button
                        onClick={() => navigate("/payment-history")}
                        className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Payment history
                      </button>
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="flex-1 rounded-lg bg-[#0F1117] py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                      >
                        Dashboard
                      </button>
                    </div>
                  </div>
                ) : (
                  // Form State
                  <form onSubmit={handleSubmit} className="space-y-6">

                    {error && (
                      <div className="flex items-center gap-2.5 rounded-lg bg-rose-50 border border-rose-100 p-4 text-sm text-rose-600">
                        <AlertCircle size={18} className="shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. John Doe"
                          required
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
                        />
                      </div>

                      {/* Transaction ID */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Transaction ID
                        </label>
                        <input
                          type="text"
                          value={txnId}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 12) {
                              setTxnId(val);
                            }
                          }}
                          placeholder="e.g. TXN_98214300 (12 characters)"
                          required
                          maxLength={12}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (val.length <= 10) {
                              setPhone(val);
                            }
                          }}
                          placeholder="e.g. 0771234567 (10 digits)"
                          required
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
                        />
                      </div>

                      {/* Refund Amount */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Refund Amount (Rs)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">Rs</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 50.00"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reason for Refund */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 block">
                        Reason for Refund
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please describe the issue with the item..."
                        rows={4}
                        required
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all resize-none"
                      />
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 block">
                        Photo of the Item <span className="text-rose-500">*</span>
                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        ref={fileInputRef}
                      />

                      {!photoFile ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 transition-colors bg-slate-50 flex flex-col items-center justify-center space-y-2 group"
                        >
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                            <Upload size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              Click to upload photo
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Supports JPG, PNG (Max 10MB) · Stored securely via Cloudinary
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-4 flex flex-col items-center md:flex-row md:items-center md:gap-4">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="h-24 w-24 object-cover rounded-lg border border-slate-100 bg-white"
                          />
                          <div className="flex-1 mt-3 md:mt-0 text-center md:text-left min-w-0 w-full">
                            <p className="text-sm font-medium text-slate-700 truncate">
                              {photoName}
                            </p>
                            {/* Upload progress bar (shown during submission) */}
                            {uploading && uploadProgress > 0 ? (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                  <span>Uploading to Cloudinary...</span>
                                  <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                  <div
                                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-200"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-emerald-500 font-semibold mt-1">
                                ✓ Photo ready · will upload on submit
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={removePhoto}
                            disabled={uploading}
                            className="absolute top-2 right-2 md:relative md:top-auto md:right-auto rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Remove photo"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting || !isFormValid}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0F1117] py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                      >
                        {uploading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Uploading photo... {uploadProgress}%
                          </>
                        ) : submitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Submitting Request...
                          </>
                        ) : (
                          "Submit Refund Request"
                        )}
                      </button>

                      {!isFormValid && (
                        <p className="text-center text-xs text-slate-400 mt-2">
                          * Submit button will be active once all fields are filled and a photo is uploaded.
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
        </main>
      </div>
    </div>
  );
}
