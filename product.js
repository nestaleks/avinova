const PRODUCTS = {
  S1: {
    tier: "Essential",
    tagline: "Alles, was gute Hygiene braucht. Klar, zuverlässig und angenehm.",
    price: "999 €",
    color: "#8aa4ac",
    specs: ["4 Stufen", "33–39 °C", "300 W", "2 Jahre"],
    labels: ["Wasserdruck", "Temperatur", "Leistung", "Garantie"],
    story: "Der unkomplizierte Einstieg",
    description: "Das S1 konzentriert sich auf das Wesentliche: präzise Wasserreinigung, angenehme Warmluft und eine Bedienung, die ohne Erklärung auskommt.",
    features: [
      ["PureStream Düse", "Oszillierender Strahl mit regulierbarer Intensität."],
      ["WarmDry", "Sanfte Warmluft reduziert den Papierverbrauch."],
      ["AutoClean", "Automatische Düsenreinigung vor und nach Nutzung."],
      ["Quick Control", "Direkte Bedienung über den seitlichen Regler."]
    ]
  },
  S2: {
    tier: "Comfort",
    tagline: "Ihr persönlicher Komfort, gespeichert für jeden neuen Tag.",
    price: "1.499 €",
    color: "#c9954d",
    specs: ["5 Stufen", "33–40 °C", "420 W", "2 Jahre"],
    labels: ["Wasserdruck", "Temperatur", "Leistung", "Garantie"],
    story: "Komfort wird persönlich",
    description: "Das S2 ergänzt die bewährte Reinigung um Wärme, Licht und Frische. Zwei Nutzerprofile speichern alle bevorzugten Einstellungen.",
    features: [
      ["Comfort Seat", "Sitzheizung mit energiesparender Anwesenheitserkennung."],
      ["FreshAir Filter", "Leise Geruchsabsaugung direkt an der Quelle."],
      ["NightGlow", "Dezentes Orientierungslicht für die Nacht."],
      ["Memory Duo", "Zwei Profile für Temperatur, Druck und Position."]
    ]
  }
};

const model = document.body.dataset.model || "S1";
const product = PRODUCTS[model];

document.documentElement.style.setProperty("--gold", product.color);
document.querySelectorAll("[data-model]:not(body)").forEach((node) => { node.textContent = model; });
document.querySelectorAll("[data-tier]").forEach((node) => { node.textContent = product.tier; });
document.querySelectorAll("[data-tagline]").forEach((node) => { node.textContent = product.tagline; });
document.querySelectorAll("[data-price]").forEach((node) => { node.textContent = product.price; });
document.querySelectorAll("[data-story]").forEach((node) => { node.textContent = product.story; });
document.querySelectorAll("[data-description]").forEach((node) => { node.textContent = product.description; });
document.title = `AVINOVA ${model} | ${product.tier}`;

const specs = document.querySelector("[data-specs]");
if (specs) {
  specs.innerHTML = product.specs.map((value, index) => `<div><small>${product.labels[index]}</small><strong>${value}</strong></div>`).join("");
}

const features = document.querySelector("[data-features]");
if (features) {
  features.innerHTML = product.features.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("");
}
