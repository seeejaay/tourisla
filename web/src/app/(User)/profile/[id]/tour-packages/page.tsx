"use client";

import { useEffect, useState, useCallback } from "react";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import AddTourPackage from "@/components/custom/tour-package/addTourPackage";
import EditTourPackage from "@/components/custom/tour-package/editTourPackage";
import DeleteTourPackage from "@/components/custom/tour-package/deleteTourPackage";

import {
  BadgeCheck,
  BadgeX,
  AlertTriangle,
  Plus,
  Pencil,
  Search,
  Calendar,
  MapPin,
  Clock,
  Users,
  Tag,
  Copy,
} from "lucide-react";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

import { format } from "date-fns";

type AssignedGuide = {
  tourguide_id: number;
  first_name: string;
  last_name: string;
  profile_picture?: string;
};

type TourPackage = {
  id: number;
  touroperator_id: number;
  package_name: string;
  location: string;
  description: string;
  price: string;
  duration_days: number;
  inclusions: string;
  exclusions: string;
  available_slots: number;
  date_start: string;
  date_end: string;
  start_time: string;
  end_time: string;
  cancellation_days: number;
  cancellation_note: string;
  is_active: boolean;
  assigned_guides: AssignedGuide[];
  package_image?: string;
  hasBookings?: boolean;
};

export default function TourPackagesPage() {
  const { fetchAll, loading, error, updateTourPackageStatus } =
    useTourPackageManager();
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TourPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(
    null
  );
  const params = useParams();
  const [duplicateData, setDuplicateData] =
    useState<Partial<TourPackage> | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  // Ensure id is always a string
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // Centralized load function for reuse
  const loadPackages = useCallback(async () => {
    if (!id) return;
    const data = await fetchAll();
    const packagesData = Array.isArray(data) ? data : [];
    setPackages(packagesData);
    setFilteredPackages(packagesData);
  }, [fetchAll, id]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  // Filter packages based on search term and active tab
  useEffect(() => {
    let result = packages;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (pkg) =>
          pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tab filter
    const today = new Date();
    if (activeTab === "active") {
      result = result.filter(
        (pkg) => pkg.is_active && new Date(pkg.date_end) >= today // Not completed
      );
    } else if (activeTab === "complete") {
      result = result.filter(
        (pkg) => new Date(pkg.date_end) < today // Completed
      );
    }

    setFilteredPackages(result);
  }, [searchTerm, activeTab, packages]);

  // Handle create success
  const handleCreateSuccess = async () => {
    setDialogOpen(false);
    setShowAdd(false);
    await loadPackages();
  };

  // Handle edit success
  const handleEditSuccess = async () => {
    setEditDialogOpen(false);
    setEditingPackage(null);
    await loadPackages();
  };
  const handleDuplicate = (pkg: TourPackage) => {
    // Helper to format date to mm/dd/yyyy

    setDuplicateData({
      ...pkg,
      date_start: "", // Leave blank for user to pick new date
      date_end: "",
      assigned_guides: [],
      // Split inclusions/exclusions for dropdowns
      selectedInclusions: pkg.inclusions
        ? pkg.inclusions.split(",").map((i) => i.trim())
        : [],
      selectedExclusions: pkg.exclusions
        ? pkg.exclusions.split(",").map((i) => i.trim())
        : [],
      // Optionally, if you want to prefill with formatted old dates:
      // date_start: formatDate(pkg.date_start),
      // date_end: formatDate(pkg.date_end),
    });
    setShowAdd(true);
  };

  // Render

  const toSentenceCase = (str: string[]) => {
    return str
      .map((s) => s.trim())
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
      .join(", ");
  };
  const toTitleCase = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <p className="text-gray-600">Invalid tour operator ID.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-[700px] lg:max-w-4xl overflow-y-auto max-h-[90vh] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Duplicate Tour Package
            </DialogTitle>
          </DialogHeader>
          <AddTourPackage
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowAdd(false)}
            initialData={duplicateData}
          />
        </DialogContent>
      </Dialog>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Tour Packages
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and organize your tour offerings
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search packages..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button className="gap-2" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              New Package
            </Button>
          </div>

          {/* Tabs for filtering */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full md:w-fit grid-cols-3">
              <TabsTrigger value="all">All Packages</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="complete">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Dialog for Creating Tour Package */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[700px] lg:max-w-4xl overflow-y-auto max-h-[90vh] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                Create New Tour Package
              </DialogTitle>
            </DialogHeader>
            <AddTourPackage
              onSuccess={handleCreateSuccess}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog for Editing Tour Package */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[700px] lg:max-w-4xl overflow-y-auto max-h-[90vh] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                Edit Tour Package
              </DialogTitle>
            </DialogHeader>
            {editingPackage && (
              <EditTourPackage
                tourPackage={editingPackage}
                onSuccess={handleEditSuccess}
                onCancel={() => {
                  setEditDialogOpen(false);
                  setEditingPackage(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100 max-w-md mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-800">Loading Error</h3>
            <p className="mt-2 text-red-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
            >
              Retry
            </Button>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-white max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900">
              {searchTerm
                ? "No matching packages found"
                : "No tour packages yet"}
            </h3>
            <p className="mt-1 text-gray-500 mb-6">
              {searchTerm
                ? "Try a different search term"
                : "Create your first tour package to get started"}
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              Create Tour Package
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className="hover:shadow-lg transition-shadow duration-200 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-full"
              >
                <CardHeader className="">
                  <div className="flex flex-row items-center justify-between w-full">
                    <h3 className="font-semibold text-xl text-gray-900">
                      {pkg.package_name}
                    </h3>
                    <div className="flex justify-around items-center space-x-2">
                      <Badge
                        variant={
                          !pkg.is_active
                            ? "secondary"
                            : new Date(pkg.date_end) < new Date()
                            ? "secondary"
                            : "default"
                        }
                        className={`px-3 py-1  text-sm font-medium ${
                          !pkg.is_active
                            ? "bg-red-100 text-red-800"
                            : new Date(pkg.date_end) < new Date()
                            ? "bg-gray-200 text-gray-700"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {!pkg.is_active
                          ? "Inactive"
                          : new Date(pkg.date_end) < new Date()
                          ? "Completed"
                          : "Active"}
                      </Badge>
                      <Switch
                        checked={pkg.is_active}
                        onCheckedChange={async (checked) => {
                          await updateTourPackageStatus(pkg.id, checked);
                          await loadPackages();
                        }}
                        disabled={
                          new Date(pkg.date_end) < new Date() || pkg.hasBookings
                        }
                        className={`cursor-pointer ${
                          pkg.is_active
                            ? "bg-green-500 data-[state=checked]:bg-green-500"
                            : "bg-red-300 data-[state=unchecked]:bg-red-300"
                        }`}
                        aria-label="Toggle package status "
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{pkg.location}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {toTitleCase(pkg.description)}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">₱{pkg.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{pkg.duration_days} days</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>{pkg.available_slots} slots</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>
                        {format(new Date(pkg.date_start), "MMM d, yyyy")} -{" "}
                        {format(new Date(pkg.date_end), "MMM d, yyyy")}
                      </span>
                    </div>

                    <div className="flex flex-col items-start gap-2 text-sm bg-green-100 text-green-800 p-3 rounded-md min-h-16 ">
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="h-6 w-6 text-green-500" />
                        <span className="font-semibold">Inclusions</span>
                      </div>
                      <div className="overflow-y-scroll max-h-24">
                        <ul className="list-disc pl-5">
                          {pkg.inclusions.split(",").map((inc, idx) => (
                            <li key={idx}>{toSentenceCase([inc])}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 text-sm bg-red-100 text-red-800 p-3 rounded-md  min-h-16">
                      <div className="flex items-center gap-2">
                        <BadgeX className="h-6 w-6 text-red-500" />
                        <span className=" font-semibold">Exclusions</span>
                      </div>
                      <div className="overflow-y-scoll  max-h-24">
                        <ul className="list-disc pl-5">
                          {pkg.exclusions.split(",").map((exc, idx) => (
                            <li key={idx}>{toSentenceCase([exc])}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {pkg.assigned_guides.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Assigned Guides
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {pkg.assigned_guides.map((guide) => (
                            <div
                              key={guide.tourguide_id}
                              className="flex items-center gap-2"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={guide.profile_picture} />
                                <AvatarFallback>
                                  {guide.first_name.charAt(0)}
                                  {guide.last_name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {guide.first_name} {guide.last_name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-2 border-t pt-4">
                  <span className="text-xs text-gray-500">
                    Updated: <br />
                    {format(new Date(pkg.updated_at), "MMM d, yyyy")}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleDuplicate(pkg)}
                      className="cursor-pointer flex items-center gap-2"
                      title="Duplicate this package"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingPackage(pkg);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 " />
                      Edit
                    </Button>
                    <DeleteTourPackage
                      id={pkg.id}
                      onDeleted={loadPackages}
                      disabled={pkg.hasBookings}
                    />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
