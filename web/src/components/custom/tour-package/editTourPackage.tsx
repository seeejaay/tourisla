"use client";

import { useState, useEffect } from "react";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
// import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { useApplyOperatorManager } from "@/hooks/useApplyOperatorManager";
import { TourPackage } from "@/app/static/tour-packages/tour-packageSchema";
import { useParams } from "next/navigation";
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
import { X } from "lucide-react";

export default function EditTourPackage({
  tourPackage,
  onSuccess,
  onCancel,
}: {
  tourPackage: TourPackage;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { edit, loading, error, fetchAll } = useTourPackageManager();
  // const { fetchAllTourGuideApplicants } = useTourGuideManager();
  const { fetchApplications } = useApplyOperatorManager(); //
  const params = useParams();
  const touroperator_id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>(
    tourPackage.inclusions
      ? tourPackage.inclusions.split(",").map((i) => i.trim())
      : []
  );
  const [selectedExclusions, setSelectedExclusions] = useState<string[]>(
    tourPackage.exclusions
      ? tourPackage.exclusions.split(",").map((i) => i.trim())
      : []
  );
  const [openInclusions, setOpenInclusions] = useState(false);
  const [openExclusions, setOpenExclusions] = useState(false);
  const [inclusionsSearch, setInclusionsSearch] = useState("");
  const [exclusionsSearch, setExclusionsSearch] = useState("");
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

  const fixTime = (time: string) => (time.length > 5 ? time.slice(0, 5) : time);

  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<string[]>(
    tourPackage.assigned_guides
      ? tourPackage.assigned_guides.map((g: { tourguide_id: number }) =>
          String(g.tourguide_id)
        )
      : []
  );
  const [form, setForm] = useState<Partial<TourPackage>>({
    ...tourPackage,
    id: tourPackage.id,
    price:
      typeof tourPackage.price === "number"
        ? tourPackage.price
        : Number(tourPackage.price),
    start_time: fixTime(tourPackage.start_time || "09:00"),
    end_time: fixTime(tourPackage.end_time || "17:00"),
    cancellation_note: tourPackage.cancellation_note || "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [packages, setPackages] = useState<TourPackage[]>([]);

  // Fetch all packages for overlap checking
  useEffect(() => {
    async function loadPackages() {
      const data = await fetchAll();
      setPackages(Array.isArray(data) ? data : []);
    }
    loadPackages();
  }, [fetchAll]);

  useEffect(() => {
    async function loadGuides() {
      const applications = await fetchApplications(touroperator_id);
      if (!applications) {
        setGuides([]);
        return;
      }
      setGuides(
        applications
          .filter((app: any) => app.application_status === "APPROVED")
          .map((app: any) => ({
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

  // Auto-compute duration_days based on start and end date
  useEffect(() => {
    if (form.date_start && form.date_end) {
      const start = new Date(form.date_start);
      const end = new Date(form.date_end);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.max(
        Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1,
        1
      );
      if (!isNaN(diffDays)) {
        setForm((prev) => ({
          ...prev,
          duration_days: diffDays,
        }));
      }
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
          : name === "start_time" || name === "end_time"
          ? fixTime(value)
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

  // Helper: check if a guide is assigned to any overlapping package (excluding current)
  function isGuideUnavailableForDates(
    guideId: string,
    start: string,
    end: string,
    packages: TourPackage[],
    editingId: number
  ) {
    return packages.some(
      (pkg) =>
        pkg.id !== editingId &&
        pkg.assigned_guides.some((g) => String(g.tourguide_id) === guideId) &&
        isDateOverlap(start, end, pkg.date_start, pkg.date_end)
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const dataToSubmit = {
      ...form,
      touroperator_id,
      assigned_guides: selectedGuides, // <-- should always be present
      inclusions: selectedInclusions.join(", "),
      exclusions: selectedExclusions.join(", "),
      date_start: form.date_start ? form.date_start.split("T")[0] : "",
      date_end: form.date_end ? form.date_end.split("T")[0] : "",
    };

    console.log("Submitting tour package data:", dataToSubmit);

    try {
      await edit(tourPackage.id, dataToSubmit);
      onSuccess();
    } catch (err) {
      setFormError((err as Error)?.message || "Failed to update tour package.");
    }
  };

  return (
    <main className="w-full">
      <div className="p-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
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
          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inclusions Dropdown */}
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Inclusions
              </label>
              <Command className="overflow-visible">
                <div className="rounded-md border border-[#3e979f] px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-[#3e979f] focus-within:ring-offset-2 bg-[#f8fcfd] min-h-[42px]">
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
                          i
                            .toLowerCase()
                            .includes(inclusionsSearch.toLowerCase())
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
                <div className="rounded-md border border-[#3e979f] px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-[#3e979f] focus-within:ring-offset-2 bg-[#f8fcfd] min-h-[42px]">
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
                          i
                            .toLowerCase()
                            .includes(exclusionsSearch.toLowerCase())
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
                value={form.date_start ? form.date_start.split("T")[0] : ""}
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
                value={form.date_end ? form.date_end.split("T")[0] : ""}
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
                          !isGuideUnavailableForDates(
                            g.id,
                            form.date_start!,
                            form.date_end!,
                            packages,
                            tourPackage.id
                          )
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
                                    packages,
                                    tourPackage.id
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
                value={form.start_time || ""}
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
                value={form.end_time || ""}
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
          {/* Error messages */}
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-6 py-2 rounded-lg shadow w-full"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="border border-[#e6f7fa] text-[#1c5461] font-semibold px-6 py-2 rounded-lg bg-white hover:bg-[#e6f7fa] w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
