import { ShieldAlert, RotateCw, AlertTriangle, Users, KeyRound, FileSignature, Smartphone } from "lucide-react";

export type SecurityIssueType = "compromised" | "reused" | "weak" | "common";
export type GeneratorType = "password" | "otp" | "passphrase";

export interface SecurityCardConfig {
  id: SecurityIssueType;
  title: string;
  description: string;
  icon: any;
  colorClass: string; // e.g., "text-red-500"
  bgClass: string; // e.g., "bg-red-500/10"
  borderColorClass: string; // e.g. "border-red-500"
}

export interface GeneratorCardConfig {
  id: GeneratorType;
  title: string;
  description: string;
  icon: any;
  colorClass: string;
  bgClass: string;
}

export const SECURITY_CARDS: SecurityCardConfig[] = [
  {
    id: "compromised",
    title: "Compromised",
    description: "Found in efficient data breaches",
    icon: ShieldAlert,
    colorClass: "text-red-500",
    bgClass: "bg-red-500/10",
    borderColorClass: "border-red-500",
  },
  {
    id: "reused",
    title: "Reused Passwords",
    description: "Used across multiple accounts",
    icon: RotateCw,
    colorClass: "text-orange-500",
    bgClass: "bg-orange-500/10",
    borderColorClass: "border-orange-500",
  },
  {
    id: "weak",
    title: "Weak Passwords",
    description: "Easy to crack or guess",
    icon: AlertTriangle,
    colorClass: "text-yellow-500",
    bgClass: "bg-yellow-500/10",
    borderColorClass: "border-yellow-500",
  },
  {
    id: "common",
    title: "Common Passwords",
    description: "Frequently used patterns (top 20 list)",
    icon: Users,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
    borderColorClass: "border-blue-500",
  },
];

export const GENERATOR_CARDS: GeneratorCardConfig[] = [
  {
    id: "password",
    title: "Password Generator",
    description: "Create strong, random passwords",
    icon: KeyRound,
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500/10",
  },
  {
    id: "otp",
    title: "OTP Setup",
    description: "Generate 2FA codes",
    icon: Smartphone,
    colorClass: "text-purple-500",
    bgClass: "bg-purple-500/10",
  },
  {
    id: "passphrase",
    title: "Passphrase Generator",
    description: "Memorable random words",
    icon: FileSignature,
    colorClass: "text-pink-500",
    bgClass: "bg-pink-500/10",
  },
];
