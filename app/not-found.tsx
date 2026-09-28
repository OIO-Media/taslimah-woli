import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#eeefef] text-[#18191b] flex flex-col items-center justify-center p-6 text-center select-none selection:bg-[#18191b] selection:text-[#eeefef]">
      <div className="space-y-4 max-w-md">
        <span className="text-xs font-sans-clean uppercase tracking-[0.3em] text-[#8c8e90] block">
          404 · PAGE NOT FOUND
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl uppercase tracking-wider text-[#18191b] font-light">
          FRAME UNRESOLVED
        </h1>
        <p className="text-[#3e4143] font-serif-luxury text-sm sm:text-base leading-relaxed">
          The requested monograph or portfolio panel could not be located in the archive.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#18191b] text-[#eeefef] font-semibold text-xs tracking-widest uppercase font-sans-clean hover:bg-[#3e4143] transition-colors"
          >
            RETURN TO PORTFOLIO
          </Link>
        </div>
      </div>
    </div>
  );
}
