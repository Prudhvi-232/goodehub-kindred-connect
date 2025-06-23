
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, DollarSign, Users, Globe } from "lucide-react";

const DonationPage = () => {
  const [customAmount, setCustomAmount] = useState("");

  const trustedOrganizations = [
    {
      name: "Red Cross",
      description: "Emergency relief and disaster response worldwide",
      rating: "★★★★★",
      image: "🏥",
      category: "Emergency Relief"
    },
    {
      name: "Doctors Without Borders",
      description: "Medical humanitarian aid in crisis zones",
      rating: "★★★★★",
      image: "👨‍⚕️",
      category: "Healthcare"
    },
    {
      name: "World Food Programme",
      description: "Fighting hunger and providing food assistance",
      rating: "★★★★★",
      image: "🍽️",
      category: "Food Security"
    },
    {
      name: "UNICEF",
      description: "Children's rights and emergency relief for kids",
      rating: "★★★★★",
      image: "👶",
      category: "Children's Welfare"
    },
    {
      name: "Habitat for Humanity",
      description: "Building homes and communities worldwide",
      rating: "★★★★☆",
      image: "🏠",
      category: "Housing"
    },
    {
      name: "Oxfam",
      description: "Fighting inequality and poverty globally",
      rating: "★★★★☆",
      image: "🌍",
      category: "Poverty Relief"
    }
  ];

  const donationAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-500" />
            <span>Make a Difference Today</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="organizations" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="organizations">Trusted Organizations</TabsTrigger>
              <TabsTrigger value="goodhub">Support Goodhub</TabsTrigger>
            </TabsList>
            
            <TabsContent value="organizations" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Support Verified Organizations
                </h3>
                <p className="text-gray-600 mb-6">
                  These organizations have been vetted for transparency and impact. Your donations go directly to their verified programs.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trustedOrganizations.map((org, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="text-3xl">{org.image}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{org.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{org.description}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {org.category}
                              </span>
                              <span className="text-sm text-yellow-600">{org.rating}</span>
                            </div>
                            <div className="flex space-x-2">
                              {[25, 50, 100].map((amount) => (
                                <Button key={amount} size="sm" variant="outline" className="text-xs">
                                  ${amount}
                                </Button>
                              ))}
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                                Custom
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="goodhub" className="mt-6">
              <div className="space-y-6">
                <div className="text-center">
                  <Globe className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Support Goodhub</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Help us maintain and improve our platform to connect more people with opportunities to make a difference.
                  </p>
                </div>

                <Card className="max-w-md mx-auto">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4">Choose Donation Amount</h4>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {donationAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          className="hover:bg-green-50 hover:border-green-300"
                          onClick={() => setCustomAmount(amount.toString())}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Amount
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                        <Heart className="w-4 h-4 mr-2" />
                        Donate ${customAmount || '0'} to Goodhub
                      </Button>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 text-center">
                      <p>Your donation helps us:</p>
                      <ul className="mt-2 space-y-1">
                        <li>• Maintain server infrastructure</li>
                        <li>• Develop new features</li>
                        <li>• Support community outreach</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationPage;
