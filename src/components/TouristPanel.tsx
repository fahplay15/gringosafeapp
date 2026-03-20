import { Radio, MessageCircle, ArrowLeft, Search } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { useState } from 'react'
import type { PriceQuery } from '../types'

function QueryModal() {
  const { addQuery, setShowQueryModal } = useAppStore()
  const [question, setQuestion] = useState('')

  const handleSubmit = () => {
    if (!question.trim()) return
    const q: PriceQuery = {
      id: `q_${Date.now()}`,
      question: question.trim(),
      lat: -7.116 + (Math.random() - 0.5) * 0.01,
      lng: -34.865 + (Math.random() - 0.5) * 0.01,
      askedAt: Date.now(),
      status: 'open',
      answers: [],
    }
    addQuery(q)
    setShowQueryModal(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center p-4">
      <div className="glass-card w-full max-w-md p-6">
        <h3 className="font-bold text-lg mb-1">Consultar Preço Justo</h3>
        <p className="text-gray-400 text-sm mb-4">
          Moradores locais receberão sua dúvida e responderão em segundos.
        </p>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ex: Quanto custa uma caipirinha aqui perto? O vendedor me cobrou R$40..."
          className="w-full bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-white text-sm resize-none h-28 focus:outline-none focus:border-blue-500 placeholder:text-gray-600"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowQueryModal(false)}
            className="flex-1 py-3 rounded-xl border border-brand-border text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
          >
            Enviar Dúvida
          </button>
        </div>
        <p className="text-xs text-gray-600 text-center mt-3">
          Recompensa de R$0,50 para quem responder corretamente
        </p>
      </div>
    </div>
  )
}

export default function TouristPanel() {
  const { radarActive, toggleRadar, queries, setShowQueryModal, showQueryModal, setRole } = useAppStore()
  const [showQueries, setShowQueries] = useState(false)

  const answeredQueries = queries.filter((q) => q.answers.length > 0)

  return (
    <>
      {showQueryModal && <QueryModal />}

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
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-sm font-medium text-blue-300">Turista</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pb-6 space-y-3 pointer-events-none safe-area-inset-bottom">
        {showQueries && (
          <div className="glass-card p-4 pointer-events-auto max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Respostas da Comunidade</h3>
              <button onClick={() => setShowQueries(false)} className="text-gray-500 text-xs hover:text-white">
                Fechar
              </button>
            </div>
            {answeredQueries.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-2">Nenhuma resposta ainda.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {answeredQueries.map((q) => (
                  <div key={q.id} className="bg-white/5 rounded-xl p-3">
                    <p className="text-sm text-gray-300 mb-2">"{q.question}"</p>
                    {q.answers.map((a) => (
                      <div key={a.id} className="bg-green-500/10 rounded-lg p-2.5 border border-green-500/20">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-semibold text-green-400">{a.responderName}</span>
                          <span className="text-green-400 font-bold text-sm">R${a.fairPrice}</span>
                        </div>
                        <p className="text-xs text-gray-400">{a.message}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 max-w-md mx-auto pointer-events-auto">
          <button
            onClick={toggleRadar}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95 ${
              radarActive
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/40'
                : 'glass-card border border-brand-border text-gray-300 hover:border-green-500/50'
            }`}
          >
            <Radio className={`w-5 h-5 ${radarActive ? 'animate-pulse' : ''}`} />
            {radarActive ? 'Radar Ativo' : 'Ativar Radar'}
          </button>

          <button
            onClick={() => setShowQueryModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
            Consultar Preço
          </button>

          <button
            onClick={() => setShowQueries(!showQueries)}
            className={`glass-card border border-brand-border px-4 py-4 rounded-2xl text-gray-300 hover:text-white transition-colors relative ${showQueries ? 'border-blue-500/50 text-blue-300' : ''}`}
          >
            <Search className="w-5 h-5" />
            {answeredQueries.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                {answeredQueries.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
