import React from 'react';
import { motion } from 'framer-motion';
import { BrandIcon } from '../components/BrandIcon';
import { DarkSection, LightSection, GrandDivider, MysticalDivider, ElaborateCorner, PageHeader, LightOrnateCard, OrnateCard, ATMOSPHERIC_IMAGES } from '../components/OrnateElements';

export const Privacy = () => {
  return (
    <div className="min-h-screen">
      {/* Dark Hero Section */}
      <DarkSection className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" variant="warm">
        <ElaborateCorner className="absolute top-3 left-3 w-16 h-16 sm:w-20 sm:h-20" variant="gold" />
        <ElaborateCorner className="absolute top-3 right-3 w-16 h-16 sm:w-20 sm:h-20 rotate-90" variant="gold" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PageHeader 
              iconSrc="/images/brand/pentagram-gold.png"
              title="Privacy Policy"
              subtitle="Your practice is sacred. So is your privacy."
            />
            <p className="font-montserrat text-xs sm:text-sm text-muted-brass/60 text-center">
              Last updated: January 4, 2026
            </p>
          </motion.div>
          
          <GrandDivider variant="eye" />
        </div>
      </DarkSection>

      {/* Light Section - Introduction */}
      <LightSection 
        className="py-10 sm:py-14 px-4 sm:px-6"
        atmosphericImage={ATMOSPHERIC_IMAGES.maiden}
        atmosphericOpacity={0.10}
        atmosphericPosition="center bottom"
        atmosphericTint="sepia"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-montserrat text-sm sm:text-base text-navy-dark/80 leading-relaxed text-center max-w-2xl mx-auto">
              At Where The Crowlands, we respect your privacy and the sacred nature of your practice. 
              This policy explains how we collect, use, and protect your information.
            </p>
          </motion.div>
          <MysticalDivider light />
        </div>
      </LightSection>

      {/* Dark Section - Information We Collect */}
      <DarkSection className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <OrnateCard hover={false}>
              <h2 className="font-cinzel text-lg sm:text-xl text-gold-light mb-6 flex items-center gap-2">
                <BrandIcon name="grimoire" size={24} />
                Information We Collect
              </h2>
              <div className="space-y-5">
                <div className="border-l-2 border-gold/40 pl-4">
                  <h3 className="font-cinzel text-base text-crimson-bright mb-2">Account Information</h3>
                  <p className="font-montserrat text-sm text-cream/70 leading-relaxed">
                    When you register, we collect your email address, name, and encrypted password. 
                    Your password is hashed and never stored in plain text.
                  </p>
                </div>
                <div className="border-l-2 border-gold/40 pl-4">
                  <h3 className="font-cinzel text-base text-crimson-bright mb-2">Usage Data</h3>
                  <p className="font-montserrat text-sm text-cream/70 leading-relaxed">
                    We track how many spells you generate, what you save to your grimoire, and your 
                    subscription status. This helps us improve the service and enforce fair usage limits.
                  </p>
                </div>
                <div className="border-l-2 border-gold/40 pl-4">
                  <h3 className="font-cinzel text-base text-crimson-bright mb-2">Payment Information</h3>
                  <p className="font-montserrat text-sm text-cream/70 leading-relaxed">
                    Payment processing is handled by Stripe. We never see or store your credit card 
                    information. We only receive confirmation that payment succeeded and your Stripe customer ID.
                  </p>
                </div>
                <div className="border-l-2 border-gold/40 pl-4">
                  <h3 className="font-cinzel text-base text-crimson-bright mb-2">Spell Content</h3>
                  <p className="font-montserrat text-sm text-cream/70 leading-relaxed">
                    Your saved spells, grimoire entries, and personal notes are stored privately in your 
                    account. We do not share, sell, or analyze the content of your rituals.
                  </p>
                </div>
              </div>
            </OrnateCard>
          </motion.div>
          <GrandDivider />
        </div>
      </DarkSection>

      {/* Light Section - How We Use Your Information */}
      <LightSection className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <LightOrnateCard hover={false}>
              <h2 className="font-cinzel text-lg sm:text-xl text-crimson mb-6 flex items-center gap-2">
                <BrandIcon name="key" size={24} />
                How We Use Your Information
              </h2>
              <div className="space-y-4 font-montserrat text-sm text-navy-dark/80 leading-relaxed">
                <p>
                  <strong className="text-crimson">Service Delivery:</strong> To provide spell generation, 
                  grimoire storage, and account management.
                </p>
                <p>
                  <strong className="text-crimson">Communication:</strong> To send important updates about your 
                  account, subscription, or service changes. We don&apos;t send marketing emails unless you opt in.
                </p>
                <p>
                  <strong className="text-crimson">Improvement:</strong> Aggregated, anonymized data helps us 
                  understand usage patterns and improve the service. We never analyze individual spell content.
                </p>
                <p>
                  <strong className="text-crimson">Legal Compliance:</strong> We may disclose information if 
                  required by law, but we&apos;ll notify you when legally permitted.
                </p>
              </div>
            </LightOrnateCard>
          </motion.div>
          <MysticalDivider light />
        </div>
      </LightSection>

      {/* Dark Section - Your Rights */}
      <DarkSection className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <OrnateCard hover={false}>
              <h2 className="font-cinzel text-lg sm:text-xl text-gold-light mb-6 flex items-center gap-2">
                <BrandIcon name="eye" size={24} />
                Your Rights
              </h2>
              <div className="space-y-4 font-montserrat text-sm text-cream/70 leading-relaxed">
                <p>
                  <strong className="text-gold-light">Access:</strong> You can view and download all data 
                  associated with your account at any time.
                </p>
                <p>
                  <strong className="text-gold-light">Correction:</strong> You can update your profile 
                  information, email, and password through your account settings.
                </p>
                <p>
                  <strong className="text-gold-light">Deletion:</strong> You can request complete deletion 
                  of your account and all associated data. This is irreversible.
                </p>
                <p>
                  <strong className="text-gold-light">Portability:</strong> You can export your grimoire 
                  entries as PDFs to keep a personal copy of your work.
                </p>
              </div>
            </OrnateCard>
          </motion.div>
          <GrandDivider variant="moon" />
        </div>
      </DarkSection>

      {/* Light Footer Section */}
      <LightSection className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <LightOrnateCard hover={false}>
              <h2 className="font-cinzel text-lg sm:text-xl text-crimson mb-4 flex items-center gap-2">
                <BrandIcon name="letter" size={24} />
                Contact Us
              </h2>
              <p className="font-montserrat text-sm text-navy-dark/80 leading-relaxed">
                If you have questions about this policy or your data, contact us through your account 
                settings or email. We typically respond within 48 hours.
              </p>
            </LightOrnateCard>
          </motion.div>
          
          <div className="text-center mt-8">
            <p className="font-crimson text-sm text-navy-dark/50 italic mb-4">
              Your secrets are safe. Your practice is yours.
            </p>
            <div className="flex items-center justify-center gap-4 text-crimson/40">
              <span>☽</span>
              <span className="text-gold-dark/60">❦</span>
              <span>🔒</span>
              <span className="text-gold-dark/60">❦</span>
              <span>☾</span>
            </div>
          </div>
        </div>
      </LightSection>
    </div>
  );
};
