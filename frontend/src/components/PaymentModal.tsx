import React, { useState } from 'react';
import { Appointment } from '../types';
import { api } from '../services/api';
import {
  X,
  CheckCircle2,
  Loader2,
  Smartphone,
  CreditCard,
  Building2,
  Coins,
  ShieldCheck,
  Copy,
  Check,
  QrCode
} from 'lucide-react';

interface PaymentModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = 'mpesa' | 'card' | 'bank' | 'crypto';

export const PaymentModal: React.FC<PaymentModalProps> = ({ appointment, onClose, onSuccess }) => {
  const [method, setMethod] = useState<PaymentMethod>('mpesa');
  const [phone, setPhone] = useState('254712345678');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('821');
  const [cardName, setCardName] = useState('Sarah Achieng');
  const [selectedBank, setSelectedBank] = useState('Equity Bank Kenya');
  const [bankRef, setBankRef] = useState('');
  const [cryptoCoin, setCryptoCoin] = useState<'BTC' | 'USDT'>('BTC');
  const [copied, setCopied] = useState(false);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'prompt' | 'waiting' | 'success'>('prompt');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!appointment) return null;

  const btcAmount = (appointment.fee / 8900000).toFixed(6);
  const usdtAmount = (appointment.fee / 129.5).toFixed(2);
  const cryptoWallet = cryptoCoin === 'BTC'
    ? 'bc1qmednexa9823kx7p4m209187aqlwep04'
    : '0x71C2834b92135D3b934781A92083b417';

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(cryptoWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const intentRes = await api.createPaymentIntent({
        appointment_id: appointment.id,
        method,
        phone_number: method === 'mpesa' ? phone : undefined,
        card_details: method === 'card' ? { name: cardName, number: cardNumber, expiry: cardExpiry } : undefined,
        bank_name: method === 'bank' ? selectedBank : undefined,
        crypto_currency: method === 'crypto' ? cryptoCoin : undefined,
      });

      setPaymentData(intentRes);
      setStep('waiting');

      setTimeout(async () => {
        try {
          const simRes = await api.simulatePaymentConfirmation(intentRes.payment_id, {
            method,
            appointment_id: appointment.id
          });
          setPaymentData((prev: any) => ({ ...prev, ...simRes }));
          setStep('success');
          onSuccess();
        } catch (err: any) {
          setError(err.message || 'Payment processing failed');
          setStep('prompt');
        } finally {
          setLoading(false);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161613]/55 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[32px] max-w-lg w-full border border-[#E8E6DD] shadow-lift overflow-hidden p-6 sm:p-7 relative text-[#161613]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-[#F4F2EC] hover:bg-[#E8E6DD] text-[#74736B] hover:text-[#161613] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'prompt' && (
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#161613] font-serif text-lg italic text-[#D9F99D] shadow-xs">
                m
              </span>
              <div>
                <h3 className="font-bold text-[#161613] text-base leading-tight">
                  Checkout Consultation
                </h3>
                <p className="text-[11px] text-[#74736B]">
                  Select your preferred settlement method
                </p>
              </div>
            </div>

            {/* Fee summary banner */}
            <div className="bg-[#FBFAF7] rounded-2xl p-3.5 border border-[#E8E6DD] mb-4 text-xs space-y-1">
              <div className="flex justify-between items-center text-[#74736B]">
                <span>Physician</span>
                <span className="font-semibold text-[#161613]">{appointment.doctor?.full_name}</span>
              </div>
              <div className="flex justify-between items-center text-[#74736B]">
                <span>Consultation Mode</span>
                <span className="font-semibold text-[#161613] capitalize">{appointment.type}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E6DD]/70 flex justify-between items-center">
                <span className="font-bold text-[#161613]">Total Amount Due</span>
                <span className="font-extrabold text-[#161613] text-base">
                  KES {appointment.fee.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Segmented Method Tabs (Mainstack / truerev pill selector) */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-full bg-[#F4F2EC] border border-[#E8E6DD] mb-5">
              <button
                type="button"
                onClick={() => setMethod('mpesa')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-full text-xs font-semibold transition-all ${
                  method === 'mpesa'
                    ? 'bg-[#161613] text-white shadow-xs'
                    : 'text-[#74736B] hover:text-[#161613]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">M-Pesa</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-full text-xs font-semibold transition-all ${
                  method === 'card'
                    ? 'bg-[#161613] text-white shadow-xs'
                    : 'text-[#74736B] hover:text-[#161613]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('bank')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-full text-xs font-semibold transition-all ${
                  method === 'bank'
                    ? 'bg-[#161613] text-white shadow-xs'
                    : 'text-[#74736B] hover:text-[#161613]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bank</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('crypto')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-full text-xs font-semibold transition-all ${
                  method === 'crypto'
                    ? 'bg-[#161613] text-white shadow-xs'
                    : 'text-[#74736B] hover:text-[#161613]'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bitcoin</span>
              </button>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-[#E11D48]">
                {error}
              </div>
            )}

            <form onSubmit={handleProcessPayment} className="space-y-3.5 text-xs">
              {/* Method 1: M-Pesa */}
              {method === 'mpesa' && (
                <div>
                  <label className="block font-semibold text-[#161613] mb-1.5">
                    M-Pesa Registered Mobile Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="2547XXXXXXXX or 07XXXXXXXX"
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E6DD] bg-[#FBFAF7] text-xs font-medium focus:outline-none focus:border-[#161613]"
                    required
                  />
                  <p className="text-[11px] text-[#74736B] mt-1.5">
                    A Safaricom STK prompt will appear on your mobile phone requesting your M-Pesa PIN.
                  </p>
                </div>
              )}

              {/* Method 2: Credit / Debit Card */}
              {method === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-[#161613] mb-1">
                      Cardholder Full Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. Sarah Achieng"
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E8E6DD] bg-[#FBFAF7] text-xs font-medium focus:outline-none focus:border-[#161613]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#161613] mb-1">
                      Card Number (Visa / Mastercard)
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E8E6DD] bg-[#FBFAF7] text-xs font-mono font-medium focus:outline-none focus:border-[#161613]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#161613] mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E8E6DD] bg-[#FBFAF7] text-xs font-mono focus:outline-none focus:border-[#161613]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#161613] mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E8E6DD] bg-[#FBFAF7] text-xs font-mono focus:outline-none focus:border-[#161613]"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Method 3: Bank Transfer */}
              {method === 'bank' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-[#161613] mb-1">
                      Select Your Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E8E6DD] bg-[#FBFAF7] text-xs font-semibold focus:outline-none focus:border-[#161613]"
                    >
                      <option value="Equity Bank Kenya">Equity Bank Kenya</option>
                      <option value="KCB Bank Kenya">KCB Bank Kenya</option>
                      <option value="NCBA Bank">NCBA Bank Kenya</option>
                      <option value="Stanbic Bank">Stanbic Bank</option>
                      <option value="Co-operative Bank">Co-operative Bank of Kenya</option>
                    </select>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F4F2EC] border border-[#E8E6DD] space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#74736B]">Account Name:</span>
                      <span className="font-bold text-[#161613]">MedNexa Healthcare Ltd</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#74736B]">Paybill / Business No:</span>
                      <span className="font-mono font-bold text-[#161613]">247247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#74736B]">Account Number:</span>
                      <span className="font-mono font-bold text-[#161613]">012028472910</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#161613] mb-1">
                      Bank Transfer Reference Code (optional)
                    </label>
                    <input
                      type="text"
                      value={bankRef}
                      onChange={(e) => setBankRef(e.target.value)}
                      placeholder="e.g. EFT94821 or Trans ID"
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E8E6DD] bg-[#FBFAF7] text-xs font-mono focus:outline-none focus:border-[#161613]"
                    />
                  </div>
                </div>
              )}

              {/* Method 4: Bitcoin / Cryptocurrency */}
              {method === 'crypto' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCryptoCoin('BTC')}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                        cryptoCoin === 'BTC' ? 'bg-[#161613] text-white border-[#161613]' : 'bg-[#FBFAF7] border-[#E8E6DD] text-[#74736B]'
                      }`}
                    >
                      Bitcoin (BTC)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCryptoCoin('USDT')}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                        cryptoCoin === 'USDT' ? 'bg-[#161613] text-white border-[#161613]' : 'bg-[#FBFAF7] border-[#E8E6DD] text-[#74736B]'
                      }`}
                    >
                      Tether (USDT TRC20)
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FBFAF7] border border-[#E8E6DD] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#74736B] uppercase font-bold block">
                        Estimated Crypto Amount
                      </span>
                      <span className="font-extrabold text-[#161613] text-sm">
                        {cryptoCoin === 'BTC' ? `${btcAmount} BTC` : `${usdtAmount} USDT`}
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      Lightning / Zero Fee
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#161613] mb-1">
                      Deposit Address
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value={cryptoWallet}
                        className="flex-1 px-3 py-2 rounded-xl border border-[#E8E6DD] bg-[#F4F2EC] text-[11px] font-mono text-[#161613] select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyWallet}
                        className="p-2 rounded-xl border border-[#E8E6DD] bg-white text-[#161613] hover:bg-[#F4F2EC] transition-colors"
                        title="Copy address"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#161613] hover:bg-black disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-full shadow-xs flex items-center justify-center gap-2 transition-all text-xs cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#D9F99D]" />
                ) : (
                  <span>
                    Pay KES {appointment.fee.toLocaleString()} via {method === 'mpesa' ? 'M-Pesa' : method === 'card' ? 'Card' : method === 'bank' ? 'Bank' : 'Bitcoin'}
                  </span>
                )}
              </button>
            </form>
          </div>
        )}

        {step === 'waiting' && (
          <div className="py-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#DFF2E4] text-emerald-800 flex items-center justify-center shadow-xs">
              <Loader2 className="w-7 h-7 animate-spin text-emerald-700" />
            </div>
            <h3 className="font-bold text-[#161613] text-base mb-1">
              Verifying {method.toUpperCase()} Payment
            </h3>
            <p className="text-xs text-[#74736B] max-w-xs mx-auto mb-5">
              {paymentData?.instructions || 'Confirming transaction with gateway provider...'}
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4F2EC] text-[11px] text-[#161613] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Secured Settlement Handshake...
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-4 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#DFF2E4] text-emerald-700 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[#161613] text-lg mb-1">Payment Confirmed</h3>
            <p className="text-xs text-[#74736B] mb-5">
              Your consultation booking with {appointment.doctor?.full_name} is fully confirmed.
            </p>

            <div className="bg-[#FBFAF7] rounded-2xl p-4 border border-[#E8E6DD] text-left text-xs mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#74736B]">Receipt Number</span>
                <span className="font-mono font-bold text-[#161613]">
                  {paymentData?.provider_reference || 'QK7291B89'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#74736B]">Amount Paid</span>
                <span className="font-bold text-[#161613]">KES {appointment.fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#74736B]">Payment Method</span>
                <span className="font-medium text-[#161613] capitalize">
                  {paymentData?.payment_method || method}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#74736B]">Status</span>
                <span className="text-emerald-700 font-bold">Settled &amp; Verified</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#161613] hover:bg-black text-white font-semibold py-3 px-4 rounded-full transition-all text-xs cursor-pointer"
            >
              Done &amp; View Consultations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
