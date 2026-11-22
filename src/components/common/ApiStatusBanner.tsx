import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { checkBackendHealth, GATEWAY_URL } from '../../services/api';

export const ApiStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<string>('');

  const pingGateway = async () => {
    setIsPinging(true);
    try {
      const health = await checkBackendHealth();
      setIsOnline(health.connected);
      setLatency(health.latencyMs);
      setLastChecked(new Date().toLocaleTimeString());
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    pingGateway();
    // Poll every 30 seconds
    const interval = setInterval(pingGateway, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isOnline === null) {
    return null;
  }

  return (
    <div className="fixed top-16 right-4 sm:right-6 z-30 select-none pointer-events-auto">
      {/* Minimized Pill */}
      {!isExpanded ? (
        <motion.button
          initial={{ opacity: 0, y: -6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsExpanded(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg border text-xs font-semibold cursor-pointer transition-all ${
            isOnline
              ? 'bg-emerald-950/85 text-emerald-200 border-emerald-700/60 shadow-emerald-950/30'
              : 'bg-amber-950/85 text-amber-200 border-amber-700/60 shadow-amber-950/30'
          }`}
          title="Click to view Backend Microservices & API Gateway status"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'
            }`}
          />
          <Server className="w-3.5 h-3.5" />
          <span>
            {isOnline
              ? `Gateway Live (${latency}ms)`
              : 'Backend Offline (Mock Simulation)'}
          </span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </motion.button>
      ) : (
        /* Expanded Diagnostics Modal Card */
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="w-80 sm:w-96 p-4 rounded-3xl bg-charcoal-900/95 text-warm-100 border border-charcoal-700 backdrop-blur-xl shadow-2xl space-y-3.5"
        >
          <div className="flex items-center justify-between pb-2 border-b border-charcoal-800">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-tangerine-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Microservices Status
              </h4>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 text-warm-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Close status panel"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Connection Overview */}
          <div
            className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
              isOnline
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {isOnline ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <div>
                <div className="font-bold">
                  {isOnline ? 'Connected to API Gateway' : 'Running in Mock Fallback Mode'}
                </div>
                <div className="text-[10px] text-warm-300 mt-0.5">
                  {isOnline
                    ? `Live responses from ${GATEWAY_URL} · ${latency}ms latency`
                    : 'Backend microservices are offline. Serving realistic demo data.'}
                </div>
              </div>
            </div>

            <button
              onClick={pingGateway}
              disabled={isPinging}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Ping backend now"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Microservices Port Registry */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-warm-400 tracking-wider">
              Configured Microservices Registry
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-charcoal-800/70 border border-charcoal-700/60 flex items-center justify-between">
                <span className="text-warm-300">API Gateway</span>
                <span className="font-bold text-tangerine-400">:8080</span>
              </div>
              <div className="p-2 rounded-xl bg-charcoal-800/70 border border-charcoal-700/60 flex items-center justify-between">
                <span className="text-warm-300">Eureka Registry</span>
                <span className="font-bold text-teal-400">:8761</span>
              </div>
              <div className="p-2 rounded-xl bg-charcoal-800/70 border border-charcoal-700/60 flex items-center justify-between">
                <span className="text-warm-300">Auth Service</span>
                <span className="font-bold text-sky-400">:8081</span>
              </div>
              <div className="p-2 rounded-xl bg-charcoal-800/70 border border-charcoal-700/60 flex items-center justify-between">
                <span className="text-warm-300">Restaurant</span>
                <span className="font-bold text-emerald-400">:8082</span>
              </div>
              <div className="p-2 rounded-xl bg-charcoal-800/70 border border-charcoal-700/60 flex items-center justify-between">
                <span className="text-warm-300">Order Service</span>
                <span className="font-bold text-violet-400">:8083</span>
              </div>
              <div className="p-2 rounded-xl bg-charcoal-800/70 border border-charcoal-700/60 flex items-center justify-between">
                <span className="text-warm-300">Payment Service</span>
                <span className="font-bold text-pink-400">:8084</span>
              </div>
            </div>
          </div>

          {/* Quick Help / Launch Guide */}
          {!isOnline && (
            <div className="p-2.5 rounded-2xl bg-charcoal-800 border border-charcoal-700 text-[11px] text-warm-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Terminal className="w-3.5 h-3.5 text-tangerine-400" />
                <span>To Start All Backend Microservices:</span>
              </div>
              <p className="font-mono text-[10px] bg-charcoal-950 p-1.5 rounded-lg text-emerald-400 select-all border border-charcoal-800">
                .\start-quickbite.ps1
              </p>
              <p className="text-[10px] text-warm-400 leading-tight">
                Requires PostgreSQL (user <code>postgres</code>) and JDK 17+.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] text-warm-400 pt-1">
            <span>Last probed: {lastChecked || 'Just now'}</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-tangerine-400 hover:text-tangerine-300 font-bold"
            >
              Minimize
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ApiStatusBanner;
