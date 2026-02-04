import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, BookOpen, Scroll, ArrowLeft } from 'lucide-react';

const HandcraftedSuccess = () => {
  const [searchParams] = useSearchParams();
  const product = searchParams.get('product');

  const isGrimoire = product === 'grimoire';
  const isBespoke = product === 'bespoke';

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-green-500" />
        </div>

        <h1 className="text-2xl font-serif text-amber-100 mb-4">
          {isGrimoire && 'Your Grimoire Awaits'}
          {isBespoke && 'Bespoke Request Received'}
          {!isGrimoire && !isBespoke && 'Thank You'}
        </h1>

        {isGrimoire && (
          <div className="space-y-4">
            <div className="p-6 bg-stone-900 border border-amber-900/30 rounded-lg">
              <BookOpen size={32} className="text-amber-500 mx-auto mb-4" />
              <p className="text-stone-300 mb-4">
                Thank you for your purchase! The Crowlands Grimoire will be delivered to your email shortly.
              </p>
              <p className="text-sm text-stone-500">
                Note: This is a placeholder. The actual grimoire PDF is coming soon. You'll receive it as soon as it's ready.
              </p>
            </div>
          </div>
        )}

        {isBespoke && (
          <div className="space-y-4">
            <div className="p-6 bg-stone-900 border border-amber-900/30 rounded-lg">
              <Scroll size={32} className="text-amber-500 mx-auto mb-4" />
              <p className="text-stone-300 mb-4">
                Your bespoke spell request has been received. I'll personally craft your spell and resource guide.
              </p>
              <p className="text-amber-400 font-medium">
                Expect delivery within 3-5 days.
              </p>
              <p className="text-sm text-stone-500 mt-4">
                I'll email you with your handcrafted spell, along with a curated one-pager of resources to help you develop your own magical practice.
              </p>
            </div>
          </div>
        )}

        <Link
          to="/invisible-helpers"
          className="inline-flex items-center gap-2 mt-6 text-amber-500 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Return to Invisible Helpers
        </Link>
      </div>
    </div>
  );
};

export default HandcraftedSuccess;
