"use client";

import { ContactChannels } from "@/components/ui/contact-channels";
import { FaGithub, FaDiscord, FaMailchimp } from "react-icons/fa";
import { MessageCircle } from "lucide-react";
const sampleChannels = [
  {
    id: "github",
    platform: "GitHub",
    handle: "@octocat",
    href: "https://github.com",
    action: "external" as const,
    tooltip: "open github",
    icon: <FaGithub className="size-4" />,
  },
  {
    id: "email",
    platform: "Email",
    handle: "hi@example.com",
    action: "copy" as const,
    copyValue: "hi@example.com",
    tooltip: "copy email",
    shortcutKey: "e",
    icon: <FaMailchimp className="size-4" />,
  },
  {
    id: "discord",
    platform: "Discord",
    handle: "@example",
    href: "https://discord.com",
    action: "external" as const,
    tooltip: "join the server",
    icon: <FaDiscord className="size-4" />,
  },
  {
    id: "office",
    platform: "Office hours",
    handle: "book a slot",
    href: "https://example.com/book",
    action: "external" as const,
    tooltip: "open booking link",
    icon: <MessageCircle className="size-4" />,
  },
];

export function ContactChannelsDemo() {
  return (
    <div className="w-full max-w-xl">
      <ContactChannels items={sampleChannels} columns={2} />
    </div>
  );
}
