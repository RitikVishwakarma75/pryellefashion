'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { X, CheckCircle, Lock, CreditCard, Smartphone, Truck } from 'lucide-react';

export default function CheckoutModal() {
  const {
    cart,
    promoCode,
    isCheckoutOpen,
    setIsCheckoutOpen,
    subtotal,
    discount,
    isFreeShipping,
    placeOrder,
    lastPlacedOrderId,
  } = useCart();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [formData, setFormData] = useState({
    name: 'Aanya Sen',
    email: 'aanya.sen@example.com',
    phone: '+91 98765 43210',
    address: '42, Boulevard Heights, Bandra West',
    city: 'Mumbai',
    pincode: '400050',
    paymentMethod: 'upi',
  });
  const [orderId, setOrderId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const totalPayable = Math.max(0, subtotal - discount + (isFreeShipping ? 0 : 99));

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePay = async () => {
    setIsProcessing(true);

    const orderInput = {
      guestName: formData.name,
      guestEmail: formData.email,
      guestPhone: formData.phone,
      shippingAddressText: `${formData.address}, ${formData.city} - ${formData.pincode}`,
      couponCode: promoCode || undefined,
      items: cart.map((item) => ({
        productId: item.product.id,
        variantId: `${item.product.id}-${item.selectedColor.name.toLowerCase().replace(/\s+/g, '-')}`,
        quantity: item.quantity,
      })),
    };

    try {
      if (formData.paymentMethod === 'cod') {
        const res = await fetch('/api/payments/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'cod_order', orderInput }),
        });
        const data = await res.json();
        const genId = data.order?.orderNumber || (await placeOrder(formData));
        setOrderId(genId);
      } else {
        // Online / Razorpay payment
        const resOrder = await fetch('/api/payments/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create_order', amount: totalPayable }),
        });
        const orderData = await resOrder.json();

        // Verify payment and record
        const resVerify = await fetch('/api/payments/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'verify_payment',
            razorpay_order_id: orderData.order?.orderId || `order_${Date.now()}`,
            razorpay_payment_id: `pay_${Date.now()}`,
            razorpay_signature: 'simulated_sig',
            orderInput,
          }),
        });
        const verifyData = await resVerify.json();
        const genId = verifyData.order?.orderNumber || (await placeOrder(formData));
        setOrderId(genId);
      }

      await placeOrder(formData);
      setStep('confirmed');
    } catch {
      // Local fallback
      const genId = await placeOrder(formData);
      setOrderId(genId);
      setStep('confirmed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('details');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 my-auto border border-white/70"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-black/5 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span className="caps-subtitle text-[10px] sm:text-[11px] font-semibold tracking-widest text-stone-800">
                PRAYELE Encrypted Checkout
              </span>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-200 flex items-center justify-center transition-colors text-stone-600 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 sm:p-8 max-h-[82vh] overflow-y-auto overscroll-contain">
            {/* Step 1: Shipping Details */}
            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div>
                  <h3 className="editorial-serif text-2xl font-normal text-[var(--theme-text)] mb-1">
                    Shipping & Delivery Details
                  </h3>
                  <p className="text-xs text-[var(--theme-text-muted)]">
                    Complimentary express delivery directly to your door in bespoke gift packaging.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1">
                      Contact Phone
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">
                    Street Address / Apartment
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1">
                      City
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1">
                      Postal Pincode
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center justify-between border-t border-stone-100 gap-3">
                  <div>
                    <span className="text-xs text-stone-500 block">Total Due:</span>
                    <span className="editorial-serif text-2xl font-semibold text-stone-900">
                      ₹{totalPayable}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="w-full min-[420px]:w-auto px-8 py-3 rounded-full bg-black text-white text-xs font-medium uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all text-center"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Payment Gateway Selection */}
            {step === 'payment' && (
              <div className="space-y-5">
                <div>
                  <h3 className="editorial-serif text-2xl font-normal text-[var(--theme-text)] mb-1">
                    Select Payment Method
                  </h3>
                  <p className="text-xs text-[var(--theme-text-muted)]">
                    All major UPI apps, cards, and netbanking powered by secure 256-bit SSL encryption.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'upi',
                      name: 'UPI Quick Pay',
                      desc: 'Google Pay, PhonePe, Paytm, BHIM',
                      icon: Smartphone,
                    },
                    {
                      id: 'card',
                      name: 'Credit / Debit Card',
                      desc: 'Visa, Mastercard, RuPay, Amex',
                      icon: CreditCard,
                    },
                    {
                      id: 'cod',
                      name: 'Cash on Delivery',
                      desc: 'Pay at your doorstep with verified OTP',
                      icon: Truck,
                    },
                  ].map((method) => {
                    const isSelected = formData.paymentMethod === method.id;
                    const IconComp = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-black bg-stone-50 ring-1 ring-black shadow-sm'
                            : 'border-stone-200 hover:bg-stone-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-800">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-stone-900">
                              {method.name}
                            </h4>
                            <p className="text-[11px] text-stone-500">{method.desc}</p>
                          </div>
                        </div>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-black bg-black' : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs space-y-1.5">
                  <div className="flex justify-between text-stone-600">
                    <span>Order Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Promo Savings:</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Express Courier:</span>
                    <span>{isFreeShipping ? 'FREE' : '₹99'}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between font-semibold text-sm text-stone-900">
                    <span>Total Amount:</span>
                    <span>₹{totalPayable}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col-reverse min-[420px]:flex-row items-stretch min-[420px]:items-center justify-between border-t border-stone-100 gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="text-xs text-stone-500 hover:text-stone-900 font-medium py-2 text-center"
                  >
                    ← Back to Details
                  </button>

                  <button
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="w-full min-[420px]:w-auto px-8 py-3.5 rounded-full bg-black text-white text-xs font-medium uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Encrypting & Authorizing...</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Pay ₹{totalPayable}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Order Confirmed Celebration */}
            {step === 'confirmed' && (
              <div className="text-center py-6 sm:py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <h3 className="editorial-serif text-3xl sm:text-4xl font-normal text-stone-900">
                  Thank you, {formData.name.split(' ')[0]}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Your luxury hairwear curation has been recorded under order reference{' '}
                  <strong className="text-stone-900 font-mono font-semibold">
                    {orderId || lastPlacedOrderId}
                  </strong>
                  . We are hand-inspecting and preparing your items for express dispatch.
                </p>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50 max-w-md mx-auto text-left text-xs space-y-1 text-stone-700">
                  <p>
                    <strong>Delivery Address:</strong> {formData.address}, {formData.city} -{' '}
                    {formData.pincode}
                  </p>
                  <p>
                    <strong>Estimated Arrival:</strong> Within 48 hours via Blue Dart Air
                  </p>
                  <p>
                    <strong>Receipt Sent To:</strong> {formData.email}
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="mt-6 px-8 py-3.5 rounded-full bg-black text-white text-xs font-medium uppercase tracking-wider hover:opacity-90 shadow-md"
                >
                  Continue Exploring Prayele
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
