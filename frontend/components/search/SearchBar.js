import { useState } from 'react';
import { useRouter } from 'next/router';
import { HiSearch, HiCalendar, HiUsers } from 'react-icons/hi';

export default function SearchBar({ className = '' }) {
  const router = useRouter();
  const [query,   setQuery   ] = useState('');
  const [date,    setDate    ] = useState('');
  const [guests,  setGuests  ] = useState(2);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query)  params.set('search', query);
    if (date)   params.set('date', date);
    if (guests) params.set('guests', guests);
    router.push(`/tours?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2 ${className}`}
    >
      {/* Destination/keyword */}
      <div className="flex items-center gap-3 flex-1 px-3 py-2">
        <HiSearch className="w-5 h-5 text-primary-500 flex-shrink-0" />
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-0.5">Where to?</label>
          <input
            type="text"
            placeholder="Destination, tour, or activity..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-dark placeholder-gray-400 outline-none bg-transparent"
          />
        </div>
      </div>

      <div className="hidden md:block w-px bg-gray-100" />

      {/* Date */}
      <div className="flex items-center gap-3 px-3 py-2 md:min-w-[160px]">
        <HiCalendar className="w-5 h-5 text-primary-500 flex-shrink-0" />
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-0.5">When?</label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm text-dark outline-none bg-transparent cursor-pointer"
          />
        </div>
      </div>

      <div className="hidden md:block w-px bg-gray-100" />

      {/* Guests */}
      <div className="flex items-center gap-3 px-3 py-2 md:min-w-[130px]">
        <HiUsers className="w-5 h-5 text-primary-500 flex-shrink-0" />
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-0.5">Travelers</label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))}
              className="w-5 h-5 rounded-full bg-gray-100 text-dark hover:bg-primary-100 flex items-center justify-center text-xs font-bold">−</button>
            <span className="text-sm font-semibold text-dark w-4 text-center">{guests}</span>
            <button type="button" onClick={() => setGuests(Math.min(50, guests + 1))}
              className="w-5 h-5 rounded-full bg-gray-100 text-dark hover:bg-primary-100 flex items-center justify-center text-xs font-bold">+</button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button type="submit" className="btn-primary rounded-xl md:rounded-xl w-full md:w-auto px-8">
        <HiSearch className="w-5 h-5" />
        <span>Search</span>
      </button>
    </form>
  );
}
