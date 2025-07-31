"use client";

import { useState, useEffect } from "react";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
// import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { useApplyOperatorManager } from "@/hooks/useApplyOperatorManager";
import { TourPackage } from "@/app/static/tour-packages/tour-packageSchema";
import { useParams } from "next/navigation";
import { X } from "lucide-react";
import {
  inclusions,
  exclusions,
} from "@/app/static/tour-packages/inclusions_exclusions";
import {
  Command,
  CommandGroup,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AddTourPackage({
  onSuccess,
  onCancel,
  initialData = {},
}: {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Partial<TourPackage>;
}) {
  const { create, loading, error, fetchAll } = useTourPackageManager();
  // const { fetchAllTourGuideApplicants } = useTourGuideManager();
  const { fetchApplications } = useApplyOperatorManager();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const touroperator_id = Array.isArray(params.id) ? params.id[0] : params.id;

  type TourGuide = {
    id: string;
    first_name: string;
    last_name: string;
    application_status?: string;
    birth_date: string;
    created_at: string;
    email: string;
    mobile_number: string;
    profile_picture: string;
    reason_for_applying: string;
    sex: string;
    updated_at: string;
    user_id: string;
  };

  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>([]);
  const [selectedExclusions, setSelectedExclusions] = useState<string[]>([]);
  const [openInclusions, setOpenInclusions] = useState(false);
  const [openExclusions, setOpenExclusions] = useState(false);
  const [inclusionsSearch, setInclusionsSearch] = useState("");
  const [exclusionsSearch, setExclusionsSearch] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [packages, setPackages] = useState<TourPackage[]>([]);

  // Fetch all packages for overlap checking
  useEffect(() => {
    async function loadPackages() {
      const data = await fetchAll();
      console.log("All packages for overlap check:", data);
      setPackages(Array.isArray(data) ? data : []);
    }
    loadPackages();
  }, [fetchAll]);
  useEffect(() => {
    if (Object.keys(initialData).length === 0) return; // Only run if duplicating

    if (initialData.selectedInclusions) {
      setSelectedInclusions(initialData.selectedInclusions);
    } else if (initialData.inclusions) {
      setSelectedInclusions(
        initialData.inclusions.split(",").map((i) => i.trim())
      );
    }
    if (initialData.selectedExclusions) {
      setSelectedExclusions(initialData.selectedExclusions);
    } else if (initialData.exclusions) {
      setSelectedExclusions(
        initialData.exclusions.split(",").map((i) => i.trim())
      );
    }
    setSelectedGuides(initialData.assigned_guides || []);
    setForm({
      package_name: "",
      location: "",
      description: "",
      price: 0,
      duration_days: 1,
      inclusions: "",
      exclusions: "",
      available_slots: 1,
      date_start: "",
      date_end: "",
      start_time: "",
      end_time: "",
      cancellation_days: 0,
      cancellation_note: "",
      touroperator_id: touroperator_id,
      ...initialData,
    });
  }, [initialData, touroperator_id]);
  useEffect(() => {
    async function loadGuides() {
      // Fetch applications for this operator
      const applications = await fetchApplications(touroperator_id || "");
      if (!applications) {
        setGuides([]);
        return;
      }
      // Filter only approved applications and map to guide info
      setGuides(
        applications
          .filter((app) => app.application_status === "APPROVED")
          .map((app) => ({
            id: String(app.tourguide_id),
            first_name: app.first_name,
            last_name: app.last_name,
            application_status: app.application_status,
            birth_date: app.birth_date,
            created_at: app.created_at,
            email: app.email,
            mobile_number: app.mobile_number,
            profile_picture: app.profile_picture,
            reason_for_applying: app.reason_for_applying,
            sex: app.sex,
            updated_at: app.updated_at,
            user_id: app.user_id,
          }))
      );
    }
    loadGuides();
  }, [fetchApplications, touroperator_id]);

  const [form, setForm] = useState<Partial<TourPackage>>({
    package_name: "",
    location: "",
    description: "",
    price: 0,
    duration_days: 1,
    inclusions: "",
    exclusions: "",
    available_slots: 1,
    date_start: "",
    date_end: "",
    start_time: "",
    end_time: "",
    cancellation_days: 0,
    cancellation_note: "",
    touroperator_id: touroperator_id,
    ...initialData, // <-- prefill with duplicate data
  });

  // Real-time date validation
  useEffect(() => {
    if (!form.date_start || !form.date_end) {
      setFormError(null);
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minStartDate = new Date(today);
    minStartDate.setDate(today.getDate() + 8);

    const startDate = new Date(form.date_start);
    const endDate = new Date(form.date_end);

    if (startDate < minStartDate) {
      setFormError("Start date must be at least 8 days from today.");
    } else if (endDate <= startDate) {
      setFormError("End date must be at least 1 day after the start date.");
    } else {
      setFormError(null);
    }
  }, [form.date_start, form.date_end]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "duration_days" ||
        name === "available_slots" ||
        name === "cancellation_days"
          ? Number(value)
          : value,
    }));
  };

  // Helper: check if two date ranges overlap
  function isDateOverlap(
    startA: string,
    endA: string,
    startB: string,
    endB: string
  ) {
    if (!startA || !endA || !startB || !endB) return false;
    return (
      new Date(startA) <= new Date(endB) && new Date(endA) >= new Date(startB)
    );
  }
  function isGuideUnavailableForDates(
    guideId: string,
    start: string,
    end: string,
    packages: TourPackage[]
  ) {
    return packages.some(
      (pkg) =>
        pkg.assigned_guides.some((g) => String(g.tourguide_id) === guideId) &&
        isDateOverlap(start, end, pkg.date_start, pkg.date_end)
    );
  }
  // Compute unavailable guide IDs based on overlap
  const unavailableGuideIds = new Set<string>();
  if (form.date_start && form.date_end) {
    packages.forEach((pkg) => {
      if (
        isDateOverlap(
          form.date_start!,
          form.date_end!,
          pkg.date_start,
          pkg.date_end
        )
      ) {
        pkg.assigned_guides.forEach((g) => {
          // Compare user_id (from your guides) with tourguide_id (from assigned_guides)
          if (g && g.tourguide_id) {
            unavailableGuideIds.add(String(g.tourguide_id));
          }
        });
      }
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minStartDate = new Date(today);
    minStartDate.setDate(today.getDate() + 8);
    if (selectedInclusions.length === 0 && selectedExclusions.length === 0) {
      setFormError("Please select at least one inclusion or exclusion.");
      return;
    }
    const startDate = new Date(form.date_start || "");
    const endDate = new Date(form.date_end || "");

    if (startDate < minStartDate) {
      setFormError("Start date must be at least 8 days from today.");
      return;
    }
    if (endDate <= startDate) {
      setFormError("End date must be at least 1 day after the start date.");
      return;
    }

    try {
      await create({
        ...form,
        touroperator_id,
        assigned_guides: selectedGuides,
        inclusions: selectedInclusions.join(", "),
        exclusions: selectedExclusions.join(", "),
      });
      onSuccess();
    } catch (err) {
      setFormError((err as Error)?.message || "Failed to create tour package.");
    }
  };

  return (
    <main className="w-full">
      {/* Error messages */}
      <div className="p-8 space-y-8">
        <div
          className={`w-full flex items-center justify-center ${
            !formError && !error ? "hidden" : ""
          }`}
        >
          <div className="bg-red-100 text-red-600 rounded-lg flex items-center justify-between w-1/2 border border-red-500 p-4">
            {formError && (
              <p className="text-red-500 text-sm text-center w-full">
                {formError}
              </p>
            )}
            {error && (
              <p className="text-red-500 text-sm  text-center w-full">
                {error}
              </p>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Package Name & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Package Name
              </label>
              <input
                name="package_name"
                value={form.package_name}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                placeholder="Enter package name"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                placeholder="Enter location"
                required
              />
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block font-semibold mb-2 text-[#1c5461]">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd] min-h-[80px]"
              placeholder="Describe the package"
              required
            />
          </div>
          {/* Price, Duration, Slots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Price (₱)
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                min={0}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Duration (days)
              </label>
              <input
                name="duration_days"
                type="number"
                value={form.duration_days}
                readOnly
                className="w-full border border-[#3e979f] bg-gray-100 rounded-lg px-3 py-2 text-sm min-h-[42px] cursor-not-allowed"
                min={1}
                required
                tabIndex={-1}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Available Slots
              </label>
              <input
                name="available_slots"
                type="number"
                value={form.available_slots}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                min={1}
                required
              />
            </div>
          </div>
          {/* Inclusions Dropdown */}
          <div>
            <label className="block font-semibold mb-2 text-[#1c5461]">
              Inclusions
            </label>
            <Command className="overflow-visible">
              <div
                className={`rounded-md border px-3 py-2 text-sm min-h-[42px] ${
                  selectedInclusions.length === 0 && formError
                    ? "border-red-500"
                    : "border-[#3e979f]"
                } ring-offset-background focus-within:ring-2 focus-within:ring-[#3e979f] focus-within:ring-offset-2 bg-[#f8fcfd]`}
              >
                <div className="flex flex-wrap gap-1">
                  {selectedInclusions.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="select-none mr-1 flex items-center"
                      tabIndex={-1}
                    >
                      {item}
                      <button
                        type="button"
                        className="ml-2 p-0 bg-transparent border-none cursor-pointer"
                        tabIndex={0}
                        aria-label={`Remove ${item}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInclusions(
                            selectedInclusions.filter((i) => i !== item)
                          );
                        }}
                      >
                        <X className="size-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  ))}
                  <CommandPrimitive.Input
                    value={inclusionsSearch}
                    onValueChange={setInclusionsSearch}
                    onBlur={() => setOpenInclusions(false)}
                    onFocus={() => setOpenInclusions(true)}
                    placeholder="Search inclusions..."
                    className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="relative mt-2">
                <CommandList>
                  {openInclusions &&
                    !!inclusions.filter(
                      (i) =>
                        !selectedInclusions.includes(i) &&
                        i.toLowerCase().includes(inclusionsSearch.toLowerCase())
                    ).length && (
                      <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none max-h-48 overflow-auto">
                        <CommandGroup>
                          {inclusions
                            .filter(
                              (i) =>
                                !selectedInclusions.includes(i) &&
                                i
                                  .toLowerCase()
                                  .includes(inclusionsSearch.toLowerCase())
                            )
                            .map((i) => (
                              <CommandItem
                                key={i}
                                onMouseDown={(e) => e.preventDefault()}
                                onSelect={() => {
                                  setSelectedInclusions([
                                    ...selectedInclusions,
                                    i,
                                  ]);
                                  setInclusionsSearch(""); // clear search after select
                                }}
                                className="cursor-pointer"
                              >
                                {i}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </div>
                    )}
                </CommandList>
              </div>
            </Command>
          </div>

          {/* Exclusions Dropdown */}
          <div>
            <label className="block font-semibold mb-2 text-[#1c5461]">
              Exclusions
            </label>
            <Command className="overflow-visible">
              <div
                className={`rounded-md border px-3 py-2 text-sm min-h-[42px] ${
                  selectedExclusions.length === 0 && formError
                    ? "border-red-500"
                    : "border-[#3e979f]"
                } ring-offset-background focus-within:ring-2 focus-within:ring-[#3e979f] focus-within:ring-offset-2 bg-[#f8fcfd]`}
              >
                <div className="flex flex-wrap gap-1">
                  {selectedExclusions.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="select-none mr-1 flex items-center"
                      tabIndex={-1}
                    >
                      {item}
                      <button
                        type="button"
                        className="ml-2 p-0 bg-transparent border-none cursor-pointer"
                        tabIndex={0}
                        aria-label={`Remove ${item}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExclusions(
                            selectedExclusions.filter((i) => i !== item)
                          );
                        }}
                      >
                        <X className="size-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  ))}
                  <CommandPrimitive.Input
                    value={exclusionsSearch}
                    onValueChange={setExclusionsSearch}
                    onBlur={() => setOpenExclusions(false)}
                    onFocus={() => setOpenExclusions(true)}
                    placeholder="Search exclusions..."
                    className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="relative mt-2">
                <CommandList>
                  {openExclusions &&
                    !!exclusions.filter(
                      (i) =>
                        !selectedExclusions.includes(i) &&
                        i.toLowerCase().includes(exclusionsSearch.toLowerCase())
                    ).length && (
                      <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none max-h-48 overflow-auto">
                        <CommandGroup>
                          {exclusions
                            .filter(
                              (i) =>
                                !selectedExclusions.includes(i) &&
                                i
                                  .toLowerCase()
                                  .includes(exclusionsSearch.toLowerCase())
                            )
                            .map((i) => (
                              <CommandItem
                                key={i}
                                onMouseDown={(e) => e.preventDefault()}
                                onSelect={() => {
                                  setSelectedExclusions([
                                    ...selectedExclusions,
                                    i,
                                  ]);
                                  setExclusionsSearch(""); // clear search after select
                                }}
                                className="cursor-pointer"
                              >
                                {i}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </div>
                    )}
                </CommandList>
              </div>
            </Command>
          </div>
          {/* Dates & Guides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Start Date
              </label>
              <input
                name="date_start"
                type="date"
                value={form.date_start}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                End Date
              </label>
              <input
                name="date_end"
                type="date"
                value={form.date_end}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Assign Tour Guides
              </label>
              <Command className="overflow-visible">
                <div className="rounded-md border border-[#3e979f] px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-[#3e979f] focus-within:ring-offset-2 bg-[#f8fcfd] min-h-[42px]">
                  <div className="flex flex-wrap gap-1">
                    {selectedGuides.map((id) => {
                      const guide = guides.find((g) => g.id === id);
                      if (!guide) return null;
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="select-none mr-1 flex items-center"
                          tabIndex={-1}
                        >
                          {guide.first_name} {guide.last_name}
                          <button
                            type="button"
                            className="ml-2 p-0 bg-transparent border-none cursor-pointer"
                            tabIndex={0}
                            aria-label={`Remove ${guide.first_name} ${guide.last_name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGuides(
                                selectedGuides.filter((gid) => gid !== id)
                              );
                            }}
                          >
                            <X className="size-3 text-muted-foreground hover:text-foreground" />
                          </button>
                        </Badge>
                      );
                    })}
                    <CommandPrimitive.Input
                      value={""}
                      onValueChange={() => {}}
                      onBlur={() => setOpen(false)}
                      onFocus={() => setOpen(true)}
                      placeholder="Select guides..."
                      className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div className="relative mt-2">
                  <CommandList>
                    {open &&
                      !!guides.filter(
                        (g) =>
                          !selectedGuides.includes(g.id) &&
                          !unavailableGuideIds.has(g.user_id)
                      ).length && (
                        <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                          <CommandGroup className="h-full overflow-auto">
                            {guides
                              .filter(
                                (g) =>
                                  !selectedGuides.includes(g.id) &&
                                  !isGuideUnavailableForDates(
                                    g.id,
                                    form.date_start!,
                                    form.date_end!,
                                    packages
                                  )
                              )
                              .map((g) => (
                                <CommandItem
                                  key={g.id}
                                  onMouseDown={(e) => e.preventDefault()}
                                  onSelect={() => {
                                    setSelectedGuides([
                                      ...selectedGuides,
                                      g.id,
                                    ]);
                                  }}
                                  className="cursor-pointer"
                                >
                                  {g.first_name} {g.last_name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </div>
                      )}
                  </CommandList>
                </div>
              </Command>
            </div>
          </div>
          {/* Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Start Time
              </label>
              <input
                name="start_time"
                type="time"
                value={form.start_time}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                End Time
              </label>
              <input
                name="end_time"
                type="time"
                value={form.end_time}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                required
              />
            </div>
          </div>
          {/* Cancellation Policy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Cancellation Days
              </label>
              <input
                name="cancellation_days"
                type="number"
                value={form.cancellation_days}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                min={0}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Cancellation Policy
              </label>
              <input
                name="cancellation_note"
                value={form.cancellation_note}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                placeholder="E.g., Full refund if cancelled 7 days before"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-6 py-2 rounded-lg shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-1/4"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              className="border border-gray-300 text-[#1c5461] font-semibold px-6 py-2 rounded-lg cursor-pointer bg-white hover:bg-[#f0f0f0] w-1/4"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
