import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Database, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Settings
} from 'lucide-react';
import { 
  initSupabase, 
  getSupabase, 
  fetchSupabaseConfig, 
  saveLocalSupabaseConfig, 
  clearLocalSupabaseConfig 
} from '../utils/supabaseClient';
import SupabaseDiagnostic from './SupabaseDiagnostic';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  onBypass: () => void;
}

export default function Login({ onLoginSuccess, onBypass }: LoginProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Supabase connection and local configuration states
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [config, setConfig] = useState<{
    configured: boolean;
    url: string | null;
    key: string | null;
    source: 'env' | 'local' | null;
  }>({ configured: false, url: null, key: null, source: null });

  // Custom configuration inputs
  const [customUrl, setCustomUrl] = useState('');
  const [customKey, setCustomKey] = useState('');

  // Load configuration on mount
  useEffect(() => {
    async function loadConfig() {
      const cfg = await fetchSupabaseConfig();
      setConfig(cfg);
      if (cfg.url) setCustomUrl(cfg.url);
      if (cfg.key) setCustomKey(cfg.key);

      // Automatically open setup panel if not configured
      if (!cfg.configured) {
        setIsConfigOpen(true);
      }

      // Initialize client
      await initSupabase();
    }
    loadConfig();
  }, []);

  const handleApplyCustomConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!customUrl || !customKey) {
      setError('Please fill in both the Supabase URL and the Anon Key.');
      return;
    }

    try {
      saveLocalSupabaseConfig(customUrl, customKey);
      setSuccessMsg('Custom database configuration saved! Initializing...');
      
      setTimeout(async () => {
        const client = await initSupabase();
        if (client) {
          setConfig({
            configured: true,
            url: customUrl,
            key: customKey,
            source: 'local'
          });
          setSuccessMsg('Supabase initialized successfully!');
        } else {
          setError('Failed to initialize Supabase with the provided credentials.');
        }
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Failed to save configuration.');
    }
  };

  const handleClearCustomConfig = () => {
    clearLocalSupabaseConfig();
    setCustomUrl('');
    setCustomKey('');
    setConfig({ configured: false, url: null, key: null, source: null });
    setSuccessMsg('Custom configuration cleared. Reverting to server default.');
    
    setTimeout(async () => {
      const cfg = await fetchSupabaseConfig();
      setConfig(cfg);
      await initSupabase();
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    let supabase = getSupabase();
    if (!supabase) {
      supabase = await initSupabase();
    }

    if (!supabase) {
      setError('Supabase client is not initialized. Expand "Configure Connection" below to enter your Supabase URL & Key, or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel Environment Variables.');
      setIsConfigOpen(true);
      setLoading(false);
      return;
    }

    try {
      if (activeTab === 'signin') {
        const { data, error: authErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authErr) throw authErr;

        if (data.user) {
          setSuccessMsg('Sign in successful! Redirecting...');
          setTimeout(() => {
            onLoginSuccess(data.user);
          }, 1000);
        }
      } else {
        const { data, error: authErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });

        if (authErr) throw authErr;

        if (data.user) {
          // Check if confirmation is required or auto-logged in
          if (data.session) {
            setSuccessMsg('Registration successful! Redirecting...');
            setTimeout(() => {
              onLoginSuccess(data.user);
            }, 1000);
          } else {
            setSuccessMsg('Account created successfully! Please check your email inbox for confirmation link.');
            // Clear inputs
            setEmail('');
            setPassword('');
            setActiveTab('signin');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center p-4 font-sans selection:bg-indigo-100 selection:text-indigo-900" id="login-container">
      <div className="w-full max-w-md space-y-6">
        
        {/* Logo and Greeting Card */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center mb-2">
            <img 
              src="src/assets/images/booking_setter_logo_1784639936453.jpg" 
              alt="Book App Logo" 
              className="h-20 w-20 rounded-3xl object-cover shadow-xl shadow-indigo-100/20 border border-slate-100"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
            Book App Portal
          </h1>
          <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
            Sleek Multi-Business Calendar, Client CRM, and Prepaid Package Ledger with real-time sync.
          </p>
        </div>

        {/* Main Authentication Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/50 shadow-xl shadow-slate-100/50 p-6 md:p-8 space-y-6">
          
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-black rounded-xl transition-all ${
                activeTab === 'signin' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-black rounded-xl transition-all ${
                activeTab === 'signup' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:outline-indigo-500 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Password</label>
                {activeTab === 'signin' && (
                  <button 
                    type="button"
                    onClick={() => {
                      if (!email) {
                        setError('Please enter your email first to trigger password reset.');
                        return;
                      }
                      const supabase = getSupabase();
                      if (!supabase) {
                        setError('Supabase is not configured.');
                        return;
                      }
                      supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: window.location.origin
                      }).then(({ error: resetErr }) => {
                        if (resetErr) {
                          setError(resetErr.message);
                        } else {
                          setSuccessMsg('Password reset link sent! Check your inbox.');
                        }
                      });
                    }}
                    className="text-[10px] text-indigo-600 hover:text-indigo-700 font-black cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:outline-indigo-500 pl-10 pr-10 py-2.5 rounded-xl text-xs font-semibold text-slate-800 transition-all"
                  placeholder="••••••••••••"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs font-semibold leading-relaxed animate-fade-in">
                <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs font-semibold leading-relaxed animate-fade-in">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black py-3 rounded-xl cursor-pointer transition-all disabled:opacity-50 active:scale-98"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>{activeTab === 'signin' ? 'Sign In to Portal' : 'Create Free Account'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Offline local demo bypass option */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-150"></div>
            <span className="flex-shrink mx-4 text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-slate-150"></div>
          </div>

          <button
            type="button"
            onClick={onBypass}
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-700 hover:text-indigo-800 text-xs font-extrabold py-3 rounded-xl cursor-pointer transition-all border border-indigo-100/30"
          >
            <ShieldCheck className="h-4.5 w-4.5" />
            <span>Launch Offline Local Demo Mode</span>
          </button>

          {/* Supabase Connection Configuration Accordion */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="w-full flex items-center justify-between text-left p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Database className={`h-4 w-4 ${config.configured ? 'text-emerald-600' : 'text-amber-500'}`} />
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">Supabase Cloud Connection</span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {config.configured 
                      ? `Connected (${config.source === 'env' ? 'Vite Env' : 'Custom Local'})` 
                      : 'Not Configured — Click to enter URL & Key'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  config.configured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {config.configured ? 'Ready' : 'Setup Required'}
                </span>
                {isConfigOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </div>
            </button>

            {isConfigOpen && (
              <form onSubmit={handleApplyCustomConfig} className="mt-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3.5 animate-fade-in text-xs">
                <div className="p-2.5 bg-indigo-50/60 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 leading-relaxed font-medium">
                  <strong>Vercel / Production Deployment Note:</strong><br />
                  Paste your Supabase credentials below to connect immediately in your browser, or configure <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-indigo-700">VITE_SUPABASE_URL</code> & <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-indigo-700">VITE_SUPABASE_ANON_KEY</code> in your Vercel Project Settings.
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Supabase Project URL</label>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2 rounded-lg font-mono text-[11px] text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Supabase Anon Key</label>
                  <input
                    type="password"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2 rounded-lg font-mono text-[11px] text-slate-800"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] py-2 rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    Save & Initialize Supabase
                  </button>
                  {config.source === 'local' && (
                    <button
                      type="button"
                      onClick={handleClearCustomConfig}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[11px] px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Clear Custom
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setShowDiagnosticModal(true)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-indigo-300 font-extrabold text-[11px] py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Settings className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Run Connection Diagnostic Tool</span>
                  </button>
                </div>
              </form>
            )}
          </div>


        </div>

      </div>

      {/* Diagnostic Modal */}
      {showDiagnosticModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl my-8">
            <SupabaseDiagnostic onClose={() => setShowDiagnosticModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
