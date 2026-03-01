import { IconUser } from "../Icons";

interface ProfileAvatarProps {
  name: string;
}

export function ProfileAvatar({ name }: ProfileAvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="relative w-16 h-16 border border-white/[0.12] flex items-center justify-center bg-white/[0.03] shrink-0">
      {initials ? (
        <span
          className="[font-family:'Playfair_Display',serif] font-bold text-white/70 select-none"
          style={{ fontSize: 22 }}
        >
          {initials}
        </span>
      ) : (
        <span className="text-white/20">
          <IconUser size={22} />
        </span>
      )}
    </div>
  );
}
