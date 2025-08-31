import React, { useState } from "react";

const JobMaterials = () => {
  const [material, setMaterial] = useState({
    name: "",
    quantity: "",
    cost: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterial((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Job Material Submitted:", material);

    try {
      const response = await fetch("/api/job-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(material)
      });

      if (response.ok) {
        alert("Job material added successfully!");
        setMaterial({ name: "", quantity: "", cost: "" });
      } else {
        alert("Failed to add material. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add Job Material</h2>

      <div className="mb-3">
        <label className="block mb-1">Material Name</label>
        <input
          type="text"
          name="name"
          value={material.name}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={material.quantity}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1">Cost</label>
        <input
          type="number"
          name="cost"
          value={material.cost}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit
      </button>
    </form>
  );
};

export default JobMaterials;
