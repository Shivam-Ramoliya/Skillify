import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Layers,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  Briefcase,
} from "lucide-react";

const pillars = [
  {
    title: "Freelance-ready profiles",
    icon: <ShieldCheck className="w-8 h-8 text-primary-500" />,
    description:
      "Showcase your expertise, experience, and project links so clients can trust you quickly and hire you seamlessly.",
  },
  {
    title: "Open project collaboration",
    icon: <Layers className="w-8 h-8 text-primary-600" />,
    description:
      "Publish contribution opportunities and attract contributors by matching required skills and verified experience.",
  },
  {
    title: "Transparent applications",
    icon: <LayoutDashboard className="w-8 h-8 text-accent-500" />,
    description:
      "Track sent and received applications with clear status actions in one unified, clutter-free workspace.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    setPageTitle("Skillify | Freelancer Network");
    return () => resetPageTitle();
  }, []);

  return (
    <div className="relative overflow-hidden w-full app-shell">
      {/* Subtle Background Gradient Animations */}
      <div
        className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"
        style={{ backgroundColor: "var(--color-primary-200)" }}
      ></div>
      <div
        className="absolute top-60 right-0 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob pointer-events-none"
        style={{
          backgroundColor: "var(--color-accent-200)",
          animationDelay: "2s",
        }}
      ></div>

      <div className="page-container relative z-10 pt-24 pb-32">
        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center w-full max-w-none mx-auto px-4 mt-8"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full surface-card mb-8"
          >
            <span
              className="flex h-3 w-3 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--color-accent-500)" }}
            ></span>
            <span
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: "var(--color-primary-700)" }}
            >
              Freelancer + Open Source Workspace
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.15]"
            style={{ color: "var(--color-neutral-900)" }}
          >
            Build your career by shipping{" "}
            <span className="text-gradient-premium">real projects</span> with
            the perfect team
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12"
            style={{ color: "var(--color-neutral-600)" }}
          >
            Discover opportunities, publish projects, and manage
            applications—all in one powerful platform built for freelancers.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10"
          >
            {user ? (
              <>
                <Link
                  to="/discover"
                  className="btn-primary flex items-center gap-2 group w-full sm:w-auto"
                >
                  <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Discover Jobs
                </Link>
                <Link
                  to="/publish-job"
                  className="btn-secondary w-full sm:w-auto"
                >
                  Publish a Job
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="btn-primary flex items-center gap-2 group w-full sm:w-auto"
                >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="btn-secondary w-full sm:w-auto">
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </motion.section>

        {/* Feature Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-40 w-full xl:w-[90%] mx-auto px-4 relative z-20"
        >
          <div className="glass-card p-10 md:p-14 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/3">
                <h2
                  className="text-3xl font-extrabold tracking-tight mb-4"
                  style={{ color: "var(--color-neutral-900)" }}
                >
                  Everything you need
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: "var(--color-neutral-600)" }}
                >
                  Tools designed to help you find work, showcase your skills,
                  and ship real projects.
                </p>
              </div>
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  "Publish global jobs",
                  "Apply instantly",
                  "Track real-time statuses",
                  "Manage rich profiles",
                  "Share your portfolio",
                  "Collaborate globally",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    whileHover={{ scale: 1.03 }}
                    className="px-5 py-4 text-sm font-bold flex items-center gap-3 rounded-2xl cursor-default transition-all"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.8)",
                      color: "var(--color-neutral-800)",
                      border: "1px solid var(--color-neutral-200)",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                    }}
                  >
                    <CheckCircle2
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "var(--color-primary-500)" }}
                    />
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Pillars Section */}
        <section className="mt-40 w-full mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
              style={{ color: "var(--color-neutral-900)" }}
            >
              Built for <span className="text-gradient">real workflows</span>
            </h2>
            <p
              className="mt-6 text-xl max-w-2xl mx-auto"
              style={{ color: "var(--color-neutral-600)" }}
            >
              Everything is designed to keep hiring and collaboration simple,
              transparent, and remarkably fast.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <motion.article
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="glass-card-hover p-10 relative group overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 w-full h-1.5 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  style={{ backgroundColor: "var(--color-primary-500)" }}
                ></div>
                <div
                  className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300"
                  style={{ border: "1px solid var(--color-neutral-200)" }}
                >
                  {pillar.icon}
                </div>
                <h3
                  className="text-2xl font-bold mb-4 tracking-tight"
                  style={{ color: "var(--color-neutral-900)" }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="leading-relaxed text-base"
                  style={{ color: "var(--color-neutral-600)" }}
                >
                  {pillar.description}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-40 w-full xl:w-[80%] mx-auto px-4"
        >
          <div
            className="relative rounded-[2.5rem] overflow-hidden p-14 md:p-24 text-center shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-accent-600) 100%)",
            }}
          >
            <div
              className="absolute inset-0 bg-white opacity-5 mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
              }}
            ></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                Ready to build your freelance career?
              </h2>
              <p
                className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium"
                style={{ color: "var(--color-primary-50)" }}
              >
                Join thousands of professionals shipping real projects with the
                perfect team.
              </p>
              {user ? (
                <Link
                  to="/discover"
                  className="btn-secondary text-lg px-10 py-4 shadow-xl text-primary-800"
                >
                  Explore Opportunities Now
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="btn-secondary text-lg px-10 py-4 shadow-xl"
                  style={{ color: "var(--color-primary-800)" }}
                >
                  Create Your Free Account
                </Link>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
