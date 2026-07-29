import { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Panel({
  children,
  className = "",
  hover = true,
}: PanelProps) {
  return (
    <section
      className={`
        rounded-[28px]
        bg-white
        p-7
        shadow-sm
        transition-all
        duration-300
        ${
          hover
            ? "hover:-translate-y-1 hover:shadow-xl"
            : ""
        }
        ${className}
      `}
    >
      {children}
    </section>
  );
}