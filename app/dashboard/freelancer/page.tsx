import { ProtectedRoute } from "@/components/auth/protected-route"
import { FreelancerDashboard } from "@/components/freelancer-dashboard"

export default function FreelancerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["freelancer"]}>
      <FreelancerDashboard />
    </ProtectedRoute>
  )
}
