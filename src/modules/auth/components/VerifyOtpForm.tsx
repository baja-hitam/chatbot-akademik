import { KeyRound, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/atoms/Button';
import { useForm } from 'react-hook-form';
import type { VerifyOtpPayload } from '../types/authTypes';
import { useVerifyOtpMutation } from '../hooks/useVerifyOtpMutation';
import { useAuth } from '../../../app/providers/authContext';
import { useNavigate } from '@tanstack/react-router';


export function VerifyOtpForm({ email }: { email: string }) {
  const verifyOtpMutation = useVerifyOtpMutation();
  const auth = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpPayload>({
    defaultValues: {
      email: email,
      otp_code: '',
    },
  });

  const onSubmit = async (data: VerifyOtpPayload) => {
    // Implementation for form submission
    verifyOtpMutation.mutate(data,{
        onSuccess(response) {
            // Handle successful OTP verification, e.g., show a success message or redirect to dashboard
            auth.setUser(response);
            navigate({
                to: '/',
            });
        }
    });
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <section className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-2xl shadow-slate-950/40">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-2xl font-semibold text-white">Verifikasi Email</h1>
          <p className="mt-2 text-sm text-slate-400">
            Kode verifikasi telah dikirim ke <strong className="text-slate-200">{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Kode OTP</span>
            <span className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-3 focus-within:border-indigo-400">
              <KeyRound size={16} className="text-slate-500" />
              <input
                type="text"
                {...register('otp_code', {
                  required: 'Kode OTP wajib diisi.',
                  minLength: {
                    value: 6,
                    message: 'Kode OTP harus terdiri dari 6 karakter.',
                  },
                })}
                className="w-full bg-transparent px-3 py-3 text-center text-lg tracking-[0.5em] outline-none placeholder:text-slate-600 placeholder:tracking-normal"
                placeholder="123456"
                required
                maxLength={6}
              />
            </span>
            {errors.otp_code ? <span className="text-xs text-rose-300">{errors.otp_code.message}</span> : null}
          </label>

          {verifyOtpMutation.error && (
            <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 text-center">
              {verifyOtpMutation.error.message}
            </p>
          )}

          <Button type="submit" fullWidth disabled={verifyOtpMutation.isPending} className="py-3">
            {verifyOtpMutation.isPending ? 'Memverifikasi...' : 'Verifikasi Akun'}
          </Button>
        </form>
      </section>
    </main>
  );
}
