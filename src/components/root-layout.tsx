"use client";

import * as React from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { ToastProvider, Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/ui/footer";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="college-schedule-theme">
      <LanguageProvider defaultLanguage="en" storageKey="college-schedule-language">
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
} 