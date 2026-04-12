import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../components/Shared';

export const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
            <SEO
                title="Page Not Found"
                description="The page you're looking for doesn't exist or has been moved."
            />

            <div className="text-center max-w-md">
                {/* 404 Number */}
                <h1 className="font-heading text-[120px] md:text-[180px] leading-none text-brand-orange/20 font-bold select-none">
                    404
                </h1>

                {/* Message */}
                <h2 className="font-heading text-2xl md:text-3xl text-brand-charcoal -mt-8 mb-4">
                    Page Not Found
                </h2>
                <p className="text-stone-500 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/">
                        <Button variant="primary" className="w-full sm:w-auto">
                            <Home size={18} className="mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                    <Link to="/products">
                        <Button variant="secondary" className="w-full sm:w-auto">
                            <Search size={18} className="mr-2" />
                            Browse Products
                        </Button>
                    </Link>
                </div>

                {/* Help Text */}
                <p className="text-xs text-stone-400 mt-10">
                    If you believe this is an error, please{' '}
                    <Link to="/contact" className="text-brand-orange hover:underline">
                        contact us
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
};
