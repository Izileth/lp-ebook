import { useEffect } from "react";
import { useParams} from "react-router-dom";
import App from "../App";
import { useInteractions } from "../hooks/useInteractions";

export function LandingPage() {
  const { section, source, campaign, adgroup, ad } = useParams();
  const { trackInteraction } = useInteractions();
 

  useEffect(() => {
    // 1. Track the interaction with Google Ads parameters
    trackInteraction('ads_click', section, {
      source,
      campaign,
      adgroup,
      ad,
      timestamp: new Date().toISOString()
    });

    // 2. Handle scrolling to the specific section
    if (section) {
      // Small delay to ensure App component is fully rendered
      const timer = setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          // Fallback if section ID doesn't match common ones
          const mapping: Record<string, string> = {
            'livros': 'livros',
            'books': 'livros',
            'sobre': 'sobre',
            'about': 'sobre',
            'contato': 'contato',
            'contact': 'contato',
            'newsletter': 'newsletter',
            'home': 'home',
            'hero': 'home'
          };
          
          const targetId = mapping[section.toLowerCase()];
          if (targetId) {
            document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [section, source, campaign, adgroup, ad, trackInteraction]);

  // We render the App component which contains all sections
  return <App />;
}
