"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";
import { toast } from "sonner";

interface AnalyzeButtonProps {
  sessionId: string;
  transcript: string;
}

export function AnalyzeButton({ sessionId, transcript }: AnalyzeButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAnalyze() {
    if (!transcript.trim()) {
      toast.error("Transcript is empty. Nothing to analyze.");
      return;
    }

    setLoading(true);
    const promise = fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, transcript }),
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to analyze");
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: "Analyzing transcript with OpenAI...",
      success: (data) => {
        router.refresh();
        return `Extracted ${data.count} entities successfully!`;
      },
      error: (err) => err.message,
    });

    try {
      await promise;
    } catch {
      // Error is handled by toast.promise
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleAnalyze} disabled={loading} className="gap-2">
      <BrainCircuit className="w-4 h-4" />
      {loading ? "Analyzing..." : "Analyze Transcript"}
    </Button>
  );
}
