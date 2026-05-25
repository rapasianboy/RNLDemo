import { useEffect, useState, type FormEvent } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import FloatingLabelInput from "../../components/Input/FloatingLabelInput";
import SubmitButton from "../../components/Button/SubmitButton";
import AuthService from "../../services/AuthService";

interface FieldErrors {
  username?: string[];
  password?: string[];
}

interface ValidationErrorResponse {
  message?: string;
  errors?: FieldErrors;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "RNLDemo | Login";
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      setLoading(true);
      const res = await AuthService.login({ username, password });
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/gender", { replace: true });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ValidationErrorResponse>;
      if (axiosError.response?.status === 422 && axiosError.response.data?.errors) {
        setErrors(axiosError.response.data.errors);
      } else if (axiosError.response?.status === 401) {
        setMessage(axiosError.response.data?.message ?? "The provided credentials are incorrect.");
      } else {
        setMessage("Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center px-4">
      {message && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-md">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs">
            x
          </span>
          <span>{message}</span>
        </div>
      )}

      <div className="w-full max-w-6xl grid grid-cols-1 gap-8 items-center">
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-8 max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-lg font-semibold text-teal-700">
              RN
            </div>
            <h1 className="text-3xl font-semibold text-teal-900">Sign in to your account</h1>
            <p className="mt-2 text-sm text-teal-700">Access the RNLDemo dashboard and management pages.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <FloatingLabelInput
                label="Username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                errors={errors.username}
                required
                autoFocus
              />
            </div>

            <div className="mb-5">
              <FloatingLabelInput
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                errors={errors.password}
                required
              />
            </div>

            <SubmitButton
              label="Sign In"
              loading={loading}
              loadinglabel="Signing In..."
              newClassName="w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-sm"
            />
          </form>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
