"use client";

import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f8fcfd] py-28 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-[#e6f7fa] p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1c5461] mb-6 text-center">
            Privacy Policy
          </h1>
          <p className="mb-6 text-[#51702c] text-center">
            TourISLA values your privacy. This Privacy Policy explains how we
            collect, use, and protect your personal data.
          </p>
          <ol className="space-y-6 text-[#1c5461]">
            <li>
              <h2 className="font-bold text-lg mb-2">
                1. Information We Collect
              </h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  <span className="font-semibold">Personal Information:</span>{" "}
                  Name, email, phone number, and account details.
                </li>
                <li>
                  <span className="font-semibold">Usage Data:</span> Browsing
                  activity, IP address, device information, and preferences.
                </li>
                <li>
                  <span className="font-semibold">Third-Party Data:</span>{" "}
                  Information collected via integrated APIs (e.g., TripAdvisor,
                  Google reCAPTCHA).
                </li>
                <li>
                  <span className="font-semibold">
                    Cookies and Tracking Technologies:
                  </span>{" "}
                  Used to enhance your experience and analyze usage trends.
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>To provide, maintain, and improve TourISLA services.</li>
                <li>
                  To prevent fraud, enhance security, and comply with legal
                  obligations.
                </li>
                <li>
                  To send service-related notifications, updates, and
                  promotional messages (with opt-out options).
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">
                3. Sharing of Information
              </h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  <span className="font-semibold">With Service Providers:</span>{" "}
                  Third-party vendors assisting in platform operation, such as
                  hosting, analytics, and security services.
                </li>
                <li>
                  <span className="font-semibold">With Legal Authorities:</span>{" "}
                  If required by law, court orders, or to prevent fraud or harm.
                </li>
                <li>
                  <span className="font-semibold">
                    With Third-Party API Providers:
                  </span>{" "}
                  Such as Google reCAPTCHA, FreeWeatherAPI, and TripAdvisor for
                  service functionality.
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">
                4. Cookies and Tracking
              </h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  TourISLA uses cookies to enhance user experience and analyze
                  website performance.
                </li>
                <li>
                  You can manage cookie preferences via your browser settings.
                </li>
                <li>
                  Some third-party integrations may also use tracking
                  technologies subject to their privacy policies.
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">5. Data Security</h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  We implement appropriate security measures to protect your
                  data against unauthorized access, loss, or misuse.
                </li>
                <li>
                  While we strive to ensure security, no method of transmission
                  over the internet is 100% secure.
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">6. Your Rights</h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  <span className="font-semibold">
                    Access &amp; Correction:
                  </span>{" "}
                  You can request access to your personal data and correct
                  inaccuracies.
                </li>
                <li>
                  <span className="font-semibold">Data Deletion:</span> You may
                  request deletion of your account and associated data, subject
                  to legal obligations.
                </li>
                <li>
                  <span className="font-semibold">Opt-Out:</span> You can opt
                  out of marketing communications at any time.
                </li>
                <li>
                  <span className="font-semibold">Restrict Processing:</span>{" "}
                  You may request restrictions on the processing of your data
                  under certain conditions.
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">
                7. Changes to This Policy
              </h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  We may update this Privacy Policy periodically to reflect
                  changes in our practices or legal requirements.
                </li>
                <li>
                  Significant changes will be notified via email or platform
                  alerts.
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">8. Contact Us</h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  For privacy-related inquiries, contact us at{" "}
                  <a
                    href="mailto:tour.isla2025@gmail.com"
                    className="text-[#3e979f] underline"
                  >
                    tour.isla2025@gmail.com
                  </a>
                  .
                </li>
              </ul>
            </li>
          </ol>
          <p className="mt-8 text-[#51702c] text-center">
            By using TourISLA, you acknowledge and agree to this Privacy Policy.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
