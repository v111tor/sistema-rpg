from pathlib import Path
import re


path = Path("sistema/mecanicas/sistema_mecanico_formatado.md")
text = path.read_text(encoding="utf-8")


def clean_subclasses(content: str) -> str:
    patterns = [
        r"(?im)^• Níveis 3/6/10/14/18: Traços da Subclasse\s*\n?",
        r"(?im)^• \*\*Nível 3:\*\* Escolha de Arquétipo Marcial.*\n?",
        r"(?im)^• \*\*Nível 3:\*\* Escolha de Tradição Arcana.*\n?",
        r"(?im)^• \*\*Nível 3:\*\* Escolha de Caminho Emocional.*\n?",
        r"(?im)^• \*\*Nível 3:\*\* Escolha de Domínio.*\n?",
        r"(?im)^• \*\*Nível 3:\*\* Escolha de Especialidade.*\n?",
        r"(?im)\s*• \*\*Nível 3:\*\* Escolha de Arquétipo do Explorador.*",
        r"(?im)^• \*\*Subclasse:\*\*.*\n?",
    ]
    for pattern in patterns:
        content = re.sub(pattern, "", content)

    replacements = {
        r"\s*• \*\*Nível 3:\*\* Escolha de Tradição Arcana \(subclasse:[^)]+\)": "",
        r"Subclasse: traço 5 \(Final\)": "—",
        r"Subclasse: traço [0-9]+,\s*": "",
        r",\s*Subclasse: traço [0-9]+": "",
        r"Subclasse: traço [0-9]+": "—",
        r"Talento,\s*—": "Talento",
        r"Estilo de Combate, Arquétipo Marcial": "Estilo de Combate",
    }
    for pattern, repl in replacements.items():
        content = re.sub(pattern, repl, content)
    return content


blocks = {
    "Guerreiro": """**Efeitos das Características Fixas:**

**Estilo de Combate.** No nível 1, escolha um estilo permanente. Ele não custa ação nem AU e fica ativo enquanto você cumprir suas condições.

- **Arqueiro:** +1 em ataques com armas à distância. Se mirar antes de atacar, ignore cobertura leve.
- **Defesa:** +1 Aparar enquanto usa armadura.
- **Duelo:** +2 dano quando usa uma arma corpo a corpo em uma mão e não usa outra arma.
- **Grande Arma:** ao rolar 1 ou 2 no dado de dano de arma pesada, role novamente uma vez.
- **Proteção:** quando aliado adjacente for atacado, use reação para impor -2 no ataque inimigo se estiver usando escudo.
- **Duas Armas:** ao lutar com duas armas leves, some metade do Mod. AGI ou FOR no dano da arma secundária.

**Melhoria de Atributo.** Nos níveis indicados, aumente um atributo em 1 passo, respeitando o limite da campanha.

**Talento.** Nos níveis indicados, escolha 1 talento para o qual cumpra os pré-requisitos.""",
    "Arcanista": """**Efeitos das Características Fixas:**

**Grimório.** No nível 1, você recebe um grimório arcano e registra 6 habilidades Arcanas conhecidas. A cada nível de Arcanista, registre mais 2 habilidades Arcanas. Sem o grimório, magias de custo 2 PA ou maior sofrem -2 no teste até você preparar uma cópia durante descanso longo.

**Recuperação Arcana.** Uma vez por descanso curto, após 10 minutos de estudo, recupere 2 PA. A partir do nível 9, recupere 4 PA. Essa recuperação não pode ultrapassar seu PA máximo.

**Melhoria de Atributo.** Nos níveis indicados, aumente um atributo em 1 passo, respeitando o limite da campanha.

**Talento.** Nos níveis indicados, escolha 1 talento para o qual cumpra os pré-requisitos.""",
    "Sensiente": """**Efeitos das Características Fixas:**

**Estado Emocional.** Antes da primeira ação em uma cena tensa, declare Raiva, Amor, Medo, Alegria, Tristeza ou Determinação. Habilidades do estado declarado custam o valor normal. Habilidades de outro estado custam o dobro. Você pode trocar de estado com uma ação e 2 PE.

**Ressonância Emocional.** Como ação, escolha uma criatura em até 9m. Se ela falhar em ESP CD 8 + Mod. ESP, você descobre sua emoção dominante, se está hostil e se há influência emocional mágica ativa. Em sucesso, você sente apenas uma impressão vaga.

**Melhoria de Atributo.** Nos níveis indicados, aumente um atributo em 1 passo, respeitando o limite da campanha.

**Talento.** Nos níveis indicados, escolha 1 talento para o qual cumpra os pré-requisitos.""",
    "Devoto": """**Efeitos das Características Fixas:**

**Escolha de Divindade.** No nível 1, escolha uma divindade ou força patrona. Habilidades associadas a essa divindade custam o valor normal. Habilidades de outra divindade custam o dobro de PD e podem exigir justificativa narrativa do Mestre.

**Símbolo Sagrado.** Você possui um foco sagrado. Enquanto o empunha ou ostenta, recebe +1 em testes de Religião ligados à sua divindade e pode usar habilidades de PD sem componentes improvisados. Se perder o símbolo, pode consagrar outro durante descanso longo.

**Canalizar Divindade.** Você pode canalizar poder bruto da sua divindade 2 vezes por descanso curto no nível 1, 3 vezes no nível 5, 4 vezes no nível 11 e 5 vezes no nível 17. Cada uso pode: recuperar PD igual ao Mod. DEV, conceder +1d4 a um teste de aliado em 9m ou impor -1d4 a um teste de inimigo que você possa ver.

**Intervenção Divina.** A partir do nível 10, uma vez por semana, peça intervenção direta. Role Religião contra CD 16. Em sucesso, a divindade produz um milagre narrativo compatível com seu domínio; em falha, você recupera 1 uso de Canalizar Divindade.

**Melhoria de Atributo.** Nos níveis indicados, aumente um atributo em 1 passo, respeitando o limite da campanha.

**Talento.** Nos níveis indicados, escolha 1 talento para o qual cumpra os pré-requisitos.""",
    "Artífice": """**Efeitos das Características Fixas:**

**Especialista em Tecnologia.** Você é proficiente em todas as ferramentas artesanais e tecnológicas. Quando já teria proficiência, recebe +1 adicional no teste.

**Infusão.** Durante descanso longo, escolha itens não mágicos em quantidade igual ao seu limite de Infusões. Cada item recebe uma propriedade simples até o próximo descanso longo: +1 ataque, +1 Aparar, luz constante, armazenamento de 1 PA técnico, retorno à mão, alarme ou ativação por comando. Um item só pode manter uma infusão sua por vez.

**PA Técnico.** Seu PA técnico ativa dispositivos, protótipos e infusões. Ele não substitui o PA Arcano de Arcanistas para rituais complexos, mas pode alimentar itens criados por você.

**Melhoria de Atributo.** Nos níveis indicados, aumente um atributo em 1 passo, respeitando o limite da campanha.

**Talento.** Nos níveis indicados, escolha 1 talento para o qual cumpra os pré-requisitos.""",
    "Explorador": """**Efeitos das Características Fixas:**

**Ataque Furtivo.** Uma vez por turno, cause dano extra quando acertar uma criatura com arma à distância, arma leve ou arma de finesse e tiver vantagem, estiver escondido, ou tiver um aliado adjacente ao alvo. O dano extra segue a coluna Ataque Furtivo da tabela.

**Especialista.** No nível 1, escolha 2 perícias em que você seja proficiente. Ao rolar essas perícias, dobre o bônus de proficiência. No nível 6, escolha mais 2 perícias para receber esse benefício.

**Pool de Aura do Explorador.** Seu AU representa reflexo, respiração e movimento treinado. Ele recupera em descanso curto e pode ser usado em técnicas de mobilidade, furtividade e sobrevivência.

**Melhoria de Atributo.** Nos níveis indicados, aumente um atributo em 1 passo, respeitando o limite da campanha.

**Talento.** Nos níveis indicados, escolha 1 talento para o qual cumpra os pré-requisitos.""",
}


text = clean_subclasses(text)

for class_name, block in blocks.items():
    pool = f"Pool de 30 Habilidades — {class_name}"
    if block not in text:
        text = text.replace(pool, block + "\n\n" + pool)

path.write_text(text, encoding="utf-8")
print("Habilidades fixas atualizadas.")
