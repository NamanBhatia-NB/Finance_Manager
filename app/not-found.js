"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
    return (
        <div>
            <div className="container mx-auto flex flex-col items-center justify-center min-h-screen px-6">
                <motion.h1
                    className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    404
                </motion.h1>

                <motion.h2
                    className="text-2xl font-semibold mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                >
                    Oops! Page Not Found
                </motion.h2>

                <motion.p
                    className="text-gray-600 mt-3 text-center max-w-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                >
                    It seems like you&#39;ve ventured into unknown financial territory. Let&#39;s
                    get you back to a safe investment!
                </motion.p>

                <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.7 }}
                >
                    <Link href="/">
                        <Button className="px-6 py-6 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-lg transition duration-300">
                            Return to Homepage
                        </Button>
                    </Link>
                </motion.div>
            </div>
            <div className="w-full h-[2px] bg-white animate-pulse"></div>

        </div>
    );
}
