import { Link, Outlet } from 'react-router-dom'

function App() {
  return (
    <div>
      <header style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
        <h1>Automezzi & Filiali</h1>
        <nav>
          <Link to="/filiali" style={{ marginRight: '10px' }}>Filiali</Link>
          <Link to="/automezzi">Automezzi</Link>
        </nav>
      </header>
      <main style={{ padding: '10px' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default App