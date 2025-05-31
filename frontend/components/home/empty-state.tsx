import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
  showButton?: boolean;
}

export function EmptyState({
  title,
  description,
  icon,
  buttonText,
  onClick,
  showButton = true,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="p-5 rounded-full mb-4">{icon}</div>
      <h3 className="text-white font-medium mb-1">{title}</h3>
      <p className="text-stone-500 text-sm max-w-[250px] mb-4">{description}</p>

      {showButton && (
        <Button
          onClick={onClick}
          className="bg-yellow-400 hover:bg-yellow-500 text-stone-900"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
