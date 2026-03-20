import { ArrowLeft, DollarSign, Plus, CheckCircle, Clock, Wallet, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { useGemini } from '../hooks/useGemini'
import type { PriceItem, QueryAnswer } from '../types'

function AddPriceModal({ onClose }: { onClose: () => void }) {
  const { vendors, addPriceReport, addBalance, localUser } = useAppStore()
  const { identify, suggestPriceAI, checkPrice, loading } = useGemini()
  const [vendorId, setVendorId] = useState(vendors[0]?.id ?? '')
  const [itemName, setItemName] = useState('')
  const [normalizedName, setNormalizedName] = useState('')
  const [price, setPrice] = useState('')
  const [unit, setUnit] = useState('unid')
  const [suggestion, setSuggestion] = useState<{ price: number; range: string } | null>(null)
  const [validation, setValidation] = useState<{ fair: boolean; message: string } | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const handleItemChange = async (value: string) => {
    setItemName(value)
    
    if (value.length > 2) {
      setAnalyzing(true)
      // Identificar produto
      const identified = await identify(value)
      setNormalizedName(identified.name)
      setUnit(identified.unit)
      
      // Sugerir preço
      const priceSuggestion = await suggestPriceAI(identified.name, identified.unit)
      setSuggestion(priceSuggestion)
      setAnalyzing(false)
    }
  }

  const handlePriceChange = async (value: string) => {
    setPrice(value)
    
    if (value && normalizedName && parseFloat(value) > 0) {
      const validation = await checkPrice(normalizedName, parseFloat(value), vendors.find(v => v.id === vendorId)?.name || 'Praia')
      setValidation(validation)
    }
  }

  const handleSubmit = () => {
    if (!itemName.trim() || !price || !vendorId) return
    const item: PriceItem = {
      id: `pi_${Date.now()}`,
      name: normalizedName || itemName.trim(),
      value: parseFloat(price),
      unit,
      reportedBy: localUser.name,
      timestamp: Date.now(),
    }
    addPriceReport(vendorId, item)
    addBalance(0.25)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center p-4">
      <div className="glass-card w-full max-w-md p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Cadastrar Preço Real
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Estabelecimento</label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id} style={{ background: '#161B22' }}>{v.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs text-gray-500 mb-1 block flex items-center gap-1">
              Item {analyzing && <span className="text-xs text-yellow-400 animate-spin">⚡</span>}
            </label>
            <input
              value={itemName}
              onChange={(e) => handleItemChange(e.target.value)}
              placeholder="Ex: Caipirinha, Água de Coco..."
              className="w-full bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500 placeholder:text-gray-600"
              disabled={analyzing}
            />
            {normalizedName && normalizedName !== itemName && (
              <p className="text-xs text-green-400 mt-1">✓ Reconhecido como: <span className="font-semibold">{normalizedName}</span></p>
            )}
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Preço (R$)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="0,00"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm focus:outline-none placeholder:text-gray-600 ${
                  validation ? (validation.fair ? 'border-green-500' : 'border-yellow-500') : 'border-brand-border'
                } focus:border-green-500`}
              />
              {suggestion?.price && !price && (
                <p className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                  💡 Sugestão: R${suggestion.price.toFixed(2)} ({suggestion.range})
                </p>
              )}
              {validation && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${validation.fair ? 'text-green-400' : 'text-yellow-400'}`}>
                  {validation.fair ? '✓' : '⚠'} {validation.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Unidade</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="bg-white/5 border border-brand-border rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-green-500"
              >
                <option style={{ background: '#161B22' }} value="unid">unid</option>
                <option style={{ background: '#161B22' }} value="kg">kg</option>
                <option style={{ background: '#161B22' }} value="dia">dia</option>
                <option style={{ background: '#161B22' }} value="porção">porção</option>
                <option style={{ background: '#161B22' }} value="litro">litro</option>
              </select>
            </div>
          </div>
        </div>
        <p className="text-xs text-green-400 mt-3 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          Você ganha R$0,25 por cadastro validado
        </p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-brand-border text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!itemName.trim() || !price || !vendorId || loading}
            className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
          >
            {loading ? 'Analisando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function QueryAnswerModal({ onClose }: { onClose: () => void }) {
  const { activeQuery, answerQuery, addBalance, localUser, setActiveQuery } = useAppStore()
  const [fairPrice, setFairPrice] = useState('')
  const [message, setMessage] = useState('')

  if (!activeQuery) return null

  const handleSubmit = () => {
    if (!fairPrice || !message.trim()) return
    const answer: QueryAnswer = {
      id: `ans_${Date.now()}`,
      responderId: localUser.id,
      responderName: localUser.name,
      fairPrice: parseFloat(fairPrice),
      message: message.trim(),
      votes: 0,
      timestamp: Date.now(),
    }
    answerQuery(activeQuery.id, answer)
    addBalance(0.5)
    setActiveQuery(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center p-4">
      <div className="glass-card w-full max-w-md p-6">
        <h3 className="font-bold text-lg mb-2">Responder Dúvida</h3>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-blue-200">"{activeQuery.question}"</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Preço justo (R$)</label>
            <input
              type="number"
              value={fairPrice}
              onChange={(e) => setFairPrice(e.target.value)}
              placeholder="Quanto custa de verdade..."
              className="w-full bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500 placeholder:text-gray-600"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Explicação</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explique o preço justo da região..."
              className="w-full bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-white text-sm resize-none h-24 focus:outline-none focus:border-green-500 placeholder:text-gray-600"
            />
          </div>
        </div>
        <p className="text-xs text-green-400 mt-3 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          Você ganha R$0,50 por resposta correta
        </p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-brand-border text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-colors"
          >
            Responder
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LocalPanel() {
  const { setRole, localUser, queries, activeQuery, setActiveQuery } = useAppStore()
  const [showAddPrice, setShowAddPrice] = useState(false)
  const [showAnswerModal, setShowAnswerModal] = useState(false)
  const [showPanel, setShowPanel] = useState(false)

  const openQueries = queries.filter((q) => q.status === 'open')
  const canWithdraw = localUser.balance >= 20

  return (
    <>
      {showAddPrice && <AddPriceModal onClose={() => setShowAddPrice(false)} />}
      {(showAnswerModal && activeQuery) && <QueryAnswerModal onClose={() => { setShowAnswerModal(false); setActiveQuery(null) }} />}

      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => setRole(null)}
          className="glass-card px-3 py-2 flex items-center gap-2 text-sm text-gray-300 hover:text-white pointer-events-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Sair
        </button>
        <div className="glass-card px-3 py-1.5 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm font-medium text-green-300">Avaliador Local</span>
          </div>
        </div>
      </div>

      {showPanel && (
        <div className="absolute bottom-[88px] left-0 right-0 z-10 px-4 pointer-events-none">
          <div className="glass-card p-5 max-w-md mx-auto pointer-events-auto">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-green-400">R${localUser.balance.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-0.5">Saldo</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-white">{localUser.reports}</p>
                <p className="text-xs text-gray-500 mt-0.5">Cadastros</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-white">{localUser.answers}</p>
                <p className="text-xs text-gray-500 mt-0.5">Respostas</p>
              </div>
            </div>

            <button
              disabled={!canWithdraw}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm mb-4 transition-all ${
                canWithdraw
                  ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-white/5 border border-brand-border text-gray-600 cursor-not-allowed'
              }`}
            >
              <Wallet className="w-4 h-4" />
              {canWithdraw ? 'Sacar via PIX' : `Faltam R$${(20 - localUser.balance).toFixed(2)} para sacar`}
            </button>

            {openQueries.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Dúvidas Abertas ({openQueries.length})
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {openQueries.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => { setActiveQuery(q); setShowAnswerModal(true) }}
                      className="w-full text-left bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2.5 hover:bg-blue-500/20 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-300 line-clamp-2">{q.question}</p>
                          <span className="text-xs text-green-400 font-medium">+R$0,50</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pb-6 pointer-events-none safe-area-inset-bottom">
        <div className="flex gap-3 max-w-md mx-auto pointer-events-auto">
          <button
            onClick={() => setShowPanel(!showPanel)}
            className={`glass-card border border-brand-border px-4 py-4 rounded-2xl transition-colors relative ${showPanel ? 'border-green-500/50 text-green-400' : 'text-gray-300 hover:text-white'}`}
          >
            <DollarSign className="w-5 h-5" />
            {openQueries.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                {openQueries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowAddPrice(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm shadow-lg shadow-green-500/30 transition-all duration-200 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Cadastrar Preço
          </button>

          {activeQuery ? (
            <button
              onClick={() => setShowAnswerModal(true)}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-95"
            >
              <Send className="w-5 h-5" />
              Responder
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
