# AGENTE CRIADOR DE AVENTURA PRONTA - SISTEMA MECANICO RPG

Esta memoria deve ser usada quando o usuario pedir para criar uma aventura pronta, um modulo de sessao, uma continuacao de arco, uma aventura em formato de livro, ou disser algo como:

- "rode a memoria de aventura"
- "use a memoria de aventura pronta"
- "crie uma aventura"
- "transforme isso em aventura"
- "monte uma aventura para narrar"

Quando esta memoria for chamada, leia primeiro este arquivo, depois consulte os arquivos do projeto indicados abaixo antes de criar ou editar material.

## Objetivo

Criar aventuras prontas de RPG em portugues do Brasil, claras, objetivas e faceis de usar em mesa, usando o Sistema Mecanico RPG como base.

A aventura deve funcionar como:

1. Livro de aventura, com narracao, contexto, mundo e historia.
2. Material pratico de mesa, com cenas jogaveis, pistas, encontros, NPCs e consequencias.
3. Arquivo compativel com Obsidian, com frontmatter YAML, titulos bem separados, links internos e tags.

## Fontes do projeto

Antes de criar conteudo novo, consulte conforme a tarefa:

- Vault Obsidian da campanha: `C:/Users/presi/OneDrive/Documents/documentos RPG`
- Painel do Obsidian: `C:/Users/presi/OneDrive/Documents/documentos RPG/00 - Painel da Campanha.md`
- Sistema principal: `sistema/mecanicas/sistema_mecanico_formatado.md`
- Bestiario: `sistema/mecanicas/bestiario_sistema.md`
- Divindades: `sistema/mecanicas/divindades_sistema.md`
- Ebook do sistema: `sistema/ebook/Sistema_Mecanico_RPG.html`
- Locais catalogados: `lugares/indice_lugares.json` e `lugares/indice_lugares.md`
- Agente de arcos: `sistema/agentes/agente_criador_arcos_sistema_mecanico.md`
- Agente de NPCs: `sistema/agentes/agente_criador_npc_sistema_mecanico.md`
- Arco 01: `arco/arco.md`
- Arco 02: `arco_02/arco.md`
- Backup preferencial da mesa: `fichas/mesa-rpg-backup.json`
- Backup antigo da mesa: `arco/mesa-principal/mesa-rpg-backup.json`
- Molde de bestiario: `molde_bestiario_rpg.md`

Quando houver diferenca entre um lugar no workspace e uma nota equivalente no Obsidian, use a nota do Obsidian como fonte mais atual de mundo, salvo se o usuario pedir explicitamente para usar outra versao.

Se o usuario fornecer uma ideia, resumo, arquivo, vila, regiao, NPC, bestiario ou anotacao, use isso como fonte principal. Se houver contradicao, mantenha a informacao mais recente enviada pelo usuario.

## Regras de trabalho

- Nao pare por falta de informacao. Crie o que faltar de forma coerente.
- Pergunte apenas se a ausencia de informacao impedir a tarefa ou causar risco real de desfazer algo existente.
- Quando inventar informacao que nao veio do usuario nem dos arquivos, marque com:

> [!note] Informacao criada
> Esta informacao foi criada para completar a aventura, pois nao estava definida no material original.

- Mantenha o texto pratico para narracao. Evite blocos longos dentro de cenas.
- Cada cena precisa ter entrada, objetivo, escolhas e consequencias.
- Nunca dependa de uma unica pista para revelar um segredo importante.
- Sempre que possivel, reaproveite locais, criaturas, NPCs e consequencias ja existentes na campanha.

## Memoria da campanha atual

### Vault Obsidian - documentos RPG

O vault foi verificado em `C:/Users/presi/OneDrive/Documents/documentos RPG`.

Estrutura encontrada:

- `.obsidian`: configuracao do cofre.
- `00 - Painel da Campanha.md`: hub principal.
- `Lugares/`: lugares, vilas, imperios e templos.
- `NPCs/`: NPCs proprios do mundo.
- `Regioes/`: moldes e material regional.
- `Sistema de Regras/`: sistema, bestiario, divindades, agentes e ebook.

Fluxo indicado pelo painel:

1. Consulte ou crie lugares em `Lugares/`.
2. Consulte ou crie personagens em `NPCs/`.
3. Use `Sistema de Regras/Bestiario/Por Grau/` para montar encontros balanceados.
4. Preserve moldes em pastas `template` ou `_Templates`.

Notas importantes:

- Os arquivos `NPCs/Arturo Selva.md` e `NPCs/Carmander Asbarta.md` existem, mas estavam vazios na leitura inicial.
- O vault tem copia modular do bestiario com 80 criaturas, indices por Grau, Tipo e Habitat.
- O vault tem copia do Sistema Mecanico, Divindades, Agente Criador de Arcos e Agente Criador de NPC.

### Lugares do Obsidian

#### Vila de Ferro Clara

- Tipo: vila.
- Status: ativa, em crise silenciosa.
- Povo predominante: lizardmans.
- Lider atual: Vrass de Pedra.
- Regiao: Pantano de Ferro Clara.
- Religiao: Natureza.
- Tom: fronteira perigosa, pantano sagrado, comunidade desconfiada.
- Temas: escassez, pacto antigo, sobrevivencia, territorio sagrado.
- Fonte de renda: mercado ribeirinho, coleta, caca regulada e trocas de sobrevivencia.
- Tabu central: poluir agua.
- Lei local: dividas pequenas podem ser pagas com trabalho comunitario.
- Segredo principal: pacto antigo com uma criatura da agua, possivelmente ligado a protecao, caca, agua limpa ou sobrevivencia durante secas.
- Problema atual: escassez crescente, criaturas aparecendo perto de inocentes, estoque separado em segredo e medo de contaminacao da agua.
- Locais marcantes: Praca de Barro Batido, Casa de Conselho de Ferro Clara, Celeiro Comunal, Banca de Sskara da Ponte, Agua do Pacto, Ponto Mais Antigo de Ferro Clara.
- NPCs locais: Vrass de Pedra, Vrass Ferrolho, Makru da Ponte, Issak Vela-Fria, Sskara Ferrolho.
- Ameacas ligadas: Guardiao Ribeirinho, Deus Pequeno do Lodo, Crocodilo de Pedra, Afogado Sem Rosto.
- Frase de apresentacao: "Em Ferro Clara, ate a agua parece esperar que voce peca permissao antes de tocar nela."

Use Ferro Clara como vila de misterio, crise de sobrevivencia, respeito cultural, segredo sagrado e consequencias de pactos antigos.

#### Vila das Sete Portas

- Tipo: vila.
- Status: ativa, politicamente tensionada.
- Continente: Eldoria.
- Regiao do mundo: Marisma Oriental.
- Reino/imperio: Imperio de Sal.
- Base proxima: Porto Junco.
- Povo predominante: lizardmans.
- Lider atual: Sskara da Ponte, curandeira-chefe.
- Religiao: Natureza.
- Tom: fronteira perigosa, negociacao tensa, comunidade desconfiada.
- Temas: pacto antigo, tabu de ovos e filhotes, faccao desprezada, agua e memoria.
- Tabu central: matar filhotes ou ovos de especies locais.
- Lei local: forasteiros recebem abrigo por uma noite, mas devem partir ou contribuir depois disso.
- Segredo principal: pacto antigo com uma criatura da agua ligado a existencia da setima porta, protecao dos ovos e sobrevivencia da vila.
- Problema atual: Sskara negocia com uma faccao desprezada pela populacao.
- As sete portas: Porta do Junco, Porta da Lama Quente, Porta dos Ovos, Porta da Agua Parada, Porta da Ponte Torta, Porta do Silencio, Porta Proibida.
- Locais marcantes: Casa de Conselho das Sete Portas, Celeiro Comunal, Praca de Barro Batido, Tenda Fiscalizada por Sskara, Porta dos Ovos, Porta Proibida, Canal das Memorias Afogadas.
- NPCs locais: Sskara da Ponte, Issak, Sskara Ferrolho, Vrass da Ponte, Issak da Ponte.
- Ameacas ligadas: Afogado Sem Rosto, Memoria Afogada, Polvo de Pedra, Guardiao Ribeirinho.
- Frase de apresentacao: "Em Sete Portas, toda entrada cobra uma promessa, e toda saida cobra uma consequencia."

Use Sete Portas como passagem estrategica, vila de tabus, investigacao politica, negociacao tensa e ponte entre pantano e Imperio de Sal.

#### Imperio de Asbarta

- Tipo: imperio humano.
- Status: rascunho.
- Localizacao: montanhas mineradoras.
- Povo dominante: humanos.
- Governo: monarquia imperial.
- Lider atual: Carmander Asbarta.
- NPC importante: Arturo Selva.
- Economia: mineracao, comercio e saques.
- Recurso importante: Mitrio.
- Temas: mineracao, guerra, saque, maldicao, preconceito, ruinas antigas.
- Cultura dominante: soberba humana e tratamento de outras especies como inferiores, escravas, ferramentas ou objetos.
- Segredo politico: a coroa pode estar perdendo controle para o estado militar.
- Segredo antigo: a familia real fez pacto com deuses para fundar o imperio; os primogenitos reais nascem cada vez mais fracos.
- Lenda: Cervo de Chifres Dourados, entidade ou forma divina que cobra o preco da ambicao.
- Ruinas: Asbarta foi construida sobre antiga civilizacao prospera, com tesouros sob a base militar.
- Conflitos: coroa contra exercito, povo contra maldicao, especies oprimidas contra soberba humana, estado militar escondendo tesouros.
- Ganchos fortes: herdeiro real fraco, entrada secreta nas ruinas, agentes da coroa desaparecidos, rebeliao de povos escravizados, mensagem em mitrio, retorno do cervo, culto secreto ao Deus da Sombra.

Use Asbarta para aventuras de montanha, opressao imperial, exploracao subterranea, maldicao dinastica, militarismo e conspiracao sobre tesouros antigos.

#### Reino Imperial de Kingstom

- Tipo: reino de poder imperial.
- Status: destruido.
- Regiao: norte do continente.
- Governo antigo: monarquia hereditaria.
- Figura central: Vessel.
- Temas: queda, vinganca, corte, sombras, tragedia.
- Evento central: Massacre do Festival da Colheita.
- Ameaça sobrenatural: Sombra de Vessel.
- Local oculto: Templo Subterraneo ao Norte de Kingstom.
- Cultura: corte, festivais, banquetes, artistas, colheita e aparencia publica.
- Ferida social: nobreza luxuosa e pobres invisiveis; artistas celebrados, mas sem respeito real.
- Origem de Vessel: orfao sem sobrenome levado a corte como artista e bobo, tratado como entretenimento.
- Queda: Vessel encontra entidade em templo subterraneo antigo, desperta uma sombra e destroi a estrutura de poder de Kingstom durante o Festival da Colheita.
- Segredos: o templo e anterior ao reino; a entidade pode ter manipulado Vessel; o rei talvez soubesse de lendas sobre o templo; Vessel talvez nao tenha sido abandonado por acaso.
- Rumores: guizos na madrugada, sombra que aparece antes de Vessel, templo ainda aberto, nobres sobreviventes, sombra sem mestre.
- Ganchos fortes: mascaras de Vessel, herdeiro escondido, entrada selada, reconstruir Kingstom, sombra sem mestre, guizos antes de tragedias.

Use Kingstom como ruina tragica, lenda viva, origem de vilao, dungeon sombria, comentario sobre humilhacao social e consequencias de uma corte cruel.

### Arco 01 - Cinzas Entre Tendas e Telhados

- Tom: investigacao sombria, dark fantasy, discriminacao racial/cultural, transicao de tribos para vila.
- Nivel: grupo nivel 1.
- Local inicial: Vila de Ferro Clara.
- Conflito: uma vila em formacao tenta trocar pactos tribais por leis, cercas, atas e guarda fixa.
- Vilao principal: Hadrun Pele-Limpa, fundador da primeira guarda, defensor de uma lei de pureza.
- Resultado esperado: a vila pode nascer com lei comum para todos, lei de pureza suavizada, retorno aos pactos tribais ou cicatriz politica.
- Elementos fortes: Pedreira dos Nomes Riscados, Casa de Julgamento de Madeira Verde, Tendas da Margem Velha, julgamento publico, nomes apagados, categoria dos tolerados.

### Arco 02 - As Estradas do Sal e da Cinza

- Continuidade: alguns dias ou semanas depois do Arco 01.
- Tom: investigacao sombria, dark fantasy politico, viagem sandbox, consequencias sociais.
- Nivel sugerido: nivel 2 ou grupo iniciante sobrevivente do primeiro arco.
- Ponto de partida: Vila de Ferro Clara, durante a assembleia publica depois do julgamento de Hadrun.
- Conflito: a pedra de fundacao sangra agua salgada e revela nomes de vilas, portos, templos e familias ligados a um pacto antigo.
- Tema central: o problema nao era local; havia controle regional de povos "tolerados" pelo Imperio de Sal.
- Locais centrais: Vila de Ferro Clara, Vila das Sete Portas, Porto Junco, Estrada das Pedras Brancas, Templo do Juramento.
- Vilao principal: Dama Ilyra Sal-Negro, magistrada comercial que transforma protecao em controle legal.
- Escolha final: quebrar, reescrever, usar ou esconder o pacto.

### Mesa conhecida

Backup preferencial lido em `fichas/mesa-rpg-backup.json`. Se esse arquivo existir, use ele antes de qualquer outro backup.

Personagens identificados:

- Sif de Sparda, humano guerreiro nivel 1, PV 16, Aparar 9, FOR d8, VIG d8, foco em combate corpo a corpo e Aura.
- Tronax, humano guerreiro nivel 1, PV 14, Aparar 9, FOR d8, VIG d6, INT d6, usa machado e besta leve, com perfil militar.
- Vessel, humano explorador nivel 1, PV 14, Aparar 8, AGI d8, ESP d6, forte em furtividade, engano, persuasao e ataque furtivo.

Ao balancear aventuras para esta mesa, assumir grupo pequeno de nivel 1 se nenhum backup mais recente for indicado. Use ameacas de Grau 0-2 como base, com chefe Grau 2 ou Grau 3 apenas quando houver terreno interativo, fraqueza clara e opcoes sociais.

## Locais catalogados

Sempre consulte `lugares/indice_lugares.json` antes de criar locais novos.

Locais atuais:

- Vila de Ferro Clara: vila de pantano, povo predominante lizardman, divindade Natureza. Base emocional e politica do Arco 01.
- Vila das Sete Portas: vila em Eldoria, Marisma Oriental, Imperio de Sal, base proxima Porto Junco, povo lizardman, divindade Natureza. Tem sete entradas, regras para forasteiros e segredo de pacto antigo com criatura da agua.
- Templo do Juramento: templo em ruina, povo predominante anao, divindade Morte. Centro antigo de juramentos, contratos funerarios e mortos sem nome.

Se criar lugar novo, explique como ele se conecta a estes locais.

## Regras mecanicas obrigatorias

Use apenas estes atributos:

- Forca
- Agilidade
- Vigor
- Intelecto
- Espirito
- Devocao

Nao use Presenca.

Use Espirito para:

- interacoes sociais
- percepcao
- intuicao
- medo
- leitura emocional
- convencimento
- negociacao
- enganacao social

Use Devocao para:

- religiao
- fe
- pactos
- bencaos
- maldicoes divinas
- resistencia espiritual
- entidades
- rituais sagrados

Pericias permitidas:

- Acrobacia
- Arcanismo
- Atletismo
- Enganacao
- Furtividade
- Historia
- Intimidacao
- Intuicao
- Medicina
- Natureza
- Percepcao
- Persuasao
- Prestidigitacao
- Religiao
- Sobrevivencia
- Tecnologia

NPCs e criaturas nao usam Dado Selvagem.

Personagens jogadores usam Dado Selvagem d6 em rolagens base. Pericias seguem a regra propria do sistema.

CDs principais:

- Trivial: 2
- Facil: 4
- Medio: 8
- Dificil: 12
- Epico: 16
- Lendario: 20

Aumento: resultado 4 ou mais acima da CD gera efeito adicional.

Modificadores de atributo:

- d4 = +0
- d6 = +1
- d8 = +2
- d10 = +3
- d12 = +4
- d20 = +6

## Escala de ameaca e balanceamento

Graus:

- Grau 0: figurante, obstaculo ou criatura fraca.
- Grau 1: ameaca baixa.
- Grau 2: ameaca media.
- Grau 3: elite ou chefe menor.
- Grau 4: chefe de arco.
- Grau 5: entidade rara ou lendaria.

Escala do bestiario:

| Grau | Uso | PV | Aparar/Defesa | Ataque | Dano medio | CD |
|---|---|---:|---:|---:|---:|---:|
| 0 | Figurante/obstaculo | 4-10 | 9-11 | +2 | 2-4 | 10 |
| 1 | Inimigo baixo | 12-24 | 11-13 | +3 | 4-7 | 11-12 |
| 2 | Inimigo medio | 25-45 | 13-15 | +4 | 7-11 | 13-14 |
| 3 | Elite/chefe menor | 46-75 | 15-17 | +5 | 11-17 | 15 |
| 4 | Chefe de arco | 76-120 | 17-19 | +6 | 17-25 | 16-17 |
| 5 | Entidade rara | 121+ | 19+ | +7 | 25+ | 18+ |

Pontos de encontro:

- Grau 0 vale 0,5 ponto.
- Grau 1 vale 1 ponto.
- Grau 2 vale 2 pontos.
- Grau 3 vale 4 pontos.
- Grau 4 vale 8 pontos.
- Grau 5 vale 16 pontos.

Para nivel 1-2:

- Facil: 1 ponto por personagem.
- Padrao: 2 pontos por personagem.
- Dificil: 3 pontos por personagem.
- Mortal: 4 pontos por personagem.

Se houver mais criaturas que personagens, aumente o orcamento em 25%. Se o terreno favorecer muito as criaturas, aumente em mais 25%. Se a criatura tiver controle forte, reduza o dano em 25%.

## Fontes de poder do sistema

Use as fontes de poder de forma consistente:

- Arcana: mente, estudo, runas, geometria, PA/Intelecto.
- Primitiva/Emocional: emocao, natureza, sensibilidade, PE/Espirito.
- Fe: divindades, pactos, bencaos e maldicoes, PD/Devocao.
- Tecnologia: item, dispositivo, protese, construto, carga, oficina e risco.
- Aura: energia marcial e espiritual treinada pelo corpo, AU, alcance curto e movimento.
- Absorcao: drenagem, roubo de energia, consequencia visivel e custo moral.

Divindades de Fe conhecidas:

- Luz: cura, revelacao, exorcismo, protecao.
- Sombra: segredos, ilusoes, passagem, morte suave.
- Natureza: plantas, animais, clima, venenos naturais, equilibrio.
- Morte: ancestrais, ciclos, ressurreicao, passagem.
- Caos: destruicao, mutacao, imprevisibilidade.
- Ordem: lei, destino, protecao, profecia, juramentos.
- Demonio: poder, medo, controle, pactos.

## Estrutura de entrega da aventura

Se criar uma pasta de aventura, use:

```txt
aventura-nome/
├── 00 - Resumo da Aventura.md
├── 01 - Contexto do Mundo.md
├── 02 - Local Principal.md
├── 03 - NPCs Importantes.md
├── 04 - Faccoes.md
├── 05 - Linha do Tempo.md
├── 06 - Cenas da Aventura.md
├── 07 - Locais de Exploracao.md
├── 08 - Pistas e Segredos.md
├── 09 - Encontros e Combates.md
├── 10 - Criaturas e Inimigos.md
├── 11 - Recompensas.md
├── 12 - Finais e Consequencias.md
├── 13 - Tabelas Rapidas.md
├── 14 - Textos de Narracao.md
└── 15 - Apendices.md
```

Se criar apenas um arquivo, use:

```txt
Aventura - {{Nome da Aventura}}.md
```

## Frontmatter Obsidian

Use frontmatter YAML no arquivo principal:

```yaml
---
tipo: aventura_rpg
nome: "{{nome_da_aventura}}"
sistema: "Sistema Mecanico RPG"
nivel_recomendado: "{{nivel}}"
numero_de_jogadores: "{{numero_de_jogadores}}"
duracao: "{{duracao_estimada}}"
tom: "{{tom}}"
tema:
  - "{{tema_1}}"
  - "{{tema_2}}"
  - "{{tema_3}}"
local_principal: "[[{{local_principal}}]]"
regiao: "[[{{regiao}}]]"
reino_ou_imperio: "[[{{reino_ou_imperio}}]]"
vila_ou_cidade: "[[{{vila_ou_cidade}}]]"
vilao_ou_ameaca: "[[{{vilao_ou_ameaca}}]]"
tags:
  - aventura
  - rpg
  - sistema-mecanico-rpg
  - aventura/{{nome_da_aventura}}
  - "{{tag_tom}}"
  - "{{tag_regiao}}"
  - "{{tag_ameaca}}"
---
```

Use links internos:

- `[[Nome do Local]]`
- `[[Nome do NPC]]`
- `[[Nome da Regiao]]`
- `[[Nome da Criatura]]`
- `[[Nome da Faccao]]`

## Ordem completa da aventura

A aventura deve conter, nesta ordem:

1. Titulo da aventura.
2. Resumo rapido para o mestre.
3. Premissa.
4. Ganchos iniciais, de 3 a 5.
5. Contexto do mundo.
6. Local principal.
7. Atmosfera e narracao.
8. Linha do tempo.
9. NPCs importantes.
10. Vilao ou ameaca principal.
11. Faccoes e grupos, de 2 a 4.
12. Estrutura em atos.
13. Cenas prontas, pelo menos 6.
14. Locais de exploracao, de 5 a 10.
15. Pistas e segredos.
16. Encontros e combates.
17. Testes e desafios.
18. Criaturas e inimigos.
19. Recompensas.
20. Finais e consequencias.
21. Tabelas rapidas.
22. Textos prontos para narracao.
23. Mapas e auxilios.
24. Apendices.

## Checklist de qualidade

Antes de finalizar, confirme que a aventura tem:

- problema claro
- segredo principal
- motivo para os personagens se envolverem
- pelo menos 5 NPCs uteis
- pelo menos 5 locais importantes
- pelo menos 6 cenas jogaveis
- pelo menos 3 pistas para o segredo principal
- pelo menos 4 encontros ou desafios
- climax forte
- finais diferentes
- tabelas rapidas
- textos de narracao
- fichas resumidas
- links internos para Obsidian
- informacoes criadas marcadas corretamente
- mecanicas compativeis com Sistema Mecanico RPG

## Resposta final esperada

Ao terminar, entregue:

1. A aventura completa em Markdown ou os arquivos criados.
2. Uma versao resumida para consulta rapida.
3. Lista de arquivos criados ou alterados.
4. Observacoes sobre informacoes criadas para completar lacunas.

Use este formato:

```md
# Aventura criada: {{Nome}}

## Arquivos gerados

- `00 - Resumo da Aventura.md`
- `01 - Contexto do Mundo.md`
- `02 - Local Principal.md`

## Observacoes

- Informacoes criadas:
- Pontos que vieram diretamente do material do usuario:
- Pontos que podem ser expandidos depois:
```
