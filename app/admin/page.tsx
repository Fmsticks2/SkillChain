import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
