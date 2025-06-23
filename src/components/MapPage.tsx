
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";

const MapPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-green-600" />
            <span>Find Help Near You</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search for locations, organizations, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                Search
              </Button>
            </div>
            
            {/* Google Maps Embed */}
            <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2799160891!2d-74.25987368715491!3d40.697670063539654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1640995200000!5m2!1sen!2s"
                allowFullScreen
                title="Google Maps"
                className="rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card className="border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-700 mb-2">Nearby Organizations</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Food Bank Network</span>
                      <span className="text-gray-500">0.5 mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Community Center</span>
                      <span className="text-gray-500">1.2 mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Homeless Shelter</span>
                      <span className="text-gray-500">2.1 mi</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Active Requests</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Emergency supplies needed</span>
                      <span className="text-gray-500">0.8 mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Volunteer drivers wanted</span>
                      <span className="text-gray-500">1.5 mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meal preparation help</span>
                      <span className="text-gray-500">2.3 mi</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapPage;
