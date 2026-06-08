from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED, ZIP_STORED
import argparse
from html import escape
import json
import random
import re
import unicodedata
import uuid


OUT_DIR = Path("arco")
AUTHOR = "Mesa RPG"
RPG_SITE_URL = "https://v111tor.github.io/sistema-rpg/sistema/site/rpg_melhorado.html"
PLACES_DIR = Path("lugares")


def ask(label, default="crie"):
    value = input(label).strip()
    return value if value else default


def is_blank_choice(value):
    return value.strip().lower() in {"", "crie", "invente", "tanto faz", "qualquer"}


def clean_text(value):
    text = str(value or "")
    try:
        text = text.encode("latin1").decode("utf-8")
    except Exception:
        pass
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"\s+", " ", text).strip()


def load_party_context():
    candidates = [
        OUT_DIR / "mesa-principal.json",
        OUT_DIR / "mesa-rpg-backup.json",
        Path("mesa-principal.json"),
        Path("mesa-rpg-backup.json"),
        Path("sistema/site/mesa-principal.json"),
        Path("sistema/site/mesa-rpg-backup.json"),
    ]
    for path in candidates:
        if not path.exists():
            continue
        try:
            raw = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        state = raw.get("data") if isinstance(raw, dict) and isinstance(raw.get("data"), dict) else raw
        if not isinstance(state, dict):
            continue
        characters = state.get("characters") or state.get("personagens") or []
        if not isinstance(characters, list) or not characters:
            continue
        party_ids = set((state.get("campaign") or {}).get("partyIds") or [])
        party = [c for c in characters if not party_ids or c.get("id") in party_ids]
        if party:
            return summarize_party(path, party)
    return {
        "found": False,
        "source": "",
        "power_label": "",
        "summary": (
            f"Site RPG configurado: {RPG_SITE_URL}. "
            "Nenhum backup local da mesa-principal foi encontrado. "
            "O balanceamento usa o nivel informado manualmente."
        ),
        "details": [],
        "size": 0,
    }


def load_places_context():
    index_path = PLACES_DIR / "indice_lugares.json"
    if not index_path.exists():
        return {
            "found": False,
            "source": str(index_path),
            "summary": "Catalogo de lugares nao encontrado. Locais do arco foram criados sem consulta a pasta lugares.",
            "places": [],
        }
    try:
        index = json.loads(index_path.read_text(encoding="utf-8"))
    except Exception as error:
        return {
            "found": False,
            "source": str(index_path),
            "summary": f"Catalogo de lugares encontrado, mas nao pode ser lido: {error}.",
            "places": [],
        }
    places = []
    for entry in index if isinstance(index, list) else []:
        if not isinstance(entry, dict):
            continue
        place = {
            "name": clean_text(entry.get("nome") or entry.get("name")),
            "kind": clean_text(entry.get("tipo") or entry.get("kind")),
            "continent": clean_text(entry.get("continente") or entry.get("continent")),
            "geo_region": clean_text(entry.get("regiao") or entry.get("geo_region")),
            "empire": clean_text(entry.get("imperio") or entry.get("empire")),
            "city": clean_text(entry.get("cidade") or entry.get("city")),
            "biome": clean_text(entry.get("bioma") or entry.get("region")),
            "people": clean_text(entry.get("povo") or entry.get("race")),
            "deity": clean_text(entry.get("divindade") or entry.get("deity")),
            "markdown": entry.get("markdown") or "",
            "json": entry.get("json") or "",
            "source": "indice_lugares.json",
        }
        detail_path = Path(str(place["json"]))
        if detail_path.exists():
            try:
                detail = json.loads(detail_path.read_text(encoding="utf-8"))
                place.update(extract_place_detail(detail, detail_path))
            except Exception:
                pass
        places.append(place)
    return {
        "found": bool(places),
        "source": str(index_path),
        "summary": f"Foram encontrados {len(places)} locais catalogados em {index_path}.",
        "places": places,
    }


def extract_place_detail(detail, detail_path):
    description = detail.get("description") or {}
    leader = detail.get("leader") or {}
    culture = detail.get("culture") or {}
    secret = detail.get("secret") or {}
    npcs = detail.get("npcs") or []
    creatures = detail.get("creatures") or []
    hooks = detail.get("hooks") or []
    return {
        "name": clean_text(detail.get("name")),
        "kind": clean_text(detail.get("kind")),
        "continent": clean_text(detail.get("continent")),
        "geo_region": clean_text(detail.get("geo_region")),
        "empire": clean_text(detail.get("empire")),
        "city": clean_text(detail.get("city")),
        "biome": clean_text(detail.get("region")),
        "people": clean_text(detail.get("race")),
        "deity": clean_text(detail.get("deity")),
        "tone": clean_text(detail.get("tone")),
        "party_level": clean_text(detail.get("party_level")),
        "read_aloud": clean_text(description.get("read_aloud")),
        "landmarks": [clean_text(item) for item in description.get("landmarks", [])[:4]],
        "first_impressions": [clean_text(item) for item in description.get("first_impressions", [])[:4]],
        "leader_name": clean_text(leader.get("name")),
        "leader_title": clean_text(leader.get("title")),
        "leader_pressure": clean_text(leader.get("pressure")),
        "culture_identity": clean_text(culture.get("identity")),
        "culture_law": clean_text(culture.get("law")),
        "culture_taboo": clean_text(culture.get("taboo")),
        "secret_surface": clean_text(secret.get("surface")),
        "secret_truth": clean_text(secret.get("truth")),
        "secret_cost": clean_text(secret.get("cost")),
        "npcs": [
            {
                "name": clean_text(npc.get("name")),
                "role": clean_text(npc.get("role")),
                "hook": clean_text(npc.get("hook")),
            }
            for npc in npcs[:4]
        ],
        "creatures": [
            {
                "name": clean_text(creature.get("name")),
                "type": clean_text(creature.get("type")),
                "grade": clean_text(creature.get("grade")),
                "hook": clean_text(creature.get("hook")),
            }
            for creature in creatures[:4]
        ],
        "hooks": [clean_text(hook) for hook in hooks[:4]],
        "source": str(detail_path),
    }


def relevant_places(places_context, theme, idea, required, limit=2):
    places = places_context.get("places") or []
    if not places:
        return []
    query = clean_text(" ".join([theme, idea, required])).lower()
    scored = []
    for place in places:
        blob = " ".join(
            clean_text(place.get(key)).lower()
            for key in ["name", "kind", "continent", "geo_region", "empire", "city", "biome", "people", "deity", "tone", "culture_identity"]
        )
        score = 0
        if theme == "fronteira":
            for term in ["vila", "fronteira", "pantano", "trib", "lizard", "povo", "natureza"]:
                if term in blob:
                    score += 2
        if theme in {"praga", "selvagem"} and any(term in blob for term in ["pantano", "natureza", "vila"]):
            score += 2
        for token in set(re.findall(r"[a-z0-9]{4,}", query)):
            if token in blob:
                score += 1
        scored.append((score, place))
    scored.sort(key=lambda item: (item[0], item[1].get("name", "")), reverse=True)
    chosen = [place for score, place in scored if score > 0][:limit]
    return chosen or [place for _score, place in scored[:limit]]


def summarize_party(path, party):
    levels = []
    ancestries = []
    roles = []
    details = []
    for c in party:
        level = int(c.get("level") or 1)
        levels.append(level)
        ancestry = str(c.get("ancestry") or "origem indefinida")
        role = str(c.get("role") or "funcao indefinida")
        ancestries.append(ancestry)
        roles.append(role)
        hp = c.get("hp") or {}
        attrs = c.get("attrs") or {}
        skills = c.get("skills") or {}
        strong_skills = [name for name, value in skills.items() if int(value or 0) > 0][:5]
        attr_bits = ", ".join(f"{key} {value}" for key, value in attrs.items() if value)
        details.append(
            f"{c.get('name') or 'Personagem'}: nivel {level}, {ancestry}, {role}, "
            f"PV {hp.get('current', '?')}/{hp.get('max', '?')}, Aparar {c.get('ac', '?')}, "
            f"atributos {attr_bits or 'nao informados'}, pericias fortes {', '.join(strong_skills) or 'nao marcadas'}."
        )
    avg_level = round(sum(levels) / max(1, len(levels)))
    return {
        "found": True,
        "source": str(path),
        "power_label": f"nivel {avg_level}",
        "summary": (
            f"Site RPG configurado: {RPG_SITE_URL}. "
            f"Foram lidas {len(party)} fichas de backup/exportacao em {path}. "
            f"Niveis {min(levels)}-{max(levels)}; povos/origens: {', '.join(sorted(set(ancestries)))}; "
            f"classes/funcoes: {', '.join(sorted(set(roles)))}."
        ),
        "details": details,
        "size": len(party),
        "avg_level": avg_level,
    }


def slug(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "secao"


def pick(rng, values):
    return rng.choice(values)


def default_start_for_theme(theme):
    return {
        "fronteira": "Cruzamento de Pedra e Junco",
        "praga": "Vila de Pedra Baixa",
        "culto": "Santuario de Santa Vela",
        "intriga": "Solar dos Valmont",
        "ruina": "Acampamento da Garganta Velha",
        "selvagem": "Trilha de Musgo Negro",
        "sombra": "Estalagem da Porta Azul",
    }[theme]


def is_start_condition(value):
    text = value.lower()
    return any(word in text for word in ["jogador", "jogadores", "racas diferentes", "grupo", "personagens", "comeca com"])


def power_profile(power):
    text = power.lower()
    if any(mark in text for mark in ["lendario", "grau 4", "grau 5", "chefe"]):
        return {
            "label": "ameaca lendaria",
            "weak": ["d6", "d8", "d8", "d6", "d8", "d6"],
            "standard": ["d8", "d8", "d10", "d8", "d10", "d8"],
            "boss": ["d10", "d10", "d12", "d10", "d12", "d10"],
        }
    if any(mark in text for mark in ["experiente", "grau 3", "forte"]):
        return {
            "label": "ameaca forte",
            "weak": ["d6", "d6", "d8", "d6", "d6", "d4"],
            "standard": ["d8", "d8", "d8", "d6", "d8", "d6"],
            "boss": ["d10", "d8", "d10", "d8", "d10", "d8"],
        }
    if any(mark in text for mark in ["medio", "grau 1", "grau 2"]):
        return {
            "label": "ameaca media",
            "weak": ["d4", "d6", "d6", "d4", "d6", "d4"],
            "standard": ["d6", "d8", "d6", "d6", "d8", "d6"],
            "boss": ["d8", "d8", "d8", "d8", "d10", "d8"],
        }
    return {
        "label": "ameaca inicial",
        "weak": ["d4", "d6", "d4", "d4", "d6", "d4"],
        "standard": ["d6", "d6", "d6", "d6", "d6", "d4"],
        "boss": ["d8", "d6", "d8", "d8", "d8", "d6"],
    }


def combat_numbers(tier):
    if tier == "boss":
        return {
            "pv": "34",
            "aparar": "6",
            "deslocamento": "9 m",
            "iniciativa": "+1",
            "ataque": "d8 + 2",
            "dano": "1d8+2",
            "cd": "13",
            "salvamento": "VIG ou ESP CD 13",
        }
    if tier == "standard":
        return {
            "pv": "20",
            "aparar": "5",
            "deslocamento": "9 m",
            "iniciativa": "+1",
            "ataque": "d6 + 2",
            "dano": "1d6+1",
            "cd": "12",
            "salvamento": "AGI ou ESP CD 12",
        }
    return {
        "pv": "12",
        "aparar": "4",
        "deslocamento": "9 m",
        "iniciativa": "+0",
        "ataque": "d6 + 1",
        "dano": "1d4+1",
        "cd": "11",
        "salvamento": "AGI ou VIG CD 11",
    }


def ficha(profile, tier, skills, role, tactic, weakness, special):
    attrs = profile[tier]
    names = ["Forca", "Agilidade", "Vigor", "Intelecto", "Espirito", "Devocao"]
    nums = combat_numbers(tier)
    lines = ["**Defesa e recursos:**"]
    lines.append(f"* PV: {nums['pv']}")
    lines.append(f"* Aparar: {nums['aparar']}")
    lines.append(f"* Deslocamento: {nums['deslocamento']}")
    lines.append(f"* Iniciativa: {nums['iniciativa']}")
    lines.append("")
    lines.append("**Atributos:**")
    lines.extend(f"* {name}: {die}" for name, die in zip(names, attrs))
    lines.append("")
    lines.append("**Pericias:** " + ", ".join(skills))
    lines.append("")
    lines.append(f"**Papel em combate:** {role}")
    lines.append("")
    lines.append("**Ataques e acoes:**")
    lines.append(f"* Ataque principal: {nums['ataque']}; dano {nums['dano']}.")
    lines.append(f"* Pressao de cena: um alvo faz {nums['salvamento']} ou sofre desvantagem narrativa curta, queda, medo, atraso ou separacao do grupo.")
    lines.append(f"* Reacao: uma vez por rodada, pode mover 3 m, proteger uma pista, chamar reforco ou impor custo social ao atacante.")
    lines.append(f"* CD de efeitos especiais: {nums['cd']}.")
    lines.append("")
    lines.append(f"**Tatica:** {tactic}")
    lines.append(f"**Fraqueza:** {weakness}")
    lines.append(f"**Recurso especial:** {special}")
    lines.append("**Uso em mesa:** se a cena ja estiver pesada, use o recurso especial uma vez; se estiver facil, use uma segunda vez quando o inimigo ficar com metade dos PV.")
    return "\n".join(lines)


def infer_theme(idea, tone, required):
    merged = " ".join([idea, tone, required]).lower()
    if any(word in merged for word in ["tribo", "tribos", "vila", "vilas", "raca", "racas", "discrimin", "povo", "povos", "transicao cultural"]):
        return "fronteira"
    if any(word in merged for word in ["praga", "doenca", "peste", "veneno"]):
        return "praga"
    if any(word in merged for word in ["culto", "alma", "demon", "pacto", "templo"]):
        return "culto"
    if any(word in merged for word in ["guerra", "nobre", "casa", "politica", "trono"]):
        return "intriga"
    if any(word in merged for word in ["ruina", "artefato", "expedicao", "masmorra"]):
        return "ruina"
    if any(word in merged for word in ["floresta", "selva", "fera", "natureza"]):
        return "selvagem"
    return "sombra"


def point_lines_for_location(location, place=None, theme="sombra"):
    if place:
        landmarks = place.get("landmarks") or []
        lines = []
        for landmark in landmarks[:3]:
            lines.append(
                f"* **{landmark}:** aparencia marcada pelo bioma local; funcionalidade social ou ritual. Interacao: investigar, reparar, profanar, consagrar ou usar como cobertura. Pista: revela quem respeita ou viola as leis do lugar."
            )
        if place.get("leader_name"):
            lines.append(
                f"* **Espaco de {place['leader_name']}:** area de mando, cura, julgamento ou comercio. Interacao: negociar, pressionar, pedir abrigo, roubar documentos ou oferecer servico. Consequencia: muda a disposicao da lideranca."
            )
        if place.get("secret_truth"):
            lines.append(
                f"* **Marca do segredo:** sinal discreto ligado a '{place['secret_truth']}'. Interacao: Arcanismo, Natureza, Religiao ou Intuicao. Consequencia: descobrir cedo antecipa uma cena de conflito."
            )
        return lines[:5] or [
            "* **Marco central:** ponto mais visivel do local. Interacao: observar, escalar, esconder prova ou chamar atencao publica.",
            "* **Canto esquecido:** ponto lateral onde uma pista fica sem guarda. Interacao: investigar, rastrear ou conversar longe da multidao.",
        ]
    if theme == "fronteira":
        return [
            f"* **Chao marcado de {location}:** lama, cinza, sangue seco ou pegadas. Interacao: Sobrevivencia ou Percepcao para distinguir rastro real de rastro plantado.",
            "* **Poste de lei nova:** tabuas com regras recem-pregadas. Interacao: Historia, Persuasao ou Tecnologia para achar alteracoes, falsificacoes e assinaturas forcadas.",
            "* **Abrigo dos indesejados:** canto onde pessoas de outro povo esperam sem entrar. Interacao: conversar, escoltar, esconder ou entregar alguem. Consequencia: muda quem confia no grupo.",
            "* **Objeto ritual antigo:** amuleto, osso pintado, pedra de nome ou tigela de lama. Interacao: Religiao, Natureza ou Espirito para entender o custo cultural de mexer ali.",
        ]
    return [
        f"* **Marco de {location}:** ponto visual dominante. Interacao: investigar, escalar, quebrar, selar ou usar como cobertura.",
        "* **Deposito ou canto de servico:** guarda ferramentas, rastros e objetos fora de lugar. Interacao: Furtividade, Tecnologia ou Percepcao.",
        "* **Lugar de conversa privada:** permite negociar sem a multidao. Interacao: Persuasao, Intuicao ou Enganacao.",
    ]


def scene_templates(theme, locations, villain_main, secondary_villains):
    main_villain = villain_main[0]
    first_secondary = secondary_villains[0][0] if secondary_villains else "um agente secundario"
    if theme == "fronteira":
        return [
            {
                "name": "Cena 1 - O Sino Toca Antes da Lei",
                "place": locations[0],
                "situation": "um corpo aparece no centro do assentamento antes da primeira lei da vila ser proclamada.",
                "objective": "impedir linchamento, preservar provas e decidir se o grupo se mostra unido apesar das racas diferentes.",
                "interactive": [
                    "Corpo na lama: Medicina ou Percepcao revela morte antes do toque do sino.",
                    "Multidao em circulo: Persuasao ou Intimidacao muda quem fala e quem se cala.",
                    "Sino incompleto: Tecnologia ou Arcanismo encontra sangue no badalo.",
                ],
                "choices": [
                    "Proteger o acusado publicamente e ganhar inimigos entre os guardas.",
                    "Investigar primeiro e deixar a multidao ferir alguem.",
                    "Aceitar a escolta da guarda e entrar na investigacao sob vigilancia.",
                ],
                "consequence": "se a multidao for contida, uma testemunha aparece; se nao, a vila se divide em patrulhas raciais.",
                "enemies": "Miliciano de Barro ou dois guardas comuns tentando separar o grupo.",
                "exits": f"leva a {locations[1] if len(locations) > 1 else 'proxima area'} ou a qualquer NPC que tenha visto lanternas na noite anterior.",
            },
            {
                "name": "Cena 2 - As Portas Que Decidem Quem Entra",
                "place": locations[1] if len(locations) > 1 else locations[0],
                "situation": "moradores discutem quem pode dormir dentro da vila e quem deve ficar na margem.",
                "objective": "descobrir quem escreveu a regra de tolerados e qual povo seria expulso primeiro.",
                "interactive": [
                    "Registro de entrada: Historia ou Tecnologia encontra nomes apagados.",
                    "Porta vigiada: Furtividade ou Persuasao permite entrar sem confronto.",
                    "Tenda de comida: Intuicao revela quem esta lucrando com a escassez.",
                ],
                "choices": [
                    "Usar a lei contra os proprios guardas.",
                    "Ajudar os excluidos e perder acesso a autoridades.",
                    "Aceitar um acordo sujo para ver documentos internos.",
                ],
                "consequence": "cada ajuda publica a um povo perseguido aumenta confianca desse povo e suspeita da guarda.",
                "enemies": f"{first_secondary}, acompanhado por provocadores pagos.",
                "exits": "abre caminho para a Casa de Julgamento, a Margem Velha ou a Pedreira.",
            },
            {
                "name": "Cena 3 - A Margem Que Ainda Lembra",
                "place": "Tendas da Margem Velha",
                "situation": "familias tribais escondem alguem acusado e tambem escondem uma culpa antiga.",
                "objective": "separar inocencia no crime atual de erros reais do passado.",
                "interactive": [
                    "Fogueira ritual: Religiao ou Natureza mostra qual tabu foi quebrado.",
                    "Cesto de nomes: Percepcao acha o nome verdadeiro da vitima.",
                    "Canoa virada: Sobrevivencia revela rota ate a pedreira.",
                ],
                "choices": [
                    "Entregar uma pessoa culpada por crime menor para ganhar prova maior.",
                    "Mentir para proteger a familia e arriscar a investigacao.",
                    "Pedir ritual de verdade, pagando com promessa publica.",
                ],
                "consequence": "a margem vira aliada se for respeitada; vira emboscada se for tratada como simples fonte de pistas.",
                "enemies": "Totem Rachado ou vingadores tribais assustados.",
                "exits": "leva ao julgamento, ao confronto com a guarda ou a uma missao secundaria.",
            },
            {
                "name": "Cena 4 - A Casa Onde a Mentira Vira Ata",
                "place": "Casa de Julgamento de Madeira Verde",
                "situation": "documentos oficiais estao sendo reescritos enquanto testemunhas desaparecem.",
                "objective": f"ligar {main_villain} a lei de pureza e aos rastros falsos.",
                "interactive": [
                    "Arquivo umido: Tecnologia ou Furtividade recupera ata rasurada.",
                    "Banco dos juramentos: Espirito ou Devocao percebe quem jurou sob medo.",
                    "Sala fechada: Prestidigitacao ou Forca abre acesso a provas materiais.",
                ],
                "choices": [
                    "Roubar provas e virar criminoso oficial.",
                    "Forcar audiencia publica e dar tempo para o vilao preparar o final.",
                    "Chantagear uma antagonista secundaria.",
                ],
                "consequence": "com provas completas, o final pode ser social; sem elas, tende a combate.",
                "enemies": "Vessa do Marco, guardas e um Cao de Cerca.",
                "exits": "aponta diretamente para a Pedreira dos Nomes Riscados.",
            },
            {
                "name": "Cena 5 - Julgamento na Pedreira",
                "place": "Pedreira dos Nomes Riscados",
                "situation": f"{main_villain} usa medo publico para transformar execucao em fundacao da vila.",
                "objective": "salvar o condenado, expor a mentira e decidir que lei nasce dali.",
                "interactive": [
                    "Cinzeis oficiais: Percepcao identifica a ferramenta que marcou o corpo.",
                    "Pedras de fundacao: Historia ou Persuasao revela nomes apagados.",
                    "Borda instavel: Atletismo ou Tecnologia permite derrubar andaime sem matar civis.",
                ],
                "choices": [
                    "Mostrar provas e arriscar que a multidao ataque.",
                    "Atacar Hadrun e permitir que seguidores chamem isso de golpe estrangeiro.",
                    "Negociar uma lei provisoria e deixar parte da verdade enterrada.",
                ],
                "consequence": "o tipo de vitoria define se a proxima vila nascera como refugio, prisao legal ou campo de revanche.",
                "enemies": f"{main_villain}, Milicianos de Barro e reforcos conforme provas perdidas.",
                "exits": "encerra o arco e abre ganchos politicos, tribais ou espirituais.",
            },
        ]
    return [
        {
            "name": f"Cena sandbox em {locations[0]}",
            "place": locations[0],
            "situation": "o conflito principal se torna visivel por uma crise publica.",
            "objective": "obter pista, escolher aliado e definir uma consequencia.",
            "interactive": ["Marco central", "testemunha", "rastro fisico"],
            "choices": ["investigar", "negociar", "confrontar"],
            "consequence": "o vilao reage a primeira escolha importante.",
            "enemies": "ameaca fraca ou rival social.",
            "exits": "qualquer local com pista aberta.",
        }
    ]


def build_arc(data):
    seed = "|".join(str(v) for v in data.values()).lower()
    rng = random.Random(seed)
    party_context = data.get("party_context") or {}
    effective_power = party_context.get("power_label") or data["power"]
    profile = power_profile(effective_power)
    theme = infer_theme(data["idea"], data["tone"], data["required"])
    places_context = data.get("places_context") or {}
    chosen_places = relevant_places(places_context, theme, data["idea"], data["required"], limit=2)
    place_by_name = {place.get("name"): place for place in chosen_places if place.get("name")}

    title_by_theme = {
        "fronteira": ["Cinzas Entre Tendas e Telhados", "O Primeiro Sino da Vila", "Sangue na Praca de Barro"],
        "praga": ["A Febre dos Sinos", "O Ultimo Pulso da Vila", "Cinzas Sobre Agua Clara"],
        "culto": ["O Pacto Sob a Lua Partida", "As Vozes do Santuario", "O Juramento das Almas Frias"],
        "intriga": ["A Coroa de Ferro Frio", "Sangue Entre Brasoes", "O Banquete dos Traidores"],
        "ruina": ["A Camara do Primeiro Eco", "O Mapa Que Sangra", "Reliquia Sob Pedra Morta"],
        "selvagem": ["A Mata Que Nao Dorme", "Raizes da Ira Antiga", "O Uivo Alem da Trilha"],
        "sombra": ["A Sombra Que Aprendeu Nomes", "O Inverno Dentro das Portas", "O Preco da Ultima Luz"],
    }
    title = pick(rng, title_by_theme[theme])

    if not is_blank_choice(data["idea"]):
        premise = data["idea"]
    else:
        premise = {
            "praga": "uma comunidade comeca a definhar depois que sinos antigos tocam sozinhos durante a madrugada",
            "culto": "um culto discreto troca promessas de salvacao por fragmentos de alma",
            "intriga": "duas faccoes disputam poder enquanto uma terceira forca lucra com o caos",
            "ruina": "uma ruina recem-revelada promete poder, mas desperta algo que deveria continuar soterrado",
            "selvagem": "uma regiao selvagem reage com violencia contra uma invasao humana recente",
            "fronteira": "tribos antigas tentam virar vilas permanentes, enquanto medo, fome e preconceito transformam diferencas de povo em acusacoes",
            "sombra": "um inimigo oculto transforma medo, culpa e boatos em armas reais",
        }[theme]

    if is_blank_choice(data["start"]) or is_start_condition(data["start"]):
        start_location = chosen_places[0]["name"] if chosen_places else default_start_for_theme(theme)
        start_condition = "" if is_blank_choice(data["start"]) else data["start"]
    else:
        start_location = data["start"]
        start_condition = ""

    villain_main = {
        "fronteira": ("Hadrun Pele-Limpa", "fundador da primeira guarda da vila", "provar que a nova vila so sera segura quando todos os povos considerados impuros forem expulsos"),
        "praga": ("Dra. Malva Cineris", "alquimista exilada", "provar que a cura perfeita so nasce quando todos conhecem a dor"),
        "culto": ("Prior Edran Voss", "lider de culto", "abrir um caminho para seu patrono atravessar o mundo"),
        "intriga": ("Dama Sorelle de Nivar", "conspiradora nobre", "derrubar rivais e reescrever a sucessao local"),
        "ruina": ("Kaor, o Cartografo Cego", "explorador possuido", "terminar o mapa vivo gravado sob sua pele"),
        "selvagem": ("Mae Urze", "oraculo corrompido da mata", "punir toda civilizacao que feriu o territorio"),
        "sombra": ("O Homem do Segundo Nome", "manipulador oculto", "roubar identidades ate se tornar impossivel de cacar"),
    }[theme]

    secondary_pool = {
        "fronteira": [
            ("Vessa do Marco", "juiza de limites", "transforma costumes tribais em crimes escritos"),
            ("Tor Brasa-Fria", "chefe de patrulha", "provoca ataques falsos para culpar racas estrangeiras"),
            ("Nara Fio-Partido", "mensageira dividida", "vende informacoes para proteger seu proprio povo"),
        ],
        "praga": [
            ("Irmao Sal", "falso curandeiro", "vende alivio temporario que piora a doenca"),
            ("Capita Runa", "comandante local", "mantem quarentena brutal por medo"),
            ("Nix Fuligem", "ladra de remedios", "rouba suprimentos para salvar sua familia"),
        ],
        "culto": [
            ("Velha Narra", "profetisa", "interpreta sonhos plantados pelo culto"),
            ("Sir Odrik", "cavaleiro quebrado", "protege o culto em troca de perdao"),
            ("Lume", "acolito arrependido", "sabe demais e teme fugir"),
        ],
        "intriga": [
            ("Mestre Dain", "escrivao", "falsifica registros e genealogias"),
            ("Baronesa Ilya", "aliada ambigua", "muda de lado conforme a vantagem"),
            ("Verro", "duelista contratado", "remove testemunhas inconvenientes"),
        ],
        "ruina": [
            ("Tess dos Pregos", "saqueadora", "guia exploradores para armadilhas"),
            ("Frade Holun", "reliquarista", "quer selar a ruina a qualquer custo"),
            ("Maquina Votiva", "construto desperto", "cumpre uma ordem antiga de protecao"),
        ],
        "selvagem": [
            ("Gral, Filho da Casca", "campeao tribal", "ataca invasores sem negociar"),
            ("Savia Rubra", "druida hostil", "espalha sementes que enlouquecem animais"),
            ("Torneiro Brant", "madeireiro", "esconde o crime que iniciou a ira da mata"),
        ],
        "sombra": [
            ("Mara do Espelho", "informante", "vende verdades misturadas com mentiras"),
            ("Joric Sem Sombra", "assassino", "aparece onde a luz falha"),
            ("A Crianca do Sino", "isca sobrenatural", "atrai herois para cenas preparadas"),
        ],
    }[theme]
    secondary_villains = secondary_pool[: rng.randint(2, 3)]

    existing_location_names = [place["name"] for place in chosen_places if place.get("name")]
    location_pool = {
        "fronteira": [
            start_location,
            *existing_location_names,
            "Praca do Primeiro Sino",
            "Tendas da Margem Velha",
            "Casa de Julgamento de Madeira Verde",
            "Pedreira dos Nomes Riscados",
        ],
        "praga": [
            start_location,
            "Enfermaria dos Panos Vermelhos",
            "Poco Velho sob a Capela",
            "Laboratorio Selado",
        ],
        "culto": [
            start_location,
            "Cripta das Velas Afogadas",
            "Mercado do Voto",
            "Camara do Pacto",
        ],
        "intriga": [
            start_location,
            "Arquivo da Camara",
            "Jardim dos Duelos",
            "Sala do Banquete Final",
        ],
        "ruina": [
            start_location,
            "Ponte dos Ossos Numerados",
            "Galeria do Mapa Vivo",
            "Camara do Primeiro Eco",
        ],
        "selvagem": [
            start_location,
            "Clareira das Raizes Altas",
            "Acampamento Madeireiro",
            "Coracao de Pedra da Mata",
        ],
        "sombra": [
            start_location,
            "Beco das Cartas Rasgadas",
            "Casa sem Retratos",
            "Sala do Segundo Nome",
        ],
    }[theme]
    locations = list(dict.fromkeys(location_pool))

    creatures_by_theme = {
        "fronteira": [
            ("Cao de Cerca", "fera treinada para reconhecer cheiro de povos marcados como indesejados", "batedor"),
            ("Totem Rachado", "espirito tribal ferido pela construcao da vila sobre solo sagrado", "controlador"),
            ("Miliciano de Barro", "guarda novato armado com medo, boatos e lanterna", "agressor"),
        ],
        "praga": [
            ("Febril Errante", "vitima da praga movida por espasmos e febre", "controlador"),
            ("Rato de Cinza", "enxame faminto que fareja remedios e sangue", "batedor"),
            ("Homunculo de Soro", "criatura fabricada para testar curas instaveis", "suporte"),
        ],
        "culto": [
            ("Devoto Sem Face", "cultista que entregou sua identidade ao patrono", "agressor"),
            ("Anjo de Fuligem", "entidade menor envolta em pena queimada", "artilheiro"),
            ("Guardiao do Voto", "armadura animada por juramentos quebrados", "defensor"),
        ],
        "intriga": [
            ("Espiao de Mascara Clara", "agente treinado em veneno, rumor e fuga", "batedor"),
            ("Cao de Salao", "fera elegante usada para intimidar convidados", "agressor"),
            ("Espectro de Heranca", "morto preso a um brasao falso", "controlador"),
        ],
        "ruina": [
            ("Sentinela de Pedra Oca", "construto rachado que ainda guarda passagens", "defensor"),
            ("Eco Mordente", "som antigo que ganha forma quando alguem mente", "controlador"),
            ("Escavador Cego", "fera subterranea atraida por metal antigo", "agressor"),
        ],
        "selvagem": [
            ("Lobo de Musgo", "predador silencioso coberto de fungos verdes", "batedor"),
            ("Arvore Ferida", "tronco vivo que sangra seiva escura", "defensor"),
            ("Vespa de Vidro", "inseto grande com ferroes cristalinos", "artilheiro"),
        ],
        "sombra": [
            ("Sussurro Encarnado", "boato que ganhou dentes e voz", "controlador"),
            ("Ladrao de Reflexos", "criatura que imita movimentos atrasados", "batedor"),
            ("Vulto de Porta", "assombracao que prende rotas de fuga", "defensor"),
        ],
    }[theme]

    required_note = "" if is_blank_choice(data["required"]) else f"\n\nElemento obrigatorio incorporado: **{data['required']}**."

    md = []
    md.append(f"# {title}")
    md.append("")
    md.append(f"**Tom:** {data['tone']}")
    md.append(f"**Nivel de poder:** {effective_power} ({profile['label']})")
    md.append(f"**Local inicial:** {start_location}")
    if start_condition:
        md.append(f"**Condicao de abertura:** {start_condition}")
    md.append("")
    md.append("## Sumario do mestre")
    md.append("")
    if theme == "fronteira":
        md.append(f"Este arco abre a campanha durante uma transicao cultural dolorosa: {premise}. A comunidade quer trocar tendas, pactos de sangue e liderancas tribais por cercas, atas, sinos e uma guarda fixa. Essa mudanca promete seguranca, mas tambem cria uma desculpa para separar povos, marcar corpos e transformar diferencas raciais em culpa publica.{required_note}")
    else:
        md.append(f"Este arco gira em torno de {premise}. Os personagens entram na historia por um problema visivel, descobrem uma causa mais antiga no meio do caminho e chegam ao fim diante de uma escolha que muda a regiao.{required_note}")
    md.append("")
    md.append("Use o arco em 3 a 6 sessoes. Corte locais se quiser uma aventura curta; expanda as missoes secundarias se quiser transforma-lo em uma pequena campanha.")
    md.append("")
    md.append("## Composicao esperada")
    md.append("")
    md.append(f"* **Escala:** {profile['label']}, ajustada para o nivel informado.")
    md.append(f"* **Estrutura:** 1 vilao principal, {len(secondary_villains)} viloes secundarios, {len(locations)} locais, {len(creatures_by_theme)} criaturas e 3 missoes secundarias.")
    md.append("* **Duracao sugerida:** 3 sessoes para uma versao direta, 5 a 6 sessoes usando todos os locais e missoes.")
    md.append("* **Uso ideal:** investigacao com ameacas crescentes, encontros ligados ao lugar e final com escolha moral ou tatica.")
    md.append("")
    md.append("## Contexto do grupo e balanceamento")
    md.append("")
    md.append(party_context.get("summary") or "Balanceamento feito pelo nivel informado.")
    for detail in party_context.get("details") or []:
        md.append(f"* {detail}")
    if party_context.get("found"):
        md.append("* Ajuste: para grupo com 3 personagens, use uma criatura fraca por cena e evite dois inimigos com recurso especial juntos.")
        md.append("* Ajuste: para grupo com 4 a 5 personagens, use os encontros como escritos.")
        md.append("* Ajuste: para 6 ou mais personagens, acrescente um obstaculo social ou ambiental antes de aumentar dano.")
    else:
        md.append("* Para usar as fichas reais, abra o site RPG, carregue a mesa-principal, exporte o backup e salve como `arco/mesa-principal.json` ou `mesa-principal.json`.")
        md.append("* Como todos foram informados como nivel 1, os inimigos usam dados baixos, recursos especiais narrativos e dano moderado.")
        md.append("* Se houver 3 personagens ou menos, reduza cada combate para uma ameaca principal e uma complicacao.")
        md.append("* Se houver 5 personagens ou mais, mantenha o dano, mas adicione reforcos, terreno dificil ou pressoes de tempo.")
    md.append("")
    md.append("## Locais existentes consultados")
    md.append("")
    if places_context.get("found"):
        md.append(places_context.get("summary") or "Catalogo de lugares consultado.")
        if chosen_places:
            for place in chosen_places:
                md.append(
                    f"* **{place.get('name')}** ({place.get('kind') or 'local'}): "
                    f"{place.get('continent') or 'continente indefinido'} / {place.get('geo_region') or place.get('biome') or 'regiao indefinida'}; "
                    f"povo predominante {place.get('people') or 'nao informado'}; fonte `{place.get('source') or places_context.get('source')}`."
                )
        else:
            md.append("* Nenhum local catalogado combinou diretamente com o tema; os locais abaixo foram criados como complementares.")
    else:
        md.append(places_context.get("summary") or "Catalogo de lugares nao encontrado.")
    md.append("")
    md.append("## Comeco, meio e fim")
    md.append("")
    md.append("### Comeco")
    md.append("")
    if theme == "fronteira":
        md.append(f"Os personagens chegam a **{start_location}** juntos, vindos de povos diferentes ou carregando sinais visiveis de origens distintas. A primeira cena deve deixar claro que a vila em formacao nao sabe se precisa deles, se teme eles ou se quer usa-los como exemplo.")
        md.append("")
        md.append("* Incidente inicial: o primeiro sino da vila toca antes de estar terminado. Quando todos correm para a praca, um jovem de um povo marginalizado aparece morto, com lama na boca e o simbolo de uma tribo rival riscado no peito.")
        md.append("* Acusacao imediata: uma multidao escolhe o culpado mais facil entre os diferentes. Se algum personagem tiver raca parecida com a acusada, ele vira alvo social da cena.")
        md.append("* Primeira escolha: proteger o acusado, acalmar a multidao, examinar o corpo ou aceitar escolta da guarda local.")
        md.append("* Primeira pista: a lama no corpo vem da pedreira, nao da margem tribal onde o crime teria acontecido.")
    else:
        md.append(f"Os personagens chegam a **{start_location}** quando um incidente publico revela que o problema nao e boato. Apresente uma vitima, uma testemunha confusa e uma autoridade pedindo ajuda sem contar tudo.")
        md.append("")
        md.append("* Gancho: alguem importante desaparece ou adoece logo depois de procurar os herois.")
        md.append("* Primeira escolha: ajudar a populacao, perseguir uma pista imediata ou confrontar a autoridade local.")
        md.append("* Primeira pista: um simbolo, mapa, frasco, brasao ou marca que conecta o incidente ao vilao principal.")
    md.append("")
    md.append("### Meio")
    md.append("")
    if theme == "fronteira":
        md.append("O meio revela que o crime nao foi um odio espontaneo, mas parte de uma politica planejada. Hadrun quer que a primeira lei da vila seja uma lei de pureza: quem nao tiver moradia fixa, sangue reconhecido ou juramento ao sino perde protecao.")
        md.append("")
        md.append("* Escalada: a guarda cria toques de recolher diferentes para povos diferentes.")
        md.append("* Dilema: salvar uma familia perseguida pode fazer a multidao destruir provas na praca.")
        md.append("* Virada: uma antagonista secundaria tem provas contra Hadrun, mas so entrega se os personagens aceitarem proteger uma pessoa culpada por outro crime.")
        md.append("* Verdade parcial: a vitima descobriu que Hadrun simulava ataques tribais para justificar uma guarda permanente.")
    else:
        md.append("O meio deve abrir o mapa do arco. Cada local revela uma parte diferente: causa, metodo, cumplices e custo humano. Os viloes secundarios aparecem para testar escolhas, nao apenas para lutar.")
        md.append("")
        md.append("* Escalada: o vilao principal acelera o plano quando percebe interferencia.")
        md.append("* Dilema: uma missao secundaria oferece vantagem, mas consome tempo ou expoe inocentes.")
        md.append("* Virada: um vilao secundario pode ser inimigo, aliado temporario ou vitima do proprio esquema.")
    md.append("")
    md.append("### Fim")
    md.append("")
    if theme == "fronteira":
        md.append(f"O final acontece na **Pedreira dos Nomes Riscados**, onde **{villain_main[0]}** prepara uma execucao publica disfarcada de julgamento. A vitoria nao e apenas impedir a morte: os personagens precisam decidir que tipo de ordem vai nascer ali.")
        md.append("")
        md.append("* Final de prova: apresentar a lama, as marcas falsas e a testemunha certa derruba Hadrun sem iniciar massacre.")
        md.append("* Final de combate: Hadrun chama a guarda e usa civis assustados como cobertura moral.")
        md.append("* Final amargo: salvar o acusado pode permitir que Hadrun fuja; prender Hadrun pode deixar uma familia perseguida sem protecao imediata.")
        md.append("* Escolha central: uma vila com lei comum para todos, uma vila dividida por sangue, ou o retorno instavel aos pactos tribais.")
    else:
        md.append(f"O final acontece quando os personagens alcancam o centro real da ameaca e confrontam **{villain_main[0]}**. A vitoria nao precisa ser apenas matar o vilao: destruir o recurso especial, revelar o segredo ou salvar refens pode resolver o arco.")
        md.append("")
        md.append("* Final de combate: o vilao usa o local final como arma.")
        md.append("* Final social: provas reunidas no meio do arco permitem virar aliados contra o vilao.")
        md.append("* Final tragico: vencer exige sacrificar recompensa, reputacao ou seguranca imediata.")
    md.append("")
    md.append("## Estrutura sandbox")
    md.append("")
    md.append("O arco nao precisa ser jogado em ordem fixa. Depois da cena inicial, os personagens podem escolher qual area explorar. Cada local oferece uma pista principal, uma complicacao e uma consequencia se for ignorado por tempo demais.")
    md.append("")
    md.append("* **Rota social:** falar com lideres, acusados, familias perseguidas e comerciantes. Boa para Persuasao, Intuicao, Enganacao e Religiao.")
    md.append("* **Rota investigativa:** examinar corpo, lama, arquivos, marcas, sino, cinzeis e nomes apagados. Boa para Percepcao, Medicina, Historia, Tecnologia e Sobrevivencia.")
    md.append("* **Rota de risco:** seguir patrulhas, invadir arquivos, escoltar testemunhas ou interromper julgamento. Boa para Furtividade, Atletismo, Acrobacia e combate.")
    md.append("* **Relogio de consequencia:** a cada descanso longo ou falha publica importante, avance uma etapa: boatos, toque de recolher, prisao de inocente, julgamento, expulsao legal.")
    md.append("* **Chaves de progresso:** os jogadores chegam ao final por tres provas, duas aliancas fortes, confissao de um vilao secundario ou confronto direto com custo alto.")
    md.append("")
    md.append("## Cenas sandbox jogaveis")
    md.append("")
    for scene in scene_templates(theme, locations, villain_main, secondary_villains):
        md.append(f"### {scene['name']}")
        md.append("")
        md.append(f"**Local:** {scene['place']}")
        md.append(f"**Situacao inicial:** {scene['situation']}")
        md.append(f"**Objetivo da cena:** {scene['objective']}")
        md.append("")
        md.append("**Pontos interativos:**")
        for item in scene["interactive"]:
            md.append(f"* {item}")
        md.append("")
        md.append("**Escolhas importantes:**")
        for item in scene["choices"]:
            md.append(f"* {item}")
        md.append("")
        md.append(f"**Consequencia:** {scene['consequence']}")
        md.append(f"**Inimigos ou pressoes:** {scene['enemies']}")
        md.append(f"**Saidas para o sandbox:** {scene['exits']}")
        md.append("")
    md.append("## Vilao principal")
    md.append("")
    md.append(f"### {villain_main[0]}")
    md.append("")
    md.append(f"**Funcao:** {villain_main[1]}.")
    md.append(f"**Motivacao:** {villain_main[2]}.")
    md.append("**Metodo:** age por intermediarios, cria crises pequenas para esconder a crise maior e sempre deixa alguem culpado no lugar certo.")
    md.append("**Segredo:** o plano depende de uma ferida pessoal antiga; descobrir essa origem permite negociar, enfraquecer ou expor o vilao.")
    md.append("")
    md.append(ficha(profile, "boss", ["Arcanismo", "Enganacao", "Intimidacao", "Percepcao"], "chefe", "isola o personagem mais vulneravel e transforma o ambiente em pressao constante", "orgulho; reage mal quando seu controle narrativo e quebrado", "Ordem Irrevogavel: uma vez por cena, transforma uma pista, objeto ou refem em ameaca imediata."))
    md.append("")
    md.append("## Viloes secundarios")
    md.append("")
    for name, role, function in secondary_villains:
        md.append(f"### {name}")
        md.append("")
        md.append(f"**Funcao narrativa:** {role}; {function}.")
        md.append("**Como usar:** coloque este vilao em uma cena onde combater seja possivel, mas conversar revele uma pista util.")
        md.append("")
        md.append(ficha(profile, "standard", ["Furtividade", "Intuicao", "Persuasao"], "rival", "testa os limites dos herois e recua quando perde vantagem", "tem medo de ser descartado pelo vilao principal", "Vantagem de Cena: recebe +1 dado narrativo quando luta em seu local preparado."))
        md.append("")
    md.append("## NPCs importantes")
    md.append("")
    npc_rows = []
    for place in chosen_places:
        if place.get("leader_name"):
            npc_rows.append({
                "name": place["leader_name"],
                "race": place.get("people") or "povo local",
                "role": place.get("leader_title") or "lideranca local",
                "place": place.get("name") or "local catalogado",
                "goal": place.get("leader_pressure") or "manter a comunidade unida",
                "hook": place.get("culture_law") or "pode abrir ou fechar acesso ao local",
            })
        for npc in place.get("npcs") or []:
            npc_rows.append({
                "name": npc.get("name") or "NPC local",
                "race": place.get("people") or "povo local",
                "role": npc.get("role") or "morador importante",
                "place": place.get("name") or "local catalogado",
                "goal": npc.get("hook") or "quer sobreviver a crise sem perder reputacao",
                "hook": npc.get("hook") or "oferece pista se for tratado com respeito",
            })
    if theme == "fronteira":
        npc_rows.extend([
            {"name": "Aru dos Dois Nomes", "race": "mestico ou povo rejeitado", "role": "testemunha sem classe formal", "place": start_location, "goal": "provar que viu lanternas da guarda sem ser morto", "hook": "sabe que a vitima foi levada viva para a pedreira"},
            {"name": "Maira Junco-Seco", "race": "humana", "role": "mercadora e mediadora", "place": "Praca do Primeiro Sino", "goal": "manter comercio aberto mesmo que a lei seja injusta", "hook": "vende comida a excluidos escondida da guarda"},
            {"name": "Rusk Lodo-Claro", "race": "lizardman", "role": "batedor / explorador", "place": "Tendas da Margem Velha", "goal": "defender os seus sem iniciar guerra", "hook": "conhece uma trilha segura ate a Casa de Julgamento"},
        ])
    seen_npcs = set()
    for npc in npc_rows[:10]:
        key = npc["name"].lower()
        if key in seen_npcs:
            continue
        seen_npcs.add(key)
        md.append(f"### {npc['name']}")
        md.append("")
        md.append(f"**Raca / povo:** {npc['race']}.")
        md.append(f"**Classe / funcao:** {npc['role']}.")
        md.append(f"**Local ligado:** {npc['place']}.")
        md.append(f"**Aparencia:** roupas gastas pelo ambiente, um detalhe cultural visivel e postura que muda conforme o grupo respeita ou viola costumes locais.")
        md.append(f"**Voz e interpretacao:** fala com frases curtas quando pressionado; relaxa quando alguem reconhece seu povo, sua lei ou sua dor.")
        md.append(f"**Objetivo:** {npc['goal']}.")
        md.append("**Medo:** virar exemplo publico, perder protecao da propria comunidade ou ser usado como prova falsa.")
        md.append(f"**Segredo ou gancho:** {npc['hook']}.")
        md.append("**Como pode ajudar:** oferece rota, testemunho, abrigo, item simples, nome apagado ou aviso sobre patrulha.")
        md.append("**Como pode atrapalhar:** mente por medo, exige promessa, chama parentes armados ou entrega o grupo se for humilhado.")
        md.append("")
    md.append("## Locais")
    md.append("")
    frontier_location_details = {
        "Cruzamento de Pedra e Junco": {
            "desc": "o ponto onde antigas trilhas tribais encontram a rua de barro batido da futura vila; metade e acampamento, metade e obra.",
            "clima": "desconfiado, enlameado e cheio de olhares medindo cor, chifres, presas, marcas, sotaques e roupas",
            "acontece": "os personagens presenciam a primeira acusacao publica e percebem que a vila ja decidiu quem merece medo.",
            "pistas": "lama de pedreira no cadaver, marcas feitas com ferramenta de guarda e uma crianca que viu lanternas fora do horario.",
            "perigos": "multidao em panico, insultos que podem virar violencia e guardas tentando separar os personagens por raca.",
            "uso": "use para apresentar o preconceito sem monologo: faca NPCs pedirem ajuda a um personagem e recusarem a mao de outro.",
        },
        "Praca do Primeiro Sino": {
            "desc": "uma praca ainda sem pedra, com um sino pendurado em andaimes e postes onde novas leis sao pregadas sobre costumes antigos.",
            "clima": "cerimonial, cruel e instavel",
            "acontece": "Vessa le uma proposta de lei que divide moradores entre juramentados e tolerados.",
            "pistas": "a ata da lei foi escrita antes do crime, o sino tem sangue seco no badalo e ha marcas de arrasto ate a guarda.",
            "perigos": "debate publico, provocadores pagos e chance de uma fala errada virar prova contra o grupo.",
            "uso": "conduza como cena social: cada argumento dos jogadores muda quem ganha coragem para testemunhar.",
        },
        "Tendas da Margem Velha": {
            "desc": "o ultimo circulo tribal preservado na margem do rio, onde familias se recusam a trocar memoria por cerca.",
            "clima": "ferido, ritualistico e a beira de exilio",
            "acontece": "uma familia acusada esconde uma pessoa inocente e uma culpa antiga que complica a investigacao.",
            "pistas": "um canto funerario menciona a vitima com outro nome, e um amuleto dela foi achado perto da pedreira.",
            "perigos": "vingadores tribais, medo de traicao e um espirito de totem rachado reagindo a mentiras.",
            "uso": "deixe claro que os oprimidos nao sao automaticamente puros; alguns querem justica, outros querem revanche.",
        },
        "Casa de Julgamento de Madeira Verde": {
            "desc": "a primeira casa oficial da vila, construida com madeira ainda viva, onde regras novas tentam esmagar pactos antigos.",
            "clima": "frio, burocratico e sufocante",
            "acontece": "os personagens podem acessar depoimentos, mas cada documento omitido protege alguem poderoso.",
            "pistas": "Vessa guardou duas versoes da mesma lei, uma para o conselho e outra para Hadrun.",
            "perigos": "armarios trancados, testemunhas intimidadas e acusacoes legais contra personagens de origem estrangeira.",
            "uso": "trate como investigacao de documentos; recompense Tecnologia, Historia, Intuicao, Persuasao e Furtividade.",
        },
        "Pedreira dos Nomes Riscados": {
            "desc": "uma pedreira onde pedras de fundacao recebem nomes de familias aceitas, enquanto nomes tribais sao apagados a cinzel.",
            "clima": "sombrio, aberto e fatalista",
            "acontece": "Hadrun prepara o julgamento final usando a pedreira como palco e prova falsa.",
            "pistas": "a ferramenta que riscou o corpo da vitima esta escondida entre cinzeis oficiais.",
            "perigos": "desmoronamento, guardas acuados, caes de cerca e civis usados como escudo social.",
            "uso": "e o final ideal: deixe cada prova reunida antes remover um perigo, aliado ou obstaculo da cena.",
        },
    }
    for index, location in enumerate(locations, start=1):
        md.append(f"### {location}")
        md.append("")
        if location in place_by_name:
            place = place_by_name[location]
            md.append(f"**Origem:** local existente em `{place.get('source') or places_context.get('source')}`.")
            md.append(f"**Tipo e regiao:** {place.get('kind') or 'local'} em {place.get('continent') or 'continente indefinido'}, {place.get('geo_region') or place.get('biome') or 'regiao indefinida'}.")
            md.append(f"**Povo predominante:** {place.get('people') or 'nao informado'}.")
            if place.get("deity"):
                md.append(f"**Divindade ou forca patrona:** {place['deity']}.")
            md.append(f"**Descricao:** {place.get('read_aloud') or place.get('culture_identity') or 'local catalogado na pasta lugares.'}")
            if place.get("leader_name"):
                md.append(f"**Lideranca:** {place['leader_name']}, {place.get('leader_title') or 'lider local'}. Pressao atual: {place.get('leader_pressure') or 'manter a comunidade unida'}.")
            if place.get("culture_law"):
                md.append(f"**Lei local:** {place['culture_law']}.")
            if place.get("culture_taboo"):
                md.append(f"**Tabu:** {place['culture_taboo']}.")
            if place.get("secret_surface") or place.get("secret_truth"):
                md.append(f"**Segredo util ao arco:** {place.get('secret_surface') or 'ha um problema aparente'} Verdade: {place.get('secret_truth') or 'o mestre define a ligacao com o vilao'}.")
            if place.get("npcs"):
                md.append("**NPCs para usar:**")
                for npc in place["npcs"]:
                    md.append(f"* {npc.get('name') or 'NPC'}: {npc.get('role') or 'papel indefinido'}; gancho: {npc.get('hook') or 'pode oferecer pista ou custo moral'}.")
            md.append("**Pontos de interesse interativos:**")
            for point in point_lines_for_location(location, place, theme):
                md.append(point)
            md.append("**Como usar em mesa:** trate este local como ancora geografica do arco. Os locais complementares abaixo devem se conectar a suas leis, tabus, liderancas ou segredos.")
        elif theme == "fronteira" and location in frontier_location_details:
            detail = frontier_location_details[location]
            md.append(f"**Descricao:** {detail['desc']}")
            md.append(f"**Clima:** {detail['clima']}.")
            md.append(f"**O que acontece aqui:** {detail['acontece']}")
            md.append(f"**Pistas:** {detail['pistas']}")
            md.append(f"**Perigos:** {detail['perigos']}")
            md.append("**Pontos de interesse interativos:**")
            for point in point_lines_for_location(location, None, theme):
                md.append(point)
            md.append(f"**Como usar em mesa:** {detail['uso']}")
        else:
            md.append(f"**Descricao:** lugar importante do arco, marcado por sinais do tema central e por pessoas que ainda tentam manter rotina apesar do perigo.")
            md.append(f"**Clima:** {pick(rng, ['tenso e vigiado', 'silencioso demais', 'cheio de rumores', 'opressivo e ritualistico', 'urgente e caotico'])}.")
            md.append("**O que acontece aqui:** os personagens encontram uma pista concreta, um obstaculo social e uma ameaca fisica.")
            md.append("**Pistas:** uma testemunha contraditoria, um objeto fora de lugar e um rastro que aponta para outro local.")
            md.append("**Perigos:** emboscadas, perseguicoes, armadilhas simples, pressao de tempo ou inocentes em risco.")
            md.append("**Pontos de interesse interativos:**")
            for point in point_lines_for_location(location, None, theme):
                md.append(point)
            md.append("**Como usar em mesa:** comece com uma imagem forte, ofereca duas rotas de investigacao e termine com uma consequencia clara.")
        md.append("")
    md.append("## Criaturas e inimigos com ficha")
    md.append("")
    for name, desc, role in creatures_by_theme:
        md.append(f"### {name}")
        md.append("")
        md.append(f"**Descricao:** {desc}.")
        md.append("**Comportamento:** reage primeiro ao medo, ao cheiro de magia ou a ordens simples do vilao.")
        md.append("**Uso em cena:** use uma criatura sozinha como sinal de perigo; use duas ou mais para forcar movimento e escolha de prioridades.")
        md.append("")
        md.append(ficha(profile, "weak", ["Atletismo", "Percepcao", "Sobrevivencia"], role, "pressiona o alvo mais isolado e tenta separar o grupo", "perde eficiencia quando exposta a luz, fogo, fe ou prova ligada ao tema", "Instinto Tematico: ao primeiro dano sofrido, revela uma pista fisica sobre sua origem."))
        md.append("")
    catalog_creatures = []
    for place in chosen_places:
        for creature in place.get("creatures") or []:
            key = creature.get("name")
            if key and key not in {item.get("name") for item in catalog_creatures}:
                catalog_creatures.append({**creature, "place": place.get("name")})
    if catalog_creatures:
        md.append("### Ameacas vindas dos locais catalogados")
        md.append("")
        md.append("Estas criaturas aparecem nos arquivos da pasta `lugares` e foram copiadas para ca para uso direto em mesa.")
        md.append("")
        for creature in catalog_creatures[:6]:
            grade = creature.get("grade") or "1"
            tier = "standard" if str(grade).isdigit() and int(grade) >= 2 else "weak"
            md.append(f"#### {creature.get('name')}")
            md.append("")
            md.append(f"**Local de origem:** {creature.get('place')}.")
            md.append(f"**Tipo / grau:** {creature.get('type') or 'ameaca local'} / grau {grade}.")
            md.append(f"**Gancho:** {creature.get('hook') or 'ameaca ligada ao segredo do local'}.")
            md.append("**Uso em cena:** coloque como pressagio, obstaculo territorial ou consequencia de violar tabu local.")
            md.append("")
            md.append(ficha(profile, tier, ["Atletismo", "Percepcao", "Sobrevivencia"], "ameaca local", "usa terreno conhecido e tenta empurrar os personagens para agua, lama, ruina ou multidao", "pode ser evitada respeitando tabu, oferecendo alimento, recuando ou revelando o segredo local", "Territorio Familiar: enquanto estiver em seu local de origem, recebe +1 em testes para perseguir, esconder ou proteger uma pista."))
            md.append("")
    md.append("## Missoes secundarias")
    md.append("")
    if theme == "fronteira":
        side_quests = [
            ("A Crianca Que Viu as Lanternas", "proteger uma crianca que viu guardas levando a vitima para a pedreira", "a familia da crianca quer fugir antes de depor, e impedir a fuga pode parecer traicao", "testemunho que remove uma patrulha do final"),
            ("Os Nomes Apagados", "recuperar pedras de fundacao com nomes tribais riscados", "algumas pedras tambem provam que uma familia tribal aceitou participar de expulsao antiga", "prova da politica de pureza e uma chance de reconciliacao dificil"),
            ("Comida Para os Tolerados", "levar suprimentos a familias proibidas de comprar no mercado da vila", "enquanto ajudam, documentos podem ser queimados na casa de julgamento", "apoio popular, abrigo e informacoes sobre rotas secretas"),
        ]
    else:
        side_quests = [
            ("A Testemunha Sumida", "encontrar alguem que viu o primeiro sinal real da ameaca", "a testemunha tambem esconde um crime menor", "uma pista direta para o proximo local"),
            ("Suprimentos em Risco", "recuperar comida, remedios, armas ou documentos", "os suprimentos estao protegidos por gente desesperada", "aliados locais e vantagem em uma cena futura"),
            ("O Acordo Errado", "negociar com um vilao secundario ou rival", "aceitar ajuda cobra um preco moral", "atalho para o final ou informacao sobre a fraqueza do vilao principal"),
        ]
    for name, objective, complication, reward in side_quests:
        md.append(f"### {name}")
        md.append("")
        md.append(f"**Objetivo:** {objective}.")
        md.append("**Gatilho:** aparece quando os personagens investigam um local e escolhem ajudar alguem alem da missao principal.")
        md.append(f"**Complicacao:** {complication}.")
        md.append(f"**Recompensa:** {reward}.")
        md.append("**Como usar:** ofereca esta missao quando a mesa precisar de respiro, reforco emocional ou uma pista que nao dependa de combate.")
        md.append("")
    md.append("## Encontros por local")
    md.append("")
    for location in locations:
        md.append(f"### {location}")
        md.append("")
        encounters = [
            "Uma testemunha assustada pede escolta e revela metade de uma verdade.",
            "Uma criatura menor aparece ferida, fugindo de algo pior.",
            "Um vilao secundario observa de longe e testa a reacao do grupo.",
            "Um obstaculo ambiental separa os personagens por alguns minutos.",
            "Um inocente carrega uma pista, mas tambem uma acusacao falsa.",
            "O simbolo do vilao principal surge em um lugar onde nao deveria estar.",
        ]
        for die, encounter in enumerate(encounters, start=1):
            md.append(f"* d6={die}: {encounter}")
        md.append("")
    md.append("## Consequencias")
    md.append("")
    if theme == "fronteira":
        md.append("* Se os personagens vencerem com provas, a vila nasce com uma lei comum, ainda imperfeita, mas sem expulsao racial oficial.")
        md.append("* Se vencerem apenas pela forca, Hadrun cai, mas seus seguidores espalham que povos estrangeiros derrubaram a ordem nascente.")
        md.append("* Se salvarem a familia perseguida e perderem provas, ganham aliados leais, mas a lei de pureza passa em versao suavizada.")
        md.append("* Se preservarem provas e abandonarem inocentes, Hadrun pode ser exposto, mas o grupo carrega uma divida moral com os sobreviventes.")
        md.append("* Se fizerem acordo com Vessa ou Nara, recebem informacao decisiva, mas uma mentira entra nos registros oficiais da nova vila.")
        md.append("* Se falharem, a primeira lei da vila cria a categoria dos tolerados: pessoas que podem morar ali, mas nao testemunhar, herdar ou portar armas.")
    else:
        md.append("* Se os personagens vencerem com provas, a regiao se reorganiza e eles ganham aliados duradouros.")
        md.append("* Se vencerem apenas pela forca, o problema imediato acaba, mas culpados menores escapam.")
        md.append("* Se fizerem acordo com o vilao ou com um secundario, recebem uma vantagem agora e uma cobranca futura.")
        md.append("* Se falharem, o vilao principal conclui uma etapa do plano e o proximo arco comeca em posicao pior.")
    md.append("")
    md.append("## Ganchos para continuar")
    md.append("")
    md.append("* Um objeto encontrado no final tem marca de outra regiao.")
    md.append("* Um vilao secundario sobrevivente oferece servico, vinganca ou chantagem.")
    md.append("* A solucao usada pelos herois deixou uma cicatriz magica, politica ou espiritual.")
    md.append("")
    md.append("## Notas rapidas para o mestre")
    md.append("")
    md.append("* Mantenha cada cena ligada a uma escolha: salvar, investigar, negociar, perseguir ou confrontar.")
    md.append("* Se a mesa travar, revele uma pista por consequencia, nao por bloqueio.")
    md.append("* Reaproveite criaturas como sinais de escalada, nao apenas como combates aleatorios.")
    md.append("")
    return title, "\n".join(md)


def inline_md(text):
    text = escape(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<em>\1</em>", text)
    text = re.sub(r"`(.+?)`", r"<code>\1</code>", text)
    return text


def markdown_to_body(md):
    html = []
    toc = []
    paragraph = []
    list_items = []

    def flush_paragraph():
        if paragraph:
            html.append("<p>" + inline_md(" ".join(paragraph).strip()) + "</p>")
            paragraph.clear()

    def flush_list():
        if list_items:
            html.append("<ul>" + "".join(f"<li>{inline_md(item)}</li>" for item in list_items) + "</ul>")
            list_items.clear()

    for raw in md.splitlines():
        line = raw.strip()
        if not line:
            flush_paragraph()
            flush_list()
            continue
        heading = re.match(r"^(#{1,6})\s+(.+)$", line)
        if heading:
            flush_paragraph()
            flush_list()
            level = len(heading.group(1))
            text = heading.group(2).strip()
            ident = slug(text) + "-" + str(len(toc) + 1)
            toc.append((level, text, ident))
            html.append(f'<h{level} id="{ident}">{inline_md(text)}</h{level}>')
            continue
        bullet = re.match(r"^(?:[-*+]|\u2022)\s+(.+)$", line)
        if bullet:
            flush_paragraph()
            list_items.append(bullet.group(1).strip())
            continue
        flush_list()
        paragraph.append(line)
    flush_paragraph()
    flush_list()
    return "\n".join(html), toc


def xhtml_document(title, body, stylesheet="../Styles/style.css"):
    return f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="pt-BR">
<head>
  <title>{escape(title)}</title>
  <link rel="stylesheet" type="text/css" href="{stylesheet}" />
</head>
<body>
{body}
</body>
</html>
'''


def stylesheet():
    return """
body {
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.55;
  color: #221f1f;
  margin: 2rem auto;
  max-width: 880px;
  padding: 0 1rem;
}
h1, h2, h3 {
  font-family: 'Segoe UI', Arial, sans-serif;
  line-height: 1.2;
  color: #3a1015;
}
h1 {
  font-size: 2.1em;
  border-bottom: 2px solid #8d1c27;
  padding-bottom: 0.25em;
}
h2 {
  margin-top: 2em;
  border-bottom: 1px solid #d8c7bf;
  padding-bottom: 0.15em;
}
h3 {
  margin-top: 1.35em;
}
ul {
  padding-left: 1.3rem;
}
code {
  background: #f1e9e4;
  padding: 0.1em 0.25em;
}
""".strip()


def build_epub(title, body, toc, out_path):
    book_id = f"urn:uuid:{uuid.uuid4()}"
    chapter = xhtml_document(title, body)
    nav_items = []
    for level, text, ident in toc:
        if level <= 2:
            nav_items.append(f'<li><a href="Text/chapter1.xhtml#{ident}">{inline_md(text)}</a></li>')
    nav_xhtml = xhtml_document("Sumario", f'''<nav epub:type="toc" id="toc" xmlns:epub="http://www.idpf.org/2007/ops">
  <h1>Sumario</h1>
  <ol>
    {"".join(nav_items)}
  </ol>
</nav>''')
    content_opf = f'''<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">{book_id}</dc:identifier>
    <dc:title>{escape(title)}</dc:title>
    <dc:creator>{escape(AUTHOR)}</dc:creator>
    <dc:language>pt-BR</dc:language>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="style" href="Styles/style.css" media-type="text/css"/>
    <item id="chap1" href="Text/chapter1.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="chap1"/>
  </spine>
</package>
'''
    container_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
'''
    with ZipFile(out_path, "w") as epub:
        epub.writestr("mimetype", "application/epub+zip", ZIP_STORED)
        epub.writestr("META-INF/container.xml", container_xml, ZIP_DEFLATED)
        epub.writestr("OEBPS/content.opf", content_opf, ZIP_DEFLATED)
        epub.writestr("OEBPS/nav.xhtml", nav_xhtml, ZIP_DEFLATED)
        epub.writestr("OEBPS/Styles/style.css", stylesheet(), ZIP_DEFLATED)
        epub.writestr("OEBPS/Text/chapter1.xhtml", chapter, ZIP_DEFLATED)


def main():
    global OUT_DIR
    parser = argparse.ArgumentParser(description="Cria e compila um arco de RPG em Markdown, HTML e EPUB.")
    parser.add_argument("--out-dir", default=str(OUT_DIR), help="Pasta de saida do arco. Padrao: arco")
    args = parser.parse_args()
    OUT_DIR = Path(args.out_dir)

    print("Agente Criador de Arcos - Sistema Mecanico RPG")
    print("Responda 'crie' quando quiser que o agente invente.")
    print("")
    data = {
        "idea": ask("1. Ideia central, tema ou problema do arco: "),
        "tone": ask("2. Tom do arco: "),
        "power": ask("3. Nivel de poder do grupo: "),
        "start": ask("4. Onde o arco comeca: "),
        "required": ask("5. Algo obrigatorio que deve aparecer: "),
    }
    data["party_context"] = load_party_context()
    data["places_context"] = load_places_context()

    title, md = build_arc(data)
    body, toc = markdown_to_body(md)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    md_path = OUT_DIR / "arco.md"
    html_path = OUT_DIR / "arco.html"
    epub_path = OUT_DIR / "arco.epub"

    md_path.write_text(md, encoding="utf-8")
    html_path.write_text(xhtml_document(title, body, "style.css").replace("../Styles/style.css", "style.css"), encoding="utf-8")
    (OUT_DIR / "style.css").write_text(stylesheet(), encoding="utf-8")
    build_epub(title, body, toc, epub_path)

    print("")
    if data["party_context"].get("found"):
        print("Fichas usadas no balanceamento: " + data["party_context"]["source"])
    else:
        print("Site RPG configurado: " + RPG_SITE_URL)
        print("Fichas da mesa-principal nao encontradas em backup local; usado nivel informado.")
    print(data["places_context"].get("summary") or "Catalogo de lugares nao consultado.")
    print(f"Arco criado: {title}")
    print(f"Markdown: {md_path}")
    print(f"HTML: {html_path}")
    print(f"EPUB: {epub_path}")


if __name__ == "__main__":
    main()
