export const loginPage = () =>
  `<div class="body-login">
  <form class="login-form" action="./" method="POST">
    <div class="login-form__logo-container">
      <img class="login-form__logo" src="../images/logo.png" alt="Logo" />
    </div>
    <div class="login-form__content">
      <form id="form">
        <div class="login-form__header">Login to your account</div>
        <input
          id="username"
          class="login-form__input"
          type="text"
          name="dc_username"
          placeholder="Username"
        />
        <input
          id="password"
          class="login-form__input"
          type="password"
          name="dc_username"
          placeholder="Password"
        />
        <button
          id="login-button"
          class="login-form__button__login"
          type="submit"
        >
          Login
        </button>
        <div class="login-form__links">
          <a class="login-form__link" href="./">Forgot your password?</a>
        </div>
      </form>
    </div>
  </form>
</div>

`;