from html import escape
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED, ZIP_STORED
import json
import random
import re
import unicodedata
import uuid


OUT_DIR = Path("lugares")

SUPPORTS = {
    "divindades": Path("sistema/mecanicas/divindades_sistema.md"),
    "sistema": Path("sistema/ebook/Sistema_Mecanico_RPG.monolitico.html"),
    "bestiario": Path("sistema/mecanicas/bestiario_sistema.md"),
}

DIVINITIES = ["Luz", "Sombra", "Natureza", "Morte", "Caos", "Ordem", "Demonio"]

RACES = {
    "humano": {
        "plural": "humanos",
        "traits": ["adaptacao", "ambicao social", "memoria curta para tragedias antigas"],
        "customs": ["conselhos abertos", "festas de colheita", "juramentos escritos"],
        "taboos": ["quebrar hospitalidade", "roubar de viajantes sob protecao local"],
        "architecture": ["madeira reforcada", "pedra simples", "telhados inclinados"],
        "market": "variado, pratico e aberto a forasteiros",
    },
    "elfo": {
        "plural": "elfos",
        "traits": ["longevidade", "rituais de memoria", "estetica integrada a natureza"],
        "customs": ["nomes cerimoniais", "duelos de poesia", "luto silencioso"],
        "taboos": ["derrubar arvores antigas sem rito", "apressar decisoes de anciaos"],
        "architecture": ["madeira viva", "pontes suspensas", "pedra polida por magia"],
        "market": "refinado, caro e baseado em reputacao",
    },
    "orc": {
        "plural": "orcs",
        "traits": ["honra direta", "forca comunitaria", "respeito por provas fisicas"],
        "customs": ["desafios publicos", "banquetes de pacto", "marcas de feito"],
        "taboos": ["covardia em defesa da casa", "mentir em disputa formal"],
        "architecture": ["paliçadas grossas", "ossos cerimoniais", "forjas abertas"],
        "market": "duro, barulhento e inclinado a escambo",
    },
    "anao": {
        "plural": "anoes",
        "traits": ["linhagens registradas", "tecnicas de pedra", "juramentos duradouros"],
        "customs": ["brindes de contrato", "cantos de trabalho", "culto a ancestrais"],
        "taboos": ["entregar obra imperfeita", "profanar tumulos de clã"],
        "architecture": ["salas baixas de pedra", "arcos geometricos", "metal exposto"],
        "market": "preciso, tabelado e cheio de garantias",
    },
    "goblin": {
        "plural": "goblins",
        "traits": ["engenho improvisado", "humor agressivo", "lealdade por bando"],
        "customs": ["leiloes relampago", "apelidos publicos", "provas de esperteza"],
        "taboos": ["desperdicar sucata util", "recusar uma aposta aceita"],
        "architecture": ["andaimes", "remendos metalicos", "tunelaria apertada"],
        "market": "caotico, barato e cheio de itens estranhos",
    },
    "lizardman": {
        "plural": "lizardmans",
        "traits": ["leitura de clima", "territorio sagrado", "parentesco por ninhada"],
        "customs": ["banhos rituais", "pinturas de lama", "cacas reguladas"],
        "taboos": ["poluir agua", "matar filhotes ou ovos de especies locais"],
        "architecture": ["palafitas", "pedra umida", "barro endurecido"],
        "market": "organico, ribeirinho e controlado por anciaos",
    },
    "homem-fera": {
        "plural": "homens-fera",
        "traits": ["instinto de matilha", "totens animais", "hierarquia por cuidado e forca"],
        "customs": ["vigilia lunar", "cicatrizes narradas", "cacas de passagem"],
        "taboos": ["abandonar a matilha", "vender trofeus sagrados"],
        "architecture": ["tendas de couro", "cabanas altas", "totens pintados"],
        "market": "sazonal, tribal e rico em produtos de caca",
    },
}

REGIONS = {
    "floresta": {
        "senses": ["cheiro de folhas molhadas", "coro de insetos", "luz verde filtrada"],
        "flora": ["samambaia de orvalho", "cipó de sangue-frio", "raiz de cura amarga", "musgo luminoso"],
        "fauna": ["cervos de galho branco", "raposas cinzentas", "corvos runicos", "lobos de cinza"],
        "hazards": ["neblina que apaga trilhas", "raízes que escondem covas", "chuva repentina"],
    },
    "pantano": {
        "senses": ["lama quente", "agua parada", "nuvens de mosquitos", "madeira inchada"],
        "flora": ["junco negro", "flor de febre", "lirio de lodo", "alga anestesica"],
        "fauna": ["rastejantes de pantano", "crocodilos de pedra", "sapos de vidro", "garcas carniceiras"],
        "hazards": ["solo falso", "gas inflamavel", "febre de agua ruim"],
    },
    "montanha": {
        "senses": ["vento cortante", "pedra fria", "ecos longos", "ceú aberto"],
        "flora": ["liquen de ferro", "pinheiro anão", "flor de altitude", "erva contra tontura"],
        "fauna": ["cabras de chifre azul", "abutres brancos", "ursos de bruma", "lagartos de rocha"],
        "hazards": ["deslizamento", "ar rarefeito", "pontes geladas"],
    },
    "deserto": {
        "senses": ["areia quente", "sal nos labios", "silencio amplo", "miragens baixas"],
        "flora": ["cacto de agua doce", "erva de vidro", "raiz de sal", "flor noturna"],
        "fauna": ["hienas da raiva", "serpentes de vidro", "besouros de cobre", "falcões secos"],
        "hazards": ["tempestade de areia", "miragem arcana", "sede acelerada"],
    },
    "subterraneo": {
        "senses": ["pedra suada", "goteiras constantes", "ar mineral", "ecos proximos"],
        "flora": ["cogumelo de eco", "mofo prateado", "raiz cega", "liquen fosforescente"],
        "fauna": ["aranhas de eco", "morcegos pálidos", "vermes de pedra", "sombras liquidas"],
        "hazards": ["teto fraco", "ar venenoso", "fendas invisiveis"],
    },
    "cidade": {
        "senses": ["fumaça de cozinha", "metal batido", "vozes sobrepostas", "pedra gasta"],
        "flora": ["ervas de janela", "arvores de praça", "vinhas de muro", "flores funerarias"],
        "fauna": ["ratos de rua", "corvos runicos", "caes de guarda", "pombos mensageiros"],
        "hazards": ["briga de faccoes", "impostos abusivos", "espiões em tavernas"],
    },
    "ruina": {
        "senses": ["po antigo", "pedra quebrada", "vento por corredores vazios", "magia velha"],
        "flora": ["hera rachapedra", "musgo de memoria", "flores cinzentas", "raizes invasoras"],
        "fauna": ["corvos runicos", "serpentes de vidro", "mariposas do luto", "mortos juramentados"],
        "hazards": ["piso instavel", "glifos antigos", "ecos que imitam vozes"],
    },
    "linha de forca": {
        "senses": ["zumbido nos dentes", "luzes no canto dos olhos", "ar carregado", "sombra atrasada"],
        "flora": ["cristal-folha", "erva sifonada", "fungo azul", "flores sem raiz"],
        "fauna": ["vaga-lumes sifao", "corvos runicos", "elementais menores", "bestas mutadas"],
        "hazards": ["descarga arcana", "gravidade irregular", "memorias que vazam"],
    },
}

PLACE_TYPES = {
    "vila": {
        "leaders": ["prefeita", "ancião", "capitã da milicia", "curandeira-chefe"],
        "market": True,
        "landmarks": ["praça de barro batido", "poço central", "celeiro comunal", "casa de conselho"],
    },
    "caverna": {
        "leaders": ["guardiao das galerias", "matriarca do eco", "chefe mineiro", "xama das profundezas"],
        "market": False,
        "landmarks": ["lago negro", "ponte natural", "paredão de cristais", "fenda vertical"],
    },
    "templo": {
        "leaders": ["sumo-sacerdote", "abadessa", "oraculo velado", "zelador juramentado"],
        "market": True,
        "landmarks": ["altar principal", "sala de votos", "cripta lateral", "jardim ritual"],
    },
    "ruina": {
        "leaders": ["arqueologa-chefe", "espirito guardiao", "capataz do acampamento", "devoto exilado"],
        "market": False,
        "landmarks": ["portao tombado", "mosaico partido", "sala soterrada", "torre quebrada"],
    },
    "cidade": {
        "leaders": ["magistrada", "mestre de guilda", "capitao da guarda", "senescal"],
        "market": True,
        "landmarks": ["mercado coberto", "portao fiscal", "ponte velha", "bairro das oficinas"],
    },
    "fortaleza": {
        "leaders": ["castelao", "comandante", "marechal de fronteira", "mestre de armas"],
        "market": True,
        "landmarks": ["muralha externa", "patio de treino", "torre de vigia", "arsenal"],
    },
    "necropole": {
        "leaders": ["guardiao funerario", "sacerdotisa dos nomes", "morto-vivo juramentado", "arquivista"],
        "market": False,
        "landmarks": ["avenida de tumbas", "portao de osso", "arquivo dos mortos", "forno ritual"],
    },
    "acampamento": {
        "leaders": ["batedora-chefe", "capataz", "mestre de caravana", "xama errante"],
        "market": True,
        "landmarks": ["fogueira maior", "curral improvisado", "tenda de comando", "cercado de carga"],
    },
}

NAME_PARTS = {
    "prefix": ["Pedra", "Bruma", "Junco", "Cinza", "Vela", "Raiz", "Ferro", "Eco", "Sal", "Lua"],
    "middle": ["Baixa", "Partida", "Velha", "Alta", "Muda", "Clara", "Negra", "Fria", "Viva", "Torta"],
    "suffix": ["do Vau", "dos Sinos", "da Nascente", "do Juramento", "do Ultimo Fogo", "das Sete Portas", "do Espelho", "da Garganta"],
}

NPC_ROLES = [
    "comerciante que sabe demais",
    "guarda local dividido entre dever e familia",
    "curandeira que esconde uma falha",
    "caçador que conhece trilhas proibidas",
    "criança ou aprendiz que viu o segredo",
    "forasteiro aceito pela comunidade",
    "sacerdote de fé duvidosa",
    "artesã dona de uma chave antiga",
]

MARKET_ITEMS = {
    "basico": [
        ("Refeicao quente", "2 pc", "comum"),
        ("Racao de viagem, 1 dia", "5 pc", "comum"),
        ("Corda resistente, 15 m", "1 pp", "comum"),
        ("Tocha resinada", "1 pc", "comum"),
        ("Kit de primeiros socorros simples", "8 pp", "limitado"),
        ("Alojamento comum", "5 pc", "comum"),
    ],
    "selvagem": [
        ("Unguento contra veneno natural", "1 po", "limitado"),
        ("Pele tratada contra chuva", "7 pp", "comum"),
        ("Isca de predador", "4 pp", "limitado"),
        ("Mapa oral de trilha segura", "6 pp", "negociavel"),
    ],
    "sagrado": [
        ("Incenso ritual", "3 pp", "comum"),
        ("Agua consagrada", "1 po", "limitado"),
        ("Vela votiva", "2 pc", "comum"),
        ("Rito de bencao menor", "2 po", "por reputacao"),
    ],
    "subterraneo": [
        ("Lamparina de oleo grosso", "8 pp", "comum"),
        ("Picareta curta", "1 po", "comum"),
        ("Giz mineral para marcar tunel", "3 pc", "comum"),
        ("Cogumelo nutritivo seco", "4 pc", "comum"),
    ],
    "arcano": [
        ("Tinta runica simples", "2 po", "limitado"),
        ("Cristal de foco rachado", "5 po", "raro"),
        ("Lacre contra interferencia arcana", "1 po", "limitado"),
        ("Pergaminho em branco tratado", "7 pp", "comum"),
    ],
    "militar": [
        ("Reparo de armadura leve", "2 po", "por encomenda"),
        ("Flechas, pacote com 20", "1 po", "comum"),
        ("Escudo usado", "4 po", "limitado"),
        ("Treino com veterano, 1 tarde", "1 po", "por favor"),
    ],
}


def fix_mojibake(text):
    if "Ã" not in text and "Â" not in text and "�" not in text:
        return text
    try:
        return text.encode("latin1").decode("utf-8")
    except UnicodeError:
        return text


def strip_tags(text):
    text = re.sub(r"<script[\s\S]*?</script>", " ", text, flags=re.I)
    text = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def read_support(path):
    if not path.exists():
        return ""
    raw = path.read_text(encoding="utf-8", errors="replace")
    if path.suffix.lower() in {".html", ".xhtml"}:
        raw = strip_tags(raw)
    return fix_mojibake(raw)


def parse_divinities(text):
    found = {}
    pattern = re.compile(r"^##\s+(.+?)\s*$", re.M)
    matches = list(pattern.finditer(text))
    for idx, match in enumerate(matches):
        name = match.group(1).strip()
        if name not in DIVINITIES:
            continue
        start = match.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        body = text[start:end]
        found[name] = {
            "domain": find_field(body, "Do que e deus/deusa") or find_field(body, "Do que é deus/deusa"),
            "culture": find_field(body, "Cultura"),
            "people": find_field(body, "Povo ligado"),
            "creatures": find_field(body, "Criaturas associadas"),
            "hooks": re.findall(r"^-\s+(.+)$", body, flags=re.M)[:4],
        }
    return found


def find_field(body, label):
    field = re.search(r"\*\*" + re.escape(label) + r":\*\*\s*(.+)", body)
    return field.group(1).strip() if field else ""


def parse_bestiary(text):
    entries = []
    pattern = re.compile(r"^###\s+\d+\.\s+(.+?)\s*$", re.M)
    matches = list(pattern.finditer(text))
    for idx, match in enumerate(matches):
        name = match.group(1).strip()
        start = match.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        body = text[start:end]
        meta = re.search(r"\*([^*\n]+)\*", body)
        grade = re.search(r"\*\*Grau\*\*\s*([0-9]+)", body)
        hook = re.search(r"\*\*Gancho\.\*\*\s*(.+)", body)
        parts = [part.strip() for part in meta.group(1).split(",")] if meta else []
        entries.append(
            {
                "name": name,
                "type": parts[0] if len(parts) > 0 else "Criatura",
                "source": parts[1] if len(parts) > 1 else "",
                "culture": parts[2] if len(parts) > 2 else "",
                "environment": parts[3] if len(parts) > 3 else "",
                "behavior": parts[4] if len(parts) > 4 else "",
                "grade": grade.group(1) if grade else "?",
                "hook": hook.group(1).strip() if hook else "",
            }
        )
    return entries


def load_supports():
    div_text = read_support(SUPPORTS["divindades"])
    bestiary_text = read_support(SUPPORTS["bestiario"])
    system_text = read_support(SUPPORTS["sistema"])
    return {
        "divinities": parse_divinities(div_text),
        "bestiary": parse_bestiary(bestiary_text),
        "system_loaded": bool(system_text),
        "system_terms": infer_system_terms(system_text),
        "loaded_paths": {key: str(path) for key, path in SUPPORTS.items() if path.exists()},
    }


def infer_system_terms(text):
    terms = []
    for term in ["Forca", "Agilidade", "Vigor", "Intelecto", "Espirito", "Devocao", "Aparar", "PV", "PA", "PE", "PD", "AU"]:
        if term in text or fix_mojibake(term) in text:
            terms.append(term)
    return terms or ["Forca", "Agilidade", "Vigor", "Intelecto", "Espirito", "Devocao", "PV", "Aparar"]


def ask(label, default="crie"):
    value = input(label).strip()
    return value if value else default


def is_blank_choice(value):
    return value.strip().lower() in {"", "crie", "invente", "tanto faz", "qualquer", "aleatorio", "aleatório"}


def normalize_key(value, options, fallback):
    text = value.strip().lower()
    if is_blank_choice(text):
        return fallback
    text = (
        text.replace("ã", "a")
        .replace("á", "a")
        .replace("â", "a")
        .replace("ç", "c")
        .replace("é", "e")
        .replace("ê", "e")
        .replace("í", "i")
        .replace("ó", "o")
        .replace("ô", "o")
        .replace("ú", "u")
    )
    normalized_options = {simple_key(option): option for option in options}
    return normalized_options.get(text, fallback)


def simple_key(value):
    return (
        value.lower()
        .replace("ã", "a")
        .replace("á", "a")
        .replace("â", "a")
        .replace("ç", "c")
        .replace("é", "e")
        .replace("ê", "e")
        .replace("í", "i")
        .replace("ó", "o")
        .replace("ô", "o")
        .replace("ú", "u")
    )


def pick(rng, values):
    return rng.choice(list(values))


def choose_deity(data, rng):
    if not is_blank_choice(data["deity"]):
        wanted = data["deity"].strip().capitalize()
        for deity in DIVINITIES:
            if simple_key(deity) == simple_key(wanted):
                return deity
    joined = " ".join([data["kind"], data["region"], data["race"], data["tone"], data["required"]]).lower()
    if any(word in joined for word in ["floresta", "pantano", "selvagem", "lizard", "fera", "nascente"]):
        return "Natureza"
    if any(word in joined for word in ["cripta", "necropole", "morto", "funer", "ruina"]):
        return "Morte"
    if any(word in joined for word in ["caverna", "subterr", "segredo", "fuga"]):
        return "Sombra"
    if any(word in joined for word in ["lei", "fortaleza", "guarda", "cidade"]):
        return "Ordem"
    if any(word in joined for word in ["praga", "mutacao", "caos", "instavel"]):
        return "Caos"
    if any(word in joined for word in ["demon", "pacto", "medo"]):
        return "Demonio"
    if "templo" in joined or "cura" in joined:
        return "Luz"
    return pick(rng, ["Luz", "Sombra", "Natureza", "Morte", "Ordem"])


def build_name(kind, region, deity, rng, given):
    if not is_blank_choice(given):
        return given
    form = rng.randint(1, 3)
    if form == 1:
        return f"{kind.title()} de {pick(rng, NAME_PARTS['prefix'])} {pick(rng, NAME_PARTS['middle'])}"
    if form == 2:
        return f"{kind.title()} {pick(rng, NAME_PARTS['suffix'])}"
    return f"{kind.title()} de {region.title()} da {deity}"


def select_creatures(region, deity, supports, rng):
    entries = supports["bestiary"]
    if not entries:
        return []
    region_key = simple_key(region)
    deity_key = simple_key(deity)
    scored = []
    for creature in entries:
        blob = " ".join(str(value) for value in creature.values()).lower()
        score = 0
        if region_key in simple_key(blob):
            score += 4
        if deity_key in simple_key(blob):
            score += 3
        if any(word in blob for word in ["guardiao", "predador", "errante", "fanatico"]):
            score += 1
        if score:
            scored.append((score, creature))
    scored.sort(key=lambda item: (-item[0], item[1]["name"]))
    top = [item[1] for item in scored[:8]]
    rng.shuffle(top)
    return top[:4]


def make_leader(kind_info, race, deity, rng):
    title = pick(rng, kind_info["leaders"])
    race_info = RACES[race]
    name = make_person_name(rng, race)
    virtues = ["cauteloso", "carismatico", "severo", "pragmatico", "devoto", "exausto", "calculista"]
    pressure = [
        "precisa manter o local unido apesar de uma escassez crescente",
        "negocia com uma faccao que a populacao despreza",
        "esconde uma culpa antiga para evitar revolta",
        "quer proteger uma pessoa importante a qualquer custo",
        "tem medo de que a divindade local tenha parado de responder",
    ]
    return {
        "name": name,
        "title": title,
        "race": race_info["plural"],
        "profile": f"{pick(rng, virtues)} e conhecido por {pick(rng, race_info['traits'])}",
        "pressure": pick(rng, pressure),
        "public_face": f"recebe visitantes com regras claras e observa quem respeita os costumes de {deity}",
    }


def make_person_name(rng, race):
    starts = {
        "humano": ["Mara", "Tomas", "Iria", "Dario", "Lena", "Bren"],
        "elfo": ["Sael", "Elyra", "Thalen", "Iarel", "Nimue", "Avar"],
        "orc": ["Brakka", "Drog", "Urzha", "Mogren", "Karok", "Shara"],
        "anao": ["Borin", "Hilda", "Durn", "Kara", "Varric", "Marta"],
        "goblin": ["Niki", "Grin", "Pazto", "Ziba", "Trik", "Moxo"],
        "lizardman": ["Sskara", "Vrass", "Tziri", "Makru", "Issak", "Ruksa"],
        "homem-fera": ["Rava", "Khor", "Mina", "Serrak", "Luma", "Vargan"],
    }
    ends = ["", " de Pedra", " do Junco", " Ferrolho", " Vela-Fria", " Trilha-Curta", " da Ponte"]
    return pick(rng, starts[race]) + pick(rng, ends)


def make_npcs(race, deity, rng):
    npcs = []
    used_roles = rng.sample(NPC_ROLES, 4)
    for role in used_roles:
        desire = pick(
            rng,
            [
                "quer que os aventureiros partam antes do proximo ritual",
                "procura alguem capaz de escoltar uma entrega",
                "oferece ajuda, mas cobra um favor social",
                "tem uma prova do segredo local",
                "sabe qual criatura nao deve ser ferida",
                "esta sendo chantageado por uma faccao interna",
            ],
        )
        npcs.append(
            {
                "name": make_person_name(rng, race),
                "role": role,
                "hook": desire,
                "deity_link": f"interpreta {deity} de um jeito que incomoda parte da comunidade",
            }
        )
    return npcs


def make_culture(race, region, deity, supports, rng):
    race_info = RACES[race]
    deity_info = supports["divinities"].get(deity, {})
    customs = rng.sample(race_info["customs"], min(2, len(race_info["customs"])))
    taboo = pick(rng, race_info["taboos"])
    local_law = pick(
        rng,
        [
            "todo visitante deve declarar armas e motivo de viagem",
            "nenhuma criatura sagrada da regiao pode ser morta sem julgamento",
            "dívidas pequenas podem ser pagas com trabalho comunitario",
            "mentiras ditas diante do lider viram assunto publico",
            "forasteiros recebem abrigo por uma noite, mas devem partir ou contribuir depois disso",
        ],
    )
    faith = deity_info.get("culture") or f"A fe em {deity} aparece em ritos domesticos, promessas de estrada e sinais pintados em portas."
    return {
        "identity": f"Comunidade de {race_info['plural']} em ambiente de {region}, marcada por {', '.join(race_info['traits'][:2])}.",
        "architecture": f"Casas e espacos usam {', '.join(race_info['architecture'])}, adaptados a riscos como {pick(rng, REGIONS[region]['hazards'])}.",
        "customs": customs,
        "taboo": taboo,
        "law": local_law,
        "faith": faith,
    }


def make_secret(kind, region, deity, rng, required):
    if not is_blank_choice(required):
        seed = required
    else:
        seed = pick(
            rng,
            [
                "uma criatura associada ao local esta sendo alimentada em segredo",
                "o lider falsificou um pressagio para evitar guerra",
                "o mercado vende um item roubado de um templo rival",
                "a agua ou pedra da regiao guarda uma memoria perigosa",
                "um pacto antigo protege o local, mas cobra uma pessoa por geracao",
                "as ruinas sob o assentamento nao estao vazias",
            ],
        )
    return {
        "surface": f"Moradores dizem que os problemas recentes sao apenas azar comum em {region}.",
        "truth": f"Na verdade, {seed}.",
        "trigger": pick(
            rng,
            [
                "o segredo vem à tona se alguem quebrar um tabu local",
                "uma criatura do bestiario aparece perto de uma pessoa inocente",
                "um NPC importante pede ajuda sem autorizacao do lider",
                "um ritual de {deity} falha diante dos aventureiros",
                "uma compra no mercado revela moeda, marca ou sangue estranho",
            ],
        ).format(deity=deity),
        "cost": pick(
            rng,
            [
                "expor tudo salva vidas, mas destrói a confiança no lider",
                "manter silencio preserva a paz por poucos dias",
                "resolver pela força transforma aliados em inimigos",
                "negociar exige entregar algo que a comunidade considera sagrado",
            ],
        ),
    }


def should_have_market(kind, market_answer, rng):
    if not is_blank_choice(market_answer):
        answer = market_answer.lower()
        return answer.startswith("s") or answer in {"sim", "yes", "y"}
    return PLACE_TYPES[kind]["market"] or rng.random() < 0.25


def make_market(kind, region, race, deity, has_market, rng):
    if not has_market:
        return {
            "seller": "Nao ha mercado formal.",
            "note": "Itens so aparecem por escambo, recompensa ou favor com NPCs locais.",
            "items": [],
        }
    pools = ["basico"]
    if region in {"floresta", "pantano", "montanha", "deserto"}:
        pools.append("selvagem")
    if kind == "templo" or deity in {"Luz", "Morte", "Ordem", "Sombra", "Natureza"}:
        pools.append("sagrado")
    if region == "subterraneo" or kind == "caverna":
        pools.append("subterraneo")
    if region == "linha de forca" or deity == "Caos":
        pools.append("arcano")
    if kind == "fortaleza":
        pools.append("militar")

    items = []
    for pool in pools:
        items.extend(MARKET_ITEMS[pool])
    rng.shuffle(items)
    selected = items[:8]
    seller = pick(
        rng,
        [
            f"banca de {make_person_name(rng, race)}",
            "armazem comunitario",
            "tenda fiscalizada pelo lider",
            "mesa de escambo ao lado do ponto mais movimentado",
        ],
    )
    complication = pick(
        rng,
        [
            "precos sobem 25% para quem desrespeita costumes locais",
            "um item raro so e vendido depois de uma promessa diante da comunidade",
            "o melhor vendedor tambem e informante do lider",
            "metade do estoque foi separado para uma crise que ninguem admite",
        ],
    )
    return {
        "seller": seller,
        "note": f"Mercado {RACES[race]['market']}; {complication}.",
        "items": [{"item": item, "price": price, "availability": availability} for item, price, availability in selected],
    }


def make_description(name, kind, region, race, deity, rng):
    region_info = REGIONS[region]
    place_info = PLACE_TYPES[kind]
    senses = rng.sample(region_info["senses"], min(3, len(region_info["senses"])))
    landmarks = rng.sample(place_info["landmarks"], min(3, len(place_info["landmarks"])))
    arrival = (
        f"{name} surge em ambiente de {region} como se tivesse aprendido a sobreviver antes de aprender a receber visitas. "
        f"O primeiro sinal do lugar e {senses[0]}, seguido por {senses[1]} e por olhares que medem cada arma, simbolo e ferida. "
        f"A presenca de {deity} aparece em pequenos gestos: marcas nas portas, silencio antes de promessas e cuidado com aquilo que nao deve ser desperdicado."
    )
    return {
        "read_aloud": arrival,
        "landmarks": landmarks,
        "first_impressions": [
            f"habitantes {RACES[race]['plural']} observam visitantes antes de oferecer ajuda",
            f"a aproximacao e marcada por {senses[2] if len(senses) > 2 else senses[0]}",
            f"o lugar parece preparado para {pick(rng, REGIONS[region]['hazards'])}",
        ],
    }


def make_fauna_flora(region, creatures, rng):
    region_info = REGIONS[region]
    flora = rng.sample(region_info["flora"], min(4, len(region_info["flora"])))
    fauna = rng.sample(region_info["fauna"], min(4, len(region_info["fauna"])))
    if creatures:
        fauna = list(dict.fromkeys([creature["name"] for creature in creatures[:3]] + fauna))[:5]
    uses = [
        f"{flora[0]} pode render remedio simples, mas perde potencia se colhida sem ferramenta limpa.",
        f"{flora[1]} serve como pista natural: cresce perto de agua, magia ou ossos antigos, conforme o local.",
        f"{fauna[0]} aparece como pressagio para moradores experientes.",
    ]
    return {"flora": flora, "fauna": fauna, "uses": uses}


def make_hooks(name, leader, secret, creatures, rng):
    creature_name = creatures[0]["name"] if creatures else "uma criatura territorial"
    hidden_truth = secret["truth"]
    hidden_truth = re.sub(r"^Na verdade,\s*", "", hidden_truth, flags=re.I)
    return [
        f"{leader['name']} contrata o grupo para resolver ataques de {creature_name} sem revelar que {hidden_truth[0].lower() + hidden_truth[1:]}",
        f"Um NPC importante oferece pagamento ou abrigo se os aventureiros investigarem o ponto mais antigo de {name}.",
        f"Uma faccao rival chega ao local procurando o mesmo segredo que a comunidade tenta manter enterrado.",
        "Se os personagens respeitarem o tabu local, ganham aliados; se ignorarem, o lugar inteiro se fecha contra eles.",
    ]


def build_place(data, supports):
    seed = "|".join(str(value) for value in data.values()).lower()
    rng = random.Random(seed)

    kind = normalize_key(data["kind"], PLACE_TYPES.keys(), pick(rng, PLACE_TYPES.keys()))
    region = normalize_key(data["region"], REGIONS.keys(), pick(rng, REGIONS.keys()))
    race = normalize_key(data["race"], RACES.keys(), pick(rng, RACES.keys()))
    deity = choose_deity({**data, "kind": kind, "region": region, "race": race}, rng)
    name = build_name(kind, region, deity, rng, data["name"])
    has_market = should_have_market(kind, data["market"], rng)

    kind_info = PLACE_TYPES[kind]
    leader = make_leader(kind_info, race, deity, rng)
    npcs = make_npcs(race, deity, rng)
    culture = make_culture(race, region, deity, supports, rng)
    secret = make_secret(kind, region, deity, rng, data["required"])
    creatures = select_creatures(region, deity, supports, rng)
    market = make_market(kind, region, race, deity, has_market, rng)
    description = make_description(name, kind, region, race, deity, rng)
    ecology = make_fauna_flora(region, creatures, rng)
    hooks = make_hooks(name, leader, secret, creatures, rng)

    place = {
        "name": name,
        "kind": kind,
        "continent": location_value(data.get("continent"), "continente indefinido"),
        "geo_region": location_value(data.get("geo_region"), region),
        "empire": location_value(data.get("empire"), "imperio indefinido"),
        "city": location_value(data.get("city"), "cidade indefinida"),
        "region": region,
        "race": race,
        "deity": deity,
        "tone": data["tone"] if not is_blank_choice(data["tone"]) else "fantasia sombria de fronteira",
        "party_level": data["party_level"] if not is_blank_choice(data["party_level"]) else "nivel inicial ou medio",
        "leader": leader,
        "npcs": npcs,
        "culture": culture,
        "secret": secret,
        "market": market,
        "description": description,
        "ecology": ecology,
        "creatures": creatures,
        "hooks": hooks,
        "support_summary": {
            "paths": supports["loaded_paths"],
            "divinity_loaded": deity in supports["divinities"],
            "bestiary_matches": len(creatures),
            "system_terms": supports["system_terms"],
        },
    }
    return place, render_markdown(place, supports)


def render_markdown(place, supports):
    leader = place["leader"]
    deity_info = supports["divinities"].get(place["deity"], {})
    lines = [
        f"# {place['name']}",
        "",
        f"> {place['kind'].title()} em {place['region']} habitada principalmente por {RACES[place['race']]['plural']}. Tom: {place['tone']}.",
        "",
        "## Visao Rapida",
        "",
        f"- **Tipo:** {place['kind']}",
        f"- **Continente:** {place['continent']}",
        f"- **Regiao do mundo:** {place['geo_region']}",
        f"- **Imperio/Reino:** {place['empire']}",
        f"- **Cidade ou base proxima:** {place['city']}",
        f"- **Regiao:** {place['region']}",
        f"- **Povo predominante:** {RACES[place['race']]['plural']}",
        f"- **Divindade ou forca patrona:** {place['deity']}",
        f"- **Nivel sugerido:** {place['party_level']}",
        f"- **Mercado:** {'sim' if place['market']['items'] else 'nao formal'}",
        "",
        "## Descricao Narrativa",
        "",
        place["description"]["read_aloud"],
        "",
        "**Marcos visiveis:**",
    ]
    lines.extend(f"- {item}" for item in place["description"]["landmarks"])
    lines.append("")
    lines.append("**Primeiras impressoes:**")
    lines.extend(f"- {item}" for item in place["description"]["first_impressions"])
    lines.extend(
        [
            "",
            "## Lider Do Local",
            "",
            f"**{leader['name']}**, {leader['title']} entre {leader['race']}.",
            "",
            f"- **Perfil:** {leader['profile']}.",
            f"- **Pressao atual:** {leader['pressure']}.",
            f"- **Como recebe o grupo:** {leader['public_face']}.",
            "",
            "## NPCs Importantes",
            "",
        ]
    )
    for npc in place["npcs"]:
        lines.extend(
            [
                f"### {npc['name']}",
                "",
                f"- **Papel:** {npc['role']}.",
                f"- **Quer:** {npc['hook']}.",
                f"- **Relacao religiosa/cultural:** {npc['deity_link']}.",
                "",
            ]
        )
    culture = place["culture"]
    lines.extend(
        [
            "## Cultura Propria",
            "",
            f"**Identidade:** {culture['identity']}",
            "",
            f"**Arquitetura e espaco:** {culture['architecture']}",
            "",
            "**Costumes marcantes:**",
        ]
    )
    lines.extend(f"- {custom}" for custom in culture["customs"])
    lines.extend(
        [
            "",
            f"**Tabu:** {culture['taboo']}.",
            f"**Lei local:** {culture['law']}.",
            f"**Fe cotidiana:** {culture['faith']}",
            "",
            "## Divindade No Local",
            "",
            f"**Patrono:** {place['deity']}",
            "",
            f"- **Dominio usado:** {deity_info.get('domain') or 'a interpretacao local mistura costume, sobrevivencia e medo respeitoso.'}",
            f"- **Povo ligado segundo o suporte:** {deity_info.get('people') or 'nao especificado no arquivo lido.'}",
            "",
            "## Complicacoes E Segredos",
            "",
            f"- **Problema aparente:** {place['secret']['surface']}",
            f"- **Verdade escondida:** {place['secret']['truth']}",
            f"- **Gatilho em mesa:** {place['secret']['trigger']}",
            f"- **Custo moral:** {place['secret']['cost']}",
            "",
            "## Mercado",
            "",
            f"**Vendedor/estrutura:** {place['market']['seller']}",
            "",
            f"**Observacao:** {place['market']['note']}",
            "",
        ]
    )
    if place["market"]["items"]:
        lines.extend(["| Item | Preco | Disponibilidade |", "|---|---:|---|"])
        for item in place["market"]["items"]:
            lines.append(f"| {item['item']} | {item['price']} | {item['availability']} |")
        lines.append("")
    lines.extend(["## Fauna E Flora", "", "**Flora:**"])
    lines.extend(f"- {item}" for item in place["ecology"]["flora"])
    lines.extend(["", "**Fauna:**"])
    lines.extend(f"- {item}" for item in place["ecology"]["fauna"])
    lines.extend(["", "**Usos em jogo:**"])
    lines.extend(f"- {item}" for item in place["ecology"]["uses"])
    lines.extend(["", "## Encontros E Ameacas Do Bestiario", ""])
    if place["creatures"]:
        for creature in place["creatures"]:
            lines.extend(
                [
                    f"- **{creature['name']}** (Grau {creature['grade']}, {creature['type']}, {creature['environment']}): {creature['hook'] or 'use como pressao ambiental ou encontro social perigoso.'}",
                ]
            )
    else:
        lines.append("- Nenhuma criatura especifica foi encontrada no bestiario para esse ambiente; use a fauna local como ameaca narrativa.")
    lines.extend(["", "## Ganchos De Aventura", ""])
    lines.extend(f"- {hook}" for hook in place["hooks"])
    lines.extend(
        [
            "",
            "## Notas De Uso No Sistema",
            "",
            f"- Use testes com {', '.join(place['support_summary']['system_terms'][:6])} para investigacao, negociacao, travessia e resistencia ambiental.",
            "- Para encontro facil, use uma unica criatura de grau baixo ou um obstaculo social.",
            "- Para encontro dificil, combine criatura, terreno e segredo local em uma mesma cena.",
            "- Respeitar cultura local deve abrir atalhos; violar tabu deve criar custo social antes de virar combate.",
            "",
            "## Suportes Consultados",
            "",
        ]
    )
    for key, path in place["support_summary"]["paths"].items():
        lines.append(f"- **{key}:** `{path}`")
    return "\n".join(lines) + "\n"


def slug(text):
    text = fix_mojibake(str(text)).lower()
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "lugar"


def location_value(value, default):
    if value is None or is_blank_choice(str(value)):
        return default
    return str(value).strip()


def location_folder(value, default):
    return slug(location_value(value, default))


def place_output_dir(place):
    return (
        OUT_DIR
        / location_folder(place["continent"], "continente indefinido")
        / location_folder(place["geo_region"], "regiao indefinida")
        / location_folder(place["empire"], "imperio indefinido")
        / location_folder(place["city"], "cidade indefinida")
        / slug(place["name"])
    )


def rebuild_place_index():
    records = []
    if OUT_DIR.exists():
        for path in sorted(OUT_DIR.rglob("*.json")):
            if path.name == "indice_lugares.json":
                continue
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
            except Exception:
                continue
            if not isinstance(data, dict) or "name" not in data:
                continue
            records.append(
                {
                    "nome": data.get("name", ""),
                    "tipo": data.get("kind", ""),
                    "continente": data.get("continent", "continente indefinido"),
                    "regiao": data.get("geo_region", data.get("region", "regiao indefinida")),
                    "imperio": data.get("empire", "imperio indefinido"),
                    "cidade": data.get("city", "cidade indefinida"),
                    "bioma": data.get("region", ""),
                    "povo": data.get("race", ""),
                    "divindade": data.get("deity", ""),
                    "markdown": str(path.with_suffix(".md")),
                    "html": str(path.with_suffix(".html")),
                    "epub": str(path.with_suffix(".epub")),
                    "json": str(path),
                }
            )
    index_json = OUT_DIR / "indice_lugares.json"
    index_md = OUT_DIR / "indice_lugares.md"
    index_json.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = [
        "# Indice De Lugares",
        "",
        "| Local | Continente | Regiao | Imperio | Cidade | Tipo | Bioma | Arquivo |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for item in records:
        lines.append(
            "| "
            + " | ".join(
                [
                    item["nome"],
                    item["continente"],
                    item["regiao"],
                    item["imperio"],
                    item["cidade"],
                    item["tipo"],
                    item["bioma"],
                    item["markdown"],
                ]
            )
            + " |"
        )
    index_md.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return index_md, index_json


def inline_markdown(text):
    text = escape(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"`(.+?)`", r"<code>\1</code>", text)
    return text


def markdown_to_body(md):
    html = []
    in_ul = False
    in_table = False
    for line in md.splitlines():
        if line.startswith("|") and line.endswith("|"):
            cells = [cell.strip() for cell in line.strip("|").split("|")]
            if set(cells) == {"---"} or all(re.fullmatch(r":?-+:?", cell) for cell in cells):
                continue
            if not in_table:
                html.append("<table>")
                in_table = True
            tag = "th" if all(cell in ["Item", "Preco", "Disponibilidade"] for cell in cells[:3]) else "td"
            html.append("<tr>" + "".join(f"<{tag}>{inline_markdown(cell)}</{tag}>" for cell in cells) + "</tr>")
            continue
        if in_table:
            html.append("</table>")
            in_table = False
        if line.startswith("- "):
            if not in_ul:
                html.append("<ul>")
                in_ul = True
            html.append(f"<li>{inline_markdown(line[2:])}</li>")
            continue
        if in_ul:
            html.append("</ul>")
            in_ul = False
        if not line.strip():
            continue
        if line.startswith("# "):
            html.append(f"<h1>{inline_markdown(line[2:])}</h1>")
        elif line.startswith("## "):
            html.append(f"<h2>{inline_markdown(line[3:])}</h2>")
        elif line.startswith("### "):
            html.append(f"<h3>{inline_markdown(line[4:])}</h3>")
        elif line.startswith("> "):
            html.append(f"<blockquote>{inline_markdown(line[2:])}</blockquote>")
        else:
            html.append(f"<p>{inline_markdown(line)}</p>")
    if in_ul:
        html.append("</ul>")
    if in_table:
        html.append("</table>")
    return "\n".join(html)


def page_stylesheet():
    return """
body {
  color: #241f1f;
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.58;
  margin: 0 auto;
  max-width: 900px;
  padding: 32px 18px 56px;
  background: #f7f4ef;
}
h1, h2, h3 {
  color: #4b151b;
  font-family: Arial, sans-serif;
  line-height: 1.2;
}
h1 { border-bottom: 3px solid #7b2630; padding-bottom: 8px; }
h2 { border-bottom: 1px solid #d6c6b8; margin-top: 34px; padding-bottom: 4px; }
blockquote {
  border-left: 4px solid #7b2630;
  margin: 18px 0;
  padding: 8px 18px;
  background: #fffaf2;
}
table {
  border-collapse: collapse;
  width: 100%;
  margin: 14px 0;
  background: #fffaf2;
}
th, td {
  border: 1px solid #d6c6b8;
  padding: 8px 10px;
  text-align: left;
  vertical-align: top;
}
th { background: #eadfd2; font-family: Arial, sans-serif; }
code { background: #eadfd2; padding: 1px 4px; }
""".strip()


def markdown_to_html(md, title):
    body = markdown_to_body(md)
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{escape(title)}</title>
  <style>
{page_stylesheet()}
  </style>
</head>
<body>
{body}
</body>
</html>
"""


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


def build_epub(title, body, out_path):
    book_id = f"urn:uuid:{uuid.uuid4()}"
    chapter = xhtml_document(title, body)
    nav = xhtml_document(
        "Sumario",
        f'''<nav epub:type="toc" id="toc" xmlns:epub="http://www.idpf.org/2007/ops">
  <h1>Sumario</h1>
  <ol>
    <li><a href="Text/chapter1.xhtml">{escape(title)}</a></li>
  </ol>
</nav>''',
    )
    content_opf = f'''<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">{book_id}</dc:identifier>
    <dc:title>{escape(title)}</dc:title>
    <dc:creator>Mesa RPG</dc:creator>
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
        epub.writestr("OEBPS/nav.xhtml", nav, ZIP_DEFLATED)
        epub.writestr("OEBPS/Styles/style.css", page_stylesheet(), ZIP_DEFLATED)
        epub.writestr("OEBPS/Text/chapter1.xhtml", chapter, ZIP_DEFLATED)


def main():
    print("Agente Criador de Lugares - Sistema Mecanico RPG")
    print("Responda 'crie' para o script inventar.")
    print("")
    supports = load_supports()
    if supports["loaded_paths"]:
        print("Suportes encontrados: " + ", ".join(supports["loaded_paths"].keys()))
    else:
        print("Suportes nao encontrados; usando tabelas internas.")
    print("")

    data = {
        "continent": ask("1. Continente: "),
        "geo_region": ask("2. Regiao do continente: "),
        "empire": ask("3. Imperio/reino/dominio: "),
        "city": ask("4. Cidade ou base proxima: "),
        "name": ask("5. Nome do local: "),
        "kind": ask("6. Tipo (vila, caverna, templo, ruina, cidade, fortaleza, necropole, acampamento): "),
        "region": ask("7. Localizacao/bioma (floresta, pantano, montanha, deserto, subterraneo, cidade, ruina, linha de forca): "),
        "race": ask("8. Raca habitante principal (humano, elfo, orc, anao, goblin, lizardman, homem-fera): "),
        "deity": ask("9. Divindade/forca patrona (Luz, Sombra, Natureza, Morte, Caos, Ordem, Demonio): "),
        "market": ask("10. Tem mercado? (sim, nao ou crie): "),
        "tone": ask("11. Tom desejado: "),
        "party_level": ask("12. Nivel medio do grupo: "),
        "required": ask("13. Algo obrigatorio/segredo desejado: "),
    }

    place, md = build_place(data, supports)
    out_dir = place_output_dir(place)
    out_dir.mkdir(parents=True, exist_ok=True)
    base = slug(place["name"])
    md_path = out_dir / f"{base}.md"
    html_path = out_dir / f"{base}.html"
    json_path = out_dir / f"{base}.json"
    epub_path = out_dir / f"{base}.epub"

    body = markdown_to_body(md)
    md_path.write_text(md, encoding="utf-8")
    html_path.write_text(markdown_to_html(md, place["name"]), encoding="utf-8")
    json_path.write_text(json.dumps(place, ensure_ascii=False, indent=2), encoding="utf-8")
    build_epub(place["name"], body, epub_path)
    index_md, index_json = rebuild_place_index()

    print("")
    print(f"Lugar criado: {place['name']}")
    print(f"Pasta: {out_dir}")
    print(f"Markdown: {md_path}")
    print(f"HTML: {html_path}")
    print(f"JSON: {json_path}")
    print(f"EPUB: {epub_path}")
    print(f"Indice Markdown: {index_md}")
    print(f"Indice JSON: {index_json}")


if __name__ == "__main__":
    main()
