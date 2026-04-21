[PROJEKTI.md](https://github.com/user-attachments/files/26939966/PROJEKTI.md)
# Okkosen Puutuote Oy — Tarjousjärjestelmä
**Päivitetty:** 2026-04-21

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
| products | ✅ 121 tuotetta, mallit: simple/cubic, ALV 25.5% |
| quotes | ✅ sections_json, delivery_type, footer_text, discount_amount, is_template, template_name |
| quote_items | luotu, ei käytössä (tuleva tilausvaihe) |
| quote_text_templates | ✅ luotu, is_default autolataus |
| orders / time_tracking / maintenance_log | ei luotu |

Funktiot: `next_customer_number()`, `next_quote_number()` (2026-001 tyyli)
RLS: päällä kaikilla tauluilla, kirjautuneet = täydet oikeudet ✅

## Sivut

| Sivu | Tila | Kuvaus |
|------|------|--------|
| login.html | ✅ GitHubissa | Kirjautuminen |
| auth-guard.js | ✅ GitHubissa | Suojaus kaikille sivuille |
| asiakkaat.html | ✅ GitHubissa | Asiakashallinta |
| hinnasto.html | ✅ GitHubissa | Tuotteet, 2 hinnoittelumallia, CSV-tuonti |
| tarjous.html | ✅ toimitettu | Kohde+Hinnasto+Kuvaus sarakkeet, osiot, statusvalinta, kopiointi |
| tarjoukset.html | ✅ toimitettu | Listaus, statukset, status-dropdown fixed, mallipohjat |
| print_quote.html | ✅ toimitettu | Tulostus asiakkaalle — täpät: rivihinnat / määrä+yksikkö |
| print_supply.html | ✅ toimitettu | Sisäinen tarvikkelista tuotannolle |

## Tarjouslomake — sarakerakenne
- **Kohde** — vapaa teksti, tulee tulosteeseen (esim. "Hirret", "Kattovasa")
- **Hinnasto** — hakukenttä hinnastosta, tuo hinnan/yksikön, ei tulostu
- **Kuvaus** — lisätiedot, tulee tulosteeseen
- Määrä, Yksikkö, à-hinta, Yhteensä

## Tulostusasetukset (print_quote.html)
Täpät tarjous.html:ssä ennen tulostusta:
- ☑ Näytä rivihinnat
- ☑ Näytä määrä ja yksikkö

## Hinnoittelu
- **cubic:** `myynti_kuutio = (kuutiohinta + tyosto_kuutio + salvostus_kuutio) × (1 + kate%)` → `hinta_jm = myynti_kuutio × aihio_leveys × aihio_paksuus / 1 000 000`
- **simple:** `hinta = ostohinta × (1 + kate%) × kpl`

## Tuotekoodit kategorioittain
Työ 0–99 | Rak.työ 100–199 | Sahatavara 1000–1999 | Hirret 2000–2999 | Höylätty 3000–3999 | Pienrauta 4000–4999 | Tarvikkeet 5000–5999 | Ovet/ikkunat 6000–6999 | Kattotarvikkeet 7000–7999 | Vakiomallit 9000–9999

## Vakiomallit Supabasessa
- Harjusauna / Täyspohja (is_template=true, status=MODEL) ✅ — tuotu Accessin Excel-datasta

## TODO
- [ ] Kadso CSV-tuonti — **odottaa Tuomolta:** täsmäävätkö nimikkeet hinnastoon?
- [ ] Vakiotekstien hallinta (quote_text_templates CRUD)
- [ ] tarjoukset.html: mallipohjat omana ryhmänä välilehdellä
- [ ] orders-taulu + tilausvirta hyväksytystä tarjouksesta
- [ ] Ulkoasun viimeistely (erillinen chat)
