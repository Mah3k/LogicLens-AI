import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "../common/Button";
import CodePreview from "./CodePreview";
import "./Hero.css";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-glow" />
      <div className="container hero-inner">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="eyebrow">
            <Sparkles size={13} /> AI code review, on demand
          </span>
          <h1 className="hero-title">
            Your AI-Powered
            <br />
            <span className="gradient-text">Code Mentor</span>
          </h1>
          <p className="hero-desc">
            Paste a function or upload a file. LogicLens reads it line by line,
            flags real bugs, rewrites it cleaner, and writes the tests you
            didn't have time for.
          </p>
          <div className="hero-cta">
            <Button
              size="lg"
              iconRight={ArrowRight}
              onClick={() => navigate("/register")}
            >
              Start Analyzing Code
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Features
            </Button>
          </div>
          <div className="hero-trust">
            <span>Java</span>
            <span>Python</span>
            <span>JavaScript</span>
            <span>C++</span>
            <span>TypeScript</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <CodePreview />
        </motion.div>
      </div>
    </section>
  );
}
