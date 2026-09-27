const tabs = [
  { key: "books", label: "📚 Books" },
  { key: "members", label: "👥 Members" },
  { key: "borrows", label: "🔄 Borrow / Return" },
];

export default function Navbar({ active, onChange }) {
  return (
    <header className="bg-indigo-700 text-white shadow">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <h1 className="mb-3 text-xl font-bold tracking-tight">📖 Library Management System</h1>
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                active === tab.key
                  ? "bg-white text-indigo-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
