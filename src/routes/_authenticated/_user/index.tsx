import { createFileRoute } from '@tanstack/react-router';
import { ChatPage } from '../../../modules/chat/pages/ChatPage';

export const Route = createFileRoute('/_authenticated/_user/')({
  component: ChatPage,
});