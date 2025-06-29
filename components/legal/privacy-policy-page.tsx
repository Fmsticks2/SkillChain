import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          <CardDescription>Last updated: June 28, 2025</CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>Introduction</h2>
          <p>
            Welcome to SkillChain ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you
            have a positive experience on our website and while using our services.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect information to provide better services to all our users. The types of information we collect
            include:
          </p>
          <ul>
            <li>
              <strong>Account Information:</strong> When you create an account, we collect your name, email address, and
              password.
            </li>
            <li>
              <strong>Profile Information:</strong> Information you provide in your user profile, such as skills,
              experience, and portfolio.
            </li>
            <li>
              <strong>Wallet Information:</strong> Public blockchain addresses that you connect to our platform.
            </li>
            <li>
              <strong>OAuth Information:</strong> When you sign in using OAuth providers (Google, GitHub, LinkedIn), we
              receive basic profile information from these services.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Match freelancers with appropriate clients based on skills and requirements</li>
            <li>Process transactions and send related information</li>
            <li>Send notifications, updates, and support messages</li>
            <li>Detect and prevent fraud and abuse</li>
          </ul>

          <h2>Blockchain Data</h2>
          <p>Our platform integrates with blockchain technology. Please be aware that:</p>
          <ul>
            <li>Blockchain transactions are public, immutable, and verifiable</li>
            <li>Your public wallet address may be visible to others on the blockchain</li>
            <li>We do not store your private keys or seed phrases</li>
          </ul>

          <h2>Data Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share information in the following circumstances:</p>
          <ul>
            <li>With your consent</li>
            <li>For legal reasons, if required by applicable law</li>
            <li>With service providers who work on our behalf</li>
          </ul>

          <h2>Your Rights and Choices</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li>Access to your personal information</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your information</li>
            <li>Objection to certain processing activities</li>
            <li>Data portability</li>
          </ul>

          <h2>Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against
            unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last Updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>
            Email: privacy@skillchain.example.com
            <br />
            Address: 123 Blockchain Street, Web3 City, 12345
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
