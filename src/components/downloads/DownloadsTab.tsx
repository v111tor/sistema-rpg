const EBOOKS = [
  {
    title: 'A Ultima Ascenção - Livro de Regras',
    description: 'Sistema mecânico completo, classes, combate, magia e criação de personagem.',
    type: 'HTML',
    href: 'ebook/A_Ultima_Ascencao_Livro_de_Regras.html',
    online: true,
  },
  {
    title: 'A Ultima Ascenção - Livro de Regras',
    description: 'Versão PDF para leitura, impressão e consulta fora do navegador.',
    type: 'PDF',
    href: 'ebook/A_Ultima_Ascencao_Livro_de_Regras.pdf',
  },
  {
    title: 'A Ultima Ascenção - Livro de Regras',
    description: 'Versão EPUB para leitores digitais.',
    type: 'EPUB',
    href: 'ebook/A_Ultima_Ascencao_Livro_de_Regras.epub',
  },
  {
    title: 'A Ultima Ascenção - Bestiário',
    description: 'Fichas compactas de criaturas, índices por tipo, grau e habitat, sprites PNG e habilidades especiais.',
    type: 'HTML',
    href: 'ebook/A_Ultima_Ascencao_Bestiario.html',
    online: true,
  },
  {
    title: 'A Ultima Ascenção - Livro do Mestre',
    description: 'Guia do mestre, regras opcionais, classe Abismal, subclasses abissais e ferramentas de aventura.',
    type: 'HTML',
    href: 'ebook/A_Ultima_Ascencao_Livro_do_Mestre.html',
    online: true,
  },
  {
    title: 'A Ultima Ascenção - Codex das Sete Forças',
    description: 'Site complementar com lore, símbolos, cultos e referências das sete divindades.',
    type: 'HTML',
    href: 'ebook/A_Ultima_Ascencao_Codex_das_Sete_Forcas.html',
    online: true,
  },
]

export function DownloadsTab() {
  return (
    <section className="downloads-page">
      <div className="downloads-hero">
        <p className="muted">Biblioteca publicada</p>
        <h2>A Ultima Ascenção</h2>
        <p>Arquivos sincronizados para consulta online e download.</p>
      </div>

      <div className="downloads-list">
        {EBOOKS.map((ebook) => {
          const href = `${import.meta.env.BASE_URL}${ebook.href}`
          return (
            <article className="download-card" key={`${ebook.href}-${ebook.type}`}>
              <div>
                <span className="pill gold">{ebook.type}</span>
                <h3>{ebook.title}</h3>
                <p>{ebook.description}</p>
              </div>
              <div className="download-actions">
                {ebook.online && (
                  <a className="btn" href={href} target="_blank" rel="noopener noreferrer">
                    Ler online
                  </a>
                )}
                <a className="btn primary" href={href} download>
                  Baixar
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
