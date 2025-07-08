import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex gap-4 text-blue-600 font-semibold">
      <Link to="/">Home</Link>
      <Link to="/blogs">Blogs</Link>
      <Link to="/write">Write</Link>
    </nav>
  );
}
