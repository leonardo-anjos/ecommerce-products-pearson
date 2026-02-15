/** RenderingBadge — reusable badge component indicating the rendering strategy */

interface RenderingBadgeProps {
  type: "SSR" | "SSG" | "CSR";
  description: string;
}

const config = {
  SSR: {
    color: "bg-blue-50 border-blue-200 text-blue-800",
    dot: "bg-blue-500",
    label: "Server-Side Rendering",
  },
  SSG: {
    color: "bg-purple-50 border-purple-200 text-purple-800",
    dot: "bg-purple-500",
    label: "Static Site Generation",
  },
  CSR: {
    color: "bg-green-50 border-green-200 text-green-800",
    dot: "bg-green-500",
    label: "Client-Side Rendering",
  },
};

export function RenderingBadge({ type, description }: RenderingBadgeProps) {
  const { color, dot, label } = config[type];
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${color}`}>
      <span className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
      <span className="font-bold">{type}</span>
      <span className="text-xs font-normal opacity-75">— {label}</span>
      <span className="hidden sm:inline text-xs font-normal opacity-60">| {description}</span>
    </div>
  );
}
