import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { API_BASE } from '@/config';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProfessorApplicants() {
  const { fullName, lastName } = useUser();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { label: 'Dashboard', path: '/professor/dashboard' },
    { label: 'Applicants', path: '/professor/applicants' },
    { label: 'My Courses', path: '/professor/courses' },
    { label: 'Lab Profile', path: '/professor/profile' }
  ];

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        // We look for either the full name or just the last name 
        // to maximize the chance of matching what the student submitted.
        const searchName = fullName || lastName || 'Unknown';
        const res = await fetch(`${API_BASE}/email/logs/professor/${encodeURIComponent(searchName)}`);
        if (res.ok) {
          const data = await res.json();
          setApplicants(data);
        }
      } catch (err) {
        console.error('Failed to fetch applicants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [fullName, lastName]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/email/logs/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return <Badge className="bg-green-600">Accepted</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'interview': return <Badge variant="secondary" className="bg-[#ffb347] text-black">Interviewing</Badge>;
      default: return <Badge variant="outline">Pending Review</Badge>;
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Applicants">
      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground animate-pulse">Loading applicants...</p>
          </CardContent>
        </Card>
      ) : applicants.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">You have no pending applicants to review at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {applicants.map(app => (
            <Card key={app.id} className="overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-6 py-4 flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-xl text-primary">{app.student_name}</h3>
                  <p className="text-sm text-muted-foreground">Applied on {new Date(app.created_at).toLocaleDateString()}</p>
                </div>
                {getStatusBadge(app.status)}
              </div>
              <CardContent className="p-6">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[#a395b3] mb-2">Message</h4>
                  <p className="text-sm whitespace-pre-wrap bg-muted/20 p-4 rounded border border-border">
                    {app.email_text}
                  </p>
                </div>
                
                {app.status !== 'accepted' && app.status !== 'rejected' && (
                  <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                    {app.status !== 'interview' && (
                      <Button variant="outline" onClick={() => handleStatusUpdate(app.id, 'interview')}>
                        Request Interview
                      </Button>
                    )}
                    <Button variant="primary" onClick={() => handleStatusUpdate(app.id, 'accepted')} className="bg-green-600 hover:bg-green-700 text-white">
                      Accept
                    </Button>
                    <Button variant="destructive" onClick={() => handleStatusUpdate(app.id, 'rejected')}>
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
