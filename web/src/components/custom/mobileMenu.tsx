"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronUp, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Pill from "./pill";
import WeatherWidget from "./weather";

interface MobileMenuProps {
  navigation: Array<{
    tag: string;
    title: string;
    href?: string;
    dropdown?: Array<{
      tag: string;
      title: string;
      href?: string;
    }>;
  }>;
  pathName: string;
}

export function MobileMenu({ navigation, pathName }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const router = useRouter();

  const toggleDropdown = (tag: string) => {
    setExpandedDropdown(expandedDropdown === tag ? null : tag);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setExpandedDropdown(null);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className="lg:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-[#1c5461]" />
        ) : (
          <Menu className="h-6 w-6 text-[#1c5461]" />
        )}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/5 backdrop-blur-md"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`
          lg:hidden fixed top-0 right-0 h-full w-60 bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#e6f7fa]">
          <h2 className="text-lg font-semibold text-[#1c5461]">Menu</h2>
          <Button
            variant="ghost"
            className="p-2"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-[#1c5461]" />
          </Button>
        </div>

        {/* Action Buttons Section */}
        <div className="p-4 border-b border-[#e6f7fa]">
          <h3 className="text-sm font-medium text-[#1c5461] mb-3">
            Quick Actions
          </h3>
          <div className="flex items-center justify-center space-x-3">
            {/* Pill Component */}

            <Pill />

            {/* Announcements Button */}
            <Button
              variant="ghost"
              className="rounded-full h-10 w-10 p-0 relative hover:bg-[#3e979f]/10 transition-colors group"
              onClick={() => {
                router.push("/announcements");
                closeMenu();
              }}
              aria-label="Announcements"
            >
              <Megaphone className="w-6 h-6 text-[#1c5461] group-hover:text-[#3e979f] transition" />
            </Button>

            {/* Weather Widget */}
            <div className="flex-shrink-0">
              <WeatherWidget />
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col p-4 space-y-2">
          <h3 className="text-sm font-medium text-[#1c5461] mb-2">
            Navigation
          </h3>
          {navigation.map((item) => {
            const isActive = item.href ? pathName === item.href : false;

            if (item.dropdown) {
              return (
                <div key={item.tag} className="space-y-2">
                  {/* Dropdown Trigger */}
                  <button
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left
                      ${
                        isActive
                          ? "bg-[#3e979f]/10 text-[#3e979f]"
                          : "text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f]"
                      }
                    `}
                    onClick={() => toggleDropdown(item.tag)}
                  >
                    <span className="font-medium">{item.title}</span>
                    {expandedDropdown === item.tag ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {/* Dropdown Items */}
                  {expandedDropdown === item.tag && (
                    <div className="ml-4 space-y-1">
                      {item.dropdown.map((subItem) => {
                        if (!subItem.href) return null;

                        const isSubActive = pathName === subItem.href;
                        return (
                          <Link
                            key={subItem.tag}
                            href={subItem.href}
                            className={`
                              block px-3 py-2 rounded-lg transition-colors font-medium text-sm
                              ${
                                isSubActive
                                  ? "bg-[#3e979f]/10 text-[#3e979f]"
                                  : "text-[#51702c] hover:bg-[#e6f7fa] hover:text-[#3e979f]"
                              }
                            `}
                            onClick={closeMenu}
                          >
                            {subItem.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular navigation item
            if (item.href) {
              return (
                <Link
                  key={item.tag}
                  href={item.href}
                  className={`
                    block px-3 py-2 rounded-lg transition-colors font-medium
                    ${
                      isActive
                        ? "bg-[#3e979f]/10 text-[#3e979f]"
                        : "text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f]"
                    }
                  `}
                  onClick={closeMenu}
                >
                  {item.title}
                </Link>
              );
            }

            return null;
          })}
        </div>
      </div>
    </>
  );
}
