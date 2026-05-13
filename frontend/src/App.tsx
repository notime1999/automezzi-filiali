import { Link, Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Automezzi & Filiali</h1>
          <nav className="mt-2 flex gap-6">
            <Link
              to="/filiali"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Filiali
            </Link>
            <Link
              to="/automezzi"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Automezzi
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default App