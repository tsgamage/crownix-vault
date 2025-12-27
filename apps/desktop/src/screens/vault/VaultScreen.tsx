import { useState } from "react";
import { VaultSidebar } from "@/components/vault/VaultSidebar";
import {
  PasswordList,
  type PasswordItem,
} from "@/components/vault/PasswordList";
import { PasswordDetail } from "@/components/vault/PasswordDetail";

// Mock Data
const MOCK_ITEMS: PasswordItem[] = [
  {
    id: "1",
    name: "Google Account",
    username: "alex.doe@gmail.com",
    password: "••••••••••••••••",
    url: "https://accounts.google.com/login",
    notes: "Primary email for personal and professional use.",
    category: "login",
    isFavorite: true,
    icon: "https://www.google.com/favicon.ico",
  },
  {
    id: "2",
    name: "GitHub",
    username: "alexdoe",
    password: "••••••••••••••••",
    url: "https://github.com/login",
    notes: "Source code hosting for all side projects.",
    category: "login",
    isFavorite: true,
    icon: "favicon.ico",
  },
  {
    id: "3",
    name: "Netflix",
    username: "alex.doe@gmail.com",
    password: "••••••••••••••••",
    url: "https://www.netflix.com/login",
    notes: "Family sharing account.",
    category: "login",
    isFavorite: false,
    icon: "https://www.netflix.com/favicon.ico",
  },
  {
    id: "4",
    name: "Amazon AWS",
    username: "root-user",
    password: "••••••••••••••••",
    url: "https://console.aws.amazon.com",
    notes: "Infrastructure and cloud services root access.",
    category: "login",
    isFavorite: false,
    icon: "https://aws.amazon.com/favicon.ico",
  },
  {
    id: "5",
    name: "Wi-Fi Home 5G",
    username: "WPA2-PSK",
    password: "••••••••••••••••",
    notes: "Main home network. Router IP: 192.168.1.1",
    category: "secure-note",
    isFavorite: true,
  },
  {
    id: "6",
    name: "Spotify",
    username: "alex.doe@gmail.com",
    password: "••••••••••••••••",
    url: "https://www.spotify.com/login",
    notes: "Premium subscription.",
    category: "login",
    isFavorite: true,
    icon: "https://www.spotify.com/favicon.ico",
  },
  {
    id: "7",
    name: "LinkedIn",
    username: "alex.doe@outlook.com",
    password: "••••••••••••••••",
    url: "https://www.linkedin.com/login",
    notes: "Professional network profile.",
    category: "login",
    isFavorite: false,
    icon: "https://www.linkedin.com/favicon.ico",
  },
  {
    id: "8",
    name: "Slack - Work",
    username: "alex.doe@company.com",
    password: "••••••••••••••••",
    url: "https://company.slack.com",
    notes: "Used for internal team communication.",
    category: "login",
    isFavorite: false,
    icon: "https://slack.com/favicon.ico",
  },
  {
    id: "9",
    name: "Discord",
    username: "AlexDoe#1234",
    password: "••••••••••••••••",
    url: "https://discord.com/login",
    notes: "Gaming and community chats.",
    category: "login",
    isFavorite: false,
    icon: "https://discord.com/favicon.ico",
  },
  {
    id: "10",
    name: "Dropbox",
    username: "alex.doe@gmail.com",
    password: "••••••••••••••••",
    url: "https://www.dropbox.com/login",
    notes: "File storage and backup sync.",
    category: "login",
    isFavorite: true,
    icon: "https://www.dropbox.com/favicon.ico",
  },
  {
    id: "11",
    name: "PayPal",
    username: "alex.doe@gmail.com",
    password: "••••••••••••••••",
    url: "https://www.paypal.com/signin",
    notes: "Online payments and receipts.",
    category: "login",
    isFavorite: false,
    icon: "https://www.paypal.com/favicon.ico",
  },
  {
    id: "12",
    name: "Steam",
    username: "alexdoe_gaming",
    password: "••••••••••••••••",
    url: "https://store.steampowered.com/login",
    notes: "Gaming library.",
    category: "login",
    isFavorite: false,
    icon: "https://store.steampowered.com/favicon.ico",
  },
  {
    id: "13",
    name: "Twitter / X",
    username: "@alexdoe",
    password: "••••••••••••••••",
    url: "https://x.com/login",
    notes: "Personal social media.",
    category: "login",
    isFavorite: false,
    icon: "https://x.com/favicon.ico",
  },
  {
    id: "14",
    name: "Reddit",
    username: "alex_doe_2024",
    password: "••••••••••••••••",
    url: "https://www.reddit.com/login",
    notes: "Community discussions.",
    category: "login",
    isFavorite: false,
    icon: "https://www.reddit.com/favicon.ico",
  },
  {
    id: "15",
    name: "Office WiFi",
    username: "WPA3-Enterprise",
    password: "••••••••••••••••",
    notes: "Password changes every 90 days. Next change: Jan 15th.",
    category: "secure-note",
    isFavorite: false,
  },
  {
    id: "16",
    name: "Adobe Creative Cloud",
    username: "alex.doe@gmail.com",
    password: "••••••••••••••••",
    url: "https://creativecloud.adobe.com",
    notes: "Photoshop and Lightroom assets.",
    category: "login",
    isFavorite: false,
    icon: "https://www.adobe.com/favicon.ico",
  },
  {
    id: "17",
    name: "Bank - Chase",
    username: "alexdoe123",
    password: "••••••••••••••••",
    url: "https://www.chase.com",
    notes: "Main checking and savings accounts.",
    category: "login",
    isFavorite: true,
    icon: "https://www.chase.com/favicon.ico",
  },
  {
    id: "18",
    name: "Figma",
    username: "alex.doe@company.com",
    password: "••••••••••••••••",
    url: "https://www.figma.com/login",
    notes: "Design files for the company project.",
    category: "login",
    isFavorite: false,
    icon: "https://www.figma.com/favicon.ico",
  },
  {
    id: "19",
    name: "OpenAI / ChatGPT",
    username: "alex.doe@gmail.com",
    password: "••••••••••••••••",
    url: "https://chat.openai.com/auth/login",
    notes: "GPT-4 plus subscription.",
    category: "login",
    isFavorite: true,
    icon: "https://chat.openai.com/favicon.ico",
  },
  {
    id: "20",
    name: "Credit Card PIN",
    username: "Chase Sapphire - •••• 4521",
    password: "••••",
    notes: "Pin for offline transactions.",
    category: "secure-note",
    isFavorite: false,
  },
];

export default function VaultScreen() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLock = () => {
    console.log("Locking vault...");
    // TODO: Implement lock logic
  };

  const filteredItems = MOCK_ITEMS.filter((item) => {
    // Filter by tab
    if (activeTab === "favorites" && !item.isFavorite) return false;
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.username.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const selectedItem =
    MOCK_ITEMS.find((item) => item.id === selectedId) || null;
  return (
    <div className="h-screen w-full bg-background overflow-hidden">
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <div className="w-[18%] min-w-[200px] h-full">
          <VaultSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLock={handleLock}
          />
        </div>

        {/* List */}
        <div className="w-[30%] min-w-[300px] h-full">
          <PasswordList
            items={filteredItems}
            selectedId={selectedId}
            onSelect={setSelectedId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Detail */}
        <div className="flex-1 h-full">
          <PasswordDetail item={selectedItem} />
        </div>
      </div>
    </div>
  );
}
