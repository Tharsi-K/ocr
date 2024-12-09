import React from 'react';
import { Link } from 'react-router-dom';
import { ScanText, Zap, Check, Clock, CloudLightning, Upload, Cpu, FileText } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: 'Fast Processing',
      description: 'Convert your images to text within seconds using our optimized OCR engine'
    },
    {
      icon: <Check className="h-6 w-6 text-blue-600" />,
      title: 'High Accuracy',
      description: 'Advanced AI technology ensures precise Tamil text recognition'
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: 'Instant Results',
      description: 'Get your converted text immediately, no waiting time'
    },
    {
      icon: <CloudLightning className="h-6 w-6 text-blue-600" />,
      title: 'Cloud Processing',
      description: 'Process your images anywhere, anytime with cloud technology'
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Convert Tamil Text from Images with Ease
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Transform your Tamil language images into editable text instantly using our advanced OCR technology.
                Fast, accurate, and free to use.
              </p>
              <Link 
                to="/sign-in" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-700 transition-colors inline-flex"
              >
                <ScanText className="h-5 w-5" />
                <span>Start Converting Now</span>
              </Link>
            </div>
            <div className="lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1618788372246-79faff0c3742?auto=format&fit=crop&q=80&w=2940"
                alt="Tamil manuscript"
                className="rounded-lg shadow-2xl" style={{ height: "50vh" ,width:"600px"}}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose TamilOCR?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
              <p className="text-gray-600">Upload any image containing Tamil text</p>
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Cpu className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Process</h3>
              <p className="text-gray-600">Our AI processes and recognizes the text</p>
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-gray-600">Download your converted Tamil text</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}