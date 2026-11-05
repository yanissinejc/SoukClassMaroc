import React, { useState } from 'react';
import { X, Send, MapPin, CheckCircle2, ShieldCheck, Phone } from 'lucide-react';
import { Conversation, Listing } from '../types';
import { formatPriceDH } from '../data/mockListings';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeListing: Listing | null;
  conversations: Conversation[];
  onSendMessage: (listingId: string, text: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  activeListing,
  conversations,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  // Find active conversation or create preview
  const currentConv = activeListing
    ? conversations.find((c) => c.listingId === activeListing.id)
    : conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeListing) return;
    onSendMessage(activeListing.id, inputText.trim());
    setInputText('');
  };

  const handleQuickQuestion = (q: string) => {
    if (!activeListing) return;
    onSendMessage(activeListing.id, q);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 h-[620px] max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {activeListing ? (
              <img
                src={activeListing.seller.avatar}
                alt=""
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold">
                SC
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">
                  {activeListing ? activeListing.seller.name : 'Messagerie SoukClass'}
                </h3>
                {activeListing?.seller.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <p className="text-[11px] text-emerald-300">
                {activeListing ? `En ligne • ${activeListing.city}` : 'Vos échanges en direct'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listing preview banner at top of chat */}
        {activeListing && (
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={activeListing.images[0]}
                alt=""
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{activeListing.title}</p>
                <p className="text-xs font-black text-emerald-800">{formatPriceDH(activeListing.price)}</p>
                <p className="text-[10px] text-slate-500">{activeListing.city} • {activeListing.sector}</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-100/50">
          {/* Default safety note */}
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Ne partagez jamais vos coordonnées bancaires secrètes dans le chat.</span>
          </div>

          {currentConv?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  msg.isMe
                    ? 'bg-emerald-800 text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        {activeListing && (
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto shrink-0">
            {[
              'Salam, toujours disponible ?',
              'Le prix est-il négociable ?',
              `Est-ce possible de voir l'article à ${activeListing.city} ?`,
              'Avez-vous d’autres photos ?'
            ].map((chip, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(chip)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input box */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Écrivez votre message en français ou Darija..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
