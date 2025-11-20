import { APP_TITLE, APP_LOGO, CONTACT_INFO, ROUTES } from "@/const";
import { Button } from "@/components/ui/button";
import { Menu, Phone, Mail, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Libre Passage", href: "/libre-passage" },
  { name: "Protection Juridique", href: "/protection-juridique" },
  { 
    name: "Concepts", 
    href: "/concepts/talentis",
    submenu: [
      { name: "Talentis", href: "/concepts/talentis" },
      { name: "Durabilis", href: "/concepts/durabilis" },
      { name: "Synergis", href: "/concepts/synergis" },
    ]
  },
  { name: "À propos", href: "/a-propos" },
  { name: "Contact", href: "/contact" },
  { name: "Tarifs", href: "/tarifs" },
];

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-auto" />
          <span className="font-bold text-xl text-primary hidden sm:inline-block">
            {APP_TITLE}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => (
            <div key={item.name} className="relative group">
              <Link href={item.href}>
                <Button
                  variant={location === item.href ? "default" : "ghost"}
                  className="text-sm font-medium"
                >
                  {item.name}
                </Button>
              </Link>
              {item.submenu && (
                <div className="absolute top-full left-0 mt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-background border rounded-lg shadow-lg py-2">
                    {item.submenu.map((subitem: any) => (
                      <Link key={subitem.name} href={subitem.href}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm hover:bg-accent/10 hover:text-primary"
                        >
                          {subitem.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Info & CTA */}
        <div className="hidden lg:flex items-center space-x-4">
          <a
            href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>{CONTACT_INFO.phone}</span>
          </a>
          <Link href="/questionnaire-info">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Demandez Conseil
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Ouvrir le menu</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link href={item.href}>
                  <Button
                    variant={location === item.href ? "default" : "ghost"}
                    className="w-full justify-start text-base"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Button>
                </Link>
                {item.submenu && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.submenu.map((subitem: any) => (
                      <Link key={subitem.name} href={subitem.href}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subitem.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-2 border-t">
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{CONTACT_INFO.phone}</span>
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>{CONTACT_INFO.email}</span>
              </a>
              <Link href="/questionnaire-info">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Demandez Conseil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
