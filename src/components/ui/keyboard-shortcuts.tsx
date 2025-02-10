"use client";

import * as React from "react";
import { Command } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({
  shortcuts,
  isOpen,
  onClose,
}: KeyboardShortcutsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-4 w-4" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between pb-4 last:mb-0 last:pb-0"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                {shortcut.ctrlKey && <span>Ctrl</span>}
                {shortcut.ctrlKey && shortcut.key && <span>+</span>}
                {shortcut.shiftKey && <span>Shift</span>}
                {shortcut.shiftKey && shortcut.key && <span>+</span>}
                {shortcut.altKey && <span>Alt</span>}
                {shortcut.altKey && shortcut.key && <span>+</span>}
                {shortcut.key && (
                  <span>{shortcut.key.toUpperCase()}</span>
                )}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 