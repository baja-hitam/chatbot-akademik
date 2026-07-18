import { Globe, Mic, Paperclip, Send } from 'lucide-react';
import { useChatComposer } from '../hooks/useChatComposer';
import { Button } from '../../../components/atoms/Button';
interface ChatComposerProps {
  isSending: boolean;
  onSend: (message: string) => void;
}

export function ChatComposer({ isSending, onSend }: ChatComposerProps) {
  const {
    register,
    canSubmit,
    handleSubmit,
  } = useChatComposer({ isSending, onSend });
  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
      <div className="flex items-center gap-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 py-2">
        <button type="button" className="rounded-md p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200" aria-label="Lampiran">
          <Paperclip size={16} />
        </button>
        <button type="button" className="rounded-md p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200" aria-label="Browser">
          <Globe size={16} />
        </button>
        <button type="button" className="rounded-md p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200" aria-label="Voice">
          <Mic size={16} />
        </button>
        <input
          {...register('message')}
          placeholder="Tulis pertanyaan akademik..."
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-500"
          disabled={isSending}
        />
        <Button type="submit" disabled={!canSubmit} className="px-3 py-2">
          <Send size={14} />
          Kirim
        </Button>
      </div>
    </form>
  );
}
