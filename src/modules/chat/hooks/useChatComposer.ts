import { useCallback, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

interface UseChatComposerParams {
  isSending: boolean;
  onSend: (message: string) => void;
}

export function useChatComposer({ isSending, onSend }: UseChatComposerParams) {
  const [input, setInput] = useState('');

  const canSubmit = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const value = input.trim();
      if (!value || isSending) {
        return;
      }

      onSend(value);
      setInput('');
    },
    [input, isSending, onSend],
  );

  return {
    input,
    setInput,
    canSubmit,
    handleSubmit,
  };
}
