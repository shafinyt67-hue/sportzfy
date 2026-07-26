import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1B2432] border border-[#2A3445]">
        <Icon size={28} className="text-gray-500" />
      </div>
      <p className="text-sm font-semibold text-white">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 max-w-[220px]">{subtitle}</p>}
    </div>
  );
}
