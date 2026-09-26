/* ==========================================================================
   Shivam Enterprise — SITE DATA
   --------------------------------------------------------------------------
   THIS IS THE ONE FILE YOU EDIT FOR BUSINESS DETAILS.
   Every contact value, the WhatsApp number, the service areas, the map
   embed and the form endpoint live here. index.html picks them all up
   automatically. Nothing below needs to be changed in the HTML.

   This is an informational company website, not an online shop: there are
   no prices, no cart and no ordering. Visitors read what the business
   sells and what services it offers, then get in touch.

   All values are PLACEHOLDERS marked  <-- REPLACE  — swap in your real
   details and the whole site updates.
   ========================================================================== */

const SITE = {
  business: {
    name: "Shivam Enterprise",                                // <-- REPLACE
    tagline: "Quality Yarn. Stronger Fabric. Better Future.", // <-- REPLACE
    // Year the business started. Left blank on purpose — the signage does
    // not state one, and a wrong "since 19XX" claim is worse than none.
    // Fill this in and it will appear in the About section.
    established: "",                                    // <-- REPLACE
  },

  contact: {
    // Digits only, country code first, no + and no spaces.
    // India example below. WhatsApp: 91 = India, 9909143989 = your number.
    whatsapp: "919909143989",                           // <-- REPLACE

    // Human-readable, used as the link text.
    phoneDisplay: "+91 99091 43989",                    // <-- REPLACE
    // Click-to-call target. Must match whatsapp.
    phoneTel: "+919909143989",                          // <-- REPLACE

    // Leave blank and the email row is hidden automatically rather than
    // rendering a dead mailto: link. Add the address and it appears.
    email: "",                                          // <-- REPLACE

    address: [
      "1075-1076, Diamond Eco-3, Gabeni Gam, Sachin",
      "Surat, Gujarat, India",
    ],

    // Second contact person, shown in the Location and Contact panels.
    // Set person.name to "" to hide it.
    person: {
      name: "Vinod Patel",                              // <-- REPLACE
      role: "",                                         // <-- REPLACE
      phone: "8734913805",                              // <-- REPLACE
      phoneTel: "+918734913805",                        // <-- REPLACE
    },

    // Social profiles. Paste full URLs here, e.g.
    //   instagram: "https://instagram.com/yourbusiness"
    // Leave a value as "" and that icon is hidden — the row disappears
    // entirely when both are empty, so there are never dead links.
    social: {
      instagram: "",                                    // <-- REPLACE
      facebook: "",                                     // <-- REPLACE
    },
  },

  /* ------------------------------------------------------------------------
     WHERE WE WORK
     Shown as a list of pills in the Location section. These are still
     PLACEHOLDERS — replace them with the places you actually deliver to.
     A short, honest list of 6-12 places works better than a long one.
     ------------------------------------------------------------------------ */
  areas: [
    "Surat",                                           // <-- REPLACE
    "Ahmedabad",                                       // <-- REPLACE
    "Rajkot",                                          // <-- REPLACE
    "Vadodara",                                        // <-- REPLACE
    "Mumbai",                                          // <-- REPLACE
    "Delhi NCR",                                       // <-- REPLACE
  ],

  /* ------------------------------------------------------------------------
     GOOGLE MAP EMBED
     No API key and no billing required. This points at the Diamond Eco-3
     unit in Gabeni Gam, Sachin, Surat. To use a Google Maps share embed
     instead, paste the whole https://www.google.com/maps/embed?pb=... URL.
     ------------------------------------------------------------------------ */
  mapEmbed: "https://www.google.com/maps?q=1075-1076,+Diamond+Eco-3,+Gabeni+Gam,+Sachin,+Surat,+Gujarat&output=embed", // <-- REPLACE

  form: {
    /* ------------------------------------------------------------------
       HOW ENQUIRIES ARE DELIVERED — Web3Forms
       ------------------------------------------------------------------
       Enquiries are POSTed to Web3Forms (https://web3forms.com) which
       forwards them to your email inbox for free.

       web3formsKey: your unique access key from web3forms.com.
       Keep mode: "web3forms" to enable email delivery.
       Set mode: "whatsapp" to bypass email and always use WhatsApp.
       ------------------------------------------------------------------ */
    web3formsKey: "16ef79d9-51e8-4cda-bfa5-7f9b1c0fd8a6",   // <-- your key
    mode: "web3forms",
  },
};

/* Available to both files. Exposed on window because there is no bundler
   and both scripts load as plain <script> tags. */
window.SITE = SITE;
