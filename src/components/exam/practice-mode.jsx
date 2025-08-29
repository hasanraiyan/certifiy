"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function PracticeMode({
  sessionId,
  examConfig,
  questions,
  onExamComplete
}) {
  // Minimal placeholder implementation
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-2">Practice Mode</h2>
      <p className="text-muted-foreground">Practice mode is under construction.</p>
    </div>
  );
}

export default PracticeMode;