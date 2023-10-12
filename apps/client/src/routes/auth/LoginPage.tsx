import { SubmitHandler, useForm } from "react-hook-form";
import { treaty } from "@nutrishare/libs";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";

type LoginForm = {
  login: string;
  password: string;
};

const LoginPage = () => {
  const { setAccessToken } = useAuthContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<LoginForm>();
  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const res = await treaty.api.auth.local.login.post(data);
    if (res.status !== 201 || res.data === null) {
      // TODO: Better error handling
      console.log("Error logging in");
      return;
    }

    setAccessToken(res.data.accessToken);
    navigate("/auth/success");
  };

  return (
    <>
      <h1>Log In</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-inputs">
          <div className="form-input">
            <label htmlFor="login:login">Username or Email</label>
            <input
              id="login:login"
              {...register("login", { required: true })}
            />
            {formErrors.login && (
              <span>Please enter your username or email</span>
            )}
          </div>

          <div className="form-input">
            <label htmlFor="login:password">Password</label>
            <input
              id="login:password"
              type="password"
              {...register("password", { required: true })}
            />
            {formErrors.password && <span>Please enter your password</span>}
          </div>

          <input type="submit" value="Log In" />
        </div>
      </form>

      <h2>Sign in via an external service</h2>
      <div className="external-auth">
        <a href={import.meta.env.VITE_GOOGLE_AUTHORIZE_URL}>
          <button type="button">Continue with Google</button>
        </a>
        <a href={import.meta.env.VITE_GITHUB_AUTHORIZE_URL}>
          <button type="button">Continue with GitHub</button>
        </a>
      </div>

      <h2>Don't have an account yet?</h2>
      <Link to="/auth/register">
        <button type="button">Register</button>
      </Link>
    </>
  );
};

export default LoginPage;
