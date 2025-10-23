"use client";

import { cn } from "@/lib/utils";
import * as RadixSelect from "@radix-ui/react-select";
import * as React from "react";

export interface SelectProps
  extends React.ComponentPropsWithoutRef<typeof RadixSelect.Root> {
  children: React.ReactNode;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export function Select({
  children,
  className,
  placeholder,
  disabled,
  id,
  ...props
}: SelectProps) {
  return (
    <RadixSelect.Root disabled={disabled} {...props}>
      <RadixSelect.Trigger
        id={id}
        className={cn(
          "w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm shadow-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          className
        )}
        aria-label={placeholder}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <svg
            className="ml-2 h-4 w-4 opacity-60"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          sideOffset={4}
          position="popper"
          className="w-[var(--radix-select-trigger-width)] min-w-[220px] bg-background border rounded-md shadow-lg p-1 z-50"
        >
          <RadixSelect.Viewport>{children}</RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

Select.Item = function SelectItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixSelect.Item>) {
  return (
    <RadixSelect.Item
      className={cn(
        "px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-accent focus:bg-accent focus:outline-none",
        className
      )}
      {...props}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
};
