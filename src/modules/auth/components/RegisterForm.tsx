import { Bot, Mail, Lock, User } from 'lucide-react';
import { Button } from '../../../components/atoms/Button';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useRegisterMutation } from '../hooks/useRegisterMutation';
import type { RegisterPayload } from '../types/authTypes';
import { useNavigate } from '@tanstack/react-router';


export function RegisterForm() {

  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterPayload) => {
    // Implementation for form submission
    registerMutation.mutate(data,{
      onSuccess(response) {
        // Handle successful registration, e.g., show a success message or redirect to login
        navigate({
          to: '/verify-otp',
          search: { email: response.responseBody.email },
        });
      }
    });
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl shadow-slate-950/40 lg:grid-cols-2">
        <div className="hidden flex-col justify-between border-r border-slate-800 bg-gradient-to-b from-indigo-500/20 to-slate-900 p-10 lg:flex">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">
              <Bot size={14} />
              Chatbot Akademik
            </div>
            <h1 className="mt-5 text-3xl font-semibold leading-tight text-white">
              Bergabung dengan asisten akademik kampus.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Daftarkan diri Anda untuk mulai menanyakan info akademik seputar jadwal, KRS, tugas akhir, dan masih banyak lagi.
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Akses ke sistem membutuhkan verifikasi email (OTP) setelah registrasi.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">
                <Bot size={14} />
                Chatbot Akademik
              </div>
              <h1 className="mt-4 text-2xl font-semibold text-white">Buat akun baru</h1>
            </div>

            <div className="hidden lg:block mb-8">
              <h1 className="text-2xl font-semibold text-white">Buat akun baru</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Username / Nama Lengkap</span>
                <span className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-3 focus-within:border-indigo-400">
                  <User size={16} className="text-slate-500" />
                  <input
                    type="text"
                    {...register('username',{
                      required: 'Username wajib diisi.',
                    })}
                    className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-500"
                    placeholder="Contoh: Budi Santoso"
                    required
                  />
                </span>
                {errors.username ? <span className="text-xs text-rose-300">{errors.username.message}</span> : null}
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Email</span>
                <span className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-3 focus-within:border-indigo-400">
                  <Mail size={16} className="text-slate-500" />
                  <input
                    type="email"
                    {...register('email',{
                      required: 'Email wajib diisi.',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Format email tidak valid.',
                      }
                    })}
                    className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-500"
                    placeholder="mahasiswa@kampus.ac.id"
                    autoComplete="email"
                    required
                  />
                </span>
                {errors.email ? <span className="text-xs text-rose-300">{errors.email.message}</span> : null}
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Password</span>
                <span className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-3 focus-within:border-indigo-400">
                  <Lock size={16} className="text-slate-500" />
                  <input
                    type="password"
                    {...register('password',{
                      required: 'Password wajib diisi.',
                      minLength: {
                        value: 6,
                        message: 'Password minimal 6 karakter.',
                      }
                    })}
                    className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-500"
                    placeholder="Minimal 6 karakter"
                    autoComplete="new-password"
                    required
                  />
                </span>
                {errors.password ? <span className="text-xs text-rose-300">{errors.password.message}</span> : null}
              </label>

              {registerMutation.isError && (
                <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {registerMutation.error.message}
                </p>
              )}

              <Button type="submit" fullWidth disabled={registerMutation.isPending} className="py-3">
                {registerMutation.isPending ? 'Memproses...' : 'Daftar Sekarang'}
              </Button>
            </form>

            <div className="mt-5 text-center text-sm text-slate-400">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline">
                Masuk di sini
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
