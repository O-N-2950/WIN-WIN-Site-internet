import { Button } from "@/components/ui/button";
import { ROUTES, COMPANY_INFO } from "@/const";
import {
  Target,
  ArrowRight,
  CheckCircle2,
  Award,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Particule flottante
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Gradient animé
function AnimatedGradient() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(135deg, hsl(203, 55%, 38%), hsl(203, 55%, 45%), hsl(205, 40%, 69%))',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Texte qui apparaît lettre par lettre
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const letters = text.split("");
  
  return (
    <span>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: delay + index * 0.03,
            ease: [0.6, -0.05, 0.01, 0.99],
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
}

export default function SpectacularHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background animé */}
      <AnimatedGradient />
      
      {/* Particules flottantes */}
      <FloatingParticles />
      
      {/* Grille de fond */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Effet de lumière */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Content avec parallaxe */}
      <motion.div 
        className="container relative z-10 py-20"
        style={{ y, opacity }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge FINMA avec animation pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Award className="w-5 h-5 text-yellow-300" />
            </motion.div>
            <span className="text-sm font-semibold">Autorisé FINMA {COMPANY_INFO.finma}</span>
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </motion.div>

          {/* Titre principal avec effet typewriter */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <TypewriterText text="Libérez-vous de la Gestion" delay={0.5} />
            <br />
            <span className="text-accent">
              <TypewriterText text="de Vos Assurances" delay={1.5} />
            </span>
          </h1>

          {/* Sous-titre avec fade in */}
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl mb-10 text-white/90 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            99% des gens détestent gérer leurs assurances. Nous le faisons pour vous.
          </motion.p>

          {/* Boutons CTA avec animations hover spectaculaires */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-5 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.8 }}
          >
            <Link href={ROUTES.questionnaireInfo}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="relative bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-10 py-7 h-auto shadow-2xl overflow-hidden group"
                >
                  {/* Effet de brillance au hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <Target className="w-6 h-6 mr-2" />
                  Devenir Client
                  <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/conseil">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 hover:bg-white/20 border-2 border-white/40 text-primary font-bold text-lg px-10 py-7 h-auto backdrop-blur-md shadow-xl"
                >
                  Demandez Conseil
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Badges de confiance avec stagger */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.8 }}
          >
            {[
              { icon: CheckCircle2, text: "Sans engagement" },
              { icon: CheckCircle2, text: "Réponse sous 24h" },
              { icon: CheckCircle2, text: "100% confidentiel" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.5 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              >
                <item.icon className="w-5 h-5 text-accent" />
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Indicateur de scroll animé */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
