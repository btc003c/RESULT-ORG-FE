"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [orgName, setOrgName] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("Education");
  const [website, setWebsite] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const domains = [
    "Education", "Sports", "Finance", "Politics", "Entertainment", 
    "Government", "Law", "Healthcare", "Business", "Hyperlocal", 
    "Technology", "Custom"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!orgName || !email || !password || !fullName) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email format.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.auth.orgRegister({
        email,
        password,
        name: orgName, // we map orgName to the name field
        organizationType: selectedDomain,
        website
      });

      if (response.accessToken) {
        setIsSuccess(true);
      } else {
        setError("Invalid response from server. Missing token.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to register organization.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="flex min-h-screen flex-col bg-background text-foreground items-center justify-center p-6">
        <div className="max-w-md w-full bg-background rounded-3xl p-8 border border-muted shadow-sm text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Registration Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Your organization has been successfully registered. You can now log in to the portal.
          </p>
          <button 
            onClick={() => router.push("/organization/login")}
            className="w-full px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="flex-1 py-16 px-6 bg-muted/10 border-b border-muted">
        <div className="mx-auto max-w-3xl bg-background rounded-3xl p-8 md:p-12 border border-muted shadow-sm hover:shadow-md transition-shadow duration-500">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Register your Organization</h1>
            <p className="text-muted-foreground">Get verified and start publishing datasets globally on ResultHub.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleRegister}>
            {/* Step 1 */}
            <section>
              <h2 className="text-xl font-semibold border-b border-muted pb-2 mb-6">1. Organization Details</h2>
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-sm font-semibold mb-2 group-focus-within:text-primary transition-colors">Organization Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Stanford University" 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300" 
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  
                  {/* Animative Custom Dropdown */}
                  <div className="relative group" ref={dropdownRef}>
                    <label className="block text-sm font-semibold mb-2 group-focus-within:text-primary transition-colors">Primary Domain *</label>
                    <div 
                      className={`w-full px-4 py-3 rounded-xl border cursor-pointer flex items-center justify-between bg-background transition-all duration-300 ${isDropdownOpen ? 'border-primary ring-2 ring-primary/20 shadow-sm' : 'border-muted hover:border-primary/50'}`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span className="font-medium">{selectedDomain}</span>
                      <svg 
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    
                    {/* Dropdown Menu Options */}
                    <div 
                      className={`absolute z-20 w-full mt-2 bg-background border border-muted rounded-xl shadow-xl overflow-hidden transition-all duration-300 origin-top ${
                        isDropdownOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
                      }`}
                    >
                      <div className="max-h-60 overflow-y-auto hide-scrollbar p-1">
                        {domains.map(domain => (
                          <div 
                            key={domain}
                            className={`px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                              selectedDomain === domain 
                                ? 'bg-primary/10 text-primary' 
                                : 'hover:bg-muted/50 hover:pl-5 text-foreground'
                            }`}
                            onClick={() => {
                              setSelectedDomain(domain);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {selectedDomain === domain && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary animate-in zoom-in duration-300">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                            <span className={selectedDomain === domain ? 'ml-0' : 'ml-[22px]'}>{domain}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 group-focus-within:text-primary transition-colors">Official Website</label>
                    <input 
                      type="url" 
                      placeholder="https://" 
                      className="w-full px-4 py-3 rounded-xl border border-muted bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2 */}
            <section>
              <h2 className="text-xl font-semibold border-b border-muted pb-2 mb-6 mt-8">2. Administrative Contact</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold mb-2 group-focus-within:text-primary transition-colors">Full Name *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2 group-focus-within:text-primary transition-colors">Work Email *</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-xl border border-muted bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2 group-focus-within:text-primary transition-colors">Password *</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full px-4 py-3 rounded-xl border border-muted bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 pr-10" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isLoading}
                className="relative overflow-hidden w-full md:w-auto px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? 'Processing...' : 'Register Organization'}
                  {!isLoading && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
