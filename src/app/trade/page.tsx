"use client";
import { useState, useEffect } from "react";
import UserTradeDashboard from "@/components/trade/UserTradeDashboard";
import SignInModal from "@/components/auth/SignInModal";
import SignUpModal from "@/components/auth/SignUpModal";
import { authService } from "@/services/authService";
import { LayoutDashboard, ShieldCheck, TrendingUp, Wallet, ArrowRight } from "lucide-react";

export default function Trade() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSignInSubmit = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (result.success && result.data) {
      sessionStorage.setItem("userId", result.data.userId);
      setIsAuthenticated(true);
      setShowSignInModal(false);
    } else {
      setErrorMessage(result.message || "An error occurred.");
    }
  };

  const handleSignUpSubmit = async (username: string, email: string, password: string) => {
    const result = await authService.signUp(username, email, password);
    if (result.success && result.data) {
      sessionStorage.setItem("userId", result.data.userId);
      setIsAuthenticated(true);
      setShowSignUpModal(false);
    } else {
      setErrorMessage(result.message || "An error occurred.");
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen pt-20">
      {!isAuthenticated ? (
        <div className="relative overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>

          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8 animate-slideUp">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold tracking-wide uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  Live Virtual Trading
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                  Master the Art of <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Crypto Trading
                  </span>
                </h1>

                <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                  Experience a risk-free trading environment. Practice strategies, monitor real-time prices, and build your portfolio without spending a dime.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => setShowSignInModal(true)}
                    className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-white/10"
                  >
                    Start Trading Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowSignUpModal(true)}
                    className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    Create Account
                  </button>
                </div>

                <div className="flex items-center gap-8 pt-8 border-t border-white/10">
                  <div className="flex bg-white/5 rounded-2xl p-4 gap-4 items-center">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <Wallet className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold">$10,000</p>
                      <p className="text-gray-500 text-sm">Virtual Balance</p>
                    </div>
                  </div>
                  <div className="flex bg-white/5 rounded-2xl p-4 gap-4 items-center">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold">Real-time</p>
                      <p className="text-gray-500 text-sm">Market Data</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Preview Dashboard */}
              <div className="relative animate-slideUp" style={{ animationDelay: "0.2s" }}>
                 {/* Glass Card Effect */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-blue-600/30 rounded-3xl blur-2xl -z-10 transform rotate-6 scale-95 opacity-60"></div>
                 
                 <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                    {/* Mock Header */}
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full bg-red-500"></div>
                         <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                         <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-gray-500 text-xs">Simulated Dashboard</div>
                    </div>

                    {/* Mock Content showing UserTradeDashboard preview */}
                    <div className="opacity-50 pointer-events-none grayscale-[50%] hover:grayscale-0 transition-all duration-700">
                      <UserTradeDashboard isPreview={true} />
                    </div>
                    
                    {/* Callout Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="bg-black/90 backdrop-blur-md px-6 py-3 rounded-full border border-green-500/30 text-green-400 font-mono text-sm shadow-xl flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          Live Data Connection Active
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated View */
        <div className="max-w-7xl mx-auto px-4 py-8 animate-slideIn">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <LayoutDashboard className="text-purple-500" />
              Trading Dashboard
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm">
              <ShieldCheck size={16} />
              <span>Secure Session Active</span>
            </div>
          </div>
          <UserTradeDashboard />
        </div>
      )}

      {/* Modals */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => {
          setShowSignInModal(false);
          setErrorMessage("");
        }}
        onSignIn={handleSignInSubmit}
        onSignUpClick={() => {
          setShowSignInModal(false);
          setShowSignUpModal(true);
        }}
        errorMessage={errorMessage}
      />
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => {
          setShowSignUpModal(false);
          setErrorMessage("");
        }}
        onSignUp={handleSignUpSubmit}
        errorMessage={errorMessage}
      />
    </div>
  );
}
