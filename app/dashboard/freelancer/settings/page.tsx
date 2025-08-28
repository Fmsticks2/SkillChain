'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  AlertTriangle,
  Camera,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Globe,
  DollarSign
} from 'lucide-react'

export default function FreelancerSettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: true,
    projectUpdates: true,
    messageAlerts: true,
    paymentNotifications: true
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    showEarnings: false
  })

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    title: 'Full Stack Developer',
    bio: 'Experienced full-stack developer with 5+ years of experience in React, Node.js, and modern web technologies.',
    hourlyRate: '45',
    availability: 'full-time',
    timezone: 'UTC-5',
    languages: ['English', 'Spanish']
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }))
  }

  const handleProfileChange = (key: string, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-2">Manage your account preferences and profile settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900 border-slate-800">
            <TabsTrigger value="profile" className="flex items-center space-x-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <Shield className="w-4 h-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center space-x-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <CreditCard className="w-4 h-4" />
              <span>Billing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Information */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                    <AvatarFallback className="text-lg">{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="mb-2">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-slate-600">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Full Stack Developer, UI/UX Designer"
                    value={profile.title}
                    onChange={(e) => handleProfileChange('title', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell clients about your experience and expertise..."
                    value={profile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Professional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="hourlyRate"
                        type="number"
                        placeholder="45"
                        value={profile.hourlyRate}
                        onChange={(e) => handleProfileChange('hourlyRate', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Select value={profile.availability} onValueChange={(value) => handleProfileChange('availability', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time (40+ hrs/week)</SelectItem>
                        <SelectItem value="part-time">Part-time (20-40 hrs/week)</SelectItem>
                        <SelectItem value="project-based">Project-based</SelectItem>
                        <SelectItem value="not-available">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => handleProfileChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={() => {
                    console.log('Saving profile changes...', profile);
                    // Handle profile save logic here
                    alert('Profile changes saved successfully!');
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {/* Notification Preferences */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-slate-600">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-slate-600">Receive push notifications in browser</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-slate-600">Receive important updates via SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="font-medium">Marketing Communications</p>
                        <p className="text-sm text-slate-600">Receive updates about new features and tips</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                    />
                  </div>
                </div>

                <hr />

                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Project & Work Notifications</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Project Updates</p>
                      <p className="text-sm text-slate-600">New projects, status changes, deadlines</p>
                    </div>
                    <Switch
                      checked={notifications.projectUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('projectUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Message Alerts</p>
                      <p className="text-sm text-slate-600">New messages from clients</p>
                    </div>
                    <Switch
                      checked={notifications.messageAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('messageAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Notifications</p>
                      <p className="text-sm text-slate-600">Payment received, invoices, earnings</p>
                    </div>
                    <Switch
                      checked={notifications.paymentNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('paymentNotifications', checked)}
                    />
                  </div>
                </div>

                <Button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={() => {
                    console.log('Saving notification preferences...', notifications);
                    // Handle notification preferences save logic here
                    alert('Notification preferences saved successfully!');
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            {/* Privacy & Security */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-slate-600">Make your profile visible to clients</p>
                    </div>
                    <Switch
                      checked={privacy.profileVisible}
                      onCheckedChange={(checked) => handlePrivacyChange('profileVisible', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Email Address</p>
                      <p className="text-sm text-slate-600">Display email on your public profile</p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Phone Number</p>
                      <p className="text-sm text-slate-600">Display phone number on your public profile</p>
                    </div>
                    <Switch
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Earnings</p>
                      <p className="text-sm text-slate-600">Display total earnings on your profile</p>
                    </div>
                    <Switch
                      checked={privacy.showEarnings}
                      onCheckedChange={(checked) => handlePrivacyChange('showEarnings', checked)}
                    />
                  </div>
                </div>

                <hr />

                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Security</h4>
                  
                  <div className="space-y-3">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button variant="outline">
                    Change Password
                  </Button>
                </div>

                <hr />

                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Authenticator App</p>
                      <p className="text-sm text-slate-600">Use an authenticator app for additional security</p>
                    </div>
                    <Badge variant="outline">Not Enabled</Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-3"
                    onClick={() => {
                      console.log('Enabling 2FA...');
                      // Handle 2FA enable logic here
                      alert('Two-factor authentication setup initiated!');
                    }}
                  >
                    Enable 2FA
                  </Button>
                </div>

                <Button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={() => {
                    console.log('Saving security settings...');
                    // Handle security settings save logic here
                    alert('Security settings saved successfully!');
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            {/* Billing & Payments */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VISA</span>
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-slate-600">Expires 12/25</p>
                      </div>
                    </div>
                    <Badge>Primary</Badge>
                  </div>
                </div>
                <Button variant="outline">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billingName">Full Name</Label>
                    <Input id="billingName" placeholder="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="billingEmail">Email</Label>
                    <Input id="billingEmail" type="email" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="billingAddress">Address</Label>
                  <Input id="billingAddress" placeholder="123 Main St" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="billingCity">City</Label>
                    <Input id="billingCity" placeholder="New York" />
                  </div>
                  <div>
                    <Label htmlFor="billingState">State</Label>
                    <Input id="billingState" placeholder="NY" />
                  </div>
                  <div>
                    <Label htmlFor="billingZip">ZIP Code</Label>
                    <Input id="billingZip" placeholder="10001" />
                  </div>
                </div>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={() => {
                    console.log('Saving billing info...');
                    // Handle billing info save logic here
                    alert('Billing information saved successfully!');
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Billing Info
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-slate-900 border-red-800">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Danger Zone</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900">Delete Account</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}