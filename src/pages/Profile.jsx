import React, { useEffect, useState } from "react";
import { User, Mail, Phone, ShieldCheck, Pencil, Save } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Field({ icon: Icon, label, name, value, editing, onChange, disabled }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <Icon size={13} /> {label}
      </label>
      <input
        name={name}
        value={value ?? ""}
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
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/users/profile");
        if (!cancelled) setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        if (!cancelled) {
          setError(err.response?.data?.message || "Couldn't load profile. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const res = await api.put("/users/profile", {
        name: profile.name,
        phone: profile.phone,
      });
      setProfile((prev) => ({ ...prev, ...res.data.user }));
      setEditing(false);
    } catch (err) {
      console.error("Profile save failed:", err);
      setError(err.response?.data?.message || "Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-[#0A192F]">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 p-8">
            <div className="h-24 animate-pulse rounded-xl bg-white ring-1 ring-slate-100" />
          </main>
        </div>
      </div>
    );
  }

  const joined = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-[#0A192F]">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

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
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#0A192F] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d223f] disabled:opacity-60"
              >
                <Save size={15} /> {saving ? "Saving..." : "Save Changes"}
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

          {error && (
            <div className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-6">
            {/* Left: avatar card */}
            <div className="w-64 shrink-0 rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0A192F] text-2xl font-semibold text-white">
                {profile?.name?.charAt(0) ?? "U"}
              </div>
              <p className="mt-4 font-semibold text-[#0A192F]">{profile?.name}</p>
              <p className="text-xs text-slate-400">{profile?.accessLabel || profile?.role}</p>

              <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2 text-xs font-medium text-emerald-600">
                <ShieldCheck size={14} /> Verified Account
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Member since <span className="text-[#0A192F]">{joined}</span>
              </p>
            </div>

            {/* Right: editable fields */}
            <div className="flex-1 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Personal Information
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Field icon={User} label="Full Name" name="name" value={profile?.name} editing={editing} onChange={handleChange} />
                <Field icon={Mail} label="Email Address" name="email" value={profile?.email} editing={editing} onChange={handleChange} disabled />
                <Field icon={Phone} label="Phone Number" name="phone" value={profile?.phone} editing={editing} onChange={handleChange} />
                <Field icon={ShieldCheck} label="Access Role" name="role" value={profile?.role} editing={editing} onChange={handleChange} disabled />
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
