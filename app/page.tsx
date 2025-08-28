'use client';

import React, { useState, useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, RefreshCw, ArrowRight, Building2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

/* ---------- Helpers ---------- */

const DEMO_EMAIL = "demo@doyen.ai";
const DEMO_PASSWORD = "Doyen!2025";
const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
const strongPwd = (p: string) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}/.test(p);

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 ${className}`}>{children}</div>;
}

function Input({ leftIcon, rightIcon, ...props }: any) {
  return (
    <div className="relative">
      {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">{leftIcon}</div>}
      <input
        {...props}
        className={`w-full border rounded-xl py-3 ${leftIcon ? "pl-10" : "pl-4"} ${rightIcon ? "pr-10" : "pr-4"} focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400`}
      />
      {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60">{rightIcon}</div>}
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 select-none cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange?.(e.target.checked)} className="h-4 w-4" />
      <span className="text-sm opacity-80">{label}</span>
    </label>
  );
}

function Button({ children, className = "", ...props }: any) {
  return (
    <button {...props} className={`w-full rounded-xl py-3 font-semibold transition-all shadow-sm hover:shadow focus:outline-none focus:ring-4 ${className}`}>
      {children}
    </button>
  );
}

function Footer() {
  return <div className="text-center text-xs opacity-60 mt-8">© {new Date().getFullYear()} Fundare Labs. All rights reserved.</div>;
}

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-2xl shadow-sm bg-white">
        <TrendingUp className="w-6 h-6" />
      </div>
      <div>
        <div className="text-xl font-semibold tracking-tight">Doyen.ai</div>
        <div className="text-xs opacity-70 -mt-0.5">Revenue Growth Management Platform</div>
      </div>
    </div>
  );
}

/* ---------- Vistas ---------- */

function LoginView({ onSuccess, goForgot }: { onSuccess: (u:any)=>void; goForgot: ()=>void }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const remembered = localStorage.getItem("doyen_auth");
    if (remembered) {
      try { setEmail(JSON.parse(remembered || "{}").email || ""); } catch {}
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const stash = JSON.parse(localStorage.getItem("doyen_reset") || "null");
    const currentPwd = stash?.newPassword || DEMO_PASSWORD;

    if (!emailRegex.test(email)) return setError("Enter a valid email address.");
    if (!pwd) return setError("Enter your password.");

    if (email.toLowerCase() === DEMO_EMAIL && pwd === currentPwd) {
      if (remember) localStorage.setItem("doyen_auth", JSON.stringify({ email }));
      onSuccess({ email });
    } else {
      setError("Invalid credentials. Use demo@doyen.ai / Doyen!2025 (or your reset password).");
    }
  };

  return (
    <Card className="max-w-md w-full">
      <div className="flex items-center justify-between"><BrandMark /></div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="text-sm opacity-70 mt-1">Welcome back. Please enter your details.</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input type="email" placeholder="Email address" value={email} onChange={(e:any)=>setEmail(e.target.value)} leftIcon={<Mail className="w-5 h-5" />} />
        <div className="relative">
          <Input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={pwd}
            onChange={(e:any)=>setPwd(e.target.value)}
            leftIcon={<Lock className="w-5 h-5" />}
            rightIcon={
              <button type="button" onClick={()=>setShow(s=>!s)} className="p-1">
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" checked={remember} onChange={setRemember} />
          <button type="button" onClick={goForgot} className="text-sm font-medium text-green-600 hover:underline">
            Forgot password?
          </button>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button type="submit" className="bg-green-500 text-white hover:brightness-95 focus:ring-green-100">
          Continue <ArrowRight className="inline w-4 h-4 ml-1 -mt-0.5" />
        </Button>
      </form>

      <Footer />
    </Card>
  );
}

function ForgotView({ goLogin, goCode, setEmail }: { goLogin: ()=>void; goCode:(t:string)=>void; setEmail:(e:string)=>void }) {
  const [email, setLocalEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!emailRegex.test(email)) return setError("Enter a valid email address.");
    const token = String(Math.floor(100000 + Math.random() * 900000));
    localStorage.setItem("doyen_reset_req", JSON.stringify({ email, token, ts: Date.now() }));
    setEmail(email);
    goCode(token);
  };

  return (
    <Card className="max-w-md w-full">
      <BrandMark />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Reset your password</h1>
      <p className="text-sm opacity-70 mt-1">Enter the email associated with your account.</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input type="email" placeholder="Email address" value={email} onChange={(e:any)=>setLocalEmail(e.target.value)} leftIcon={<Mail className="w-5 h-5" />} />
      </form>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="mt-4 space-y-3">
        <Button onClick={submit} className="bg-green-500 text-white hover:brightness-95 focus:ring-green-100">Send reset code</Button>
        <Button onClick={goLogin} className="bg-slate-100 hover:bg-slate-200">Back to sign in</Button>
      </div>
      <Footer />
    </Card>
  );
}

function CodeView({ email, token, goSetPassword }: { email:string; token:string; goSetPassword:()=>void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const req = JSON.parse(localStorage.getItem("doyen_reset_req") || "null");
    if (!req || req.email !== email) return setError("Reset request expired. Please start again.");
    if (code !== req.token) return setError("Incorrect code. Check your email (mock).");
    goSetPassword();
  };

  return (
    <Card className="max-w-md w-full">
      <BrandMark />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Enter verification code</h1>
      <p className="text-sm opacity-70 mt-1">We sent a 6-digit code to <strong>{email}</strong>.</p>
      <div className="mt-2 text-xs opacity-60">(Demo token: <span className="font-mono">{token}</span>)</div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input inputMode="numeric" placeholder="6-digit code" value={code} onChange={(e:any)=>setCode(e.target.value)} leftIcon={<RefreshCw className="w-5 h-5" />} />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button type="submit" className="bg-green-500 text-white hover:brightness-95 focus:ring-green-100">Continue</Button>
      </form>
      <Footer />
    </Card>
  );
}

function SetPasswordView({ onDone }: { onDone: ()=>void }) {
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [error, setError] = useState("");
  const ok = strongPwd(pwd1) && pwd1 === pwd2;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!strongPwd(pwd1)) return setError("Password must be 8+ chars with upper, lower, number, and symbol.");
    if (pwd1 !== pwd2) return setError("Passwords do not match.");
    localStorage.setItem("doyen_reset", JSON.stringify({ newPassword: pwd1, ts: Date.now() }));
    onDone();
  };

  return (
    <Card className="max-w-md w-full">
    <BrandMark />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Create a new password</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input type="password" placeholder="New password" value={pwd1} onChange={(e:any)=>setPwd1(e.target.value)} leftIcon={<Lock className="w-5 h-5" />} />
        <Input type="password" placeholder="Confirm new password" value={pwd2} onChange={(e:any)=>setPwd2(e.target.value)} leftIcon={<Lock className="w-5 h-5" />} />
        <div className="text-xs opacity-70">Must include: upper, lower, number & symbol.</div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button disabled={!ok} type="submit" className={`text-white ${ok ? "bg-green-500 hover:brightness-95 focus:ring-green-100" : "bg-slate-300"}`}>Update password</Button>
      </form>
      <Footer />
    </Card>
  );
}

function Dashboard({ email, onLogout }: { email:string; onLogout: ()=>void }) {
  return (
    <Card className="max-w-3xl w-full">
      <div className="flex items-center justify-between">
        <BrandMark />
        <button onClick={onLogout} className="text-sm font-semibold text-slate-600 hover:underline">Log out</button>
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-white border rounded-2xl p-5">
          <div className="text-xs opacity-60">Revenue YoY</div>
          <div className="mt-2 text-3xl font-semibold">+12.4%</div>
        </div>
        <div className="bg-gradient-to-br from-sky-50 to-white border rounded-2xl p-5">
          <div className="text-xs opacity-60">Gross Margin</div>
          <div className="mt-2 text-3xl font-semibold">38.7%</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-white border rounded-2xl p-5">
          <div className="text-xs opacity-60">Price Uplift</div>
          <div className="mt-2 text-3xl font-semibold">+2.1 pp</div>
        </div>
      </div>
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="border rounded-2xl p-5">
          <div className="text-sm font-semibold flex items-center gap-2"><Building2 className="w-4 h-4"/> Top Customers</div>
          <ul className="mt-3 text-sm space-y-2">
            <li className="flex justify-between"><span>Acme Retail</span><span className="font-mono">$1.24M</span></li>
            <li className="flex justify-between"><span>Northstar Foods</span><span className="font-mono">$972k</span></li>
            <li className="flex justify-between"><span>Blue Harbor</span><span className="font-mono">$641k</span></li>
          </ul>
        </div>
        <div className="border rounded-2xl p-5">
          <div className="text-sm font-semibold flex items-center gap-2"><TrendingUp className="w-4 h-4"/> RGM Opportunities</div>
          <ul className="mt-3 text-sm space-y-2 list-disc pl-5">
            <li>Price-pack architecture optimization</li>
            <li>Trade spend ROI uplift (promo pruning)</li>
            <li>Mix shift toward premium SKUs</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-xs opacity-60">Logged in as <span className="font-mono">{email}</span></div>
      <Footer />
    </Card>
  );
}

/* ---------- App ---------- */

export default function Page() {
  const [view, setView] = useState<"login" | "forgot" | "code" | "setpwd" | "dashboard">("login");
  const [authed, setAuthed] = useState<any>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    document.body.className = "min-h-screen bg-[#F8FAFC]";
  }, []);

  const goForgot = () => setView("forgot");
  const goCode = (t: string) => { setToken(t); setView("code"); };
  const goSetPassword = () => setView("setpwd");
  const onLogin = (user: any) => { setAuthed(user); setView("dashboard"); };
  const onLogout = () => { setAuthed(null); setView("login"); };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex items-center justify-center">
        {view === "login" && <LoginView onSuccess={onLogin} goForgot={goForgot} />}
        {view === "forgot" && <ForgotView goLogin={() => setView("login")} goCode={goCode} setEmail={setResetEmail} />}
        {view === "code" && <CodeView email={resetEmail} token={token} goSetPassword={goSetPassword} />}
        {view === "setpwd" && <SetPasswordView onDone={() => setView("login")} />}
        {view === "dashboard" && <Dashboard email={authed?.email} onLogout={onLogout} />}
      </motion.div>
    </div>
  );
}
