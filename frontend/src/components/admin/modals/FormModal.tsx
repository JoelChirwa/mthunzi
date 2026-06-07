"use client";

import { FormEvent, ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

type FormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  submitText?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
};

export default function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitText = "Save",
  onSubmit,
  loading = false,
}: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.(event);
          }}
          className="space-y-4 py-4"
        >
          {children}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {onSubmit && (
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-700 hover:bg-green-800"
              >
                {loading ? "Saving..." : submitText}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
