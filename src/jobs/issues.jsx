import React, { useState } from "react";
import { MdDescription } from "react-icons/md";

const ReportIssue = () => {
  const [issue, setIssue] = useState({
    title: "",
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssue((prevIssue) => ({
      ...prevIssue,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("report submitted:", issue);

    try {
      const response = await fetch("/api/report-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(issue)
      });

      if (response.ok) {
        alert("Issue reported successfully!");
        setIssue({ title: "", description: "" });
      } else {
        alert("Failed to report issue. Please try again.");
      }
    } catch (error) {
      console.error("Error reporting issue:", error);
      alert("An error occurred while reporting the issue. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md shadow-md">
      <div className="mb-4">
        <label className="block mb-2 font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={issue.title}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          placeholder="Enter issue title"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium flex items-center">
          <MdDescription className="mr-2" /> Description
        </label>
        <textarea
          name="description"
          value={issue.description}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          placeholder="Enter issue description"
          rows="4"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default ReportIssue;
