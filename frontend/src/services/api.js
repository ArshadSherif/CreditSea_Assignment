
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = {
  async getAllReports() {
    const response = await fetch(`${API_BASE_URL}/reports`);
    if (!response.ok) throw new Error("Failed to fetch reports");
    return response.json();
  },
  async getReportById(id) {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`);
    if (!response.ok) throw new Error("Failed to fetch report");
    return response.json();
  },

  async uploadXML(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData, 
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload XML file");
    }

    return response.json();
  },
};
