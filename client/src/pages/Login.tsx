import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [passcode, setPasscode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow single digit
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newPasscode = [...passcode];
    newPasscode[index] = value;
    setPasscode(newPasscode);
    setError("");

    // Auto-focus next input if value entered
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits are entered
    if (newPasscode.every((digit) => digit !== "") && index === 3) {
      handleSubmit(newPasscode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !passcode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d+$/.test(pastedData)) {
      const newPasscode = pastedData.split("").concat(["", "", "", ""]).slice(0, 4);
      setPasscode(newPasscode);
      setError("");
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, 3);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = async (code?: string) => {
    const codeToSubmit = code || passcode.join("");
    setError("");
    setLoading(true);

    // Validate passcode is 4 digits
    if (codeToSubmit.length !== 4 || !/^\d{4}$/.test(codeToSubmit)) {
      setError("Passcode must be exactly 4 digits");
      setLoading(false);
      return;
    }

    try {
      await login(codeToSubmit);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid passcode. Please try again.");
      // Clear passcode on error
      setPasscode(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter 4-digit passcode
            </label>
            <div className="flex justify-center gap-3">
              {passcode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-16 h-16 text-center text-3xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  disabled={loading}
                  autoComplete="off"
                />
              ))}
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full py-3"
            disabled={loading || passcode.some((digit) => digit === "")}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

