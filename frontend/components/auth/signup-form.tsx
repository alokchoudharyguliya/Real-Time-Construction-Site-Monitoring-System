'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Building2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    accountType: 'contractor' | 'government'
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    // const age = formData.get('age') as string;
    const organization = formData.get('organization') as string;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          // age: age ? Number(age) : undefined,
          organization,
          account_type: accountType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Store JWT token in localStorage
      if (data.token) {
        console.log(data.token);
        localStorage.setItem('jwt_token', data.token);
      }

      // Optionally, you can map backend user fields to your frontend User interface here
      if (data.user) {
        login({
          id: data.user._id || data.user.id,
          email: data.user.email,
          name: data.user.name,
          // age: data.user.age,
          account_type: data.user.account_type || accountType,
          avatar: data.user.imageUrl || '',
          phone: data.user.phone_number || '',
          organization: data.user.organization || '',
          licenseNumber: data.user.licenseNumber || '',
          permissions: data.user.permissions || [],
        });
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">CS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ConstructSight
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create your account
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Select your account type to register
            </p>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="contractor" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="contractor" className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>Contractor</span>
                </TabsTrigger>
                <TabsTrigger value="government" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Government</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contractor">
                <form onSubmit={(e) => handleSubmit(e, 'contractor')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractor-name">Name</Label>
                    <Input
                      id="contractor-name"
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractor-email">Email</Label>
                    <Input
                      id="contractor-email"
                      name="email"
                      type="email"
                      placeholder="contractor@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractor-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="contractor-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="contractor-age">Age</Label>
                    <Input
                      id="contractor-age"
                      name="age"
                      type="number"
                      placeholder="Age"
                    />
                  </div> */}
                  <div className="space-y-2">
                    <Label htmlFor="contractor-organization">Organization</Label>
                    <Input
                      id="contractor-organization"
                      name="organization"
                      type="text"
                      placeholder="Organization"
                    />
                  </div>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="government">
                <form onSubmit={(e) => handleSubmit(e, 'government')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gov-name">Name</Label>
                    <Input
                      id="gov-name"
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gov-email">Email</Label>
                    <Input
                      id="gov-email"
                      name="email"
                      type="email"
                      placeholder="govt@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gov-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="gov-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="gov-age">Age</Label>
                    <Input
                      id="gov-age"
                      name="age"
                      type="number"
                      placeholder="Age"
                    />
                  </div> */}
                  <div className="space-y-2">
                    <Label htmlFor="gov-organization">Organization</Label>
                    <Input
                      id="gov-organization"
                      name="organization"
                      type="text"
                      placeholder="Organization"
                    />
                  </div>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Demo Credentials:</p>
              <p>Contractor: contractor@example.com</p>
              <p>Government: govt@example.com</p>
              <p>Password: any</p>
              <div className="mt-4">
                <span>Already have an account? </span>
                <a
                  href="/"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Log In
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
        
      </motion.div>
    </div>
  );
}