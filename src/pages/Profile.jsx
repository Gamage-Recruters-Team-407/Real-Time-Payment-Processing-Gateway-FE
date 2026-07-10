import React, { useState } from "react";
import { User, Mail, Phone, ShieldCheck, Pencil, Save } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// ---- Mock data (swap for GET /api/users/profile) ---------------------
const INITIAL_PROFILE = {
  name: "USER",
  email: "user@gamagepay.com",
  phone: "+94 71 234 5678",
  role: "Compliance access",
  joined: "March 12, 2025",
};

function Field({ icon: Icon, label, name, value, editing, onChange, disabled }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <Icon size={13} /> {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={!editing || disabled}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#0A192F] outline-none transition ${
          !editing || disabled
            ? "border-slate-100 bg-slate-50 text-slate-400"
            : "border-slate-200 bg-white focus:border-emerald-400"
        }`}
      />
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // TODO: PUT /api/users/profile with `profile`
    setEditing(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-[#0A192F]">
      <Sidebar role="user" activeLabel="Settlement" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar role="user" activeTab="Dashboard" />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0A192F]">My Profile</h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage your personal information and account details.
              </p>
            </div>
            {editing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg bg-[#0A192F] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d223f]"
              >
                <Save size={15} /> Save Changes
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Pencil size={15} /> Edit Profile
              </button>
            )}
          </div>

          <div className="mt-6 flex gap-6">
            {/* Left: avatar card */}
            <div className="w-64 shrink-0 rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0A192F] text-2xl font-semibold text-white">
                {profile.name.charAt(0)}
              </div>
              <p className="mt-4 font-semibold text-[#0A192F]">{profile.name}</p>
              <p className="text-xs text-slate-400">{profile.role}</p>

              <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2 text-xs font-medium text-emerald-600">
                <ShieldCheck size={14} /> Verified Account
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Member since <span className="text-[#0A192F]">{profile.joined}</span>
              </p>
            </div>

            {/* Right: editable fields */}
            <div className="flex-1 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Personal Information
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Field icon={User} label="Full Name" name="name" value={profile.name} editing={editing} onChange={handleChange} />
                <Field icon={Mail} label="Email Address" name="email" value={profile.email} editing={editing} onChange={handleChange} disabled />
                <Field icon={Phone} label="Phone Number" name="phone" value={profile.phone} editing={editing} onChange={handleChange} />
                <Field icon={ShieldCheck} label="Access Role" name="role" value={profile.role} editing={editing} onChange={handleChange} disabled />
              </div>

              {editing && (
                <p className="mt-4 text-xs text-slate-400">
                  Email and Access Role can't be changed here — contact an admin if these need updating.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
