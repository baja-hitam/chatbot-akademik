import { useForm } from 'react-hook-form';

export interface ChatComposerFormValues {
  message: string;
}

export function useChatComposer({ isSending, onSend }: { isSending: boolean; onSend: (message: string) => void }) {
  const { register, handleSubmit, watch, reset } = useForm<ChatComposerFormValues>({
    defaultValues: {
      message: '',
    },
  });

  const message = watch('message') || '';
  const canSubmit = message.trim().length > 0 && !isSending;

  const onSubmit = (data: ChatComposerFormValues) => {
    const value = data.message.trim();
    if (!value) return;
    onSend(value);
    reset({ message: '' });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    canSubmit,
  };
}
