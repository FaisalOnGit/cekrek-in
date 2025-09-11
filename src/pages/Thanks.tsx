import { motion } from "framer-motion";
import bg from "/bg2.png";
import love from "/love.png";
import smile from "/smile.png";
import RetroButton from "../components/ui/RetroButton";

function ThanksPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center pt-20"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <motion.h1
        className="text-2xl md:text-4xl text-primary mb-12 text-center"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Thank U Netizen Cekrek
      </motion.h1>

      <div className="flex gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.img
            key={i}
            src={love}
            alt="love"
            className="w-12 h-12"
            animate={{
              scale: [1, 1.3, 1],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <motion.h1
        className="text-2xl text-black mt-6 text-center"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Tell us about you✨
      </motion.h1>

      <div className="mt-6 flex flex-col gap-8 w-1/2 relative">
        <motion.img
          src={smile}
          alt="smile"
          className="absolute inset-0 mx-auto w-56 h-56 z-10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <input
          type="text"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
          placeholder="Your Name"
          className="self-start px-4 py-4 w-72 border border-gray-300 rounded-3xl rounded-br-none focus:outline-none focus:ring-2 focus:ring-primary relative z-10"
        />

        <input
          type="email"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
          placeholder="Your Email"
          className="self-end px-4 py-4 w-72 border border-gray-300 rounded-3xl rounded-br-none focus:outline-none focus:ring-2 focus:ring-primary relative z-10"
        />
        <RetroButton>Submit</RetroButton>
      </div>
    </div>
  );
}

export default ThanksPage;
