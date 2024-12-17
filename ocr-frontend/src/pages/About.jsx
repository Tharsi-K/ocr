import React from "react";
import {
  Users,
  Target,
  Globe2,
  BookOpen,
  Code2,
  Shield,
  Languages,
  MessageSquareText,
} from "lucide-react";

export default function About() {
  const missionPoints = [
    {
      icon: <Target className="h-6 w-6 text-blue-600" />,
      title: "Mission",
      description:
        "To preserve and enhance access to Tamil literature by converting PDF books into accurate, editable, and searchable text.",
    },
    {
      icon: <Globe2 className="h-6 w-6 text-blue-600" />,
      title: "Vision",
      description:
        "To become the leading platform for digitizing Tamil content, ensuring its longevity and global accessibility.",
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "Values",
      description:
        "Accuracy, cultural preservation, user collaboration, and technological innovation.",
    },
  ];

  const features = [
    {
      title: "Normal User",
      description:
        "The Normal User is the most basic user role in the system. Normal users can view books that have been reviewed and approved. By logging into the system, they gain additional privileges, such as uploading Tamil books in PDF format, participating in the review process, and editing the books they have uploaded. This role enables users to actively contribute to the preservation of Tamil literature by sharing and improving digital content.",
    },
    {
      title: "Reviewer ",
      description:
        "The Reviewer role is assigned to normal users who have expertise in the Tamil language. Reviewers are responsible for validating and proofreading the OCR-converted text to ensure accuracy and quality. They work collaboratively with other reviewers to identify and correct errors in the text. This role is essential to maintaining the integrity of the digitized content before it is submitted for admin approval, ensuring that the books meet the highest standards of precision.",
    },
    {
      title: "Admin",
      description:
        "The Admin plays a central role in managing the system by overseeing user accounts and assigning reviewer roles to users with Tamil language expertise. They review and approve books after proofreading, manage uploaded content, and monitor system activities to ensure smooth operation and high-quality results, contributing to the success of the Tamil Documents Digitalization System.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              About US
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl text-gray-600 sm:text-2xl md:mt-5 md:max-w-3xl">
              We specialize in transforming Tamil PDF books into editable and
              searchable text. Using advanced OCR technology and a meticulous
              human review process, we ensure high accuracy and accessibility,
              preserving Tamil literature for the digital age.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {missionPoints.map((point, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="p-3 bg-blue-50 rounded-full mb-4">
                  {point.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                <p className="text-gray-600">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Introduction</h2>
            <p className="mt-4 text-xl text-gray-600">
              The Tamil Documents Digitalization System is an innovative
              solution designed to convert Tamil books in PDF format into
              editable and searchable text. With the growing need to preserve
              and modernize traditional literature, this system bridges the gap
              between printed Tamil texts and digital accessibility. By
              transforming non-editable content, it ensures that Tamil books are
              easier to access, search, and edit in the digital era.
            </p>
            <p className="mt-4 text-xl text-gray-600">
              At the core of the system is advanced Optical Character
              Recognition (OCR) technology, which automates text extraction from
              PDF files. To guarantee the highest level of accuracy, the
              OCR-processed text undergoes a rigorous multi-level validation
              process involving human proofreaders and administrators. This
              meticulous review ensures that digitized content remains true to
              its original form, maintaining cultural and linguistic integrity.
            </p>
            <p className="mt-4 text-xl text-gray-600">
              The system promotes collaboration by allowing users to contribute
              Tamil books and participate in the review process. With a focus on
              user-friendly access and cultural preservation, the Tamil
              Documents Digitalization System serves readers, researchers, and
              enthusiasts, making Tamil literature readily available in editable
              and searchable formats for generations to come.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="p-2 bg-indigo-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            User Capabilities and Review Process
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            The User has several capabilities within the system. They can update
            their profile and delete their account at any time. Additionally,
            users can upload new books, edit the books they’ve added, and delete
            them if needed. Once a book is added, it goes through a two-stage
            review process, where it is checked for accuracy and quality by
            reviewers. After being reviewed twice, the book requires approval
            from the *Admin* before it is made public. This ensures that all
            content is thoroughly verified for accuracy before being shared with
            the public.
          </p>
        </div>
      </div>
    </div>
  );
}
