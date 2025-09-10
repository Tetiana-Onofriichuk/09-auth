import type { Metadata } from "next";
import Profile from "@/components/ProfilePage/ProfilePage";

export const metadata: Metadata = {
  title: "User Profile | MyApp",
  description: "View and manage your personal profile information.",
  openGraph: {
    title: "User Profile | MyApp",
    description: "View and manage your personal profile information.",
    url: "https://yourdomain.com/profile",
    siteName: "MyApp",
    images: [
      {
        url: "https://yourdomain.com/og/profile.png",
        width: 1200,
        height: 630,
        alt: "Profile Page Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "User Profile | MyApp",
    description: "View and manage your personal profile information.",
    images: ["https://yourdomain.com/og/profile.png"],
  },
};

export default function ProfilePage() {
  return <Profile />;
}
