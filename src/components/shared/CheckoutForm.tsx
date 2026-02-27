import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { ShieldCheck, Loader2, ArrowRight } from 'lucide-react';

interface CheckoutFormProps {
    clientSecret: string;
    amount: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CheckoutForm({ clientSecret, amount, onSuccess, onCancel }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setIsProcessing(false);
            return;
        }

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                toast.error(error.message || "Payment failed");
                setIsProcessing(false);
            } else if (paymentIntent.status === 'succeeded') {
                toast.success("Payment successful! Your seat is reserved.");
                onSuccess();
            }
        } catch {
            console.error('Payment failed');
            toast.error("An unexpected error occurred during payment.");
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount to Pay</p>
                    <p className="text-2xl font-black text-gray-900">₹{amount}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-green-500 transition-all">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#111827',
                                    '::placeholder': {
                                        color: '#9ca3af',
                                    },
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                },
                                invalid: {
                                    color: '#ef4444',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-gray-900 text-white rounded-2xl font-black shadow-xl hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Complete Payment
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="w-full py-4 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-600 transition-all disabled:opacity-50"
                >
                    Cancel Booking
                </button>
            </div>

            <div className="flex items-center justify-center gap-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-6">
                <ShieldCheck size={16} className="text-green-500" />
                Payments are encrypted and secured by Stripe
            </div>
        </form>
    );
}
