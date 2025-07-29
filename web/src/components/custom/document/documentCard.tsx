import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type GuideDocument = {
  id: string;
  document_type: string;
  file_path?: string;
  uploaded_at?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  tourguide_id?: string;
};

type OperatorDocument = {
  id?: string | number;
  document_type: string;
  file_path?: string;
  upload_date?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
};

interface DocumentCardProps {
  doc: GuideDocument | OperatorDocument;
  docType: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onEnlarge: (filePath: string) => void;
}

export function DocumentCard({
  doc,
  docType,
  onApprove,
  onReject,
  onEnlarge,
}: DocumentCardProps) {
  const { loggedInUser } = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
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
                    : "text-yellow-600 bg-yellow-100"
                }`}
          >
            {doc.status === "APPROVED"
              ? "Verified"
              : doc.status === "REJECTED"
              ? "Rejected"
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
        {doc.status === "PENDING" && userRole === "Tourism Officer" ? (
          <>
            <Button
              variant="outline"
              className="text-green-600 border-green-300 hover:bg-green-50"
              onClick={() => onApprove && onApprove(String(doc.id))}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => onReject && onReject(String(doc.id))}
            >
              Reject
            </Button>
          </>
        ) : (
          ""
        )}
      </CardFooter>
    </Card>
  );
}
