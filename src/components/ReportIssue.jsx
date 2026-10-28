
import { useState } from "react";
import { createIssue } from "../services/api";

const initialForm = {
  title: "",
  description: "",
  category: "road",
  location: "",
};

function ReportIssue({ onCreated }) {
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      await createIssue(formData);

      setSuccess(true);
      setMessage("Issue reported successfully!");
      setFormData(initialForm);

      if (onCreated) {
        await onCreated();
      }
    } catch (error) {
      setMessage(error.message || "Unable to report this issue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-card">
      <h2>Report a Community Issue</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="issue-title">Issue title</label>
        <input
          id="issue-title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Broken street light"
          required
        />

        <label htmlFor="issue-description">Description</label>
        <textarea
          id="issue-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the problem..."
          rows={4}
          required
        />

        <label htmlFor="issue-category">Category</label>
        <select
          id="issue-category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="road">Road</option>
          <option value="electricity">Electricity</option>
          <option value="water">Water</option>
          <option value="waste">Waste</option>
          <option value="security">Security</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </select>

        <label htmlFor="issue-location">Location</label>
        <input
          id="issue-location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="City, neighbourhood or street"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Issue"}
        </button>
      </form>

      {message && (
        <p role="status" aria-live="polite">
          {message}
        </p>
      )}
    </section>
  );
}

export default ReportIssue;
