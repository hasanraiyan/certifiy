"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Question, ExamConfig, Answer } from "@/lib/exam/types";

interface PracticeModeProps {
  sessionId: string;
  examConfig: ExamConfig;
  questions: Question[];
  onExamComplete?: (sessionId: string) => void;
}

export function PracticeMode({
  sessionId,
  examConfig,
  questions,
  onExamComplete
}: PracticeModeProps) {
  // Minimal placeholder implementation
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-2">Practice Mode</h2>
      <p className="text-muted-foreground">Practice mode is under construction.</p>
    </div>
  );
}

export default PracticeMode;
