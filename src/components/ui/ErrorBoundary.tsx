import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { failed: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Falha isolada na interface:', error, info.componentStack)
  }

  private recover = () => {
    try {
      const raw = localStorage.getItem('mesa_rpg_ui_local_v1')
      const ui = raw ? JSON.parse(raw) : {}
      localStorage.setItem('mesa_rpg_ui_local_v1', JSON.stringify({ ...ui, activeTab: 'ficha' }))
    } catch { /* a navegação será recuperada pelo reload */ }
    window.location.reload()
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="panel empty">
          <h3>Não foi possível abrir esta área.</h3>
          <p>Os dados foram preservados. Volte para a ficha e tente novamente.</p>
          <button className="btn primary" onClick={this.recover}>Voltar para Personagem</button>
        </div>
      )
    }
    return this.props.children
  }
}
