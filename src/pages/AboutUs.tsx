
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserIcon, HeartIcon, PawPrintIcon, ShieldIcon, HomeIcon } from 'lucide-react';

const teamMembers = [
  {
    name: 'Dhinesh',
    role: 'Frontend Developer',
    bio: 'Passionate about creating user-friendly interfaces and animal welfare.',
  },
  {
    name: 'Lakshya',
    role: 'Backend Developer',
    bio: 'Specializes in database design and server optimization. Animal lover with 2 rescue dogs.',
  },
  {
    name: 'Janani',
    role: 'UX Designer',
    bio: 'Creates intuitive user experiences. Volunteers at local animal shelters in free time.',
  },
  {
    name: 'Logeshwaran',
    role: 'Full Stack Developer',
    bio: 'Works on integration between frontend and backend systems. Advocate for stray animal care.',
  },
  {
    name: 'Rakshaya',
    role: 'Project Manager',
    bio: 'Coordinates team efforts and community outreach. Has rescued 5 stray cats over the years.',
  },
];

const AboutUsPage = () => {
  return (
    <Layout>
      <div className="paws-container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">About Paws & Places</h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600">
              Our mission is to create a better world for stray animals through community support and compassion.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center text-pawsOrange">
              <HeartIcon className="mr-2 h-6 w-6" />
              Our Mission
            </h2>
            <p className="text-gray-600 mb-4">
              Paws & Places was created with a simple but powerful goal: to help stray dogs and cats find care, food, and loving homes through community connection.
            </p>
            <p className="text-gray-600 mb-4">
              We believe that every stray animal deserves compassion, safety, and the chance for a better life. By connecting caring people with animals in need, we create a network of support that bridges the gap between homeless pets and potential caregivers or adopters.
            </p>
            <p className="text-gray-600">
              Our platform enables users to easily report stray animals, share their locations, and coordinate care efforts. Whether it's providing food, medical attention, temporary shelter, or a forever home, we facilitate the connection that makes it all possible.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center text-pawsBlue">
              <PawPrintIcon className="mr-2 h-6 w-6" />
              How It Works
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-pawsOrange-100 p-2 rounded-full mr-4 mt-1">
                  <ShieldIcon className="h-5 w-5 text-pawsOrange" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Report Stray Animals</h3>
                  <p className="text-gray-600">Users can report strays they encounter, providing details about their condition, location, and photos.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-pawsBlue-100 p-2 rounded-full mr-4 mt-1">
                  <HomeIcon className="h-5 w-5 text-pawsBlue" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Support & Adoption</h3>
                  <p className="text-gray-600">Community members can provide food, care, donations, or even adopt animals they see on the platform.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-pawsOrange-100 p-2 rounded-full mr-4 mt-1">
                  <HeartIcon className="h-5 w-5 text-pawsOrange" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Direct Donations</h3>
                  <p className="text-gray-600">Users can donate directly to the person caring for animals through GPay QR codes, ensuring resources reach strays quickly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-pawsBlue font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-pawsOrange-100 to-pawsBlue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Together, we can make a difference for stray animals in our communities. Every report, donation, and adoption helps create a better world for these deserving animals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/home" 
              className="px-6 py-3 bg-pawsOrange text-white rounded-md font-medium hover:bg-pawsOrange-600 transition-colors"
            >
              Browse Animals
            </a>
            <a 
              href="/add" 
              className="px-6 py-3 bg-pawsBlue text-white rounded-md font-medium hover:bg-pawsBlue-600 transition-colors"
            >
              Report a Stray
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUsPage;
