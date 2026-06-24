"use client";
import Categories from "@/components/Categories";
import Tags from "@/components/Tags";
import { useUserData, useAuth } from "@/functions/auth";
import {
  Tags as TagsIcon,
  UserPen,
  Shapes,
  Sparkles,
  Bell,
  Palette,
  ShieldCheck,
  Download,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

type SettingsItem = {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
  danger?: boolean;
};

type SettingsSection = {
  heading: string;
  items: SettingsItem[];
};

const SECTIONS: SettingsSection[] = [
  {
    heading: "Account",
    items: [
      {
        key: "account",
        label: "Account",
        description: "Profile, and password",
        icon: UserPen,
      },
    ],
  },
  {
    heading: "Wardrobe",
    items: [
      {
        key: "categories",
        label: "Categories",
        description: "Organize how items are grouped",
        icon: Shapes,
      },
      {
        key: "tags",
        label: "Tags",
        description: "Manage tags used across items",
        icon: TagsIcon,
      },
      // {
      //   key: "recommendations",
      //   label: "AI Recommendations",
      //   description: "Tune how outfit pairings are suggested",
      //   icon: Sparkles,
      // },
    ],
  },
  // {
  //   heading: "Preferences",
  //   items: [
  //     {
  //       key: "appearance",
  //       label: "Appearance",
  //       description: "Theme and display options",
  //       icon: Palette,
  //     },
  //     {
  //       key: "notifications",
  //       label: "Notifications",
  //       description: "Email and in-app alerts",
  //       icon: Bell,
  //     },
  //   ],
  // },
  // {
  //   heading: "Data & Privacy",
  //   items: [
  //     {
  //       key: "privacy",
  //       label: "Privacy & Security",
  //       description: "Control your data and sessions",
  //       icon: ShieldCheck,
  //     },
  //     {
  //       key: "export",
  //       label: "Export Data",
  //       description: "Download your wardrobe as a file",
  //       icon: Download,
  //     },
  //   ],
  // },
  // {
  //   heading: "Support",
  //   items: [
  //     {
  //       key: "help",
  //       label: "Help & Support",
  //       description: "Guides and contact",
  //       icon: HelpCircle,
  //     },
  //     {
  //       key: "about",
  //       label: "About",
  //       description: "Version and credits",
  //       icon: Info,
  //     },
  //   ],
  // },
];

export default function OurSettings({
  modal,
}: {
  modal: (key: string) => void;
}) {
  // the colon syntax data: user means "take the property called data, but call it user in my local scope instead.
  const { userData } = useUserData();
  const { Logout } = useAuth();

  return (
    <div className="min-h-screen bg-transparent px-4 py-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-400">
            Settings
          </p>
          <h1 className="text-3xl font-bold text-gray-100">
            Hello{userData.data ? `, ${userData.data.first_name}` : ""}
          </h1>
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <div key={section.heading} className="flex flex-col gap-2">
            <p className="px-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              {section.heading}
            </p>
            <div className="divide-y divide-gray-800 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => modal(item.key)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5 active:bg-white/10"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-gray-300">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-sm font-medium text-gray-100">
                        {item.label}
                      </span>
                      <span className="truncate text-xs text-gray-500">
                        {item.description}
                      </span>
                    </span>
                    <ChevronRight
                      size={18}
                      className="shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button
          type="button"
          onClick={() => Logout()}
          className="flex w-full items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900/50 px-4 py-3 text-left text-red-400 transition hover:bg-red-500/10 hover:text-red-300 active:scale-[0.99]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
            <LogOut size={18} aria-hidden="true" />
          </span>
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </div>
  );
}
