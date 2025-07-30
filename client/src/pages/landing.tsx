import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Briefcase, MessageCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="text-blue-600 text-2xl" />
            <span className="text-xl font-bold text-gray-800">UniConnect</span>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" onClick={() => window.location.href = '/api/login'}>
              Sign In
            </Button>
            <Button onClick={() => window.location.href = '/api/login'}>
              Join Now
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Connect with your university community
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join your fellow students, alumni, and faculty in building professional relationships 
              that last beyond graduation.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = '/api/login'}
            >
              Get Started
            </Button>
          </div>
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="University students collaborating" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Everything you need to succeed
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Build Connections</h3>
              <p className="text-gray-600 text-sm">
                Connect with students, alumni, and faculty from your university
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Find Opportunities</h3>
              <p className="text-gray-600 text-sm">
                Discover internships, jobs, and research positions
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Stay Connected</h3>
              <p className="text-gray-600 text-sm">
                Message your network and share professional updates
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Learn & Grow</h3>
              <p className="text-gray-600 text-sm">
                Access mentorship and career guidance from alumni
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">
            Ready to expand your professional network?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students and alumni building their careers together
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6"
            onClick={() => window.location.href = '/api/login'}
          >
            Join UniConnect Today
          </Button>
        </div>
      </div>
    </div>
  );
}
