import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Calendar } from "lucide-react";
import { api } from "../services/api";
import { Button } from "@/components/ui/button";

export const AllReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await api.getAllReports();
        setReports(res.data || []);
      } catch (err) {
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getCreditScoreColor = (score) => {
    if (score >= 750) return "text-green-600 bg-green-50";
    if (score >= 650) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 space-y-4 animate-pulse">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (reports.length === 0) {
    return (
      <p className="text-center mt-12 text-gray-600 text-lg">
        No reports found. Upload your first report!
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-5">
      {reports.map((report) => (
        <Card
          key={report._id}
          className="p-4 cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
          onClick={() => navigate(`/report/${report._id}`)}
        >
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              {report.basicDetails.name}
            </CardTitle>
            <span
              className={`px-2 py-1 rounded-full text-sm font-semibold ${getCreditScoreColor(
                report.basicDetails.creditScore
              )}`}
            >
              {report.basicDetails.creditScore}
            </span>
          </CardHeader>

          <CardContent className="space-y-2 text-gray-700">
            <p>
              <strong>PAN:</strong> {report.basicDetails.pan}
            </p>
            <p>
              <strong>Mobile:</strong> {report.basicDetails.mobilePhone}
            </p>
            <p>
              <strong>Total Accounts:</strong>{" "}
              {report.reportSummary.totalAccounts}
            </p>
            <p className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-gray-400" />{" "}
              {new Date(report.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </CardContent>

          <CardFooter className="pt-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(`/report/${report._id}`)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
