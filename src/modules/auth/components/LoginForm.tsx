import { Bot, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/atoms/Button';
import { Link,useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../hooks/useLoginMutation';
import { useAuth } from '../../../app/providers/authContext';

interface LoginFormValues {
  email: string;
  password: string;
}

const DEMO_CREDENTIALS = {
  email: 'mahasiswa@kampus.ac.id',
  password: 'password123',
} as const;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();
  const auth = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    },
  });

  const submitForm = (values: LoginFormValues) => {
    loginMutation.mutate(values,{
      onSuccess(data) {
        if (data.is_verified === false && data.is_verified !== undefined) {
          // Handle unverified user, e.g., redirect to OTP verification page
          navigate({
            to: '/verify-otp',
            search: { email: values.email },
          });
          return;
        }
        // Login berhasil, navigasi ke halaman utama atau lakukan tindakan lain
        auth.setUser(data);
        navigate({
          to: '/',
        });
      }
    });
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl shadow-slate-950/40 lg:grid-cols-2">
        <div className="hidden flex-col justify-between border-r border-slate-800 bg-linear-to-b from-indigo-500/20 to-slate-900 p-10 lg:flex">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">
              <Bot size={14} />
              Chatbot Akademik
            </div>
            <h1 className="mt-5 text-3xl font-semibold leading-tight text-white">
              Asisten akademik kampus dalam satu dashboard.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Tanyakan KRS, KKP, Tugas Akhir, dan pengumuman terbaru dengan tampilan yang cepat dan rapi.
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Gunakan akun demo untuk login dan eksplorasi alur chatbot.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">
                <Bot size={14} />
                Chatbot Akademik
              </div>
              <h1 className="mt-4 text-2xl font-semibold text-white">Masuk ke dashboard</h1>
            </div>

            <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
              {
                loginMutation.error instanceof Error && (
                  <div className="rounded-md border border-rose-300 bg-rose-950/50 p-3 text-sm text-rose-300">
                    {loginMutation.error.message}
                  </div>
                )
              }
              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Email</span>
                <span className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-3 focus-within:border-indigo-400">
                  <Mail size={16} className="text-slate-500" />
                  <input
                    type="email"
                    className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-500"
                    placeholder="mahasiswa@kampus.ac.id"
                    autoComplete="email"
                    {...register('email', {
                      required: 'Email wajib diisi.',
                    })}
                  />
                </span>
                {errors.email ? <span className="text-xs text-rose-300">{errors.email.message}</span> : null}
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Password</span>
                <span className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-3 focus-within:border-indigo-400">
                  <Lock size={16} className="text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-500"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register('password', {
                      required: 'Password wajib diisi.',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </span>
                {errors.password ? <span className="text-xs text-rose-300">{errors.password.message}</span> : null}
              </label>

              <Button type="submit" fullWidth disabled={loginMutation.isPending} className="py-3">
                {loginMutation.isPending ? 'Memproses...' : 'Login'}
              </Button>
            </form>

            <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-400">
              Akun demo: <span className="text-slate-200">{DEMO_CREDENTIALS.email}</span> /{' '}
              <span className="text-slate-200">{DEMO_CREDENTIALS.password}</span>
            </div>

            <div className="mt-5 text-center text-sm text-slate-400">
              Belum punya akun?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 hover:underline">
                Daftar sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
