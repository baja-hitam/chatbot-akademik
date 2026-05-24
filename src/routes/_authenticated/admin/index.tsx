import { createFileRoute } from '@tanstack/react-router';
import { AdminDashboardPage } from '../../../modules/admin/pages/AdminDashboardPage';

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminDashboardPage,
});
