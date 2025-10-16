import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, TrendingUp, Building2, CreditCard } from "lucide-react";

export const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await api.getReportById(id);
        setReport(res.data);
      } catch (err) {
        setError(err.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const formatCurrency = (amount) =>
    amount?.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  if (loading) return <Skeleton className="h-32 w-full" />;
  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  if (!report) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Credit Report Details
      </h1>

      {/* BASIC DETAILS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <User className="h-5 w-5 text-blue-500" /> Basic Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-semibold">{report.basicDetails.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">PAN</p>
            <p className="font-semibold">{report.basicDetails.pan}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mobile</p>
            <p className="font-semibold">{report.basicDetails.mobilePhone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Credit Score</p>
            <p
              className={`font-semibold ${
                report.basicDetails.creditScore >= 750
                  ? "text-green-600"
                  : report.basicDetails.creditScore >= 650
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {report.basicDetails.creditScore}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* REPORT SUMMARY */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="h-5 w-5 text-purple-500" /> Report Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
          <div>
            <p className="text-sm text-gray-500">Total Accounts</p>
            <p className="font-semibold">
              {report.reportSummary.totalAccounts}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Accounts</p>
            <p className="font-semibold">
              {report.reportSummary.activeAccounts}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Closed Accounts</p>
            <p className="font-semibold">
              {report.reportSummary.closedAccounts}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="font-semibold">
              {formatCurrency(report.reportSummary.currentBalanceAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Secured Accounts</p>
            <p className="font-semibold">
              {formatCurrency(report.reportSummary.securedAccountsAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Unsecured Accounts</p>
            <p className="font-semibold">
              {formatCurrency(report.reportSummary.unsecuredAccountsAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Credit Enquiries (Last 7 days)
            </p>
            <p className="font-semibold">
              {report.reportSummary.last7DaysCreditEnquiries}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CREDIT ACCOUNTS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Building2 className="h-5 w-5 text-green-500" /> Credit Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {report.creditAccounts.map((acc, index) => (
            <div
              key={acc._id || index}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-500" />{" "}
                  {acc.bankName.trim().toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500">
                  Acct: {acc.accountNumber}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
                <p>
                  <strong>Type:</strong> {acc.accountType}
                </p>
                <p>
                  <strong>Current Balance:</strong>{" "}
                  {formatCurrency(acc.currentBalance)}
                </p>
                <p>
                  <strong>Amount Overdue:</strong>{" "}
                  {formatCurrency(acc.amountOverdue || 0)}
                </p>
                <p className="col-span-2">
                  <strong>Address:</strong> {acc.address}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
