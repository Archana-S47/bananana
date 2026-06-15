import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="page">
      <h1>Page not found</h1>
      <p className="muted">The route you requested does not exist.</p>
      <Link className="button" to="/">
        Go home
      </Link>
    </section>
  );
}

export default NotFound;
