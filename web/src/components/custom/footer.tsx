"use client";

import Link from "next/link";
import Image from "next/image";
import { footerNavigation, socialLinks } from "@/app/static/navigation";

export default function Footer() {
  return (
    <footer className="bg-[#e6f7fa] border-t border-[#b6e0e4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 py-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex-shrink-0">
              <Image
                src="/images/TourISLA_Logo.png"
                alt="TourISLA Logo"
                width={180}
                height={60}
                className="h-auto"
              />
            </div>
            <p className="text-sm text-[#3e979f]">
              Your trusted partner for island adventures and unforgettable
              experiences.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1c5461]">
              Quick Links
            </h3>
            <nav className="space-y-2">
              {footerNavigation.map((item) => (
                <Link
                  key={item.tag}
                  href={item.href}
                  className="block text-sm text-[#3e979f] hover:text-[#1c5461] hover:underline transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info - Added a new column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1c5461]">Contact Us</h3>
            <div className="text-sm text-[#3e979f] space-y-2">
              <p>Bantayan, Cebu, Philippines</p>
              <p>Email: tour.isla2025@gmail.com</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1c5461]">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <Link
                  key={item.tag}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3e979f] hover:text-[#1c5461] transition-colors"
                  aria-label={item.title}
                >
                  <span className="sr-only">{item.title}</span>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white p-1.5 shadow-sm hover:shadow-md transition-all">
                    {item.tag === "Facebook" && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 5.02 3.66 9.16 8.44 9.93v-7.03h-2.54v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7.03C18.34 21.23 22 17.09 22 12.07z" />
                      </svg>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-[#b6e0e4] py-6 text-center">
          <p className="text-xs text-[#51702c]">
            &copy; {new Date().getFullYear()} TourISLA. All rights reserved.
            <span className="block sm:inline sm:ml-2">
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              {" | "}
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
