"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { LANGUAGES, type Language } from "@/lib/constants/languages";
import { Button } from "./button";
import { Select } from "./select";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const options = Object.entries(LANGUAGES).map(([key, label]) => ({
    value: key as Language,
    label
  }));

  return (
    <div className="flex items-center w-full">
      <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
      <Select
        value={language}
        onChange={setLanguage}
        options={options}
        className="w-full"
      />
    </div>
  );
} 