import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  TrendingDown, 
  Target, 
  ArrowRight,
  FileCheck,
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  RefreshCw
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
      {/* Header Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              About CredMed AI
            </h1>
            <p className="text-xl text-gray-600">
              Providing Data Validation and Directory Management Agent for Healthcare Payers
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">System Overview</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                CredMed AI is an autonomous multi-agent system designed to validate, enrich, and maintain 
                healthcare provider data with minimal human input. Our solution addresses the critical 
                problem of outdated and incorrect information in healthcare provider directories, which 
                affects 80% of all directories.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                By leveraging advanced AI agents and multi-agent orchestration, we deliver a hybrid system 
                that combines autonomous validation with a user-friendly web portal for administrators to 
                oversee and approve verified healthcare data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our AI Agents</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-8 border border-teal-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-teal-600 w-12 h-12 rounded-lg flex items-center justify-center">
                    <FileCheck className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Validation Agent</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Cross-verifies provider information including names, phone numbers, and addresses from 
                  multiple online sources including the NPI registry, hospital websites, and Google Maps. 
                  Ensures data accuracy through multi-source validation.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Enrichment Agent</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Automatically adds missing information such as medical specialties, professional licenses, 
                  hospital affiliations, and other critical provider details. Enhances directory completeness 
                  and usefulness.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border border-purple-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Quality Assurance Agent</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Detects inconsistencies across data sources and assigns confidence scores to each record. 
                  Flags records requiring human review and ensures only high-quality data enters the system.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 border border-orange-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Reporting Agent</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Generates comprehensive validation reports with detailed audit trails and automatically 
                  updates the master directory. Provides full transparency and compliance documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Traditional vs. Agentic AI</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Traditional Process */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="text-gray-500" size={24} />
                  Traditional Manual Process
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs">✗</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Time-Consuming</div>
                      <div className="text-gray-600 text-sm">70% slower data verification</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs">✗</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">High Labor Costs</div>
                      <div className="text-gray-600 text-sm">Manual verification required for all records</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs">✗</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Limited Auditability</div>
                      <div className="text-gray-600 text-sm">Difficult to track changes and compliance</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs">✗</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Static Updates</div>
                      <div className="text-gray-600 text-sm">Periodic manual updates only</div>
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Agentic AI System */}
              <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="text-yellow-300" size={24} />
                  Agentic AI System
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="text-green-800" size={16} />
                    </div>
                    <div>
                      <div className="font-semibold">70% Faster</div>
                      <div className="text-teal-100 text-sm">Automated data verification</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="text-green-800" size={16} />
                    </div>
                    <div>
                      <div className="font-semibold">60% Cost Reduction</div>
                      <div className="text-teal-100 text-sm">Intelligent prioritization for human review</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="text-green-800" size={16} />
                    </div>
                    <div>
                      <div className="font-semibold">90%+ Accuracy</div>
                      <div className="text-teal-100 text-sm">Verified records meet compliance standards</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="text-green-800" size={16} />
                    </div>
                    <div>
                      <div className="font-semibold">Continuous Updates</div>
                      <div className="text-teal-100 text-sm">Real-time validation capability</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Key Benefits & Innovation</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-teal-50 rounded-xl">
                <div className="bg-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-white" size={32} />
                </div>
                <div className="text-4xl font-bold text-teal-600 mb-2">70%</div>
                <div className="text-gray-700 font-semibold mb-2">Faster Validation</div>
                <p className="text-sm text-gray-600">Reduced data verification time significantly</p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-white" size={32} />
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">60%</div>
                <div className="text-gray-700 font-semibold mb-2">Cost Reduction</div>
                <p className="text-sm text-gray-600">Decreased manual labor costs</p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="text-white" size={32} />
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-2">90%+</div>
                <div className="text-gray-700 font-semibold mb-2">Accuracy Rate</div>
                <p className="text-sm text-gray-600">Verified records meet compliance standards</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Innovation Highlights</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-yellow-300" />
                    <span>Multi-agent orchestration using LangChain or CrewAI</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-yellow-300" />
                    <span>Confidence-based data scoring system</span>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-yellow-300" />
                    <span>End-to-end auditability for compliance</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-yellow-300" />
                    <span>Intelligent prioritization for human review (only low-confidence data)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-cyan-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Experience the power of automated directory validation and transform your healthcare data management.
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

