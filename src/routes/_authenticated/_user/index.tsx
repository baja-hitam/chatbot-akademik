import { createFileRoute, redirect } from '@tanstack/react-router';
import { ChatPage } from '../../../modules/chat/pages/ChatPage';

export const Route = createFileRoute('/_authenticated/_user/')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: ChatPage,
});