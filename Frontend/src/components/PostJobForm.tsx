import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Job } from "@/components/JobCard";

interface PostJobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onJobPosted: (job: Job) => void;
}

const PostJobForm: React.FC<PostJobFormProps> = ({ isOpen, onClose, onJobPosted }) => {
  const [formData, setFormData] = useState<Partial<Job>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/api/jobs/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to post job");

      const newJob = await res.json();
      onJobPosted(newJob); // update frontend
      onClose(); // close modal
    } catch (err) {
      console.error("Error posting job:", err);
      alert("Error posting job");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post a Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="title" placeholder="Job Title" onChange={handleChange} required />
          <Input name="company" placeholder="Company" onChange={handleChange} required />
          <Input name="location" placeholder="Location" onChange={handleChange} required />
          <Input name="salary" placeholder="Salary" onChange={handleChange} />
          <Input name="type" placeholder="Type (full-time/part-time/...)" onChange={handleChange} required />
          <Input name="experience" placeholder="Experience (e.g. 3+ years)" onChange={handleChange} required />
          <Textarea name="description" placeholder="Job Description" onChange={handleChange} required />
          <Input name="skills" placeholder="Skills (comma separated)" onChange={handleChange} />

          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostJobForm;
