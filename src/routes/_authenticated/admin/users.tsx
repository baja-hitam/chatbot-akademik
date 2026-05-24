import { createFileRoute } from '@tanstack/react-router';
import { UserPage } from '../../../modules/admin/users/pages/UserPage';

export const Route = createFileRoute('/_authenticated/admin/users')({
  component: UserPage,
});
