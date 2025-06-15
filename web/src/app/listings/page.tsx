"use client";
import React from "react";
import useTripAdvisor from "@/hooks/useTripAdvisor";

export default function Listings() {
  const { hotels, loading, error } = useTripAdvisor();

  if (loading) return <div>Loading hotels...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Listings</h2>
      {hotels.length === 0 ? (
        <div>No hotels found.</div>
      ) : (
        <ul>
          {hotels.map((hotel) => (
            <li key={hotel.link}>
              <a href={hotel.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={hotel.thumbnail_url}
                  alt={hotel.name}
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
                <div>{hotel.name}</div>
                <div>
                  Lat: {hotel.latitude}, Lng: {hotel.longitude}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
