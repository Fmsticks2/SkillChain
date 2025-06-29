"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEthereum } from "@/hooks/use-ethereum"

type UserType = "client" | "freelancer" | null

interface WalletConnectProps {
  onSuccess?: (address: string, userType: UserType, userData: any) => void
  onConnect?: (wallet: string, address: string) => void
  onCancel?: () => void
}

export function WalletConnect({ onSuccess, onConnect, onCancel }: WalletConnectProps) {
  const { 
    isMetaMaskInstalled, 
    currentAccount, 
    error: ethereumError, 
    connect: connectWallet 
  } = useEthereum()
  
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [currentStep, setCurrentStep] = useState<"connect" | "details">("connect")
  const [userType, setUserType] = useState<UserType>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Update state when account changes
  useEffect(() => {
    if (currentAccount) {
      setIsConnected(true)
      if (currentStep === "connect") {
        setCurrentStep("details")
      }
    } else {
      setIsConnected(false)
      setCurrentStep("connect")
    }
  }, [currentAccount, currentStep])
  
  // Update error state
  useEffect(() => {
    if (ethereumError) {
      setError(ethereumError)
    }
  }, [ethereumError])

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    skills: "",
    experience: "",
  })

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      console.log("Attempting to connect wallet...")
      const address = await connectWallet()
      console.log("Wallet connection result:", address)
      // Simulate a delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Call the onConnect callback if provided
      if (onConnect && address) {
        console.log("Calling onConnect with address:", address)
        onConnect('metamask', address)
      } else {
        console.log("No onConnect callback or no address returned")
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)
      setError(error.message || "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submission started")
    console.log("Current account:", currentAccount)
    console.log("User type:", userType)
    console.log("Form data:", formData)
    
    if (!currentAccount) {
      console.error("No wallet connected")
      return
    }
    
    if (!userType) {
      console.error("No user type selected")
      alert("Please select whether you're a client or a freelancer")
      return
    }

    // Call the onSuccess callback with the wallet address, user type, and form data
    if (onSuccess) {
      console.log("Calling onSuccess with:", { currentAccount, userType, formData })
      onSuccess(currentAccount, userType, formData)
    } else {
      console.error("No onSuccess callback provided")
    }
  }

  // Render wallet connection step
  if (currentStep === "connect") {
    return (
      <Card className="w-full max-w-md mx-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your Ethereum wallet to access the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isMetaMaskInstalled && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>MetaMask Not Installed</AlertTitle>
                <AlertDescription>
                  Please install MetaMask to use this application.
                  <a 
                    href="https://metamask.io/download/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline ml-1"
                  >
                    Download MetaMask
                  </a>
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-center">
              {isConnected && currentAccount ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Wallet Connected: {currentAccount.substring(0, 6)}...{currentAccount.substring(currentAccount.length - 4)}</span>
                </div>
              ) : (
                <Button 
                  onClick={handleConnect} 
                  disabled={isConnecting || !isMetaMaskInstalled}
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect Wallet"
                  )}
                </Button>
              )}
            </div>
            
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={onCancel} 
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card className="w-full max-w-md mx-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide your details to complete the signup process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="userType">I am a:</Label>
                <RadioGroup
                  value={userType || ""}
                  onValueChange={(value) => setUserType(value as UserType)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="client" id="client" />
                    <Label htmlFor="client">Client</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="freelancer" id="freelancer" />
                    <Label htmlFor="freelancer">Freelancer</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {userType === "client" ? (
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" name="company" value={formData.company} onChange={handleInputChange} />
                </div>
              ) : userType === "freelancer" ? (
                <>
                  <div>
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input id="skills" name="skills" value={formData.skills} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              ) : null}
            </div>

            <Button type="submit" className="w-full">
              Complete Signup
            </Button>
          </form>
      </CardContent>
    </Card>
  );
}}
