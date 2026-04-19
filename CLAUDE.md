[CLAUDE.md](https://github.com/user-attachments/files/26870324/CLAUDE.md)
# CLAUDE.md — Okkosen Puutuote Oy tarjousjärjestelmä

Tämä tiedosto antaa Claudelle kontekstin projektista. Lue tämä aina ensin ennen kuin teet mitään.

---

## Projekti lyhyesti

Okkosen Puutuote Oy:lle rakennetaan selainpohjainen tarjousjärjestelmä joka korvaa vanhan Access-tietokannan. Stack: Supabase (tietokanta) + GitHub Pages (frontend). Kustannus ~0 €/kk.

**Yrittäjä:** Tuomo (otuomo @ GitHub)  
**Tyyli:** Rempseä, voi väittää vastaan jos on väärässä. Tuomo on verkkanen — suunnitellaan ensin, tehdään sitten.

---

## Yritystiedot

| Kenttä | Arvo |
|--------|------|
| Nimi | Okkosen Puutuote Oy |
| Osoite | Sievintie 149, 85160 Rautio |
| Puhelin | 0500-360 741 |
| Email | myynti@okkosenpuutuote.com |
| Web | www.okkosenpuutuote.com |
| Y-tunnus | 3579911-5 |
| Logo | `/orders/okkonenlogopuu.svg` |

---

## Tekninen stack

| Asia | Arvo |
|------|------|
| Supabase URL | `https://iofjnoxvksbaqorqaydh.supabase.co` |
| Anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZmpub3h2a3NiYXFvcnFheWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjYzNjcsImV4cCI6MjA5MTQwMjM2N30.7aYtakimbUHcxyv6Jco2ggt4VdS2F68xydTbi9suAPo` |
| Repo | `https://github.com/otuomo/hirsi-tarjous` |
| GitHub Pages | `https://otuomo.github.io/hirsi-tarjous/` |
| Sivut | `/orders/`-kansiossa |

**TÄRKEÄÄ:** Tiedostot GitHubiin **aina drag & drop** — ei copy-pastea, enkoodaus menee rikki!

---

## Tietokanta (Supabase)

### customers ✅ VALMIS
```
id, created_at, name, email, email2, phone, address, city, notes,
customer_number, contact_person, business_id,
billing_address, billing_postal_code, billing_city, billing_country,
ovt_number, is_active
```
- Funktio `next_customer_number()` ✅

### products ✅ VALMIS
```
id, created_at, code, name, unit, price, vat_percent, category, active,
pricing_model, ostohinta, kate_percent, kuutiohinta,
tyosto_kuutio, salvostus_kuutio, leveys, mitta, kpl,
aihio_leveys, aihio_paksuus
```
- 121 tuotetta siirretty Accessista ✅
- Unique constraint: `products_code_unique`
- ALV 25.5% kaikilla
- Hinnoittelumallit: `simple` / `cubic`
- **TÄRKEÄÄ:** Hinnoittelussa käytetään aihiomittoja (aihio_leveys, aihio_paksuus), ei valmismittoja!

### quotes ✅ VALMIS — LAAJENNETTU
```
id, created_at, customer_id, quote_number, valid_until, status, notes,
total_net, total_vat, total_gross, sections_json, delivery_type,
footer_text, discount_amount, is_template, template_name,
delivery_week, prod_tuotannossa, prod_valmis, prod_toimitettu
```
- `delivery_week` — toimitusviikko muodossa `2026-32`
- `prod_tuotannossa`, `prod_valmis`, `prod_toimitettu` — tuotannon etenemistäpät
- Funktio `next_quote_number()` — muoto 2026-001 ✅

### quote_items — luotu, ei aktiivisessa käytössä
### quote_text_templates ✅ luotu, is_default autolataus

### todos ✅ LUOTU
```
id, created_at, user_id, title, notes, due_date, due_time, due_week,
is_shared, is_done, done_at, priority
```
- `priority`: 'high' | 'normal' | 'low'
- `is_shared`: true = näkyy kaikille, false = vain omistajalle
- `due_time` — kellonaika (time-tyyppi)

### absences ✅ LUOTU (ei käytössä kalenterissa — toteutetaan myöhemmin tyoaika.html kautta)
```
id, created_at, user_id, start_date, end_date, type, notes
```

### checklists ✅ LUOTU
```
id, created_at, user_id, name, is_shared
```

### checklist_items ✅ LUOTU
```
id, created_at, checklist_id, text, is_done, sort_order
```
- `checklist_id` viittaa checklists-tauluun, ON DELETE CASCADE

### orders / time_tracking / maintenance_log — ei luotu

**RLS:** päällä kaikilla tauluilla, kirjautuneet = täydet oikeudet ✅

---

## Sivut (kaikki GitHubissa ✅)

| Sivu | Kuvaus |
|------|--------|
| login.html | Kirjautuminen |
| auth-guard.js | Suojaus + sessiokorjaus + uloskirjautumisnappi |
| asiakkaat.html | Asiakashallinta |
| hinnasto.html | Tuotteet, 2 hinnoittelumallia, mobiilikorttinäkymä |
| tarjous.html | Tarjouslomake — asiakas ensin, toimitusviikkoselain, tuotantotäpät |
| tarjoukset.html | Listaus, statukset, mallipohjat välilehdellä, mobiili |
| print_quote.html | Tulostus asiakkaalle — hintasarakkeet nowrap |
| print_supply.html | Sisäinen tarvikkelista |
| kalenteri.html | Kuukausikalenteri — toimitukset + tehtävät oikeille päiville, klikkaus avaa modalin |
| todo.html | Muistilista — tehtävät + listat, muokkaus ✅ |

---

## Hinnoittelulogiikka

### Malli A — cubic (hirret, sahatavara, höylätty)
```
myynti_kuutio = (kuutiohinta + tyosto_kuutio + salvostus_kuutio) × (1 + kate%)
hinta_jm      = myynti_kuutio × aihio_leveys × aihio_paksuus / 1 000 000
```

### Malli B — simple (kaikki muu)
```
hinta = ostohinta × (1 + kate%) × kpl
```

---

## Tuotekoodivälit kategorioittain

| Kategoria | Väli |
|-----------|------|
| Työ | 0–99 |
| Työ, Rakennustyö | 100–199 |
| Sahatavara | 1000–1999 |
| Hirret | 2000–2999 |
| Höylätty | 3000–3999 |
| Pienrauta | 4000–4999 |
| Tarvikkeet | 5000–5999 |
| Ovet ja ikkunat | 6000–6999 |
| Kattotarvikkeet | 7000–7999 |
| Vakiomallit | 9000–9999 |

---

## Tyyli

### Tumma teema (tarjous.html, tarjoukset.html, hinnasto.html, asiakkaat.html)
- Tausta: `#1c1a14`, Paneeli: `#2a2720`
- Pääväri: amber `#d97706`
- Fontit: IBM Plex Sans + IBM Plex Mono
- Mobiili: korttinäkymä alle 640px

### Vaalea teema (kalenteri.html, todo.html)
- Tausta: `#faf7f2`, Paneeli: `#ffffff`, Reunat: `#e0d4c4`
- Sama amber-korostus

---

## Tarjouslogiikka

### Toimitusasteet ✅ KORJATTU
Lopullinen lista: **Hirsitoimitus, Puuosatoimitus, Valmistoimitus**
(Nouto tehtaalta ja Toimitettu poistettu)

### Statukset
`DRAFT` → `IN_PROGRESS` → `QUOTED` → `ORDERED` → `COMPLETED` → `ARCHIVED`
Lisäksi: `MODEL` (mallipohjille, is_template=true)

### Toimitusviikko ✅ KORJATTU
Tallennetaan muodossa `2026-32`. Viikkoselain: kirjoita viikkonumero (esim. "28") → näyttää päivämäärät vierellä, nuolinapit ‹ › selaukseen, vuodenvaihde huomioitu.

### Tuotannon etenemistäpät
Näkyy tarjous.html:ssä kun status on ORDERED tai COMPLETED:
- Tuotannossa / Valmis noutoon/lähetykseen / Toimitettu
Tallentuu automaattisesti heti täppäystä.

### Vakiomallit Supabasessa
- Harjusauna (is_template=true) ✅
- Täyspohja (is_template=true) ✅

---

## auth-guard.js — tärkeää

- Supabase-kirjasto ja auth-guard.js **täytyy olla `<head>`-tagissa**, ei bodyn lopussa
- Kaikki sivut käyttävät `await window._authReady` ennen Supabase-kutsuja
- `_authReady` resolvoituu kun INITIAL_SESSION-event on saatu — estää RLS-blokkauksen
- Sessio cachetetaan `_cachedSession`-muuttujaan, ei kutsuta getSession() joka pyynnöllä
- Uloskirjautumisnappi renderöidään automaattisesti `.header-right`-elementtiin

---

## TODO — Tärkeysjärjestyksessä

### 1. Seuraavaksi
- [ ] **tuotanto.html** — tarjoukset.html-klooni, vain ORDERED+COMPLETED, ei muokkausnappeja. Tuotantoporukalle näkymä tilatuista töistä ja tuotannontäpistä.
- [ ] **Vakiotekstien hallinta** — quote_text_templates CRUD-modaali tarjous.html:ssä

### 2. Odottaa Tuomolta
- [ ] **Kadson nimien täsmäytys hinnastoon** — ilman tätä CSV-tuontia ei voi rakentaa
- [ ] **koneet.html** — onko Accessissa konelista? Jos on, lähetetään se niin siirretään automaattisesti

### 3. Myöhemmin
- [ ] Kadso CSV-tuonti tarjous.html:ään
- [ ] orders-taulu + tilausvirta hyväksytystä tarjouksesta
- [ ] tyoaika.html — työajanseuranta (korvaa myös absences-kalenterimerkinnät)
- [ ] Access-historia import (Laskut1.txt + Myynnit1.txt)
- [ ] Ulkoasun viimeistely (erillinen chat)
- [ ] Roolipohjaiset oikeudet kun tulee lisää käyttäjiä

---

## Muistiinpanot

- Käyttäjiä: Tuomo (omistaja), Sanna (toimisto/vaimo), 2 työntekijää, Ville (ylläpito/kehittäjä)
- GitHub Desktop käytössä — Tuomo mergettää Coden haarat mainiin
- Claude Code käytössä isompiin muutoksiin — CLAUDE.md on Coden kontekstitiedosto
- Supabase ilmainen: 500MB, 2GB kaistaa/kk
- Yritys vaihtoi Tmi → Oy vuodenvaihteessa 2025→2026
- Toimitusviikko muodossa `2026-32` — viikkoselain tehty, ei enää vapaa tekstikenttä
