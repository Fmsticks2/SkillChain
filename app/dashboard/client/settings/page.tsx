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
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Camera,
  Save,
  Trash2
} from 'lucide-react'

export default function ClientSettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false
  })

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-2">Manage your account preferences and settings</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">John Doe</h3>
                  <p className="text-slate-400">Client since January 2024</p>
                  <Badge variant="secondary" className="mt-1 bg-slate-800 text-slate-300">Verified Account</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                  <Input id="firstName" defaultValue="John" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>

              <div>
                <Label htmlFor="company" className="text-slate-300">Company Name</Label>
                <Input id="company" defaultValue="Tech Innovations Inc." className="bg-slate-800 border-slate-700 text-white" />
              </div>

              <div>
                <Label htmlFor="bio" className="text-slate-300">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us about yourself and your company..."
                  defaultValue="CEO of Tech Innovations Inc. Looking for talented freelancers to help build innovative solutions."
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <Button 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                onClick={() => {
                  console.log('Saving client profile changes...');
                  // Handle client profile save logic here
                  alert('Profile changes saved successfully!');
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Email Notifications</h4>
                  <p className="text-sm text-slate-400">Receive updates about your projects via email</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Push Notifications</h4>
                  <p className="text-sm text-slate-400">Get instant notifications in your browser</p>
                </div>
                <Switch 
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">SMS Notifications</h4>
                  <p className="text-sm text-slate-400">Receive important updates via text message</p>
                </div>
                <Switch 
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Marketing Communications</h4>
                  <p className="text-sm text-slate-400">Receive tips, news, and promotional content</p>
                </div>
                <Switch 
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Shield className="w-5 h-5 mr-2" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Public Profile</h4>
                  <p className="text-sm text-slate-400">Make your profile visible to freelancers</p>
                </div>
                <Switch 
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => setPrivacy({...privacy, profileVisible: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Show Email Address</h4>
                  <p className="text-sm text-slate-400">Display your email on your public profile</p>
                </div>
                <Switch 
                  checked={privacy.showEmail}
                  onCheckedChange={(checked) => setPrivacy({...privacy, showEmail: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Show Phone Number</h4>
                  <p className="text-sm text-slate-400">Display your phone number on your public profile</p>
                </div>
                <Switch 
                  checked={privacy.showPhone}
                  onCheckedChange={(checked) => setPrivacy({...privacy, showPhone: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="pt-4">
                <Button variant="outline" className="mr-4 border-slate-700 text-slate-300 hover:bg-slate-800">
                  Change Password
                </Button>
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  Two-Factor Authentication
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium text-white">•••• •••• •••• 4242</p>
                        <p className="text-sm text-slate-400">Expires 12/26</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300">Primary</Badge>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  onClick={() => {
                    console.log('Adding new payment method...');
                    // Handle add payment method logic here
                    alert('Add payment method functionality would open here!');
                  }}
                >
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center text-red-400">
                <Trash2 className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-400">Delete Account</h4>
                  <p className="text-sm text-slate-400 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      console.log('Delete account requested...');
                      // Handle delete account logic here
                      const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
                      if (confirmed) {
                        alert('Account deletion process would begin here!');
                      }
                    }}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}