[PROJEKTI.md](https://github.com/user-attachments/files/29384879/PROJEKTI.md)
# Okkosen Puutuote Oy — Tarjousjärjestelmä
**Päivitetty:** 2026-06-26

## Stack
- Supabase: `iofjnoxvksbaqorqaydh.supabase.co`
- Anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZmpub3h2a3NiYXFvcnFheWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjYzNjcsImV4cCI6MjA5MTQwMjM2N30.7aYtakimbUHcxyv6Jco2ggt4VdS2F68xydTbi9suAPo`
- GitHub Pages: `otuomo.github.io/hirsi-tarjous/orders/`
- Repo: `github.com/otuomo/hirsi-tarjous`
- Tiedostot GitHubiin: **aina drag & drop** `/orders/`-kansioon

## Yritys
Okkosen Puutuote Oy | Sievintie 149, 85160 Rautio | 0500-360 741 | myynti@okkosenpuutuote.com | www.okkosenpuutuote.com | Y-tunnus: 3579911-5 | Logo: `/orders/okkonenlogopuu.svg`

## Tietokanta

| Taulu | Tila |
|-------|------|
| customers | ✅ valmis, next_customer_number() |
| products | ✅ 136 tuotetta, mallit: simple/cubic, ALV 25.5%, status+varasto_maara+varasto_alaraja lisätty |
| quotes | ✅ sections_json, delivery_type, footer_text, discount_amount, is_template, template_name, delivery_week, prod_täpät |
| quote_items | luotu, ei käytössä (tuleva tilausvaihe) |
| quote_text_templates | ✅ luotu, is_default autolataus |
| todos | ✅ luotu |
| checklists + checklist_items | ✅ luotu |
| absences | ✅ luotu |
| forest_spots + forest_spot_items | ✅ luotu |
| invoice_stage_templates + invoice_items | ✅ luotu |
| reservations / orders / time_tracking / maintenance_log | ei luotu |

Funktiot: `next_customer_number()`, `next_quote_number()` (2026-001 tyyli)
RLS: päällä kaikilla tauluilla, kirjautuneet = täydet oikeudet ✅

## products-taulun tila-sarake
- `active` — näkyy hinnastossa ja tarjouslomakkeella
- `stock_only` — näkyy vain hinnastossa, ei tarjouslomakkeella
- `hidden` — ei näy missään
- `varasto_maara` + `varasto_alaraja` — varastosaldo ja hälytysraja, punaisella kun alittuu

## Sivut

| Sivu | Tila | Kuvaus |
|------|------|--------|
| login.html | ✅ GitHubissa | Kirjautuminen |
| auth-guard.js | ✅ GitHubissa | Suojaus kaikille sivuille |
| asiakkaat.html | ✅ GitHubissa | Asiakashallinta |
| hinnasto.html | ✅ GitHubissa | Tuotteet, status (active/stock_only/hidden), varasto, Vähänä-välilehti |
| tarjous.html | ✅ GitHubissa | Tarjouslomake — stock_only+hidden suodatettu pois hausta |
| tarjoukset.html | ✅ GitHubissa | Listaus, oletuksena Aktiiviset (ei luonnoksia/arkistoa), mallipohjat välilehdellä |
| print_quote.html | ✅ GitHubissa | Tulostus asiakkaalle |
| print_supply.html | ✅ GitHubissa | Sisäinen tarvikkelista tuotannolle |
| pakkauslista.html | ✅ GitHubissa | Pakkauslista, avautuu omaan ikkunaan, teal-teema |
| kalenteri.html | ✅ GitHubissa | Kuukausikalenteri |
| todo.html | ✅ GitHubissa | Tehtävät + listat |
| laskutus.html | ✅ GitHubissa | Kolme maksuvaihetta, eräpäivät |
| metsalog.html | ✅ GitHubissa | Metsäkartta (MML + Esri), puusto per paikka |
| metsalog_kuskit.html | ✅ GitHubissa | Kuljettajien näkymä, salasanasuojattu |

## Tarjouslomake — sarakerakenne
- **Kohde** — vapaa teksti, tulee tulosteeseen (esim. "Hirret", "Kattovasa")
- **Hinnasto** — hakukenttä hinnastosta, tuo hinnan/yksikön, ei tulostu (vain active-tuotteet)
- **Kuvaus** — lisätiedot, tulee tulosteeseen
- Määrä, Yksikkö, à-hinta, Yhteensä

## Hinnoittelu
- **cubic:** `myynti_kuutio = (kuutiohinta + tyosto_kuutio + salvostus_kuutio) × (1 + kate%)` → `hinta_jm = myynti_kuutio × aihio_leveys × aihio_paksuus / 1 000 000`
- **simple:** `hinta = ostohinta × (1 + kate%) × kpl`

## Tuotekoodit kategorioittain
Työ 0–99 | Rak.työ 100–199 | Sahatavara 1000–1999 | Hirret 2000–2999 | Höylätty 3000–3999 | Pienrauta 4000–4999 | Tarvikkeet 5000–5999 | Ovet/ikkunat 6000–6999 | Kattotarvikkeet 7000–7999 | Vakiomallit 9000–9999

## Vakiomallit Supabasessa
- Harjusauna / Täyspohja (is_template=true, status=MODEL) ✅

## TODO
- [ ] Uloskirjautuminen kuntoon
- [ ] tarjoukset.html: mallipohjat kortteina taulukon yläpuolelle
- [ ] tarjous.html: toimitusviikkoselain + poista turhat toimitusasteet
- [ ] Vakiotekstien hallinta (quote_text_templates CRUD)
- [ ] Kadso CSV-tuonti — odottaa Tuomolta nimien täsmäytystä
- [ ] Varastovaraus (reservations-taulu) — esivalmistelu: product_id sections_jsoniin
- [ ] orders-taulu + tilausvirta
