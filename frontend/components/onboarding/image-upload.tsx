import React, { useRef } from "react";
import { Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ImageUploadProps {
  preview: string | null;
  onImageChange: (file: File) => void;
  onRemove: () => void;
  placeholder: React.ReactNode;
  description: string;
}

export default function ImageUpload({
  preview,
  onImageChange,
  onRemove,
  placeholder,
  description,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageChange(file);
  };

  return (
    <div className="flex flex-col items-center space-y-3 pb-4">
      <div className="relative">
        {preview ? (
          <div className="relative">
            <Avatar className="w-24 h-24 border-2 border-yellow-400">
              <AvatarImage src={preview} alt="Preview" />
              <AvatarFallback className="bg-stone-700">
                {placeholder}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 bg-stone-700 border border-stone-600"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full bg-stone-700 flex items-center justify-center border-2 border-dashed border-stone-600 cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-stone-500" />
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 bg-yellow-400 hover:bg-yellow-500"
              onClick={() => inputRef.current?.click()}
            >
              <Plus className="h-4 w-4 text-stone-900" />
            </Button>
          </div>
        )}
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}
