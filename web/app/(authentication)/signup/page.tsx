"use client";

import SignUpForm from "@/components/custom/signupform"; // Import the SignUpForm component
import Navbar from "@/components/custom/navbar"; // Import the Navbar component

export default function SignUp() {
  return (
    <div className="bg-[#f1f1f1] min-h-screen">
      <Navbar />
      <div className="p-10 pt-24">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
