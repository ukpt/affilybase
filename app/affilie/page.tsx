import Logo from '../components/Logo'
export default function Affilie() {
  return (
    <div className="flex min-h-screen" style={{background: '#F5F0E8'}}>

      {/* Sidebar */}
      <div className="w-52 bg-white border-r border-stone-200 flex flex-col py-5">
        <div className="px-5 pb-6">
      <Logo size="sm" />
      </div>
        <nav className="flex flex-col">
          <div className="px-5 py-2 text-sm font-medium text-stone-900 bg-stone-100 border-l-2 border-stone-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-900 inline-block"></span>
            Mon tableau de bord
          </div>
          {['Mon code','Mes gains','Historique'].map(item => (
            <div key={item} className="px-5 py-2 text-sm text-stone-500 flex items-center gap-2 cursor-pointer hover:text-stone-900">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 inline-block"></span>
              {item}
            </div>
          ))}
        </nav>
        <div className="mt-auto px-5 pb-4">
          <div className="text-xs text-stone-400 mb-1">Boutique partenaire</div>
          <div className="text-sm font-medium text-stone-900">Sophie Créations</div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">

        {/* Topbar */}
        <div className="mb-6">
          <h1 className="text-base font-medium text-stone-900">Bonjour, Marie</h1>
          <p className="text-xs text-stone-500 mt-0.5">Voici l'état de votre programme d'affiliation</p>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            {label: 'Gains totaux', value: '144 €', sub: '+32 € ce mois', green: true},
            {label: 'En attente de paiement', value: '144 €', sub: 'Paiement sous 7 jours', green: false},
            {label: 'Ventes générées', value: '18', sub: 'depuis le début', green: false},
          ].map(m => (
            <div key={m.label} className="bg-white border border-stone-200 rounded-lg p-3.5">
              <div className="text-xs text-stone-400 mb-1.5">{m.label}</div>
              <div className="text-2xl font-medium text-stone-900">{m.value}</div>
              <div className={`text-xs mt-1 ${m.green ? 'text-green-700' : 'text-stone-500'}`}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Mon code */}
        <h2 className="text-sm font-medium text-stone-900 mb-3">Mon code d'affiliation</h2>
        <div className="bg-white border border-stone-200 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-stone-400 mb-1.5">Votre code personnel</div>
              <div className="text-4xl font-medium text-stone-900 font-mono tracking-widest">MARIE20</div>
            </div>
            <button className="text-xs font-medium bg-stone-900 text-white px-3 py-1.5 rounded cursor-pointer">Copier le code</button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-lg p-3" style={{background:'#F5F0E8'}}>
              <div className="text-xs text-stone-500 mb-1">Remise offerte à l'acheteur</div>
              <div className="text-xl font-medium text-stone-900">20%</div>
              <div className="text-xs text-stone-400 mt-1">sur toute la boutique</div>
            </div>
            <div className="rounded-lg p-3" style={{background:'#F5F0E8'}}>
              <div className="text-xs text-stone-500 mb-1">Ma commission par vente</div>
              <div className="text-xl font-medium text-stone-900">10%</div>
              <div className="text-xs text-stone-400 mt-1">du montant de la commande</div>
            </div>
          </div>
        </div>

        {/* Partage */}
        <h2 className="text-sm font-medium text-stone-900 mb-3">Partager mon code</h2>
        <div className="bg-white border border-stone-200 rounded-xl p-4 mb-5">
          <div className="flex gap-2 flex-wrap">
            {['Copier le lien','Instagram','TikTok','WhatsApp','Email'].map(btn => (
              <button key={btn} className="text-xs text-stone-900 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded cursor-pointer hover:bg-stone-200">
                {btn}
              </button>
            ))}
          </div>
        </div>

        {/* Historique */}
        <h2 className="text-sm font-medium text-stone-900 mb-3">Historique des ventes</h2>
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          {[
            {date:'21 avril 2026', commande:'Commande #1082', panier:'80 €', commission:'+8 €', paid: false},
            {date:'18 avril 2026', commande:'Commande #1071', panier:'120 €', commission:'+12 €', paid: false},
            {date:'12 avril 2026', commande:'Commande #1058', panier:'60 €', commission:'+6 €', paid: true},
            {date:'5 avril 2026', commande:'Commande #1044', panier:'200 €', commission:'+20 €', paid: true},
          ].map((h, i, arr) => (
            <div key={h.commande} className={`flex items-center gap-2.5 px-4 py-2.5 ${i < arr.length-1 ? 'border-b border-stone-100' : ''}`}>
              <div className="text-xs text-stone-400 w-28">{h.date}</div>
              <div className="flex-1">
                <div className="text-sm text-stone-900">{h.commande}</div>
                <div className="text-xs text-stone-400">Panier : {h.panier} · Remise 20% appliquée</div>
              </div>
              <div className="text-sm font-medium text-green-700">{h.commission}</div>
              <span className={`text-xs px-2 py-0.5 rounded ${h.paid ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                {h.paid ? 'Payé' : 'En attente'}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}