"use client";

import Header from "@/components/custom/header";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MapPage from "@/components/custom/map";
import { Umbrella, Fish, MapPin, Star, Leaf, Phone, Users } from "lucide-react";

const destinations = [
  {
    title: "Pristine Beaches",
    description:
      "Relax on untouched shores with crystal-clear waters and powdery white sand.",
    image: "/images/nature/sea.jpg",
    alt: "Beach",
    icon: <Umbrella className="w-6 h-6 text-[#3e979f]" />,
  },
  {
    title: "Jungle Trails",
    description:
      "Explore lush jungle paths leading to breathtaking viewpoints and hidden waterfalls.",
    image: "/images/nature/sun.jpg",
    alt: "Trails",
    icon: <Leaf className="w-6 h-6 text-[#51702c]" />,
  },
  {
    title: "Marine Adventures",
    description:
      "Discover vibrant coral reefs teeming with tropical fish and marine life.",
    image: "/images/nature/sand.jpg",
    alt: "Marine life",
    icon: <Fish className="w-6 h-6 text-[#1c5461]" />,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    comment:
      "The beaches were absolutely pristine - exactly as pictured! Our island tour guide was incredibly knowledgeable.",
    avatar: "/images/femaleavatar.png",
    rating: 5,
  },
  {
    name: "Michael Chen",
    comment:
      "The jungle trek to the waterfalls was challenging but so rewarding. Bring good shoes!",
    avatar: "/images/maleavatar.png",
    rating: 4,
  },
  {
    name: "Elena Rodriguez",
    comment:
      "Snorkeling here was magical. We saw sea turtles and so many colorful fish right near shore.",
    avatar: "/images/maleavatar.png",
    rating: 5,
  },
];

const locations = [
  { name: "Sillon", region: "North" },
  { name: "Bantigue", region: "East" },
  { name: "Montalban", region: "West" },
  { name: "Obo-ob", region: "South" },
  { name: "Santa Fe", region: "North" },
  { name: "Ticad", region: "East" },
  { name: "Sulangan", region: "West" },
];

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Header />
      <div className="w-full bg-[#fffff1]">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[500px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c5461]/90 via-[#1c5461]/40 to-transparent z-10" />
          <Image
            src="/images/Bantayan_Map.webp"
            alt="Tropical island beach"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-xl">
              Discover Island Paradise
            </h1>
            <p className="text-xl text-[#ddddd1] max-w-2xl mb-10 drop-shadow-md">
              Where emerald jungles meet turquoise waters in perfect harmony
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/explore")}
                className="px-8 py-4 rounded-full bg-[#019375] hover:bg-[#017a60] text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <Users className="inline mr-2 w-5 h-5" /> Explore Accommodation
              </button>
              <button
                onClick={() => router.push("#contact")}
                className="px-8 py-4 rounded-full bg-transparent border-2 border-white text-white font-bold hover:bg-white/20 transition-all flex items-center"
              >
                <Phone className="inline mr-2 w-5 h-5" /> Contact Us
              </button>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-20 bg-[#fffff1]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1c5461] mb-4">
                Your Island Escape Awaits
              </h2>
              <div className="w-24 h-1 bg-[#3e979f] mx-auto mb-6"></div>
              <p className="text-lg text-[#51702c] max-w-3xl mx-auto">
                Immerse yourself in nature&apos;s beauty with our curated
                eco-tourism experiences that respect and preserve the local
                environment.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-12">
              <div className="p-6 bg-white rounded-xl shadow-md border border-[#7b9997]/20">
                <div className="text-4xl font-bold text-[#1c5461] mb-2">
                  10+
                </div>
                <div className="text-[#51702c]">Beaches</div>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md border border-[#7b9997]/20">
                <div className="text-4xl font-bold text-[#1c5461] mb-2">
                  10+
                </div>
                <div className="text-[#51702c]">Hiking Trails</div>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md border border-[#7b9997]/20">
                <div className="text-4xl font-bold text-[#1c5461] mb-2">
                  100+
                </div>
                <div className="text-[#51702c]">Marine Species</div>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md border border-[#7b9997]/20">
                <div className="text-4xl font-bold text-[#1c5461] mb-2">
                  24/7
                </div>
                <div className="text-[#51702c]">Guide Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Experiences */}
        <section id="explore" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1c5461] mb-4">
                Unique Experiences
              </h2>
              <div className="w-24 h-1 bg-[#3e979f] mx-auto mb-6"></div>
              <p className="text-lg text-[#51702c] max-w-3xl mx-auto">
                Discover authentic activities that connect you with the
                island&apos;s natural wonders
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {destinations.map((dest, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-[#fffff1] border border-[#7b9997]/20"
                >
                  <div className="relative h-64">
                    <Image
                      src={dest.image}
                      alt={dest.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c5461]/80 to-transparent" />
                    <div className="absolute top-4 left-4 bg-white p-3 rounded-full shadow-md border border-[#7b9997]/20">
                      {dest.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-[#1c5461]">
                      {dest.title}
                    </h3>
                    <p className="text-[#51702c]">{dest.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="py-20 bg-[#fffff1]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1c5461] mb-4">
                Bantayan Island
              </h2>
              <div className="w-24 h-1 bg-[#3e979f] mx-auto mb-6"></div>
              <p className="text-lg text-[#51702c] max-w-3xl mx-auto">
                Explore our beautiful island destinations
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {locations.map((location, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md text-center border border-[#7b9997]/20 hover:shadow-lg transition-all"
                >
                  <div className="text-2xl font-bold text-[#1c5461] mb-2">
                    {location.name}
                  </div>
                  <div className="text-sm text-[#7b9997]">
                    {location.region}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1c5461] mb-4">
                Explore Our Island
              </h2>
              <div className="w-24 h-1 bg-[#3e979f] mx-auto mb-6"></div>
              <p className="text-lg text-[#51702c] max-w-3xl mx-auto">
                Find your perfect spot with our interactive island map
              </p>
            </div>

            <div className=" rounded-2xl  overflow-hidden ">
              <div className="h-[500px] w-full relative">
                <MapPage />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full shadow-md flex items-center border border-[#7b9997]/20">
                  <MapPin className="w-4 h-4 text-[#3e979f] mr-2" />
                  <span className="text-[#1c5461] font-medium">
                    Island Locations
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-[#1c5461] text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Traveler Stories
              </h2>
              <div className="w-24 h-1 bg-[#3e979f] mx-auto mb-6"></div>
              <p className="text-lg text-[#ddddd1] max-w-3xl mx-auto">
                Hear from visitors who&apos;ve experienced our island adventures
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-[#3e979f]/30"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-[#3e979f]">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="font-bold mr-2">{testimonial.name}</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating
                                ? "fill-[#3e979f] text-[#3e979f]"
                                : "fill-white/20 text-white/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[#ddddd1] italic">
                    &quot;{testimonial.comment}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-[#1c5461] to-[#019375]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready for Your Island Adventure?
            </h2>
            <p className="text-xl text-[#ddddd1] mb-8">
              Book your eco-friendly tour today and create unforgettable
              memories
            </p>
            <button
              onClick={() => router.push("/tour-packages")}
              className="px-10 py-5 rounded-full bg-white hover:bg-[#fffff1] text-[#1c5461] font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Book Now
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
