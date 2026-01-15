import { useEffect, useRef } from "react";

interface ErrorSummaryProps {
  errors: Record<string, string>;
}

export const ErrorSummary = ({ errors }: ErrorSummaryProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorCount = Object.keys(errors).length;

  useEffect(() => {
    if (errorCount > 0) {
      headingRef.current?.focus();
    }
  }, [errorCount]);

  if (errorCount === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm"
    >
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-red-800 font-bold text-lg mb-2 focus:outline-none"
      >
        Encontramos {errorCount} erro{errorCount !== 1 ? "s" : ""} no formulário
      </h2>
      <ul className="list-disc list-inside text-red-700">
        {Object.entries(errors).map(([field, message]) => (
          <li key={field}>
            <a
              href={`#${field}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(field)?.focus();
              }}
              className="underline hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1"
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
