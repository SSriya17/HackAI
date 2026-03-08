import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import InputField from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { saveUser } from '@/hooks/useUser';

const YEAR_OPTIONS = [
  { label: 'Freshman', value: 'Freshman' },
  { label: 'Sophomore', value: 'Sophomore' },
  { label: 'Junior', value: 'Junior' },
  { label: 'Senior', value: 'Senior' },
  { label: 'Graduate', value: 'Graduate' },
];

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('role') || 'student');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    saveUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      role,
      year: year.trim() || undefined,
      major: major.trim() || undefined,
      department: department.trim() || undefined,
      title: title.trim() || undefined,
    });

    if (role === 'student') {
      navigate('/student/matches');
    } else {
      navigate('/professor/setup');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8">
      <div className="w-full max-w-[500px]">
        <div className="text-center mt-12 mb-8">
          <h2 className="font-serif text-3xl mb-2 text-primary">Create an account</h2>
          <p className="text-muted-foreground mb-8 text-lg">Join RAlign to connect with research opportunities</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSignup} className="flex flex-col gap-6">
              <Tabs value={role} onValueChange={setRole} className="w-full">
                <TabsList className="w-full grid grid-cols-2 h-10 bg-muted p-1">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="professor">Professor</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-4">
                <InputField label="FIRST NAME" id="firstName" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <InputField label="LAST NAME" id="lastName" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>

              <InputField label="EMAIL ADDRESS" id="email" type="email" placeholder="name@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <InputField label="PASSWORD" id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

              {role === 'student' && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label className="font-mono text-xs uppercase tracking-widest text-primary">YEAR</Label>
                    <select
                      id="year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="h-11 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
                    >
                      <option value="">Select year</option>
                      {YEAR_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <InputField label="MAJOR" id="major" placeholder="e.g. Computer Science" value={major} onChange={(e) => setMajor(e.target.value)} />
                </>
              )}

              {role === 'professor' && (
                <>
                  <InputField label="DEPARTMENT" id="department" placeholder="e.g. Computer Science" value={department} onChange={(e) => setDepartment(e.target.value)} />
                  <InputField label="TITLE" id="title" placeholder="e.g. Associate Professor" value={title} onChange={(e) => setTitle(e.target.value)} />
                </>
              )}

              <Button type="submit" variant="primary" className="w-full">
                Sign Up →
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
