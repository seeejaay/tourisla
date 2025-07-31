import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
type GuideDocument = {
  id: string;
  document_type: string;
  file_path?: string;
  uploaded_at?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "REVOKED";
  tourguide_id?: string;
};

type OperatorDocument = {
  id?: string | number;
  document_type: string;
  file_path?: string;
  upload_date?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "REVOKED";
};

interface DocumentCardProps {
  doc: GuideDocument | OperatorDocument;
  docType: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  onEnlarge: (filePath: string) => void;
  onRevoke?: (id: string, reason: string) => void;
}

export function DocumentCard({
  doc,
  docType,
  onApprove,
  onReject,
  onEnlarge,
  onRevoke,
}: DocumentCardProps) {
  const { loggedInUser } = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<
    "APPROVE" | "REJECT" | "REVOKE" | null
  >(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [revocationReason, setRevocationReason] = useState("");

  const rejectionReasonSchema = z
    .string()
    .min(3, "Reason must be at least 3 characters")
    .max(200, "Reason too long");
  const revocationReasonSchema = z
    .string()
    .max(200, "Reason too long")
    .optional();
  const [rejectionError, setRejectionError] = useState("");
  const [revocationError, setRevocationError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const user = await loggedInUser(router, false);
      if (!user) {
        router.push("/auth/login");
      } else {
        setUserRole(user.data.user.role);
      }
    }
    fetchUser();
  }, [loggedInUser, router]);

  const handleAction = (action: "APPROVE" | "REJECT" | "REVOKE") => {
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (dialogAction === "REJECT") {
      const result = rejectionReasonSchema.safeParse(rejectionReason);
      if (!result.success) {
        setRejectionError(result.error.errors[0].message);
        return;
      }
      setRejectionError("");
      if (onReject) onReject(String(doc.id), rejectionReason);
    }
    if (dialogAction === "REVOKE") {
      const result = revocationReasonSchema.safeParse(revocationReason);
      if (!result.success) {
        setRevocationError(result.error.errors[0].message);
        return;
      }
      setRevocationError("");
      if (onRevoke) onRevoke(String(doc.id), revocationReason);
    }
    if (dialogAction === "APPROVE" && onApprove) onApprove(String(doc.id));
    setDialogOpen(false);
    setDialogAction(null);
    setRejectionReason("");
    setRevocationReason("");
  };

  return (
    <Card className="transtion-all duration-200 hover:shadow-md border-gray-200 rounded-xl overlow-hidden">
      <CardHeader className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{docType}</h3>
        {doc.status && (
          <Badge
            variant={
              doc.status.toLowerCase() === "approved"
                ? "default"
                : doc.status.toLowerCase() === "rejected"
                ? "destructive"
                : "secondary"
            }
            className={`text-xs capitalize
                ${
                  doc.status === "APPROVED"
                    ? "text-blue-600 bg-blue-100"
                    : doc.status === "REJECTED"
                    ? "text-red-600 bg-red-100"
                    : doc.status === "REVOKED"
                    ? "text-gray-600 bg-gray-100"
                    : "text-yellow-600 bg-yellow-100"
                }`}
          >
            {doc.status === "APPROVED"
              ? "Verified"
              : doc.status === "REJECTED"
              ? "Rejected"
              : doc.status === "REVOKED"
              ? "Revoked"
              : "Pending"}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          {doc.file_path ? (
            <button
              type="button"
              className="absolute inset-0 w-full h-full focus:outline-none"
              onClick={() => doc.file_path && onEnlarge(doc.file_path)}
            >
              <Image
                src={doc.file_path!}
                alt={docType}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                priority
                className="object-cover "
              />
              <div className="absolute inset-0  hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center cursor-pointer">
                <span className="bg-[#3e979f] bg-opacity-80 text-xs font-medium px-2 py-1 rounded-md shadow-sm text-white">
                  Click to enlarge
                </span>
              </div>
            </button>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              No preview available
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center ">
        {doc.status === "PENDING" ||
        (doc.status === "REVOKED" && userRole === "Tourism Officer") ? (
          <>
            <Button
              variant="outline"
              className="text-green-600 border-green-300 hover:bg-green-50"
              onClick={() => handleAction("APPROVE")}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => handleAction("REJECT")}
            >
              Reject
            </Button>
          </>
        ) : doc.status === "APPROVED" && userRole === "Tourism Officer" ? (
          <Button
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50 cursor-pointer hover:text-red-600"
            onClick={() => handleAction("REVOKE")}
          >
            Revoke
          </Button>
        ) : (
          ""
        )}

        {/* Unified Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogAction === "APPROVE" && "Approve Document"}
                {dialogAction === "REJECT" && "Reject Document"}
                {dialogAction === "REVOKE" && "Revoke Document"}
              </DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              {dialogAction === "APPROVE" && (
                <p>Are you sure you want to approve this document?</p>
              )}
              {dialogAction === "REJECT" && (
                <>
                  <p>Are you sure you want to reject this document?</p>
                  <Input
                    type="text"
                    placeholder="Reason for rejection"
                    className="mt-2"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    required
                  />
                  {rejectionError && (
                    <span className="text-xs text-red-500">
                      {rejectionError}
                    </span>
                  )}
                </>
              )}
              {dialogAction === "REVOKE" && (
                <>
                  <p>Are you sure you want to revoke this document?</p>
                  <Input
                    type="text"
                    placeholder="Reason for revocation (optional)"
                    className="mt-2"
                    value={revocationReason}
                    onChange={(e) => setRevocationReason(e.target.value)}
                  />
                  {revocationError && (
                    <span className="text-xs text-red-500">
                      {revocationError}
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className={
                  dialogAction === "APPROVE"
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
