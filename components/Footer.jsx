"use client"
import Link from 'next/link';
import { useScroll } from './ScrollContext';
import { useRef, useState } from 'react';

export default function Footer() {
    const { scrollTo, refs } = useScroll();
    const [glow, setGlow] = useState(false);
    const boxRef = useRef(null);
    const triggerGlow = () => {
        setGlow(true);
        setTimeout(() => setGlow(false), 1500); // remove glow after 1.5s
    };
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
                {/* Company Info */}
                <div>
                    <h2 className="text-xl font-semibold">Finance Manager</h2>
                    <p className="mt-2 text-gray-400">Your smart partner in managing finances efficiently.</p>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-xl font-semibold">Quick Links</h2>
                    <ul className="mt-2 space-y-2">
                        <Link href="/#about"><li><button onClick={() => scrollTo(refs.aboutRef)} className="text-gray-400 hover:text-white">About Us</button></li></Link>
                        <Link href="/#features"><li><button onClick={() => scrollTo(refs.featureRef)} className="text-gray-400 hover:text-white">Features</button></li></Link>
                        <Link href="/#works"><li><button onClick={() => scrollTo(refs.worksRef)} className="text-gray-400 hover:text-white">How it Works</button></li></Link>
                        <li><button onClick={triggerGlow} className="text-gray-400 hover:text-white">Contact</button></li>
                    </ul>
                </div>

                {/* Contact & Social Media */}
                <div ref={boxRef} className={` ${glow ? "glow" : ""}`}
                >
                    <h2 className="text-xl font-semibold">Get in Touch</h2>
                    <p className="mt-2 text-gray-400">Email: support@financemanager.com</p>
                    <p className="text-gray-400">Phone: +1 234 567 890</p>
                    <div className="mt-4 flex space-x-4"></div>
                </div>
            </div>
            <div className="text-center mt-6 border-t border-gray-700 pt-4 text-gray-400">
                &copy; {new Date().getFullYear()} Finance Manager. All rights reserved.
            </div>
        </footer>
    );
}
