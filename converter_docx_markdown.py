from pathlib import Path
from zipfile import ZipFile
import re
import xml.etree.ElementTree as ET


DOCX_CANDIDATES = [
    Path("sistema_mecanico_formatado.docx"),
    Path("sistema/mecanicas/sistema_mecanico_formatado.docx"),
    Path("sistema/ebook/sistema_mecanico_formatado.docx"),
]
OUT = Path("sistema/mecanicas/sistema_mecanico_formatado.md")
NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def text_from(node):
    parts = []
    for text in node.findall(".//w:t", NS):
        if text.text:
            parts.append(text.text)
    return "".join(parts).strip()


def clean_line(text):
    text = text.replace("\u00a0", " ").strip()
    text = text.replace("■#", "#")
    text = re.sub(r"\s+", " ", text)
    text = text.replace(" --- ", "\n\n---\n\n")
    return text.strip()


def md_paragraph(node):
    text = clean_line(text_from(node))
    if not text:
        return ""
    if text == "---":
        return "---"
    if text.startswith("PARTE "):
        return f"## {text}"
    if text.startswith("Passo "):
        return f"### {text}"
    if re.match(r"^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 —-]{8,}$", text) and "|" not in text:
        return f"## {text.title()}"
    return text


def escape_cell(text):
    return clean_line(text).replace("|", "\\|")


def md_table(node):
    rows = []
    for row in node.findall(".//w:tr", NS):
        cells = [escape_cell(text_from(cell)) for cell in row.findall("./w:tc", NS)]
        if any(cells):
            rows.append(cells)
    if not rows:
        return ""
    width = max(len(row) for row in rows)
    rows = [row + [""] * (width - len(row)) for row in rows]
    lines = ["| " + " | ".join(rows[0]) + " |"]
    lines.append("| " + " | ".join(["---"] * width) + " |")
    for row in rows[1:]:
        lines.append("| " + " | ".join(row) + " |")
    return "\n".join(lines)


def main():
    docx = next((path for path in DOCX_CANDIDATES if path.exists()), None)
    if not docx:
        raise SystemExit("Arquivo DOCX nao encontrado nos caminhos esperados.")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(docx) as archive:
        xml_bytes = archive.read("word/document.xml")

    root = ET.fromstring(xml_bytes)
    body = root.find("w:body", NS)
    blocks = []

    for child in body:
        tag = child.tag.rsplit("}", 1)[-1]
        if tag == "p":
            block = md_paragraph(child)
        elif tag == "tbl":
            block = md_table(child)
        else:
            block = ""
        if block:
            blocks.append(block)

    content = "# Sistema Mecânico - RPG de Mesa\n\n"
    if blocks and blocks[0].lstrip("# ").lower().startswith("sistema mec"):
        content = ""
    content += "\n\n".join(blocks)
    content = re.sub(r"\n{4,}", "\n\n\n", content).strip() + "\n"
    OUT.write_text(content, encoding="utf-8")
    print(f"Markdown gerado: {OUT} ({len(content)} caracteres)")


if __name__ == "__main__":
    main()
