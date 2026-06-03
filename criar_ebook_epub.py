from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED, ZIP_STORED
from html import escape
import re
import uuid


TITLE = "Sistema Mecânico RPG"
AUTHOR = "Mesa RPG"
OUT = Path("sistema/ebook/Sistema_Mecanico_RPG.epub")
SOURCES = [
    ("Manual do Sistema", Path("sistema/mecanicas/sistema_mecanico_formatado.md")),
    ("Bestiário", Path("sistema/mecanicas/bestiario_sistema.md")),
]


def slug(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "secao"


def inline_md(text):
    text = escape(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<em>\1</em>", text)
    text = re.sub(r"`(.+?)`", r"<code>\1</code>", text)
    return text


def table_to_html(lines):
    rows = []
    for line in lines:
        row = [cell.strip() for cell in line.strip().strip("|").split("|")]
        rows.append(row)
    if len(rows) >= 2 and all(re.fullmatch(r":?-{3,}:?", c.strip()) for c in rows[1]):
        header = rows[0]
        body = rows[2:]
    else:
        header = []
        body = rows
    parts = ["<table>"]
    if header:
        parts.append("<thead><tr>" + "".join(f"<th>{inline_md(c)}</th>" for c in header) + "</tr></thead>")
    if body:
        parts.append("<tbody>")
        for row in body:
            parts.append("<tr>" + "".join(f"<td>{inline_md(c)}</td>" for c in row) + "</tr>")
        parts.append("</tbody>")
    parts.append("</table>")
    return "\n".join(parts)


def markdown_to_body(md):
    lines = md.splitlines()
    html = []
    toc = []
    paragraph = []
    list_items = []
    blockquote = []
    i = 0

    def flush_paragraph():
        if paragraph:
            html.append("<p>" + inline_md(" ".join(paragraph).strip()) + "</p>")
            paragraph.clear()

    def flush_list():
        if list_items:
            html.append("<ul>" + "".join(f"<li>{inline_md(item)}</li>" for item in list_items) + "</ul>")
            list_items.clear()

    def flush_quote():
        if blockquote:
            html.append("<blockquote>" + "".join(f"<p>{inline_md(item)}</p>" for item in blockquote) + "</blockquote>")
            blockquote.clear()

    while i < len(lines):
        raw = lines[i].rstrip()
        line = raw.strip()

        if not line:
            flush_paragraph()
            flush_list()
            flush_quote()
            i += 1
            continue

        if line.startswith("|") and "|" in line[1:]:
            flush_paragraph()
            flush_list()
            flush_quote()
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1
            html.append(table_to_html(table_lines))
            continue

        heading = re.match(r"^(#{1,6})\s+(.+)$", line)
        if heading:
            flush_paragraph()
            flush_list()
            flush_quote()
            level = len(heading.group(1))
            text = heading.group(2).strip()
            ident = slug(text) + "-" + str(len(toc) + 1)
            toc.append((level, text, ident))
            html.append(f'<h{level} id="{ident}">{inline_md(text)}</h{level}>')
            i += 1
            continue

        if line in {"---", "***", "___"}:
            flush_paragraph()
            flush_list()
            flush_quote()
            html.append("<hr />")
            i += 1
            continue

        if line.startswith(">"):
            flush_paragraph()
            flush_list()
            blockquote.append(line.lstrip(">").strip())
            i += 1
            continue

        bullet = re.match(r"^(?:[-*+]|\u2022)\s+(.+)$", line)
        if bullet:
            flush_paragraph()
            flush_quote()
            list_items.append(bullet.group(1).strip())
            i += 1
            continue

        flush_list()
        flush_quote()
        paragraph.append(line)
        i += 1

    flush_paragraph()
    flush_list()
    flush_quote()
    return "\n".join(html), toc


def xhtml_document(title, body):
    return f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="pt-BR">
<head>
  <title>{escape(title)}</title>
  <link rel="stylesheet" type="text/css" href="../Styles/style.css" />
</head>
<body>
{body}
</body>
</html>
'''


def build_epub():
    chapters = []
    all_toc = []
    for index, (title, path) in enumerate(SOURCES, start=1):
        if not path.exists():
            raise SystemExit(f"Arquivo nao encontrado: {path}")
        md = path.read_text(encoding="utf-8")
        body, toc = markdown_to_body(md)
        filename = f"chapter{index}.xhtml"
        chapters.append((title, filename, xhtml_document(title, body)))
        all_toc.append((title, filename, toc))

    book_id = f"urn:uuid:{uuid.uuid4()}"
    manifest_items = "\n".join(
        f'    <item id="chap{i}" href="Text/{filename}" media-type="application/xhtml+xml"/>'
        for i, (_, filename, _) in enumerate(chapters, start=1)
    )
    spine_items = "\n".join(f'    <itemref idref="chap{i}"/>' for i in range(1, len(chapters) + 1))

    content_opf = f'''<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">{book_id}</dc:identifier>
    <dc:title>{escape(TITLE)}</dc:title>
    <dc:creator>{escape(AUTHOR)}</dc:creator>
    <dc:language>pt-BR</dc:language>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="style" href="Styles/style.css" media-type="text/css"/>
{manifest_items}
  </manifest>
  <spine>
{spine_items}
  </spine>
</package>
'''

    nav_items = []
    for title, filename, toc in all_toc:
        nav_items.append(f'<li><a href="Text/{filename}">{escape(title)}</a>')
        section_items = [(level, text, ident) for level, text, ident in toc if level <= 2]
        if section_items:
            nav_items.append("<ol>")
            for _level, text, ident in section_items[:80]:
                nav_items.append(f'<li><a href="Text/{filename}#{ident}">{inline_md(text)}</a></li>')
            nav_items.append("</ol>")
        nav_items.append("</li>")
    nav_xhtml = xhtml_document("Sumário", f'''<nav epub:type="toc" id="toc" xmlns:epub="http://www.idpf.org/2007/ops">
  <h1>Sumário</h1>
  <ol>
    {"".join(nav_items)}
  </ol>
</nav>''')

    container_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
'''

    css = Path("ebook.css").read_text(encoding="utf-8") if Path("ebook.css").exists() else "body{font-family:serif;}"

    if OUT.exists():
        OUT.unlink()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(OUT, "w") as epub:
        epub.writestr("mimetype", "application/epub+zip", compress_type=ZIP_STORED)
        epub.writestr("META-INF/container.xml", container_xml, compress_type=ZIP_DEFLATED)
        epub.writestr("OEBPS/content.opf", content_opf, compress_type=ZIP_DEFLATED)
        epub.writestr("OEBPS/nav.xhtml", nav_xhtml, compress_type=ZIP_DEFLATED)
        epub.writestr("OEBPS/Styles/style.css", css, compress_type=ZIP_DEFLATED)
        for _title, filename, content in chapters:
            epub.writestr(f"OEBPS/Text/{filename}", content, compress_type=ZIP_DEFLATED)

    print(f"EPUB gerado: {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    build_epub()
