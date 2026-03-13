import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { BrandIcon } from '../components/BrandIcon';
import { DarkSection } from '../components/OrnateElements';

const HandcraftedSuccess = () => {
  const [searchParams] = useSearchParams();
  const product = searchParams.get('product');

  const isGrimoire = product === 'grimoire';
  const isBespoke = product === 'bespoke';

  return (
    <DarkSection className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/30">
          <CheckCircle size={32} className="text-gold" />
        </div>

        <h1 className="text-2xl font-cinzel text-gold-light mb-4">
          {isGrimoire && 'Your Grimoire Awaits'}
          {isBespoke && 'Bespoke Request Received'}
          {!isGrimoire && !isBespoke && 'Thank You'}
        </h1>

        {isGrimoire && (
          <div className="space-y-4">
            <div className="p-6 bg-navy-mid/50 border border-gold/20 rounded-lg">
              <BrandIcon name="book" size={36} className="mx-auto mb-4" />
              <p className="text-cream/80 font-crimson mb-4">
                Thank you for your purchase! The Crowlands Grimoire will be delivered to your email shortly.
              </p>
              <p className="text-sm text-muted-brass/70 font-montserrat">
                Note: This is a placeholder. The actual grimoire PDF is coming soon. You'll receive it as soon as it's ready.
              </p>
            </div>
          </div>
        )}

        {isBespoke && (
          <div className="space-y-4">
            <div className="p-6 bg-navy-mid/50 border border-gold/20 rounded-lg">
              <BrandIcon name="star" size={36} className="mx-auto mb-4" />
              <p className="text-cream/80 font-crimson mb-4">
                Your bespoke spell request has been received. I'll personally craft your spell and resource guide.
              </p>
              <p className="text-gold font-medium font-montserrat">
                Expect delivery within 3-5 days.
              </p>
              <p className="text-sm text-muted-brass/70 font-montserrat mt-4">
                I'll email you with your handcrafted spell, along with a curated one-pager of resources to help you develop your own magical practice.
              </p>
            </div>
          </div>
        )}

        <Link
          to="/invisible-helpers"
          className="inline-flex items-center gap-2 mt-6 text-gold hover:text-gold-light transition-colors font-montserrat"
        >
          <ArrowLeft size={16} />
          Return to Invisible Helpers
        </Link>
      </div>
    </DarkSection>
  );
};

export default HandcraftedSuccess;
