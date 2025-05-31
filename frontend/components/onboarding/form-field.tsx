import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  placeholder: string;
  type?: string;
  required?: boolean;
}

export default function FormField({
  id,
  name,
  label,
  value,
  onChange,
  icon: Icon,
  placeholder,
  type = "text",
  required = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-300 text-sm">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="w-full bg-stone-800 border-stone-700 rounded-xl py-6 pl-10 text-white focus-visible:ring-yellow-400 placeholder:text-gray-400"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
