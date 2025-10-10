export function LeafDecoration({
  position = "top-left",
}: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  }

  return (
    <div className={`absolute ${positionClasses[position]} pointer-events-none opacity-20 w-32 h-32 -z-10`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M50 150C50 150 70 120 90 110C110 100 130 95 140 80C150 65 155 40 155 40C155 40 145 60 135 75C125 90 110 100 95 105C80 110 60 120 50 150Z"
          fill="currentColor"
          className="text-primary"
        />
        <path
          d="M60 140C60 140 75 115 90 105C105 95 120 92 128 80C136 68 140 50 140 50C140 50 132 65 124 77C116 89 105 97 92 102C79 107 65 115 60 140Z"
          fill="currentColor"
          className="text-accent"
        />
      </svg>
    </div>
  )
}
