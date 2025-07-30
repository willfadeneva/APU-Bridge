import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MapPin, 
  Building, 
  Clock, 
  DollarSign, 
  Users,
  CheckCircle,
  Wifi
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { JobWithPoster } from "@shared/schema";

interface JobCardProps {
  job: JobWithPoster;
  hasApplied: boolean;
  onApply: (coverLetter: string) => void;
  isApplying: boolean;
}

export default function JobCard({ job, hasApplied, onApply, isApplying }: JobCardProps) {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const getJobTypeBadge = (type: string) => {
    const typeColors = {
      'internship': 'bg-purple-100 text-purple-800',
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-orange-100 text-orange-800'
    };
    return typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800';
  };

  const handleApply = () => {
    onApply(coverLetter);
    setIsApplicationOpen(false);
    setCoverLetter("");
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold">
                {job.company.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company}</p>
            </div>
          </div>
          <Badge className={getJobTypeBadge(job.type)}>
            {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{job.location}</span>
            {job.isRemote && (
              <>
                <Wifi className="h-4 w-4 ml-2 mr-1" />
                <span>Remote</span>
              </>
            )}
          </div>
          
          {job.salary && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>{job.salary}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{job.applicationCount || 0} applicants</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              Posted {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : 'recently'}
            </span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {job.description}
        </p>

        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Requirements:</h4>
            <div className="flex flex-wrap gap-1">
              {job.requirements.slice(0, 3).map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {req}
                </Badge>
              ))}
              {job.requirements.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{job.requirements.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <img 
              src={job.poster.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face`}
              alt={`${job.poster.firstName} ${job.poster.lastName}`} 
              className="w-6 h-6 rounded-full object-cover"
            />
            <span>Posted by {job.poster.firstName} {job.poster.lastName}</span>
          </div>
          
          {hasApplied ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Applied</span>
            </div>
          ) : (
            <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Apply for {job.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">{job.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{job.company}</p>
                    <p className="text-sm text-gray-600">{job.location}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter (Optional)
                    </label>
                    <Textarea
                      placeholder="Tell the employer why you're interested in this position and what makes you a good fit..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={6}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsApplicationOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleApply}
                      disabled={isApplying}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isApplying ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
