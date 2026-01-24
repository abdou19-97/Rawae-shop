import React from "react";

export default function Footer({ lang = "en" }) {
  const socialLinks = [
    { name: "Facebook", icon: "📘", url: "#" },
    { name: "Instagram", icon: "📷", url: "#" },
    { name: "Twitter", icon: "🐦", url: "#" },
    { name: "WhatsApp", icon: "💬", url: "#" },
    { name: "TikTok", icon: "🎵", url: "#" },
    { name: "YouTube", icon: "📹", url: "#" },
  ];

  const t = {
    en: {
      contact: "Contact Us",
      phone: "Phone",
      email: "Email",
      quickLinks: "Quick Links",
      about: "About Us",
      returnPolicy: "Return Policy",
      shipping: "Shipping",
      follow: "Follow Us",
      copyright: "All copyrights belong to Nuba-Taleb",
    },
    ar: {
      contact: "اتصل بنا",
      phone: "الهاتف",
      email: "البريد",
      quickLinks: "روابط سريعة",
      about: "من نحن",
      returnPolicy: "سياسة الإرجاع",
      shipping: "الشحن",
      follow: "تابعنا",
      copyright: "جميع الحقوق محفوظة لـ Nuba-Taleb",
    },
    fr: {
      contact: "Contactez-nous",
      phone: "Téléphone",
      email: "Email",
      quickLinks: "Liens Rapides",
      about: "À Propos",
      returnPolicy: "Politique de Retour",
      shipping: "Livraison",
      follow: "Suivez-nous",
      copyright: "Tous les droits appartiennent à Nuba-Taleb",
    },
  };

  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">{t[lang].contact}</h3>
            <p className="text-sm text-gray-600">
              {t[lang].phone}: +222 48 97 47 77
            </p>
            <p className="text-sm text-gray-600">
              {t[lang].email}: info@rawa.co
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">{t[lang].quickLinks}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-pink-600">
                  {t[lang].about}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-600">
                  {t[lang].returnPolicy}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-600">
                  {t[lang].shipping}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">{t[lang].follow}</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-2xl hover:scale-110 transition-transform"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-600">
          {t[lang].copyright}
        </div>
      </div>
    </footer>
  );
}
