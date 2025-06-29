"use client";

import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";

export default function TermsAndConditionsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f8fcfd] py-28 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-[#e6f7fa] p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1c5461] mb-6 text-center">
            Terms and Conditions
          </h1>
          <p className="mb-6 text-[#51702c] text-center">
            Welcome to TourISLA! By accessing or using our platform, you agree
            to comply with and be bound by the following terms and conditions.
            If you do not agree with these terms, please do not use our
            services.
          </p>
          <ol className="space-y-6 text-[#1c5461]">
            <li>
              <h2 className="font-bold text-lg mb-2">1. Definitions</h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  <span className="font-semibold">&quot;TourISLA&quot;</span>{" "}
                  refers to our platform, website, and associated services.
                </li>
                <li>
                  <span className="font-semibold">&quot;User&quot;</span> refers
                  to anyone who accesses or uses TourISLA.
                </li>
                <li>
                  <span className="font-semibold">&quot;Content&quot;</span>{" "}
                  includes all information, images, reviews, and data available
                  on TourISLA.
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">2. Use of Our Services</h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  You must be at least 18 years old or have parental consent to
                  use TourISLA.
                </li>
                <li>
                  You agree to use our services only for lawful purposes and in
                  compliance with all applicable laws and regulations.
                </li>
                <li>
                  You may not engage in activities that could harm the platform,
                  interfere with other users, or violate intellectual property
                  rights.
                </li>
                <li>
                  We reserve the right to terminate or restrict access to any
                  user violating these terms.
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">
                3. Account Registration
              </h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  You may need to create an account to access certain features.
                </li>
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account details, including your password.
                </li>
                <li>
                  You agree to provide accurate, current, and complete
                  information during registration.
                </li>
                <li>
                  If we detect suspicious activity, we may suspend or terminate
                  your account.
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">
                4. Content and Intellectual Property
              </h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  TourISLA owns all intellectual property rights to the platform
                  and content unless otherwise specified.
                </li>
                <li>
                  Users may not copy, distribute, modify, or use content without
                  prior written permission.
                </li>
                <li>
                  By posting content on TourISLA, you grant us a worldwide,
                  non-exclusive, royalty-free license to use, modify, and
                  display the content.
                </li>
                <li>
                  You are responsible for ensuring that the content you post
                  does not infringe third party rights.
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">
                5. Third-Party Services
              </h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  TourISLA integrates third-party APIs, including Google
                  reCAPTCHA, FreeWeatherAPI, and TripAdvisor.
                </li>
                <li>
                  We do not control or assume responsibility for third-party
                  services, their terms, or policies.
                </li>
                <li>
                  Your interactions with third-party services are governed by
                  their respective terms and privacy policies.
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">
                6. Limitation of Liability
              </h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  TourISLA is provided &quot;as is&quot; without warranties of
                  any kind, including accuracy, reliability, or uninterrupted
                  service.
                </li>
                <li>
                  We are not liable for any direct, indirect, incidental,
                  consequential, or punitive damages resulting from your use of
                  the platform.
                </li>
                <li>
                  We do not guarantee the accuracy of third-party information
                  displayed on our platform.
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">
                7. Privacy and Data Protection
              </h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  Your use of TourISLA is also governed by our Privacy Policy,
                  which outlines how we collect, use, and protect your data.
                </li>
              </ul>
            </li>
            <li>
              <h2 className="font-bold text-lg mb-2">
                8. Modifications to Terms
              </h2>
              <ul className="list-disc ml-6 text-[#51702c]">
                <li>
                  We may update these Terms and Conditions at any time.
                  Significant changes will be communicated via email or platform
                  notifications.
                </li>
                <li>
                  Continued use of the platform after changes signifies
                  acceptance of the updated terms.
                </li>
              </ul>
            </li>
          </ol>
          <p className="mt-8 text-[#51702c] text-center">
            For any questions, contact us at{" "}
            <a
              href="mailto:tour.isla2025@gmail.com"
              className="text-[#3e979f] underline"
            >
              tour.isla2025@gmail.com
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
