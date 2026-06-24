import { useStore } from '../../store'
import type { TabId } from '../../types'

const NAV_ITEMS: [TabId, string, string][] = [
  ['ficha', 'P', 'Personagem'],
  ['campanha', 'C', 'Campanhas'],
  ['mestre', '!', 'Criaturas'],
  ['mapas', 'M', 'Mapas'],
  ['magia', 'H', 'Habilidades'],
  ['dados', 'D', 'Dados'],
  ['downloads', 'DL', 'Downloads'],
]

export function Sidebar() {
  const { ui, setTab } = useStore()

  return (
    <aside className="side">
      <div className="brand">
        <h1>C.R.M.</h1>
        <p>Central de Registro Mecânico para personagens, campanhas, criaturas e habilidades.</p>
      </div>
      <nav className="nav" aria-label="Navegação principal">
        {NAV_ITEMS.map(([id, mark, label]) => (
          <button
            key={id}
            className={ui.activeTab === id ? 'active' : ''}
            onClick={() => setTab(id)}
          >
            <span className="nav-mark">{mark}</span>
            {label}
          </button>
        ))}
        <a href={`${import.meta.env.BASE_URL}ebook/A_Ultima_Ascencao_Livro_de_Regras.html`} target="_blank" rel="noopener noreferrer">
          <span className="nav-mark">S</span> Sistema Mecânico
        </a>
        <a href={`${import.meta.env.BASE_URL}ebook/A_Ultima_Ascencao_Livro_de_Regras.pdf`} download>
          <span className="nav-mark">PDF</span> Baixar PDF
        </a>
      </nav>
    </aside>
  )
}
