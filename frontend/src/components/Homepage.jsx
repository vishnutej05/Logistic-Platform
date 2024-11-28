import React, { useState, useEffect } from "react";
import {
  FaTruck,
  FaUser,
  FaUserTie,
  FaMapMarkedAlt,
  FaCreditCard,
  FaCheck,
} from "react-icons/fa";
import { BiCurrentLocation } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { FiInstagram, FiTwitter, FiFacebook, FiLinkedin } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("user");
  const navigate = useNavigate();

  const roles = {
    user: {
      title: "User",
      icon: <FaUser className="text-4xl text-indigo-600" />,
      steps: [
        "Create a booking request",
        "Select available driver",
        "Track delivery real-time",
        "Receive notifications",
      ],
    },
    driver: {
      title: "Driver",
      icon: <FaTruck className="text-4xl text-emerald-600" />,
      steps: [
        "Accept delivery requests",
        "Start delivery journey",
        "Update delivery status",
        "Complete deliveries",
      ],
    },
    admin: {
      title: "Admin",
      icon: <FaUserTie className="text-4xl text-fuchsia-600" />,
      steps: [
        "Manage entire fleet",
        "Approve new drivers",
        "Monitor deliveries",
        "Ensure compliance",
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      >
        <div className="text-center text-white z-10 px-4">
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          >
            Shiftly
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl mb-8"
          >
            Moving the Future, One Parcel at a Time
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigate("/register");
            }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300"
          >
            Get Started
          </motion.button>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <div className="py-20 px-4 bg-white">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          How It Works
        </motion.h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-6xl mx-auto">
          {Object.keys(roles).map((role) => (
            <motion.div
              key={role}
              whileHover={{ scale: 1.02 }}
              className={`flex-1 p-8 rounded-xl cursor-pointer transition-all duration-300 ${
                activeTab === role
                  ? "bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(role)}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {roles[role].icon}
                </motion.div>
                <h3 className="text-2xl font-semibold mt-4 mb-6">
                  {roles[role].title}
                </h3>
                <ul className="space-y-4">
                  {roles[role].steps.map((step, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <FaCheck className="text-emerald-500" />
                      <span>{step}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Real-Time Tracking Section */}
      <div className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Real-Time Tracking
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-center gap-4"
              >
                <BiCurrentLocation className="text-3xl text-indigo-600" />
                <div>
                  <h3 className="text-xl font-semibold">
                    Live Location Updates
                  </h3>
                  <p className="text-gray-600">
                    Track your delivery in real-time
                  </p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-center gap-4"
              >
                <FaMapMarkedAlt className="text-3xl text-indigo-600" />
                <div>
                  <h3 className="text-xl font-semibold">Route Optimization</h3>
                  <p className="text-gray-600">
                    Smart routing for faster deliveries
                  </p>
                </div>
              </motion.div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-xl shadow-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3"
                alt="Map Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Payment Process Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold mb-16 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Secure Payment Process
          </motion.h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-1 p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-lg transition-all duration-300"
            >
              <FaCreditCard className="text-4xl text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Safe Transactions</h3>
              <p className="text-gray-600">End-to-end encrypted payments</p>
            </motion.div>
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <BsArrowRight className="text-3xl text-indigo-400 hidden md:block" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-1 p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-lg transition-all duration-300"
            >
              <FaCheck className="text-4xl text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Instant Settlement</h3>
              <p className="text-gray-600">Quick payment processing</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-indigo-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                GoodsBecho
              </h3>
              <p className="text-gray-400">Revolutionary logistics platform</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <motion.div whileHover={{ scale: 1.2, color: "#1DA1F2" }}>
                  <FiTwitter className="text-xl cursor-pointer" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2, color: "#4267B2" }}>
                  <FiFacebook className="text-xl cursor-pointer" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2, color: "#E1306C" }}>
                  <FiInstagram className="text-xl cursor-pointer" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2, color: "#0077B5" }}>
                  <FiLinkedin className="text-xl cursor-pointer" />
                </motion.div>
              </div>
            </motion.div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} GoodsBecho. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
