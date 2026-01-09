"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
// import Header from "@/components/custom/old-header";
import NewHeader from "@/components/custom/Header";
import Image from "next/image";
import { Users, BadgeCheck, BadgeX, Calendar } from "lucide-react";
import Footer from "@/components/custom/footer";
import { useAuth } from "@/hooks/useAuth";
import type { TourPackage } from "@/types/TourPackageType";

export default function ViewTourPackagePage() {
  const router = useRouter();
  const params = useParams();

  const { fetchAllTourPackages } = useTourPackageManager();
  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const { loggedInUser } = useAuth();

  useEffect(() => {
    async function checkUser() {
      try {
        const userData = await loggedInUser(router, false);
        if (userData && userData.data && userData.data.user) {
          setCurrentUser(userData.data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error fetching logged in user:", error);
        setCurrentUser(null);
      }
    }

    async function fetchPackage() {
      setLoading(true);
      try {
        const allPackages = await fetchAllTourPackages();
        const pkg = allPackages.find((p) => p.id === Number(params.id)) as
          | TourPackage
          | undefined;
        setTourPackage(pkg || null);
      } catch (error) {
        console.error("Error fetching tour package:", error);
        setTourPackage(null);
      }
      setLoading(false);
    }

    fetchPackage();
    checkUser();
  }, [params.id, fetchAllTourPackages, router, loggedInUser]);

  const toTitleCase = (str: string) =>
    str
      .split(" ")
      .map((word) =>
        word.length > 0
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : ""
      )
      .join(" ");

  const getButtonStyles = () => {
    const isUserLoggedIn = currentUser !== null;
    const isFullyBooked = tourPackage && tourPackage.available_slots === 0;
    if (!isUserLoggedIn)
      return "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer";
    if (isFullyBooked) return "bg-gray-400 cursor-not-allowed text-gray-600";
    return "bg-[#3e979f] cursor-pointer hover:bg-[#1c5461] text-white";
  };

  const getButtonText = () => {
    const isUserLoggedIn = currentUser !== null;
    const isFullyBooked = tourPackage && tourPackage.available_slots === 0;
    if (!isUserLoggedIn) return "Login to Book";
    if (isFullyBooked) return "Fully Booked";
    return "Book Now";
  };

  const isButtonDisabled = () => {
    const isUserLoggedIn = currentUser !== null;
    const isFullyBooked = tourPackage && tourPackage.available_slots === 0;
    return Boolean(isUserLoggedIn && isFullyBooked);
  };

  const handleButtonClick = () => {
    const isUserLoggedIn = currentUser !== null;
    if (!isUserLoggedIn) {
      router.push("/auth/login");
      return;
    }
    if (tourPackage && tourPackage.available_slots > 0) {
      router.push(`/tour-packages/${tourPackage.id}/book`);
    }
  };

  if (loading) {
    return (
      <>
        <NewHeader />
        <main className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f1f1f1]">
          <div className="text-center">
            <div className="h-8 w-8 border-2 border-[#3e979f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  if (!tourPackage) {
    return (
      <>
        <NewHeader />
        <main className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f1f1f1]">
          <p className="text-gray-500">Tour package not found.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 cursor-pointer text-white rounded hover:bg-blue-600 transition"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <NewHeader />
      <main className="min-h-screen bg-[#f1f1f1] pb-20">
        {/* Banner/Hero Section */}
        <header className="relative">
          <Image
            src="/images/hero-carousel/4.jpg"
            alt="Tour Package Banner"
            width={1920}
            height={800}
            className="w-full h-60 md:h-96 object-cover object-top brightness-[55%]"
            sizes="100vw"
            priority
          />
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-50 text-center drop-shadow-2xl">
              {tourPackage.package_name}
            </h1>
            <p className="md:text-xl text-lg text-gray-50 text-center font-semibold drop-shadow-2xl">
              {tourPackage.location}
            </p>
          </div>
        </header>

        {/* Details Card */}
        <section className="flex justify-center items-start w-full px-4 py-10">
          <div className="max-w-2xl w-full bg-white/90 rounded-2xl shadow-2xl border border-[#e6f7fa] overflow-hidden">
            {/* Package Image */}
            <div className="relative w-full h-56 sm:h-72">
              <Image
                src="/images/article_image.webp"
                alt={tourPackage.package_name}
                fill
                className="object-cover object-center rounded-t-2xl"
                priority
              />
              <div className="absolute top-2 left-2 bg-[#3e979f] text-white text-sm px-3 py-1 rounded-full shadow">
                {tourPackage.operator_name}
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-green-600">
                  ₱
                  {Number(tourPackage.price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-gray-400 text-sm">per person</span>
              </div>
              <p className="text-gray-700 mb-6">{tourPackage.description}</p>
              <div className="mb-4">
                <span className="font-semibold text-[#1c5461]">Operator:</span>{" "}
                <span className="text-[#3e979f]">
                  {tourPackage.operator_name}
                </span>
                <br />
                <span className="font-semibold text-[#1c5461]">
                  Email:
                </span>{" "}
                <span className="text-[#3e979f]">
                  {tourPackage.operator_email}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <span className="font-semibold text-blue-700 flex items-center gap-1">
                    <BadgeCheck className="w-4 h-4 text-blue-700" />
                    Inclusions:
                  </span>
                  <div className="max-h-48 overflow-y-auto">
                    <ul className="text-gray-600 text-sm mt-1 list-disc list-inside">
                      {tourPackage.inclusions.split(",").map((item, idx) => (
                        <li key={idx}>{toTitleCase(item.trim())}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <span className="font-semibold text-red-700 flex items-center gap-1">
                    <BadgeX className="w-4 h-4 text-red-700" />
                    Exclusions:
                  </span>
                  <div className="max-h-48 overflow-y-auto">
                    <ul className="text-gray-600 text-sm mt-1 list-disc list-inside">
                      {tourPackage.exclusions.split(",").map((item, idx) => (
                        <li key={idx}>{toTitleCase(item.trim())}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <span className="font-semibold text-green-700 flex items-center gap-1">
                    <Users className="w-4 h-4 text-[#3e979f]" />
                    Available Slots:
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-[#3e979f]" />
                    <span className="text-gray-600 text-sm">
                      {tourPackage.available_slots}
                    </span>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <span className="font-semibold text-yellow-700 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-yellow-700" />
                    Schedule:
                  </span>
                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(tourPackage.date_start).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "long", day: "numeric" }
                    )}{" "}
                    {tourPackage.start_time &&
                      new Date(
                        `1970-01-01T${tourPackage.start_time}Z`
                      ).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    &rarr;{" "}
                    {new Date(tourPackage.date_end).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                    {tourPackage.end_time &&
                      ` ${new Date(
                        `1970-01-01T${tourPackage.end_time}Z`
                      ).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}`}
                  </p>
                </div>
              </div>

              {/* Assigned Guides Section */}
              {tourPackage.assigned_guides &&
                tourPackage.assigned_guides.length > 0 && (
                  <div className="mb-6">
                    <span className="font-semibold text-[#1c5461]">
                      Assigned Tour Guide
                      {tourPackage.assigned_guides.length > 1 ? "s" : ""}:
                    </span>
                    <p className="text-gray-800 mt-1">
                      {tourPackage.assigned_guides
                        .map((g) => `${g.first_name} ${g.last_name}`.trim())
                        .join(", ")}
                    </p>
                  </div>
                )}

              <button
                className={`w-full px-6 py-3 rounded-lg font-semibold shadow transition mb-2 ${getButtonStyles()}`}
                onClick={handleButtonClick}
                disabled={isButtonDisabled()}
              >
                {getButtonText()}
              </button>

              <button
                className="w-full px-6 py-2 cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-semibold shadow transition"
                onClick={() => router.back()}
              >
                ← Back to Packages
              </button>
            </div>
          </div>
        </section>

        <footer>
          <p className="text-center text-sm text-gray-500 mt-8">
            {`Viewing tour package: ${tourPackage.package_name}`}
          </p>
        </footer>
      </main>
      <Footer />
    </>
  );
}
