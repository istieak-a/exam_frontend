import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Checkbox, Input, SpikeMark } from '../components/ui';
import { useAuth } from '../context/AuthContext';

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  const normalizedScore = Math.min(Math.floor(score / 1.5), 4);

  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = [
    'bg-error',
    'bg-warning',
    'bg-accent-amber',
    'bg-accent-teal',
    'bg-success',
  ];
  const textColors = [
    'text-error',
    'text-[#8a6a10]',
    'text-[#8a5a1a]',
    'text-[#326d63]',
    'text-[#2f6e3d]',
  ];

  return {
    score: normalizedScore,
    label: labels[normalizedScore],
    color: colors[normalizedScore],
    textColor: textColors[normalizedScore],
  };
}

function PasswordStrengthIndicator({ password }) {
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              index <= strength.score ? strength.color : 'bg-hairline'
            }`}
          />
        ))}
      </div>
      <p className={`text-[11px] font-medium ${strength.textColor}`}>
        Password strength · {strength.label}
      </p>
    </div>
  );
}

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await signup(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName,
        formData.role,
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      const errorMessage = error.message || 'Signup failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Sign up with ${provider}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6 py-16">
      <div className="w-full max-w-[480px]">
        <Link to="/" className="mb-10 inline-flex items-center gap-2 text-ink">
          <SpikeMark size={20} />
          <span className="font-display text-[22px] font-medium leading-none tracking-tight">
            ExamHub
          </span>
        </Link>

        <div className="rounded-xl border border-hairline bg-canvas p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="font-display text-[32px] leading-tight tracking-[-0.02em] text-ink">
              Create an account.
            </h1>
            <p className="mt-2 text-sm text-muted">
              Five fields and you're writing your first exam.
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 rounded-md border border-error/30 bg-error/10 p-3.5">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 text-error" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="flex-1 text-xs text-[#8a3636]">{errors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Username"
                type="text"
                name="username"
                placeholder="janedoe"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                required
              />
              <Input
                label="Full name"
                type="text"
                name="fullName"
                placeholder="Jane Doe"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@university.edu"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">I am a</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'STUDENT', label: 'Student' },
                  { value: 'TEACHER', label: 'Teacher' },
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: role.value }))}
                    className={`h-10 rounded-md border text-sm font-medium transition-colors ${
                      formData.role === role.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-hairline bg-canvas text-body hover:bg-surface-soft'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                autoComplete="new-password"
              />
              <PasswordStrengthIndicator password={formData.password} />
            </div>

            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              placeholder="Repeat the password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <div>
              <Checkbox
                label={
                  <span className="text-sm text-body">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy policy
                    </Link>
                    .
                  </span>
                }
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              {errors.agreeToTerms && (
                <p className="mt-1.5 text-xs text-error">{errors.agreeToTerms}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="-ml-1 mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <div className="my-7 flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-muted-soft">
            <div className="h-px flex-1 bg-hairline" />
            or sign up with
            <div className="h-px flex-1 bg-hairline" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialSignup('google')}
              className="flex h-10 items-center justify-center gap-2 rounded-md border border-hairline bg-canvas text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignup('microsoft')}
              className="flex h-10 items-center justify-center gap-2 rounded-md border border-hairline bg-canvas text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z" />
                <path fill="#00A4EF" d="M1 13h10v10H1z" />
                <path fill="#7FBA00" d="M13 1h10v10H13z" />
                <path fill="#FFB900" d="M13 13h10v10H13z" />
              </svg>
              Microsoft
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
