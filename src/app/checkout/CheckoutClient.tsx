'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Lock, CreditCard, Banknote, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

type Step = 'shipping' | 'payment' | 'review';

export default function CheckoutClient() {
  const router = useRouter();
  const { cart, subtotal, discount, promoCode, isFreeShipping, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'razorpay' as 'razorpay' | 'cod',
  });

  const shipping = isFreeShipping ? 0 : subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);

  if (cart.length === 0) {
    return (
      <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20 flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag className="w-16 h-16 text-stone-700 mx-auto mb-6" />
          <h1 className="editorial-serif text-3xl text-white mb-3">No Items to Checkout</h1>
          <p className="text-stone-500 text-sm mb-8">Add items to your bag before checking out.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#C5A059] text-black text-sm font-semibold"
          >
            Browse Collection
          </Link>
        </div>
      </section>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isShippingValid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.addressLine1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.postalCode.trim();

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const shippingAddress = `${form.name}, ${form.addressLine1}${form.addressLine2 ? ', ' + form.addressLine2 : ''}, ${form.city}, ${form.state} ${form.postalCode}`;

      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        variantId: undefined,
        quantity: item.quantity,
      }));

      if (form.paymentMethod === 'cod') {
        const res = await fetch('/api/payments/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'cod_order',
            orderInput: {
              userId: user?.userId,
              guestEmail: !user ? form.email : undefined,
              guestPhone: !user ? form.phone : undefined,
              guestName: !user ? form.name : undefined,
              shippingAddressText: shippingAddress,
              couponCode: promoCode || undefined,
              items: orderItems,
            },
          }),
        });

        const data = await res.json();
        if (data.success) {
          clearCart();
          router.push(`/order/${data.order.orderNumber || data.order.id}`);
        }
      } else {
        // Razorpay flow
        const createRes = await fetch('/api/payments/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_order',
            amount: total,
            receipt: `rec_${Date.now()}`,
            notes: { customerName: form.name },
          }),
        });

        const createData = await createRes.json();

        if (createData.success) {
          if (createData.order.isMock) {
            // Mock payment flow for development
            const verifyRes = await fetch('/api/payments/razorpay', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'verify_payment',
                razorpay_order_id: createData.order.orderId,
                razorpay_payment_id: `pay_mock_${Date.now()}`,
                razorpay_signature: 'mock_signature',
                orderInput: {
                  userId: user?.userId,
                  guestEmail: !user ? form.email : undefined,
                  guestPhone: !user ? form.phone : undefined,
                  guestName: !user ? form.name : undefined,
                  shippingAddressText: shippingAddress,
                  couponCode: promoCode || undefined,
                  items: orderItems,
                },
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/order/${verifyData.order.orderNumber || verifyData.order.id}`);
            }
          } else {
            // Real Razorpay checkout
            const options = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_prayele',
              amount: createData.order.amount,
              currency: createData.order.currency,
              name: 'PRAYELE',
              description: 'Luxury Hair Accessories',
              order_id: createData.order.orderId,
              handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
                const verifyRes = await fetch('/api/payments/razorpay', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'verify_payment',
                    ...response,
                    orderInput: {
                      userId: user?.userId,
                      guestEmail: !user ? form.email : undefined,
                      guestPhone: !user ? form.phone : undefined,
                      guestName: !user ? form.name : undefined,
                      shippingAddressText: shippingAddress,
                      couponCode: promoCode || undefined,
                      items: orderItems,
                    },
                  }),
                });

                const verifyData = await verifyRes.json();
                if (verifyData.success) {
                  clearCart();
                  router.push(`/order/${verifyData.order.orderNumber || verifyData.order.id}`);
                }
              },
              prefill: {
                name: form.name,
                email: form.email,
                contact: form.phone,
              },
              theme: { color: '#C5A059' },
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          }
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const steps: { key: Step; label: string; num: number }[] = [
    { key: 'shipping', label: 'Shipping', num: 1 },
    { key: 'payment', label: 'Payment', num: 2 },
    { key: 'review', label: 'Review', num: 3 },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Step Progress */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {steps.map((s, i) => (
            <React.Fragment key={s.key}>
              <button
                onClick={() => i < stepIndex && setStep(s.key)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  i <= stepIndex ? 'text-[#C5A059]' : 'text-stone-600'
                } ${i < stepIndex ? 'cursor-pointer hover:text-[#D4B068]' : ''}`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < stepIndex
                      ? 'bg-[#C5A059] text-black'
                      : i === stepIndex
                        ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40'
                        : 'bg-white/5 text-stone-600'
                  }`}
                >
                  {i < stepIndex ? <Check className="w-3.5 h-3.5" /> : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-12 h-px ${i < stepIndex ? 'bg-[#C5A059]' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Shipping */}
              {step === 'shipping' && (
                <div className="space-y-4">
                  <h2 className="editorial-serif text-2xl text-white mb-6">Shipping Details</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Full Name" name="name" value={form.name} onChange={handleInputChange} required />
                    <InputField label="Email" name="email" type="email" value={form.email} onChange={handleInputChange} required />
                  </div>
                  <InputField label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleInputChange} placeholder="+91 98765 43210" required />
                  <InputField label="Address Line 1" name="addressLine1" value={form.addressLine1} onChange={handleInputChange} required />
                  <InputField label="Address Line 2 (Optional)" name="addressLine2" value={form.addressLine2} onChange={handleInputChange} />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <InputField label="City" name="city" value={form.city} onChange={handleInputChange} required />
                    <InputField label="State" name="state" value={form.state} onChange={handleInputChange} required />
                    <InputField label="PIN Code" name="postalCode" value={form.postalCode} onChange={handleInputChange} required />
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    disabled={!isShippingValid}
                    className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-sm font-bold hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 'payment' && (
                <div className="space-y-4">
                  <button onClick={() => setStep('shipping')} className="flex items-center gap-1 text-sm text-stone-400 hover:text-white transition-colors mb-4">
                    <ChevronLeft className="w-4 h-4" /> Back to Shipping
                  </button>
                  <h2 className="editorial-serif text-2xl text-white mb-6">Payment Method</h2>

                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                        form.paymentMethod === 'razorpay'
                          ? 'bg-[#C5A059]/10 border-[#C5A059]/30'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={form.paymentMethod === 'razorpay'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        form.paymentMethod === 'razorpay' ? 'border-[#C5A059]' : 'border-stone-600'
                      }`}>
                        {form.paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />}
                      </div>
                      <CreditCard className="w-5 h-5 text-stone-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Pay Online</p>
                        <p className="text-[11px] text-stone-500">UPI, Cards, Net Banking, Wallets</p>
                      </div>
                      <Lock className="w-4 h-4 text-emerald-500" />
                    </label>

                    <label
                      className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                        form.paymentMethod === 'cod'
                          ? 'bg-[#C5A059]/10 border-[#C5A059]/30'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={form.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        form.paymentMethod === 'cod' ? 'border-[#C5A059]' : 'border-stone-600'
                      }`}>
                        {form.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />}
                      </div>
                      <Banknote className="w-5 h-5 text-stone-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Cash on Delivery</p>
                        <p className="text-[11px] text-stone-500">Pay when you receive your order</p>
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={() => setStep('review')}
                    className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-sm font-bold hover:brightness-110 transition-all"
                  >
                    Review Order
                  </button>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 'review' && (
                <div className="space-y-6">
                  <button onClick={() => setStep('payment')} className="flex items-center gap-1 text-sm text-stone-400 hover:text-white transition-colors mb-4">
                    <ChevronLeft className="w-4 h-4" /> Back to Payment
                  </button>
                  <h2 className="editorial-serif text-2xl text-white mb-6">Review Your Order</h2>

                  {/* Shipping Summary */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-2">
                      Shipping To
                    </p>
                    <p className="text-sm text-white font-medium">{form.name}</p>
                    <p className="text-xs text-stone-400 mt-1">
                      {form.addressLine1}{form.addressLine2 ? `, ${form.addressLine2}` : ''}
                    </p>
                    <p className="text-xs text-stone-400">
                      {form.city}, {form.state} {form.postalCode}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">{form.phone} • {form.email}</p>
                  </div>

                  {/* Payment Summary */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-2">
                      Payment
                    </p>
                    <p className="text-sm text-white font-medium flex items-center gap-2">
                      {form.paymentMethod === 'cod' ? (
                        <><Banknote className="w-4 h-4 text-stone-400" /> Cash on Delivery</>
                      ) : (
                        <><CreditCard className="w-4 h-4 text-stone-400" /> Online Payment (Razorpay)</>
                      )}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-900 flex-shrink-0">
                          <Image
                            src={item.selectedColor.image}
                            alt={item.product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{item.product.name}</p>
                          <p className="text-[10px] text-stone-500">{item.selectedColor.name} × {item.quantity}</p>
                        </div>
                        <p className="text-xs font-semibold text-white">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-sm font-bold hover:brightness-110 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Place Order — ₹{total.toLocaleString('en-IN')}
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-stone-600 mt-2">
                    By placing this order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Mini Order Summary (sidebar) */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 p-5 rounded-3xl bg-white/[0.04] border border-white/10">
              <h3 className="text-sm font-semibold text-white mb-4">
                Order ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-xs">
                    <div className="relative w-8 h-8 rounded-md overflow-hidden bg-stone-900 flex-shrink-0">
                      <Image src={item.selectedColor.image} alt={item.product.name} fill sizes="32px" className="object-cover" />
                    </div>
                    <span className="text-stone-300 truncate flex-1">{item.product.name}</span>
                    <span className="text-stone-500">×{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>−₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>Shipping</span>
                  <span className={isFreeShipping ? 'text-emerald-400' : 'text-white'}>
                    {isFreeShipping ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-white font-semibold">
                  <span>Total</span>
                  <span className="text-[#C5A059]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] text-stone-400 mb-1.5 font-medium">
        {label} {required && <span className="text-[#C5A059]">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059]/40 transition-colors"
      />
    </div>
  );
}
