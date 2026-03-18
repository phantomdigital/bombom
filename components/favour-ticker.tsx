'use client';

const TICKER_ITEMS = ['Frozen Yoghurt', 'Soft Serve', 'Ice Cream'];
const SEPARATOR = ' • ';

function TickerContent() {
  const text = TICKER_ITEMS.join(SEPARATOR) + SEPARATOR;
  const repeated = text.repeat(12); // Enough for seamless loop

  return (
    <span className="font-sans text-base sm:text-lg font-medium uppercase tracking-wider whitespace-nowrap text-bom-white">
      {repeated}
    </span>
  );
}

export default function FavourTicker() {
  return (
    <div
      className="w-full overflow-hidden py-3 sm:py-4 bg-bom-black"
      aria-hidden
    >
      <div className="animate-ticker-marquee flex w-max">
        <TickerContent />
        <TickerContent />
      </div>
    </div>
  );
}
