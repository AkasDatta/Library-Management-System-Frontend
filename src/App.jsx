import { useState } from "react";
import Navbar from "./components/Navbar";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Borrows from "./pages/Borrows";

export default function App() {
  const [tab, setTab] = useState("books");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar active={tab} onChange={setTab} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {tab === "books" && <Books />}
        {tab === "members" && <Members />}
        {tab === "borrows" && <Borrows />}
      </main>
    </div>
  );
}
