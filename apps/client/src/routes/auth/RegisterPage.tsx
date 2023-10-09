import { SubmitHandler, useForm } from "react-hook-form";
import { treaty } from "@nutrishare/libs";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const { setAccessToken } = useAuthContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<RegisterForm>();

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    const res = await treaty.api.auth.local.register.post(data);
    if (res.status !== 201 || res.data === null) {
      // TODO: Better error handling
      console.log("Error registering");
      return;
    }
    await onRegisterSuccess(data);
  };
  const onRegisterSuccess = async ({ username, password }: RegisterForm) => {
    const res = await treaty.api.auth.local.login.post({
      login: username,
      password,
    });
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
      <h1>Register</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-inputs">
          <div className="form-input">
            <label htmlFor="register:username">Username</label>
            <input
              id="login:username"
              {...register("username", { required: true })}
            />
            {formErrors.username && <span>Please choose an username</span>}
          </div>

          <div className="form-input">
            <label htmlFor="register:email">Email</label>
            <input
              id="login:email"
              type="email"
              {...register("email", { required: true })}
            />
            {formErrors.email && <span>Please input your email</span>}
          </div>

          <div className="form-input">
            <label htmlFor="register:password">Password</label>
            <input
              id="register:password"
              type="password"
              {...register("password", { required: true })}
            />
            {formErrors.password && <span>Please choose a password</span>}
          </div>

          <input type="submit" value="Register" />
        </div>
      </form>

      <h2>Sign in via an external service</h2>
      <a href="http://localhost:8080/api/auth/github/authorize">
        <button type="button">Continue with GitHub</button>
      </a>

      <h2>Have an account already?</h2>
      <Link to="/auth/login">
        <button type="button">Log In</button>
      </Link>
    </>
  );
};

export default RegisterPage;
