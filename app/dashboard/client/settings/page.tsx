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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-2">Manage your account preferences and settings</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
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
                  <h3 className="font-semibold text-lg">John Doe</h3>
                  <p className="text-slate-600">Client since January 2024</p>
                  <Badge variant="secondary" className="mt-1">Verified Account</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>

              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" defaultValue="Tech Innovations Inc." />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us about yourself and your company..."
                  defaultValue="CEO of Tech Innovations Inc. Looking for talented freelancers to help build innovative solutions."
                />
              </div>

              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-slate-600">Receive updates about your projects via email</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-slate-600">Get instant notifications in your browser</p>
                </div>
                <Switch 
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-slate-600">Receive important updates via text message</p>
                </div>
                <Switch 
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Marketing Communications</h4>
                  <p className="text-sm text-slate-600">Receive tips, news, and promotional content</p>
                </div>
                <Switch 
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Public Profile</h4>
                  <p className="text-sm text-slate-600">Make your profile visible to freelancers</p>
                </div>
                <Switch 
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => setPrivacy({...privacy, profileVisible: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Show Email Address</h4>
                  <p className="text-sm text-slate-600">Display your email on your public profile</p>
                </div>
                <Switch 
                  checked={privacy.showEmail}
                  onCheckedChange={(checked) => setPrivacy({...privacy, showEmail: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Show Phone Number</h4>
                  <p className="text-sm text-slate-600">Display your phone number on your public profile</p>
                </div>
                <Switch 
                  checked={privacy.showPhone}
                  onCheckedChange={(checked) => setPrivacy({...privacy, showPhone: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="pt-4">
                <Button variant="outline" className="mr-4">
                  Change Password
                </Button>
                <Button variant="outline">
                  Two-Factor Authentication
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-slate-600">Expires 12/26</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Primary</Badge>
                  </div>
                </div>
                
                <Button variant="outline">
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Trash2 className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-600">Delete Account</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive">
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