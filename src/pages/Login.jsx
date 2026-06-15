function Login() {
  return (
    <section className="page">
      <div className="page-card">
        <h1>Login</h1>
        <form className="form-stack">
          <label className="form-field">
            Email
            <input type="email" name="email" placeholder="student@campus.edu" />
          </label>
          <label className="form-field">
            Password
            <input type="password" name="password" placeholder="Password" />
          </label>
          <button className="button" type="button">
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
