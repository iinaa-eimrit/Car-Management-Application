import React from "react";
import { Link } from "react-router-dom";
import { FaCar, FaChartLine, FaCog, FaUsersCog } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Home.scss";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

const Home = () => {
  return (
    <div className="home">
      <nav>
        <motion.div
          className="logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaCar /> CarMaster
        </motion.div>
        <ul className="home-links">
          <ShowOnLogout>
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/register">Register</Link>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/login">Login</Link>
            </motion.li>
          </ShowOnLogout>
          <ShowOnLogin>
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/dashboard">Dashboard</Link>
            </motion.li>
          </ShowOnLogin>
        </ul>
      </nav>

      <header className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>
            Revolutionize Your <span className="highlight">Car Fleet</span> Management
          </h1>
          <p>
            Streamline operations, boost efficiency, and drive your business forward
            with our cutting-edge car management solution.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">
              Start Free Trial
            </Link>
            <Link to="/contact-us" className="btn btn-secondary">
              Schedule Demo
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="car-icon">
            <FaCar />
          </div>
        </motion.div>
      </header>

      <section className="features">
        <h2>Powerful Features for Seamless Management</h2>
        <div className="feature-grid">
          <FeatureCard
            icon={<FaCar />}
            title="Fleet Tracking"
            description="Real-time GPS tracking and status updates for your entire fleet."
          />
          <FeatureCard
            icon={<FaChartLine />}
            title="Performance Analytics"
            description="Comprehensive insights and reports to optimize your operations."
          />
          <FeatureCard
            icon={<FaCog />}
            title="Maintenance Scheduler"
            description="Automated service reminders and maintenance history tracking."
          />
          <FeatureCard
            icon={<FaUsersCog />}
            title="Driver Management"
            description="Efficiently manage driver assignments, schedules, and performance."
          />
        </div>
      </section>

      <section className="testimonial">
        <div className="testimonial-content">
          <h2>What Our Clients Say</h2>
          <blockquote>
            "CarMaster has transformed our fleet management process. We've seen a 30% 
            increase in efficiency and significant cost savings. It's an indispensable 
            tool for our business."
          </blockquote>
          <cite>- John Doe, CEO of Fleet Solutions Inc.</cite>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Optimize Your Car Management?</h2>
        <p>Join thousands of satisfied customers and take control of your fleet today.</p>
        <Link to="/register" className="btn btn-primary">
          Get Started Now
        </Link>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="feature-card"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

export default Home;