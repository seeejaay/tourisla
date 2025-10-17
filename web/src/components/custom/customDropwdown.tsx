"use client";
import { useState, useRef, ReactNode } from "react";
import Link from "next/link";

interface DropdownItem {
  tag: string;
  title: string;
  href?: string; // Make href optional
}

interface HoverDropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  className?: string;
  contentClassName?: string;
}

export function HoverDropdown({
  trigger,
  items,
  className = "",
  contentClassName = "",
}: HoverDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 10);
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger}

      {isOpen && (
        <div
          className={`
            absolute top-full left-0 w-48 mt-1 
            bg-white rounded-md shadow-xl border border-[#e6f7fa]
            z-50 overflow-hidden p-2
            ${contentClassName}
          `}
        >
          {items.map((item, index) => {
            // Only render Link if href exists
            if (item.href) {
              return (
                <Link
                  key={item.tag}
                  href={item.href}
                  className={`
                    block w-full p-2 
                    text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer
                    focus:bg-[#e6f7fa] focus:text-[#3e979f]
                    text-sm
                  `}
                >
                  {item.title}
                </Link>
              );
            }

            // Render as span if no href (non-clickable item)
            return (
              <span
                key={item.tag}
                className={`
                  block w-full px-4 py-3 transition-colors 
                  text-gray-400 font-medium cursor-default
                  ${index === 0 ? "rounded-t-xl" : ""}
                  ${index === items.length - 1 ? "rounded-b-xl" : ""}
                `}
              >
                {item.title}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
