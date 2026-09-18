"""Build the real catalog from pic/ WhatsApp photos.

- Copies each product's photos to public/products/<slug>-<i>.jpg
- Generates supabase/migrations/0005_real_catalog.sql
  (wipe demo data, add categories, products, galleries, options)

Photo numbers refer to the contact sheets (sheet-01..06), i.e. the
sorted-file order used by scripts/make_sheets.py. Photo #71 (packaging
boxes outdoors) is intentionally excluded.
"""
import os
import shutil

SRC = r"pic/WhatsApp Unknown 2026-09-12 at 23.51.04"
OUT_DIR = r"public/products"
MIG = r"supabase/migrations/0005_real_catalog.sql"
os.makedirs(OUT_DIR, exist_ok=True)

# ---------------------------------------------------------------- options
COLORS_TV = ["Blanc mat", "Chêne clair", "Noyer"]
COLORS_TABLE = ["Blanc", "Chêne", "Noyer"]
COLORS_PLACARD = ["Blanc", "Chêne", "Noyer"]
COLORS_CHAUSSURES = ["Blanc", "Crème", "Chêne clair", "Noyer"]
COLORS_BUFFET = ["Blanc laqué", "Crème", "Chêne", "Noyer"]
COLORS_BUREAU = ["Blanc", "Chêne clair"]
COLORS_AUTRES = ["Blanc", "Chêne clair", "Noyer"]
HANDLES = ["Dorées", "Noires", "Argentées"]
HANDLES_BUFFET = ["Dorées", "Noires"]

def num(name, required=True):
    return {"name": name, "type": "number", "required": required, "values": []}

def sel(name, values, required=True):
    return {"name": name, "type": "select", "required": required, "values": values}

OPT_TV = [num("Largeur (cm)"), sel("Coloris", COLORS_TV), sel("Finition", ["Mat", "Brillant"], False)]
OPT_TABLE = [num("Longueur (cm)"), num("Largeur (cm)"), sel("Coloris", COLORS_TABLE),
             sel("Étagère inférieure", ["Avec étagère", "Sans étagère"], False)]
OPT_PLACARD = [num("Largeur (cm)"), num("Hauteur (cm)"), num("Profondeur (cm)"),
               sel("Coloris", COLORS_PLACARD), sel("Nombre de portes", ["2", "3", "4"]),
               sel("Tiroir inférieur", ["Avec tiroir", "Sans tiroir"], False)]
OPT_CHAUSSURES = [sel("Nombre d'abattants", ["2", "3", "4", "6"]),
                  sel("Coloris", COLORS_CHAUSSURES), sel("Poignées", HANDLES, False)]
OPT_BUFFET = [num("Largeur (cm)"), sel("Coloris", COLORS_BUFFET),
              sel("Poignées", HANDLES_BUFFET, False)]
OPT_BUREAU = [num("Largeur (cm)"), num("Profondeur (cm)"), sel("Coloris", COLORS_BUREAU),
              sel("Nombre de tiroirs", ["Sans tiroir", "2 tiroirs", "3 tiroirs"], False)]
OPT_AUTRES = [num("Hauteur (cm)"), sel("Coloris", COLORS_AUTRES)]

# ------------------------------------------------------------- categories
CATS = {
    "tables":     "a0000000-0000-4000-8000-000000000001",
    "placards":   "a0000000-0000-4000-8000-000000000002",
    "tv":         "a0000000-0000-4000-8000-000000000003",
    "bureaux":    "a0000000-0000-4000-8000-000000000004",
    "autres":     "a0000000-0000-4000-8000-000000000006",
    "chaussures": "a0000000-0000-4000-8000-000000000007",  # new
    "buffets":    "a0000000-0000-4000-8000-000000000008",  # new
}
NEW_CATS = [
    ("a0000000-0000-4000-8000-000000000007", "Meubles à chaussures", "meubles-a-chaussures",
     "Meubles à chaussures abattants et tiroirs, fabriqués sur mesure."),
    ("a0000000-0000-4000-8000-000000000008", "Buffets & commodes", "buffets-commodes",
     "Buffets, commodes et meubles d'entrée pour toutes les pièces."),
]

# --------------------------------------------------------------- products
# (slug, name, description, category_key, options, [photo numbers, first = main])
P = [
    # ---- Meubles TV (12)
    ("meuble-tv-flottant-noyer", "Meuble TV flottant en noyer",
     "Meuble TV suspendu au design épuré en panneaux de noyer, fixations invisibles. "
     "Longueur adaptée à votre mur sur mesure.",
     "tv", OPT_TV, [1]),
    ("meuble-tv-bois-blanc-niches", "Meuble TV bois & blanc à niches",
     "Meuble TV posé combinant façades bois clair et blanc, niches ouvertes pour vos "
     "appareils et rangements fermés.",
     "tv", OPT_TV, [2, 18]),
    ("meuble-tv-flottant-chene-lattes", "Meuble TV flottant chêne à lattes",
     "Suspendu avec façade à lattes verticales en chêne clair, style contemporain et "
     "chaleureux.",
     "tv", OPT_TV, [6]),
    ("meuble-tv-flottant-blanc-3-tiroirs", "Meuble TV flottant blanc 3 tiroirs",
     "Meuble TV suspendu blanc mat avec trois tiroirs sans poignées apparentes, lignes "
     "minimalistes.",
     "tv", OPT_TV, [9]),
    ("meuble-tv-suspendu-noyer-blanc", "Meuble TV suspendu noyer & blanc",
     "Combinaison élégante de noyer et de façades blanches, deux tiroirs et niche "
     "centrale ouverte.",
     "tv", OPT_TV, [13]),
    ("meuble-tv-blanc-bois", "Meuble TV blanc & bois",
     "Meuble TV flottant blanc avec plan supérieur en bois, discret et lumineux.",
     "tv", OPT_TV, [17]),
    ("meuble-tv-scandinave-pieds-bois", "Meuble TV scandinave pieds bois",
     "Meuble TV d'inspiration scandinave, corps blanc et chêne, pieds bois fuselés et "
     "étagères ouvertes.",
     "tv", OPT_TV, [20, 68]),
    ("meuble-tv-chene-naturel", "Meuble TV banc chêne naturel",
     "Petit meuble TV suspendu en chêne clair, format compact pour les petits salons "
     "et chambres.",
     "tv", OPT_TV, [19]),
    ("meuble-tv-flottant-chene-blanc", "Meuble TV flottant chêne & blanc",
     "Meuble TV suspendu mixant tiroirs blancs et niches en chêne, look épuré.",
     "tv", OPT_TV, [25]),
    ("meuble-tv-bas-noyer", "Meuble TV bas noyer",
     "Meuble TV bas en noyer avec tablette ouverte, parfait devant un salon marocain "
     "avec banquettes.",
     "tv", OPT_TV, [27]),
    ("meuble-tv-etageres-laterales-chene", "Meuble TV chêne avec étagères latérales",
     "Ensemble TV en chêne avec colonnes étagères latérales intégrées pour déco et "
     "rangements.",
     "tv", OPT_TV, [42]),
    ("meuble-tv-gris-clair-pieds-bois", "Meuble TV gris clair pieds bois",
     "Meuble TV gris perle et blanc sur pieds bois, style doux et moderne.",
     "tv", OPT_TV, [82]),

    # ---- Tables basses (7)
    ("table-basse-noyer-rectangulaire", "Table basse noyer rectangulaire",
     "Table basse rectangulaire en noyer avec étagère inférieure, finition mate résistante.",
     "tables", OPT_TABLE, [3]),
    ("table-basse-carree-blanche", "Table basse carrée blanche",
     "Petite table basse carrée blanche, idéale pour les salons marocains avec "
     "banquettes.",
     "tables", OPT_TABLE, [4]),
    ("table-basse-noyer-plateau-coulissant", "Table basse noyer à plateau coulissant",
     "Table basse en noyer avec plateau supérieur coulissant : double surface "
     "modulable selon vos besoins.",
     "tables", OPT_TABLE, [5]),
    ("table-basse-noyer-tasseaux", "Table basse noyer à tasseaux",
     "Table basse design en noyer, façade à tasseaux verticaux et plateau trempé.",
     "tables", OPT_TABLE, [10]),
    ("table-basse-blanche-etagere", "Table basse blanche avec étagère",
     "Table basse blanche épurée avec niche inférieure ouverte, très facile à "
     "intégrer.",
     "tables", OPT_TABLE, [11, 12]),
    ("table-basse-blanche-salon", "Table basse blanche pour salon marocain",
     "Table basse carrée blanche robuste, pensée pour les salons marocains "
     "(sedari) — dimensions sur mesure.",
     "tables", OPT_TABLE, [74, 75, 77, 22, 81]),
    ("table-basse-noyer-carree", "Table basse noyer carrée",
     "Table basse carrée en noyer avec étagère intégrée, chaleureuse et solide.",
     "tables", OPT_TABLE, [28, 32, 44, 54]),

    # ---- Placards (4)
    ("placard-2-portes-blanc", "Placard 2 portes blanc",
     "Placard blanc 2 portes avec aménagement intérieur : étagères et tiroir "
     "inclus. Dimensions sur mesure.",
     "placards", OPT_PLACARD, [7]),
    ("armoire-2-portes-tiroirs-blanc", "Armoire 2 portes et tiroirs blanc laqué",
     "Armoire blanche laquée avec poignées dorées, deux portes et tiroirs "
     "inférieurs spacieux.",
     "placards", OPT_PLACARD, [14]),
    ("placard-2-portes-noyer", "Placard 2 portes noyer",
     "Placard en noyer, deux portes avec aménagement étagères intérieur.",
     "placards", OPT_PLACARD, [80]),
    ("armoire-haute-blanc-2-portes", "Armoire haute blanche 2 portes",
     "Armoire de rangement haute en blanc, poignées noires contemporaines, pour "
     "entrée ou cellier.",
     "placards", OPT_PLACARD, [38]),

    # ---- Meubles à chaussures (10)
    ("meuble-chaussures-4-abattants-chene", "Meuble à chaussures 4 abattants chêne",
     "Meuble à chaussures chêne clair avec quatre abattants, capacité environ 16 à "
     "20 paires. Encombrement réduit.",
     "chaussures", OPT_CHAUSSURES, [8, 36]),
    ("meuble-chaussures-6-abattants-chene", "Meuble à chaussures 6 abattants chêne",
     "Grand meuble à chaussures 2×3 abattants en chêne, capacité environ 24 à 30 "
     "paires, façades épurées.",
     "chaussures", OPT_CHAUSSURES, [24, 53, 31, 51]),
    ("meuble-chaussures-3-tiroirs", "Meuble à chaussures 3 tiroirs",
     "Meuble à chaussures trois tiroirs profonds — disponible en noyer, chêne ou "
     "blanc (voir photos).",
     "chaussures", OPT_CHAUSSURES, [33, 46, 34]),
    ("meuble-chaussures-2-portes-tiroir", "Meuble à chaussures 2 portes + tiroir chêne",
     "Meuble à chaussures chêne avec tiroir supérieur et deux portes, poignées "
     "dorées élégantes.",
     "chaussures", OPT_CHAUSSURES, [35, 47]),
    ("meuble-chaussures-4-abattants-noyer", "Meuble à chaussures 4 abattants noyer",
     "Version haute en noyer foncé, quatre abattants pour une grande capacité "
     "dans un faible encombrement.",
     "chaussures", OPT_CHAUSSURES, [41]),
    ("meuble-chaussures-noyer-2-portes-tiroir", "Meuble à chaussures noyer 2 portes + tiroir",
     "Meuble à chaussures noyer avec tiroir supérieur, étagères intérieures "
     "réglables.",
     "chaussures", OPT_CHAUSSURES, [59, 45, 57]),
    ("meuble-chaussures-6-abattants-creme", "Meuble à chaussures 6 abattants crème",
     "Meuble à chaussures crème 2×3 abattants sur pieds, style doux et lumineux.",
     "chaussures", OPT_CHAUSSURES, [58]),
    ("meuble-chaussures-blanc-tiroir", "Meuble à chaussures blanc avec tiroir",
     "Meuble à chaussures blanc, tiroir supérieur et portes avec étagères "
     "internes.",
     "chaussures", OPT_CHAUSSURES, [76, 43]),
    ("meuble-chaussures-6-tiroirs-blanc-chene", "Meuble à chaussures 6 tiroirs blanc & chêne",
     "Meuble à chaussures 3×2 tiroirs, façades blanches et structure chêne.",
     "chaussures", OPT_CHAUSSURES, [78]),
    ("meuble-chaussures-blanc-2-portes-tiroir", "Meuble à chaussures blanc 2 portes + tiroir",
     "Meuble à chaussures compact blanc avec tiroir supérieur et poignées "
     "dorées.",
     "chaussures", OPT_CHAUSSURES, [79]),

    # ---- Buffets & commodes (11)
    ("buffet-blanc-noyer", "Buffet blanc & noyer",
     "Buffet deux corps combinant blanc laqué et noyer, intérieur avec étagères "
     "réglables, poignées dorées.",
     "buffets", OPT_BUFFET, [15]),
    ("commode-4-tiroirs-blanche", "Commode 4 tiroirs blanche",
     "Commode blanche 2×2 tiroirs, poignées dorées, finition laquée douce.",
     "buffets", OPT_BUFFET, [16]),
    ("buffet-chene-blanc-4-portes", "Buffet chêne & blanc 4 portes",
     "Buffet structure chêne et façades blanches, deux tiroirs et rangements "
     "fermés.",
     "buffets", OPT_BUFFET, [26]),
    ("buffet-blanc-plateau-bois", "Buffet blanc plateau bois",
     "Buffet blanc avec plateau en noyer, deux tiroirs et deux portes, très "
     "fonctionnel.",
     "buffets", OPT_BUFFET, [40]),
    ("buffet-creme-1-tiroir-2-portes", "Buffet crème 1 tiroir 2 portes",
     "Buffet crème au doux aspect laqué, poignées dorées — parfait pour entrée "
     "ou salon.",
     "buffets", OPT_BUFFET, [48, 61, 63]),
    ("buffet-blanc-laque-brillant", "Buffet blanc laqué brillant",
     "Buffet deux portes en blanc laqué brillant, finition miroir premium.",
     "buffets", OPT_BUFFET, [49]),
    ("buffet-chene-ouvert", "Buffet chêne étagères ouvertes",
     "Buffet en chêne avec intérieur ouvert étagéré, poignées dorées.",
     "buffets", OPT_BUFFET, [67]),
    ("buffet-blanc-avec-tiroir", "Buffet blanc avec tiroir",
     "Buffet blanc simple et épuré, tiroir supérieur et rangements fermés.",
     "buffets", OPT_BUFFET, [69]),
    ("buffet-chene-2-portes-tiroir", "Buffet chêne 2 portes + tiroir",
     "Buffet chêne clair avec tiroir supérieur, poignées dorées, style "
     "contemporain.",
     "buffets", OPT_BUFFET, [72]),
    ("meuble-entree-suspendu-blanc", "Meuble d'entrée suspendu blanc",
     "Meuble suspendu fixé au mur pour l'entrée : libère le sol et facilite le "
     "nettoyage.",
     "buffets", OPT_BUFFET, [56]),
    ("petit-meuble-blanc-2-portes", "Petit meuble blanc 2 portes",
     "Petit meuble de rangement blanc avec poignées noires, pour entrée, "
     "salle de bain ou chambre.",
     "buffets", OPT_BUFFET, [55]),

    # ---- Bureaux (5)
    ("bureau-chene-120cm", "Bureau chêne 120 cm",
     "Bureau chêne clair 120×73 cm, profondeur 48 à 55 cm, trois tiroirs "
     "(dimensions indicatives, adaptable).",
     "bureaux", OPT_BUREAU, [23]),
    ("bureau-blanc-1m", "Bureau blanc 1 mètre",
     "Bureau blanc compact d'un mètre, idéal pour un espace de travail à "
     "domicile.",
     "bureaux", OPT_BUREAU, [37]),
    ("bureau-chene-100cm", "Bureau chêne 100 cm",
     "Bureau chêne clair 100×50×75 cm, tiroirs intégrés (dimensions "
     "indicatives, adaptable).",
     "bureaux", OPT_BUREAU, [39]),
    ("bureau-chene-blanc-2-tiroirs", "Bureau chêne & blanc 2 tiroirs",
     "Bureau deux tiroirs, corps chêne et façades blanches, passe-câbles "
     "possible.",
     "bureaux", OPT_BUREAU, [50, 52]),
    ("bureau-blanc-caisson", "Bureau blanc avec caisson",
     "Bureau blanc avec caisson trois tiroirs sous plateau.",
     "bureaux", OPT_BUREAU, [73]),

    # ---- Autres (5)
    ("bibliotheque-chene-etroite", "Bibliothèque chêne étroite",
     "Bibliothèque étroite en chêne clair, cinq niches — se glisse dans un "
     "angle ou un couloir.",
     "autres", OPT_AUTRES, [60]),
    ("etagere-blanche-2-colonnes", "Étagère blanche 2 colonnes",
     "Bibliothèque ouverte blanche à deux colonnes, nombreuses niches de rangement.",
     "autres", OPT_AUTRES, [30]),
    ("table-chevet-chene", "Table de chevet chêne 2 tiroirs",
     "Table de chevet en chêne clair avec deux tiroirs, poignées discrètes.",
     "autres", OPT_AUTRES, [64, 65]),
    ("table-chevet-blanc-chene", "Table de chevet blanc & chêne",
     "Table de chevet deux tiroirs combinant blanc et chêne.",
     "autres", OPT_AUTRES, [62]),
    ("cabinet-coin-noyer", "Cabinet d'angle noyer",
     "Cabinet d'angle en noyer au profil incliné élégant, pour décorer et "
     "ranger.",
     "autres", OPT_AUTRES, [21]),
]

def sqlstr(s: str) -> str:
    return "'" + s.replace("'", "''") + "'"

def main() -> None:
    files = sorted(
        f for f in os.listdir(SRC)
        if f.lower().endswith((".jpeg", ".jpg", ".png", ".webp"))
    )
    # copy images + collect gallery rows
    gallery_rows: list[tuple[str, int]] = []  # (url, sort_order) appended per product later
    product_imgs: dict[str, list[str]] = {}
    for slug, _name, _desc, _cat, _opts, nums in P:
        imgs = []
        for i, n in enumerate(nums, start=1):
            src_name = files[n - 1]  # 1-based sheet number
            dst = f"{slug}-{i}.jpg"
            shutil.copyfile(os.path.join(SRC, src_name), os.path.join(OUT_DIR, dst))
            imgs.append(f"/products/{dst}")
        product_imgs[slug] = imgs
    total_imgs = sum(len(v) for v in product_imgs.values())
    print(f"copied {total_imgs} images to {OUT_DIR}")

    # ---------------- generate SQL
    lines: list[str] = []
    lines.append("-- ============================================================")
    lines.append("-- Real catalog generated from business photos (pic/).")
    lines.append("-- Run order: 0001 -> 0002 -> 0003 -> 0004 -> 0005")
    lines.append("-- Wipes ALL demo products and existing orders first!")
    lines.append("-- ============================================================")
    lines.append("")
    lines.append("-- Demo wipe (orders first: FK restrict).")
    lines.append("delete from public.order_options;")
    lines.append("delete from public.orders;")
    lines.append("delete from public.products;")
    lines.append("")
    lines.append("-- Additional categories")
    for cid, name, slug, desc in NEW_CATS:
        lines.append(
            f"insert into public.categories (id, name, slug, description, is_active) values "
            f"('{cid}', {sqlstr(name)}, {sqlstr(slug)}, {sqlstr(desc)}, true) on conflict (slug) do nothing;"
        )
    lines.append("")
    # products
    lines.append("-- Products")
    lines.append("insert into public.products (id, category_id, name, slug, description, main_image_url, is_active) values")
    prod_ids: dict[str, str] = {}
    vals = []
    for idx, (slug, name, desc, cat, _opts, _nums) in enumerate(P, start=1):
        pid = f"d0000000-0000-4000-8000-{idx:012d}"
        prod_ids[slug] = pid
        main = product_imgs[slug][0]
        vals.append(
            f"  ('{pid}', '{CATS[cat]}', {sqlstr(name)}, {sqlstr(slug)}, {sqlstr(desc)}, {sqlstr(main)}, true)"
        )
    lines.append(",\n".join(vals) + "\non conflict (slug) do nothing;")
    lines.append("")
    # galleries
    lines.append("-- Galleries")
    lines.append("insert into public.product_images (product_id, image_url, sort_order) values")
    vals = []
    for slug, _n, _d, _c, _o, _nums in P:
        for order, url in enumerate(product_imgs[slug], start=1):
            vals.append(f"  ('{prod_ids[slug]}', {sqlstr(url)}, {order})")
    lines.append(",\n".join(vals) + ";")
    lines.append("")
    # options + values
    lines.append("-- Options")
    lines.append("insert into public.product_options (id, product_id, name, type, is_required, sort_order) values")
    opt_vals_rows: list[str] = []
    opt_seq = 0
    opt_rows = []
    for slug, _n, _d, _c, opts, _nums in P:
        for oi, o in enumerate(opts, start=1):
            opt_seq += 1
            oid = f"e0000000-0000-4000-8000-{opt_seq:012d}"
            opt_rows.append(
                f"  ('{oid}', '{prod_ids[slug]}', {sqlstr(o['name'])}, {sqlstr(o['type'])}, "
                f"{str(o['required']).lower()}, {oi})"
            )
            for vi, v in enumerate(o["values"], start=1):
                opt_vals_rows.append(f"  ('{oid}', {sqlstr(v)}, {vi})")
    lines.append(",\n".join(opt_rows) + ";")
    lines.append("")
    lines.append("-- Option values")
    lines.append("insert into public.option_values (option_id, value, sort_order) values")
    lines.append(",\n".join(opt_vals_rows) + ";")
    lines.append("")

    with open(MIG, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"wrote {MIG}: {len(P)} products, {opt_seq} options")

if __name__ == "__main__":
    main()
