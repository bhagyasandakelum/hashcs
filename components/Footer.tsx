import { Facebook, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-zinc-900">About Hashcs</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Dedicated to deep dives and clear explanations of core computer science theories, helping readers grasp fundamental concepts with ease and precision.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-zinc-900">Explore</h3>
          <ul className="space-y-2 text-sm text-zinc-600">
            <li>Cybersecurity</li>
            <li>Networking</li>
            <li>Cloud</li>
            <li>AI & ML</li>
            <li>Data Science</li>
            <li>SDLC</li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-zinc-900">Follow Us</h3>
          <div className="flex gap-5 text-zinc-600">
            <a href="#" className="hover:text-black transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-black transition">
              <Linkedin size={20} />
            </a>
            <a href="#" className="hover:text-black transition">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Hashcs. All rights reserved.
      </div>
    </footer>
  );
}
