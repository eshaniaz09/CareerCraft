'use client';
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

export function TailorCVDialog({ cvData, onTailored }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobTitle.trim() || !jobDescription.trim()) {
      toast.error("Please fill in both fields");
      return;
    }

    setLoading(true);

    const photo = cvData?.basicInfo?.photo;
    if (photo) delete cvData.basicInfo.photo;

    try {
      const response = await fetch("/api/tailor-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          jobDescription,
          cvData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data?.output;
      if (!content) throw new Error("Empty response from Gemini API");

      // Extract JSON from markdown code block
      let jsonMatch = content.match(/```json\n([\s\S]*)\n```/);
      let jsonStr = jsonMatch ? jsonMatch[1] : content;

      if (jsonStr.startsWith("```") && jsonStr.endsWith("```")) {
        jsonStr = jsonStr.slice(3, -3);
      }

      let tailoredCV = JSON.parse(jsonStr);

      // Remove markdown formatting (**text** or *text*) from all string values
      const removeMarkdown = (obj) => {
        if (typeof obj === "string") {
          return obj.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
        } else if (Array.isArray(obj)) {
          return obj.map(removeMarkdown);
        } else if (obj !== null && typeof obj === "object") {
          return Object.keys(obj).reduce((acc, key) => {
            acc[key] = removeMarkdown(obj[key]);
            return acc;
          }, {});
        }
        return obj;
      };

      tailoredCV = removeMarkdown(tailoredCV);

      if (photo) tailoredCV.basicInfo.photo = photo;

      onTailored(tailoredCV);
      toast.success("CV successfully tailored!");
      setOpen(false);
    } catch (error) {
      console.error("CV Tailoring error:", error);
      const message = error instanceof Error ? error.message : "Gemini failed. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2 hover:text-gray-600">
          <Wand2 className="h-4 w-4" />
          Tailor for Job Description
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tailor Your CV</DialogTitle>
          {/* <DialogDescription>Uses free Google Gemini AI</DialogDescription> */}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label className="mb-2">Job Title</Label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          </div>

          <div>
            <Label className="mb-2">Job Description</Label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tailoring...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Tailor CV
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}