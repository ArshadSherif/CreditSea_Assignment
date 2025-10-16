import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { api } from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const UploadXML = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [reportId, setReportId] = useState(null);


  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.type === "text/xml" || file.name.endsWith(".xml")) {
        setSelectedFile(file);
        setUploadError(null);
        setUploadSuccess(false);
      } else {
        setUploadError("Please select a valid XML file");
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(false);

      const response = await api.uploadXML(selectedFile);

      if (response && response.message === "XML uploaded and data saved successfully!") {
        setUploadSuccess(true);
        setReportId(response.reportId || null);
        setSelectedFile(null);
        const fileInput = document.getElementById("file-upload");
        if (fileInput) fileInput.value = "";
      } else {
        setUploadError((response && response.message) || "Upload failed");
      }
    } catch (err) {
      setUploadError(
        err && err.message ? err.message : "Failed to upload file"
      );
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Upload Credit Report
        </h1>
        <p className="mt-2 text-gray-600">
          Upload an XML file containing credit report data
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>XML File Upload</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Select and upload your credit report XML file
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File input */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Choose a file
                </span>
                <span className="text-gray-600"> or drag and drop</span>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xml,text/xml"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="mt-2 text-sm text-gray-500">XML files only</p>
            </div>

            {/* Selected file preview */}
            {selectedFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload error */}
            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      Upload Failed
                    </h3>
                    <p className="mt-1 text-sm text-red-700">{uploadError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload success */}
            {uploadSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-green-800">
                      Upload Successful
                    </h3>
                    <p className="mt-1 text-sm text-green-700">
                      Your credit report has been processed successfully
                    </p>
                    {reportId && (
                      <Button
                        variant="link"
                        size="sm"
                        className="mt-2 p-0"
                        onClick={() => navigate(`/report/${reportId}`)}
                      >
                        View Report Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={!selectedFile || uploading}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <Upload className="h-5 w-5" />
                <span>{uploading ? "Uploading..." : "Upload File"}</span>
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Cancel
              </Button>
            </div>
          </form>

          {/* Upload requirements */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Upload Requirements
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>File must be in XML format</li>
              <li>File should contain valid credit report data</li>
              <li>Maximum file size: 10 MB</li>
              <li>Ensure the XML structure matches the expected format</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
