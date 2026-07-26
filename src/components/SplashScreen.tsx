import Logo from "./Logo";

export default function SplashScreen({ fadeOut }: { fadeOut: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#111827] transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="animate-fadein flex flex-col items-center gap-5">
        <Logo size={92} />
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Sport<span className="text-[#00BCD4]">zfy</span>
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-400">Live Sports. Anytime, Anywhere.</p>
        </div>
      </div>
      <div className="absolute bottom-14 flex flex-col items-center gap-2">
        <div className="h-1 w-28 overflow-hidden rounded-full bg-[#1B2432]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#00BCD4]" />
        </div>
        <span className="text-[11px] font-medium tracking-wide text-gray-500">LOADING</span>
      </div>
    </div>
  );
}
