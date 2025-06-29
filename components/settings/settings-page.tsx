"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Wallet, Camera, Save, Trash2, Eye, EyeOff, Globe, Smartphone, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth"

export function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  })
  const router = useRouter()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account preferences and security</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <h3 className="text-xl font-semibold mb-6">Profile Information</h3>

                {/* Avatar Section */}
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button size="icon" className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 hover:bg-blue-600">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Profile Photo</h4>
                    <p className="text-slate-400 text-sm mb-3">
                      Upload a professional photo to build trust with clients
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-slate-700 bg-transparent">
                        Upload New
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" className="bg-slate-800 border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" className="bg-slate-800 border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john@example.com"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" className="bg-slate-800 border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue="San Francisco, CA" className="bg-slate-800 border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" defaultValue="Pacific Time (PT)" className="bg-slate-800 border-slate-700" />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell clients about your experience and expertise..."
                    className="bg-slate-800 border-slate-700 min-h-[100px]"
                    defaultValue="Experienced full-stack developer with 8+ years building scalable web applications."
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <h3 className="text-xl font-semibold mb-6">Notification Preferences</h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-slate-400 text-sm">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-purple-400" />
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-slate-400 text-sm">Browser and mobile notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-slate-400 text-sm">Text messages for urgent updates</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-amber-400" />
                      <div>
                        <h4 className="font-medium">Marketing Communications</h4>
                        <p className="text-slate-400 text-sm">Product updates and promotions</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <h3 className="text-xl font-semibold mb-6">Security Settings</h3>

                {/* Password Change */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          className="bg-slate-800 border-slate-700 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                      Update Password
                    </Button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Authenticator App</p>
                        <p className="text-slate-400 text-sm">Use an app like Google Authenticator</p>
                      </div>
                      <Button variant="outline" className="border-slate-700 bg-transparent">
                        Enable
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Connected Wallets */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Connected Wallets</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Wallet className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="font-medium">MetaMask</p>
                          <p className="text-slate-400 text-sm">0x742d...4C4C</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                        Disconnect
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full border-slate-700 bg-transparent">
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect New Wallet
                    </Button>
                  </div>
                </div>

                {/* Login Sessions */}
                <div>
                  <h4 className="font-medium mb-4">Active Sessions</h4>
                  <div className="space-y-3">
                    {[
                      { device: "MacBook Pro", location: "San Francisco, CA", current: true },
                      { device: "iPhone 14", location: "San Francisco, CA", current: false },
                      { device: "Chrome Browser", location: "New York, NY", current: false },
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="font-medium flex items-center space-x-2">
                            <span>{session.device}</span>
                            {session.current && (
                              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
                                Current
                              </span>
                            )}
                          </p>
                          <p className="text-slate-400 text-sm">{session.location}</p>
                        </div>
                        {!session.current && (
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <h3 className="text-xl font-semibold mb-6">Billing & Payments</h3>

                {/* Current Plan */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Current Plan</h4>
                  <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-lg">Professional Plan</h5>
                        <p className="text-slate-400">5% platform fee • Unlimited projects</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">5%</p>
                        <p className="text-slate-400 text-sm">per transaction</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Payment Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-slate-400 text-sm">Expires 12/25</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          Remove
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full border-slate-700 bg-transparent">
                      Add Payment Method
                    </Button>
                  </div>
                </div>

                {/* Transaction History */}
                <div>
                  <h4 className="font-medium mb-4">Recent Transactions</h4>
                  <div className="space-y-3">
                    {[
                      { date: "Jan 15, 2024", description: "Platform fee - DeFi Dashboard", amount: "-$425.00" },
                      { date: "Jan 10, 2024", description: "Platform fee - NFT Marketplace", amount: "-$600.00" },
                      { date: "Jan 5, 2024", description: "Platform fee - Smart Contract Audit", amount: "-$300.00" },
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-slate-400 text-sm">{transaction.date}</p>
                        </div>
                        <p className="font-semibold text-red-400">{transaction.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 bg-red-900/10 border-red-500/20">
            <h3 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h3>
            {!showDeleteConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-slate-400 text-sm">Permanently delete your account and all associated data</p>
                </div>
                <Button 
                  variant="destructive" 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Are you sure you want to delete your account?</h4>
                  <p className="text-slate-400 text-sm mb-4">
                    This action cannot be undone. All your data, projects, and earnings will be permanently deleted.
                    Type <span className="font-bold text-red-400">DELETE</span> to confirm.
                  </p>
                  <div className="space-y-2">
                    <Input 
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="destructive" 
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deleteConfirmText !== 'DELETE'}
                    onClick={() => {
                      // Delete account logic here
                      alert('Your account has been deleted');
                      logout();
                      router.push('/');
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Permanently Delete Account
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-slate-700 bg-transparent"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
