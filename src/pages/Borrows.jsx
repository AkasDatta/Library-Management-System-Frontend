import { useEffect, useState } from "react";
import { getBooks, getMembers, getBorrows, issueBook, returnBook } from "../api";

export default function Borrows() {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("borrowed"); // borrowed | returned | all
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ book_id: "", member_id: "", due_date: "" });

  const loadAll = async (status = filter) => {
    setLoading(true);
    setError("");
    try {
      const [borrowsData, booksData, membersData] = await Promise.all([
        getBorrows(status === "all" ? "" : status),
        getBooks(),
        getMembers(),
      ]);
      setBorrows(borrowsData);
      setBooks(booksData);
      setMembers(membersData);
    } catch (err) {
      setError("Could not load data. Is the backend running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleIssue = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.book_id || !form.member_id) {
      setError("Please select both a book and a member");
      return;
    }
    try {
      await issueBook(form);
      setForm({ book_id: "", member_id: "", due_date: "" });
      loadAll(filter);
    } catch (err) {
      setError(err.response?.data?.error || "Could not issue this book");
    }
  };

  const handleReturn = async (id) => {
    try {
      await returnBook(id);
      loadAll(filter);
    } catch (err) {
      alert(err.response?.data?.error || "Could not process the return");
    }
  };

  const availableBooks = books.filter((b) => b.available > 0);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Issue form */}
      <div className="md:col-span-1">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-700">Issue a Book</h2>
          <form onSubmit={handleIssue} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Book</label>
              <select
                value={form.book_id}
                onChange={(e) => setForm({ ...form, book_id: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select a book...</option>
                {availableBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.available} available)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Member</label>
              <select
                value={form.member_id}
                onChange={(e) => setForm({ ...form, member_id: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select a member...</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Due Date (optional)
              </label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Issue Book
            </button>
          </form>
          {error && (
            <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}
          {members.length === 0 && (
            <p className="mt-3 text-xs text-gray-400">
              Add a member first from the Members tab to issue books.
            </p>
          )}
        </div>
      </div>

      {/* Borrow records */}
      <div className="md:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">Borrow Records</h2>
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-xs">
            {["borrowed", "returned", "all"].map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-md px-3 py-1 font-medium capitalize ${
                  filter === key ? "bg-white shadow-sm text-indigo-700" : "text-gray-500"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Book</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Member</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Due</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : borrows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-400">
                    No records found.
                  </td>
                </tr>
              ) : (
                borrows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{r.book_title}</td>
                    <td className="px-4 py-3">{r.member_name}</td>
                    <td className="px-4 py-3 text-gray-500">{r.due_date || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          r.status === "borrowed"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {r.status === "borrowed" ? (
                        <button
                          onClick={() => handleReturn(r.id)}
                          className="font-medium text-indigo-600 hover:underline"
                        >
                          Mark Returned
                        </button>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
