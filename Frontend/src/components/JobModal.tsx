import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Job } from "@/components/JobCard";

interface JobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ job, isOpen, onClose }) => {
  const [resume, setResume] = useState("");

  if (!job) return null;

  const handleApply = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/applications/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          userId: "demo-user", // 🔹 replace later with logged-in user ID
          resume: resume,
        }),
      });

      if (!res.ok) throw new Error("Application failed");

      const data = await res.json();
      alert(`Application submitted for ${job.title}!`);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error submitting application");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{job.company} — {job.location}</p>
          <p className="text-sm">{job.description}</p>
          <p className="text-sm"><strong>Skills:</strong> {job.skills.join(", ")}</p>

          {/* Resume / Application Box */}
          <Textarea
            placeholder="Paste your resume or cover letter here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            rows={5}
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button className="btn-primary" onClick={handleApply}>Apply Now</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobModal;
