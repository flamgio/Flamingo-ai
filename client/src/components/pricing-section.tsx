import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SparkleIcon, HumanMadeIcon } from '@/components/ui/icons';

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Flamingo Free',
    price: '$0',
    description: 'Perfect for getting started with AI assistance',
    features: [
      'Basic AI routing',
      'Limited daily queries',
      'Standard models',
      'Community support'
    ]
  },
  {
    name: 'Flamingo+',
    price: '$19',
    description: 'Advanced features for power users',
    features: [
      'Advanced AI routing',
      'Unlimited queries',
      'Premium models',
      'Priority support',
      'Enhanced prompts',
      'Custom integrations'
    ],
    popular: true
  }
];

// Custom check icon - Human curated
const CheckIcon = () => (
  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group">
    <svg className="w-3 h-3 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

// Human curated popular badge
const StarIcon = () => (
  <div className="flex items-center space-x-1">
    <SparkleIcon size="sm" />
    <HumanMadeIcon size="sm" />
  </div>
);

export default function PricingSection() {
  return (
    <div className="py-16 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Scale your AI usage with plans designed for every need
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-xl scale-105' 
                  : 'border border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-blue-600 text-white px-4 py-1 text-sm font-medium flex items-center space-x-1">
                  <StarIcon />
                  <span>Popular</span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {plan.price}
                  </span>
                  {plan.price !== '$0' && (
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckIcon />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.price === '$0' ? 'Get Started Free' : 'Upgrade Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}