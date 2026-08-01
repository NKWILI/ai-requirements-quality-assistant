type Props = {
  className?: string;
  /** "document" = ARQA card mark, "check" = app quality mark. */
  variant?: "document" | "check";
};

/** Brand marks. The app header and the ARQA card use different variants so
 *  they don't look identical. */
export function BrandIcon({ className, variant = "document" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {variant === "check" ? (
        // Clipboard with a check — signals "quality / evaluation".
        <>
          <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z" />
          <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <path d="M9 14l2 2 4-4" />
        </>
      ) : (
        // Document with lines — the ARQA card mark.
        <>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h6" />
        </>
      )}
    </svg>
  );
}
