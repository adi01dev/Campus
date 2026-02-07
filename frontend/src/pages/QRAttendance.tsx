import { motion } from 'framer-motion';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Scan, Users, Clock, Calendar, Download, RefreshCw, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { QRCodeCanvas } from 'qrcode.react';


const QRAttendance = () => {
  const { toast } = useToast();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  const token = localStorage.getItem("accessToken");

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [duration, setDuration] = useState("60");
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [todaysSessions, setTodaysSessions] = useState<any[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<{ id: string, secret: string } | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]); // Derived from schedule

  // Fetch Today's Sessions on Load
  const fetchTodaysSessions = async () => {
    try {
      const res = await fetch(`${API_BASE}/faculty/attendance/todays-sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTodaysSessions(data);
        // Extract unique subjects for dropdown
        const uniqueSubjects = Array.from(new Set(data.map((s: any) => s.subject))) as string[];
        setSubjects(uniqueSubjects);

        // Check if there is an ongoing session to resume
        const ongoing = data.find((s: any) => s.status === 'ongoing');
        if (ongoing && ongoing.sessionId) {
          // We'd ideally need the secret here too to resume QR generation. 
          // For now, we'll just show the session as active in the list.
          // If we wanted to resume QR, we'd need to store the secret or fetch it securey.
          // Simplified for this iteration: Just refresh the list.
        }
      }
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  };

  useEffect(() => {
    fetchTodaysSessions();
  }, []);

  // Poll for Live Attendance if session is active
  useEffect(() => {
    if (!activeSession) return;

    const fetchLiveAttendance = async () => {
      try {
        const res = await fetch(`${API_BASE}/faculty/attendance/active-session/${activeSession.id}/live`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRecentAttendance(data);
        }
      } catch (error) {
        console.error("Failed to fetch live attendance", error);
      }
    };

    fetchLiveAttendance(); // Initial
    const interval = setInterval(fetchLiveAttendance, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [activeSession]);


  // Crypto helper for HMAC-SHA256
  const signPayload = async (secret: string, data: string) => {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
    return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Effect to update QR every 10s if session is active
  useEffect(() => {
    if (!activeSession) return;

    const updateQR = async () => {
      const timestamp = Date.now();
      const nonce = Math.random().toString(36).substring(7);
      const signature = await signPayload(activeSession.secret, `${nonce}:${timestamp}`);
      // Payload format: sessionId:nonce:timestamp:signature
      const payload = `${activeSession.id}:${nonce}:${timestamp}:${signature}`;

      setQrToken(payload);
      setExpiresAt(new Date(timestamp + 15000).toISOString()); // 15s validity
    };

    updateQR(); // Initial
    const interval = setInterval(updateQR, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, [activeSession]);

  const handleGenerateQR = async () => {
    if (!selectedSubject || !selectedSession) {
      toast({
        title: "Missing Details",
        description: "Please select a subject and session type.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/faculty/attendance/create-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course: selectedSubject,
          sessionType: selectedSession,
          duration: parseInt(duration),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // Store session details (ID + Secret) to generate QRs locally
      setActiveSession({
        id: data.session.id,
        secret: data.session.secret
      });
      setRecentAttendance([]); // Clear previous list

      toast({
        title: "Session Started",
        description: `Dynamic QR generation active for ${selectedSubject}.`,
      });

      fetchTodaysSessions(); // Refresh list to show 'ongoing'
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to generate QR code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Simulation Helper
  const simulateStudentScan = async () => {
    if (!activeSession) return;
    try {
      // We need a dummy student ID. Since we don't have a list of students easily available without another call,
      // we'll ask the backend to just 'find one' or we can't really simulate effectively without hardcoding one.
      // However, for this demo, let's assume the backend 'mark-manual' endpoint handles looking up a student 
      // OR we pass a dummy ID if allowing loose simulation.
      // BETTER APPROACH: The backend Manual Mark endpoint expects an existing student ID.
      // For now, let's prompt the user to enter an ID or just pick a random one if we had a list.
      // Let's rely on the user having a Student ID handy or just notify them.

      const studentId = prompt("Enter Student ID to simulate scan (or correct MongoDB ID):");
      if (!studentId) return;

      const res = await fetch(`${API_BASE}/faculty/attendance/mark-manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: activeSession.id,
          studentId: studentId
        })
      });

      if (res.ok) {
        toast({ title: "Simulated Scan", description: "Student marked present." });
        // The polling effect will update the list automatically
      } else {
        const d = await res.json();
        toast({ title: "Failed", description: d.message, variant: "destructive" });
      }

    } catch (e) {
      console.error(e);
    }
  };


  return (
    <motion.div
      className="space-y-6 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BreadcrumbNav />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            QR Attendance
          </h1>
          <p className="text-muted-foreground mt-2">Generate QR codes and track attendance digitally</p>
        </div>
        <Button className="glass-card"
          onClick={handleGenerateQR}
          disabled={loading || !!activeSession}
        >
          <QrCode className="w-4 h-4 mr-2" />
          {activeSession ? "Session Active" : (loading ? "Generating..." : "Generate New QR")}
        </Button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Statistics Cards - Calculated from Live Data */}
        {/* Note: These could be enhanced to calculate from todaysSessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Classes</p>
                  <p className="text-2xl font-bold">{todaysSessions.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Participants</p>
                  <p className="text-2xl font-bold text-green-500">
                    {activeSession ? recentAttendance.length : 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Placeholders for Avg Attendance and Active Sessions - kept simple */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {todaysSessions.filter(s => s.status === 'ongoing').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Generate QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter subject name"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={!!activeSession}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session">Session Type</Label>
                <Select value={selectedSession} onValueChange={setSelectedSession} disabled={!!activeSession}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="lab">Lab Session</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="60"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={!!activeSession}
                />
              </div>

              <div className="p-6 bg-background/50 rounded-lg text-center border-2 border-dashed">
                {qrToken ? (
                  <>
                    <QRCodeCanvas
                      value={qrToken}
                      size={160}
                      includeMargin={true}
                      className="mx-auto mb-4"
                    />
                    <p className="text-sm font-medium text-green-600">QR Code Active</p>
                    {expiresAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Expires at: {new Date(expiresAt).toLocaleTimeString()}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <QrCode className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">QR Code will appear here when you start a session</p>
                  </>
                )}
              </div>

              <Button className="glass-card w-full"
                onClick={handleGenerateQR}
                disabled={loading}
              >
                <QrCode className="w-4 h-4 mr-2" />
                {loading ? "Generating..." : "Generate New QR"}
              </Button>

            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Today's Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysSessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No classes scheduled for today.</p>
                  </div>
                ) : (
                  todaysSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      className="p-4 border rounded-lg glass-card hover:bg-accent/50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{session.subject}</h3>
                            <Badge variant={
                              session.status === 'ongoing' ? 'default' :
                                session.status === 'completed' ? 'secondary' : 'outline'
                            }>
                              {session.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <p><span className="font-medium">Time:</span> {session.time}</p>
                              <p><span className="font-medium">Room:</span> {session.room}</p>
                              <p><span className="font-medium">Faculty:</span> {session.faculty}</p>
                            </div>
                            <div>
                              <p><span className="font-medium">Students:</span> {session.totalStudents}</p>
                              <p><span className="font-medium">Present:</span>
                                <span className={session.present >= session.totalStudents * 0.9 ? 'text-green-500' : 'text-orange-500'}>
                                  {" "}{session.present}/{session.totalStudents}
                                </span>
                              </p>
                              <p><span className="font-medium">Attendance:</span>
                                <span className={session.present >= session.totalStudents * 0.9 ? 'text-green-500' : 'text-orange-500'}>
                                  {" "}{session.totalStudents > 0 ? Math.round((session.present / session.totalStudents) * 100) : 0}%
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {session.status === 'ongoing' && (
                            <Button variant="ghost" size="sm">
                              <Scan className="w-4 h-4 mr-1" />
                              Scan
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Attendance</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => activeSession && setRecentAttendance([])}> {/* Hacky clear/refresh */}
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAttendance.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No attendance records for current session.</p>
                  </div>
                ) : (
                  recentAttendance.map((record, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div>
                        <p className="font-medium text-sm">{record.student}</p>
                        <p className="text-xs text-muted-foreground">{record.rollNo}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="mb-1">Present</Badge>
                        <p className="text-xs text-muted-foreground">{record.time}</p>
                      </div>
                    </motion.div>
                  )))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QRAttendance;