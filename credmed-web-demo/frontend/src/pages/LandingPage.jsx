import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  TrendingDown, 
  Target, 
  ArrowRight, 
  CheckCircle2,
  AlertTriangle,
  Users,
  FileCheck,
  BarChart3
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
            <ShieldCheck size={16} />
            <span>Agentic AI for Healthcare Directory Validation</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Automated Directory Management
            <span className="block text-teal-600 mt-2">for Healthcare Payers</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            An autonomous multi-agent system that validates, enriches, and maintains healthcare provider data 
            — with minimal human input. Delivering 70% faster validation, 60% cost reduction, and 90%+ accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/validate"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Validation
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border border-gray-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">The Problem</h2>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-lg text-lg font-semibold">
                <AlertTriangle size={24} />
                <span>80% of healthcare provider directories contain outdated or incorrect information</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Patient Impact</h3>
                <p className="text-gray-700">
                  Patients face incorrect addresses, invalid phone numbers, and unavailable doctors, 
                  leading to poor patient experience and delayed care.
                </p>
              </div>
              
              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Operational Burden</h3>
                <p className="text-gray-700">
                  Insurers and hospitals waste hours verifying data manually, increasing costs 
                  and reducing efficiency.
                </p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Compliance Risk</h3>
                <p className="text-gray-700">
                  Organizations face compliance risks under regulations (e.g., CMS mandates 90% accuracy), 
                  potentially leading to penalties.
                </p>
              </div>
              
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Business Impact</h3>
                <p className="text-gray-700">
                  Poor data quality results in financial losses, reputational harm, and decreased 
                  patient trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Overview Section */}
      <section className="py-16 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">The Solution</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A hybrid system with autonomous validation agents and a web portal for admins to 
                oversee and approve verified healthcare data.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileCheck className="text-teal-600" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Validation Agent</h3>
                <p className="text-gray-600 text-sm">
                  Cross-verifies names, phone numbers, and addresses from online sources (NPI registry, 
                  hospital sites, Google Maps).
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-green-600" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Enrichment Agent</h3>
                <p className="text-gray-600 text-sm">
                  Adds missing information such as specialties, licenses, and hospital affiliations.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="text-purple-600" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Quality Assurance Agent</h3>
                <p className="text-gray-600 text-sm">
                  Detects inconsistencies and assigns confidence scores to each record.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-orange-600" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Reporting Agent</h3>
                <p className="text-gray-600 text-sm">
                  Generates validation reports and updates the master directory automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Benefits</h2>
              <p className="text-xl text-gray-600">
                Smarter, faster, and auditable — reducing human effort while improving accuracy
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-teal-600" size={32} />
                </div>
                <div className="text-4xl font-bold text-teal-600 mb-2">70%</div>
                <div className="text-gray-600 font-semibold mb-2">Faster Validation</div>
                <p className="text-sm text-gray-500">Reduced data verification time significantly</p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="text-green-600" size={32} />
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">60%</div>
                <div className="text-gray-600 font-semibold mb-2">Cost Reduction</div>
                <p className="text-sm text-gray-500">Decreased manual labor costs</p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="text-purple-600" size={32} />
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-2">90%+</div>
                <div className="text-gray-600 font-semibold mb-2">Accuracy Rate</div>
                <p className="text-sm text-gray-500">Verified records meet compliance standards</p>
              </div>
            </div>
            
            <div className="mt-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Innovation Highlights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={20} />
                      <span>Multi-agent orchestration using LangChain or CrewAI</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={20} />
                      <span>Confidence-based data scoring system</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={20} />
                      <span>End-to-end auditability for compliance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={20} />
                      <span>Intelligent prioritization for human review</span>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <Link
                    to="/validate"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
                  >
                    Get Started
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-cyan-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Directory Management?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Start validating your healthcare provider data today with our automated AI system.
          </p>
          <Link
            to="/validate"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start Validation Job
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

