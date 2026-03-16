import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-6 h-6 animate-spin text-[#D4754E]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
