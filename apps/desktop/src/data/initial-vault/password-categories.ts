import type { IPasswordCategory } from "@/utils/types/vault";

export const MOCK_PASSWORD_CATEGORIES: IPasswordCategory[] = [
  {
    id: "1",
    name: "Social",
    color: "bg-blue-900",
    icon: "Globe", // Lucide icon name
    description: "Social media accounts and networks",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false,
  },
  {
    id: "2",
    name: "Work",
    color: "bg-orange-900",
    icon: "Briefcase",
    description: "Work-related accounts and tools",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false,
  },
  {
    id: "3",
    name: "Finance",
    color: "bg-green-900",
    icon: "DollarSign",
    description: "Banking, credit cards, and finance",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false,
  },
  {
    id: "4",
    name: "Entertainment",
    color: "bg-purple-900",
    icon: "Gamepad2",
    description: "Streaming services and gaming",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false,
  },
];
