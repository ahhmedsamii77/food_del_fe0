import { Link } from "react-router-dom";
import { UtensilsCrossed, ExternalLink } from "lucide-react";

const LINKS = [
  { label: "Menu", to: "/" },
  { label: "About", to: "/about" },
  { label: "My Orders", to: "/orders" },
  { label: "Cart", to: "/cart" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                Food<span className="text-gradient-orange">Del</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Fast, fresh, and delivered with love. Your favorite meals at your doorstep in under 35 minutes.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-semibold text-sm mb-3">Quick Links</p>
            <ul className="space-y-2">
              {LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-semibold text-sm mb-3">Contact</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📍 Cairo, Egypt</li>
              <li>📞 +20 100 000 0000</li>
              <li>✉️ hello@foodel.eg</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FoodDel. All rights reserved.</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
