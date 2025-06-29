import { ProtectedRoute } from "@/components/auth/protected-route"
import { ClientDashboard } from "@/components/client-dashboard"

export default function ClientDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <ClientDashboard />
    </ProtectedRoute>
  )
}
