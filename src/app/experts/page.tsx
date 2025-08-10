import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

// Mock data - in real app this would come from database
const experts = [
  {
    id: 'expert-1',
    name: 'Expert 1',
    bio: 'Experienced developer with 6 years in the industry. Specializes in Frontend development.',
    expertise: ['React', 'TypeScript', 'Next.js'],
    hourlyRate: 60000,
    avatar: null,
  },
  {
    id: 'expert-2',
    name: 'Expert 2',
    bio: 'Experienced developer with 7 years in the industry. Specializes in Frontend development.',
    expertise: ['React', 'TypeScript', 'Next.js'],
    hourlyRate: 70000,
    avatar: null,
  },
  {
    id: 'expert-3',
    name: 'Expert 3',
    bio: 'Experienced developer with 8 years in the industry. Specializes in Backend development.',
    expertise: ['Node.js', 'Python', 'Databases'],
    hourlyRate: 80000,
    avatar: null,
  },
]

export default function ExpertsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Expert
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our verified experts and book a personalized coding session.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experts.map((expert) => (
            <Card key={expert.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨‍💻</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{expert.name}</CardTitle>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatCurrency(expert.hourlyRate)} / hour
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {expert.bio}
                </CardDescription>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {expert.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href={`/experts/${expert.id}`}>
                    View Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}