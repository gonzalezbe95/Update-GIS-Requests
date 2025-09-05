import React, { useState } from "react";
import "../../styles.css";
import config from "../../config";

// Function to submit form data to the backend
const submitFormData = async (data: any) => {
  try {
    console.log("Submitting data to server:", data);
    const response = await fetch(`${config.apiBaseUrl}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "same-origin",
      mode: "cors",
    });

    if (response.ok) {
      console.log("Data successfully sent to server");
      return { success: true };
    } else {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }
  } catch (error: any) {
    console.error("Error submitting data:", error);
    return { success: false, error: error.message };
  }
};

const GISRequestForm = () => {
  const [formData, setFormData] = useState({
    requestBy: "",
    requestTitle: "",
    importance: "",
    department: "Realty & Trust Services",
    dateRequested: "",
    dateDue: "",
    sensitiveData: "",
    requestDetails: "",
  });

  const [errors, setErrors] = useState({
    requestBy: "",
    requestTitle: "",
    importance: "",
  });

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.requestBy) newErrors.requestBy = "Requested By is required";
    if (!formData.requestTitle)
      newErrors.requestTitle = "Request Title is required";
    if (!formData.importance) newErrors.importance = "Importance is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await submitFormData(formData);

      if (result.success) {
        alert("Request submitted successfully!");
        setFormData({
          requestBy: "",
          requestTitle: "",
          importance: "",
          department: "Realty & Trust Services",
          dateRequested: "",
          dateDue: "",
          sensitiveData: "",
          requestDetails: "",
        });
      } else {
        console.error("Server error:", result.error);
        alert(`Submission failed: ${result.error}`);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(`An error occurred while submitting the request: ${error.message}`);
    }
  };

  return (
    <div className="widget-demo jimu-widget m-2 scrollable-form-container">
      <h2 style={{ textAlign: "center" }}>GIS Request Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="requestBy">Requested By:</label>
          <input
            type="text"
            id="requestBy"
            name="requestBy"
            value={formData.requestBy}
            onChange={handleInputChange}
          />
          {errors.requestBy && (
            <span style={{ color: "red" }}>{errors.requestBy}</span>
          )}
        </div>

        <div>
          <label htmlFor="requestTitle">Request Title:</label>
          <input
            type="text"
            id="requestTitle"
            name="requestTitle"
            value={formData.requestTitle}
            onChange={handleInputChange}
          />
          {errors.requestTitle && (
            <span style={{ color: "red" }}>{errors.requestTitle}</span>
          )}
        </div>

        <div>
          <label htmlFor="importance">Importance:</label>
          <select
            id="importance"
            name="importance"
            value={formData.importance}
            onChange={handleInputChange}
          >
            <option value="">Select Importance</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          {errors.importance && (
            <span style={{ color: "red" }}>{errors.importance}</span>
          )}
        </div>

        <div>
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="dateRequested">Date Requested:</label>
          <input
            type="date"
            id="dateRequested"
            name="dateRequested"
            value={formData.dateRequested}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="dateDue">Due Date:</label>
          <input
            type="date"
            id="dateDue"
            name="dateDue"
            value={formData.dateDue}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="sensitiveData">Sensitive Data:</label>
          <select
            id="sensitiveData"
            name="sensitiveData"
            value={formData.sensitiveData}
            onChange={handleInputChange}
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label htmlFor="requestDetails">Request Details:</label>
          <textarea
            id="requestDetails"
            name="requestDetails"
            value={formData.requestDetails}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default GISRequestForm;
