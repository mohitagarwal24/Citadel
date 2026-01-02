'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  BarChart3, 
  Shield, 
  Zap, 
  TrendingUp, 
  Package,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Advanced Analytics',
      description: 'Real-time insights into sales, inventory, and performance metrics',
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: 'Product Management',
      description: 'Complete CRUD operations with multi-step forms and validation',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure Authentication',
      description: 'Role-based access control with NextAuth.js integration',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Server-Side Rendering',
      description: 'Lightning-fast page loads with Next.js SSR technology',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Sales Tracking',
      description: 'Monitor sales trends and revenue with interactive charts',
    },
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: 'Inventory Control',
      description: 'Track stock levels and get alerts for low inventory',
    },
  ];

  const benefits = [
    'Multi-step product creation with validation',
    'Cloudinary image upload and management',
    'Interactive data visualization',
    'Real-time inventory tracking',
    'Responsive and modern UI',
    'SEO optimized with SSR',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <ShoppingBag className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Citadel
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            E-commerce Admin
            <br />
            Dashboard
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Powerful server-rendered dashboard for managing your e-commerce products with
            real-time analytics and beautiful UI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-lg px-8 py-6"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Admin Login
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Image/Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 relative"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-24 w-24 text-slate-400" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-slate-600">
            Comprehensive features for modern e-commerce management
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-blue-500 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Built for Modern E-commerce
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Citadel provides all the tools you need to manage your products efficiently
                with a beautiful, intuitive interface powered by the latest web technologies.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-32 bg-slate-200 rounded"></div>
                    <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-24 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-lg"></div>
                    <div className="h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses managing their products with Citadel
          </p>
          <Link href="/auth/register">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-indigo-600 hover:bg-slate-100 text-lg px-8 py-6"
            >
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingBag className="h-8 w-8" />
            <span className="text-2xl font-bold">Citadel</span>
          </div>
          <p className="text-slate-400 mb-4">
            Modern E-commerce Admin Dashboard
          </p>
          <p className="text-slate-500 text-sm">
            © 2024 Citadel. Built with Next.js, MongoDB, and ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
