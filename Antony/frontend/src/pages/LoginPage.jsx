import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveUser } from '@/hooks/useUser';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('role') || 'student');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    saveUser({ firstName: firstName.trim(), lastName: lastName.trim(), email, role });

    if (role === 'student') {
      navigate('/student/matches');
    } else {
      navigate('/professor/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-[450px]">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl mb-2 text-primary">Welcome back</h2>
          <p className="text-muted-foreground mb-8 text-lg">Log in to your RAlign account</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <Tabs value={role} onValueChange={setRole} className="w-full">
                <TabsList className="w-full grid grid-cols-2 h-10 bg-muted p-1">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="professor">Professor</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <Label htmlFor="firstName" className="font-mono text-xs uppercase tracking-widest text-primary">
                    FIRST NAME
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <Label htmlFor="lastName" className="font-mono text-xs uppercase tracking-widest text-primary">
                    LAST NAME
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-primary">
                  EMAIL ADDRESS
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="font-mono text-xs uppercase tracking-widest text-primary">
                  PASSWORD
                </Label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Sign In →
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
