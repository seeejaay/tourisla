"use client";
import Link from "next/link";
import { HoverDropdown } from "./customDropwdown";

interface NavigationItemProps {
  item: {
    tag: string;
    title: string;
    href?: string;
    dropdown?: Array<{
      tag: string;
      title: string;
      href?: string;
    }>;
  };
  pathName: string;
}

export function NavigationItem({ item, pathName }: NavigationItemProps) {
  // Only compare if item.href exists
  const isActive = item.href ? pathName === item.href : false;

  const buttonClasses = `
     font-medium px-3 py-2 rounded-lg transition-colors
    ${
      isActive
        ? "bg-[#3e979f]/10 text-[#3e979f]"
        : "text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f] focus:bg-[#e6f7fa] focus:text-[#3e979f]"
    }
  `;

  if (item.dropdown) {
    const trigger = (
      <button
        className={buttonClasses}
        tabIndex={0}
        aria-label={`Show ${item.title} menu`}
        type="button"
      >
        {item.title}
      </button>
    );

    return (
      <HoverDropdown
        trigger={trigger}
        items={item.dropdown}
        className="flex items-center"
      />
    );
  }

  // Only render Link if href exists
  if (item.href) {
    return (
      <Link href={item.href} className={buttonClasses}>
        {item.title}
      </Link>
    );
  }

  // Fallback for items without href
  return <span className={buttonClasses}>{item.title}</span>;
}
