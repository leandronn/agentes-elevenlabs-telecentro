#!/usr/bin/env python3
"""Process downloaded Avalian HTML for local /avalian/ serving."""
import re
import sys
from pathlib import Path

WORK = Path(__file__).parent
PREFIX = "/avalian"

INTERNAL_PATHS = {
    "": "index.html",
    "/": "index.html",
    "index.html": "index.html",
    "index": "index.html",
    "/index": "index.html",
    "/index.html": "index.html",
    "planes": "planes.html",
    "/planes": "planes.html",
    "planes.html": "planes.html",
    "/planes.html": "planes.html",
    "cartilla": "cartilla.html",
    "/cartilla": "cartilla.html",
    "cartilla.html": "cartilla.html",
    "/cartilla.html": "cartilla.html",
}


def normalize_internal_href(path: str) -> str | None:
    """Return local path if href targets one of our three pages."""
    if not path:
        return None
    p = path.strip()
    if p.startswith("#"):
        return None
    for host in ("https://avalian.com", "http://avalian.com", "https://www.avalian.com", "http://www.avalian.com"):
        if p.startswith(host):
            p = p[len(host) :]
            break
    p = p.split("?")[0].split("#")[0].strip()
    if p in INTERNAL_PATHS:
        return f"{PREFIX}/{INTERNAL_PATHS[p]}"
    return None


def is_external_href(href: str) -> bool:
    if not href or href.startswith("#"):
        return False
    if href.startswith("tel:") or href.startswith("mailto:"):
        return False
    if normalize_internal_href(href):
        return False
    if href.startswith(PREFIX):
        return False
    if href.startswith("/avalian/"):
        return False
    if href.startswith("/assets/") or href.startswith("/uploads/"):
        return False
    if href.startswith("assets/") or href.startswith("uploads/"):
        return False
    return True


def rewrite_asset_url(url: str) -> str:
    u = url.split("?")[0]
    if u.startswith("https://avalian.com"):
        u = u.replace("https://avalian.com", "")
    if u.startswith("http://avalian.com"):
        u = u.replace("http://avalian.com", "")
    if u.startswith("//avalian.com"):
        u = u.replace("//avalian.com", "")
    if u.startswith("/assets/assets/"):
        u = u.replace("/assets/assets/", "/assets/")
    if u.startswith("/assets/"):
        return PREFIX + u
    if u.startswith("/uploads/"):
        return PREFIX + u
    if u.startswith("assets/"):
        return PREFIX + "/" + u
    if u.startswith("uploads/"):
        return PREFIX + "/" + u
    return url


def process_href(match: re.Match) -> str:
    quote = match.group(1)
    href = match.group(2)
    internal = normalize_internal_href(href)
    if internal:
        return f'href={quote}{internal}{quote}'
    if is_external_href(href):
        frag = ""
        if "#" in href:
            frag = href[href.index("#") :]
            if frag == "#":
                frag = ""
        return f'href={quote}#{frag}{quote}' if frag and frag != "#" else f'href={quote}#{quote}'
    if href.startswith("/assets/") or href.startswith("/uploads/"):
        return f'href={quote}{rewrite_asset_url(href)}{quote}'
    return match.group(0)


def process_src(match: re.Match) -> str:
    attr = match.group(1)
    quote = match.group(2)
    src = match.group(3)
    if src.startswith("/assets/") or src.startswith("/uploads/") or "avalian.com" in src:
        new = rewrite_asset_url(src)
        if "?" in src:
            new += "?" + src.split("?", 1)[1]
        return f'{attr}={quote}{new}{quote}'
    return match.group(0)


def process_html(content: str, page_name: str) -> str:
    # Remove analytics / tracking blocks (optional cleanup for static mirror)
    content = re.sub(
        r"\s*<!-- Google Tag Manager-->.*?<!-- End Google Tag Manager -->",
        "",
        content,
        flags=re.DOTALL,
    )
    content = re.sub(
        r"\s*<!-- Google tag \(gtag\.js\) -->.*?<!-- End Google tag \(gtag\.js\) -->",
        "",
        content,
        flags=re.DOTALL,
    )
    content = re.sub(
        r"\s*<!-- Meta Pixel Code -->.*?<!-- End Meta Pixel Code -->",
        "",
        content,
        flags=re.DOTALL,
    )
    content = re.sub(
        r"<!-- Google Tag Manager \(noscript\) -->.*?<!-- End Google Tag Manager \(noscript\) -->",
        "",
        content,
        flags=re.DOTALL,
    )
    content = re.sub(
        r"<script>\s*function trackOutboundLink\(\).*?</script>",
        "",
        content,
        flags=re.DOTALL,
    )

    # Asset paths in link[href] for css (not navigation)
    def fix_link_href(m):
        q, href = m.group(1), m.group(2)
        if href.startswith("/assets/") or href.startswith("/uploads/"):
            nh = rewrite_asset_url(href)
            if "?" in href:
                nh += "?" + href.split("?", 1)[1]
            return f'href={q}{nh}{q}'
        if href.startswith("//maxcdn"):
            return f'href={q}https:{href}{q}'
        return m.group(0)

    content = re.sub(r'href=(["\'])(/assets/[^"\']+)\1', fix_link_href, content)
    content = re.sub(r'href=(["\'])(/uploads/[^"\']+)\1', fix_link_href, content)

    # Navigation and general href
    content = re.sub(r'href=(["\'])([^"\']*)\1', process_href, content)

    # src attributes
    content = re.sub(r'(src)=(["\'])([^"\']+)\2', process_src, content)

    # action attributes on forms
    content = re.sub(
        r'action=(["\'])([^"\']*)\1',
        lambda m: f'action={m.group(1)}#{m.group(1)}' if is_external_href(m.group(2)) else m.group(0),
        content,
    )

    # inline styles with avalian urls
    def fix_style_url(m):
        u = m.group(1)
        if "avalian.com" in u or u.startswith("/assets/") or u.startswith("/uploads/"):
            return f"url({rewrite_asset_url(u)})"
        return m.group(0)

    content = re.sub(
        r"url\((['\"]?)(https://avalian\.com[^)'\"]+|/assets/[^)'\"]+|/uploads/[^)'\"]+)\1?\)",
        lambda m: f"url({rewrite_asset_url(m.group(2))})",
        content,
    )

    # script src for local assets
    content = re.sub(
        r'<script([^>]*)\ssrc=(["\'])(/assets/[^"\']+)\2',
        lambda m: f'<script{m.group(1)} src={m.group(2)}{rewrite_asset_url(m.group(3))}{m.group(2)}',
        content,
    )

    return content


def fix_css_files():
    for css in WORK.rglob("*.css"):
        text = css.read_text(encoding="utf-8", errors="replace")
        orig = text

        def repl(m):
            u = m.group(1).strip("'\"")
            if u.startswith("data:"):
                return m.group(0)
            if u.startswith("../"):
                # resolve relative to css file
                resolved = (css.parent / u).resolve()
                try:
                    rel = resolved.relative_to(WORK.resolve())
                    return f"url({PREFIX}/{rel.as_posix()})"
                except ValueError:
                    pass
            if u.startswith("/assets/"):
                nu = rewrite_asset_url(u)
                return f"url({nu})"
            if "avalian.com" in u:
                path = u.split("avalian.com", 1)[-1]
                return f"url({PREFIX}{path})"
            return m.group(0)

        text = re.sub(r"url\(([^)]+)\)", repl, text)
        if text != orig:
            css.write_text(text, encoding="utf-8")


def main():
    pages = [
        ("/tmp/avalian-home.html", "index.html"),
        ("/tmp/avalian-planes.html", "planes.html"),
        ("/tmp/avalian-cartilla.html", "cartilla.html"),
    ]
    fix_css_files()
    for src, dest in pages:
        raw = Path(src).read_bytes()
        try:
            content = raw.decode("utf-8")
        except UnicodeDecodeError:
            content = raw.decode("latin-1")
        out = process_html(content, dest)
        out = out.replace('var BASE_URL = "https://avalian.com/";', 'var BASE_URL = "/avalian/";')
        (WORK / dest).write_text(out, encoding="utf-8")
        print(f"Wrote {dest} ({len(out)} bytes)")


if __name__ == "__main__":
    main()
