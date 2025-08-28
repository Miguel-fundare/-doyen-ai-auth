'use client';

import React, { useState, useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, RefreshCw, ArrowRight, Building2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const brand = {
  name: "Doyen",
  tagline: "Revenue Growth Management Platform",
  primary: "#0F172A",
  accent: "#22C55E",
  soft: "#F8FAFC",
};

const DEMO_EMAIL = "demo@doyen.ai";
const DEMO_PASSWORD = "Doyen!2025";

const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
const strongPwd = (p: string) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}/.test(p);

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-2xl shadow-sm bg-white">
        <TrendingUp className="w-6 h-6" />
      </div>
      <div>
        <div className="text-xl font-semibold tracking-tight">{brand.name}.ai</div>
        <div className="text-xs opacity-70 -mt-0.5">{brand.tagline}</div>
      </div>
    </div>
  );
}

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

function LoginView({ onSuccess, goForgot }: any) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const remembered = localStorage.getItem("doyen_auth");
    if (remembered) {
      try {
        const { email } = JSON.parse(remembered || "{}");
        setEmail(email || "");
      } catch {}
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const stash = JSON.parse(localStorage.getItem("doyen_reset") || "null");
    const currentPwd = stash?.newPassword || DEMO_PASSWORD;

    if (!emailRegex.test(email)) return setError("Enter a valid email address.");
    if (pwd.length === 0) return setError("Enter your password.");

    if (email.toLowerCase() === DEMO_EMAIL && pwd === currentPwd) {
      if (remember) localStorage.setItem("doyen_auth", JSON.stringify({ email }));
      onSuccess?.({ email });
    } else {
      setError("Invalid credentials. Use demo@doyen.ai / Doyen!2025 (or your reset password).");
    }
  };

  return (
    <Card className="max-w-md w-full">
      <div className="flex items-center justify-between">
        <BrandMark />
      </div>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="text-sm opacity-70 mt-1">Welcome back. Please enter your details.</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input type="email
