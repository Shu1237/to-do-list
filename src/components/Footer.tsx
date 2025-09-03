import React from "react";
import { Mail, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted/30 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Bản quyền */}
        <span className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} <span className="font-semibold">To Do List</span>. All rights reserved.
        </span>

        {/* Liên hệ */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a
            href="mailto:ttei8191@gmail.com"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Mail size={16} />
            Email
          </a>
          <a
            href="https://github.com/your-github"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Github size={16} />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
