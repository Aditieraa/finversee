import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Clock, Users, Star, CheckCircle } from 'lucide-react';

interface Course {
  id: string;
  courseId: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  createdAt: string;
}

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt: string | null;
  progress: number;
}

export default function Courses() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const userId = localStorage.getItem('userId') || 'demo-user';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all courses
        const coursesRes = await fetch('/api/courses');
        if (!coursesRes.ok) throw new Error('Failed to fetch courses');
        const coursesData = await coursesRes.json();
        setCourses(coursesData);

        // Fetch user's enrollments
        const enrollmentsRes = await fetch(`/api/enrollments/${userId}`);
        if (!enrollmentsRes.ok) throw new Error('Failed to fetch enrollments');
        const enrollmentsData = await enrollmentsRes.json();
        setEnrollments(enrollmentsData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load courses',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, toast]);

  const isEnrolled = (courseId: string) => {
    return enrollments.some((e) => e.courseId === courseId);
  };

  const getProgress = (courseId: string) => {
    const enrollment = enrollments.find((e) => e.courseId === courseId);
    return enrollment?.progress || 0;
  };

  const handleEnroll = async (course: Course) => {
    setProcessing(course.courseId);

    try {
      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: course.price / 100, // Convert from paise
          type: 'course',
          itemId: course.courseId,
        }),
      });

      if (!orderResponse.ok) throw new Error('Failed to create order');

      const orderData = await orderResponse.json();
      const { orderId } = orderData;

      // Simulate payment
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Verify payment
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          orderId,
          paymentId: `pay_${Date.now()}`,
          signature: `sig_${orderId}_${Date.now()}`,
          type: 'course',
          itemId: course.courseId,
        }),
      });

      if (!verifyResponse.ok) throw new Error('Payment verification failed');

      // Add to local enrollments
      setEnrollments([
        ...enrollments,
        {
          id: `enroll_${Date.now()}`,
          userId,
          courseId: course.courseId,
          enrolledAt: new Date().toISOString(),
          completedAt: null,
          progress: 0,
        },
      ]);

      toast({
        title: '✅ Enrolled Successfully!',
        description: `Welcome to ${course.title}!`,
      });
    } catch (error) {
      toast({
        title: '❌ Enrollment Failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
    }
  };

  const categoryColors: Record<string, string> = {
    Taxes: 'bg-green-900/30 border-green-500/50',
    Investing: 'bg-blue-900/30 border-blue-500/50',
    'Real Estate': 'bg-purple-900/30 border-purple-500/50',
    Income: 'bg-orange-900/30 border-orange-500/50',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-blue-400" />
            Financial Courses
          </h1>
          <p className="text-blue-200 text-lg">
            Master financial skills with our expert-designed courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {courses.map((course) => {
            const enrolled = isEnrolled(course.courseId);
            const progress = getProgress(course.courseId);

            return (
              <Card
                key={course.courseId}
                className={`${categoryColors[course.category] || 'bg-slate-800/30 border-slate-700'} border transition-all hover:shadow-lg`}
                data-testid={`card-course-${course.courseId}`}
              >
                <div className="p-8">
                  {/* Category & Status */}
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-blue-600">{course.category}</Badge>
                    {enrolled && (
                      <Badge
                        className="bg-green-600 flex items-center gap-1"
                        data-testid={`badge-enrolled-${course.courseId}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Enrolled
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3">{course.title}</h3>
                  <p className="text-slate-300 mb-6">{course.description}</p>

                  {/* Course Info */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Duration
                      </p>
                      <p className="text-white font-semibold">{course.duration} days</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Students
                      </p>
                      <p className="text-white font-semibold">{Math.floor(Math.random() * 5000) + 1000}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Rating
                      </p>
                      <p className="text-white font-semibold">4.{Math.floor(Math.random() * 9)}/5</p>
                    </div>
                  </div>

                  {/* Progress Bar (if enrolled) */}
                  {enrolled && (
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <p className="text-sm text-slate-300">Progress</p>
                        <p className="text-sm text-blue-300 font-semibold">{progress}%</p>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Price & CTA */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-slate-400 text-sm">Price</p>
                      <p className="text-3xl font-bold text-blue-300">₹{course.price / 100}</p>
                    </div>
                    <Button
                      onClick={() => handleEnroll(course)}
                      disabled={processing === course.courseId || enrolled}
                      className={`${
                        enrolled
                          ? 'bg-slate-600 hover:bg-slate-600'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      data-testid={`button-enroll-${course.courseId}`}
                    >
                      {processing === course.courseId
                        ? 'Processing...'
                        : enrolled
                          ? 'Enrolled'
                          : 'Enroll Now'}
                    </Button>
                  </div>

                  {/* Course Features */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-xs text-slate-400 mb-3 uppercase tracking-wide">
                      What you'll learn
                    </p>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li>✓ Practical strategies and real-world examples</li>
                      <li>✓ Step-by-step implementation guides</li>
                      <li>✓ Bonus resources and templates</li>
                      <li>✓ Certificate of completion</li>
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-8 mt-12">
          <h3 className="text-2xl font-bold text-white mb-6">Why Take Our Courses?</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">📚 Expert-Led</h4>
              <p className="text-slate-300 text-sm">Learn from financial experts with years of experience</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">🎯 Practical</h4>
              <p className="text-slate-300 text-sm">Real-world strategies you can apply immediately</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">🏆 Certificates</h4>
              <p className="text-slate-300 text-sm">Get recognized with completion certificates</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">⏰ Lifetime Access</h4>
              <p className="text-slate-300 text-sm">Access course materials forever</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
