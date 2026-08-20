# Slug-Zuordnung: alt -> neu

Prinzip: alte Slugs bleiben, wo es eine echte 1:1-Entsprechung gibt.
Neue Gruppierung (Leistungen/Branchen als Hubs) wird uebernommen, wo sie
keine alte Entsprechung hat - das war explizit erwuenscht ("branchen/
e-commerce ist eigentlich gut").

| Inhalt                          | Alte URL (steuerberaterin-haan.de)     | Neue URL                          |
|----------------------------------|------------------------------------------|-------------------------------------|
| Start                            | /                                         | /                                    |
| Leistungen (Hub)                 | -                                          | /leistungen/                        |
| Fuer Unternehmer                 | /leistungen/unternehmer                   | /leistungen/unternehmer/            |
| Fuer Privatpersonen              | /leistungen/privatpersonen                | /leistungen/privatpersonen/         |
| Steueroptimierter Vermoegensaufbau | -  (auf alter Seite nicht vorhanden)   | /leistungen/vermoegensaufbau/       |
| Lohnkompetenzzentrum             | -  (auf alter Seite nicht vorhanden)     | /leistungen/lohnkompetenzzentrum/   |
| Digitale Buchhaltung (Service)   | /services/digitale-buchhaltung            | /leistungen/digitale-buchhaltung/ **MUSS NEU GEBAUT WERDEN, Inhalt fehlt noch** |
| Branchen (Hub)                   | -                                          | /branchen/                          |
| E-Commerce                       | /services/e-commerce                      | /branchen/e-commerce/               |
| Handwerk & Bau                   | /services/baugewerbe                      | /branchen/handwerk-bau/             |
| Finanzdienstleister & Versicherer| -  (auf alter Seite nicht vorhanden)     | /branchen/finanzdienstleister/      |
| Kanzlei                          | /kanzlei  (+ /arbeitsweise)               | /kanzlei/                           |
| Karriere                         | /kanzlei (Jobs-Unterseiten)               | /karriere/                          |
| Aktuelles (Hub)                  | -                                          | /aktuelles/                         |
| News                             | /news/                                    | /aktuelles/news/                    |
| Blog                             | -  (neu)                                   | /aktuelles/blog/                    |
| Kontakt                          | -  (Kontaktdaten nur im Footer)           | /kontakt/                           |
| Impressum                        | /impressum                                | /impressum/                         |
| Datenschutz                      | /datenschutz                              | /datenschutz/                       |
| Glossar                          | /glossar                                  | /glossar/  **MUSS NEU GEBAUT WERDEN** |
| Steuerberatung fuer Solingen     | /steuerberatung-fuer-solingen             | /steuerberatung-fuer-solingen/ **MUSS NEU GEBAUT WERDEN** |

## Redirects (301), bei Domain-Umzug oder Relaunch noetig

/arbeitsweise                  -> /kanzlei/
/services/e-commerce           -> /branchen/e-commerce/
/services/baugewerbe           -> /branchen/handwerk-bau/
/news/                         -> /aktuelles/news/
/kanzlei/jobs/*                -> /karriere/

ACHTUNG bei /services/digitale-buchhaltung:
NICHT auf /leistungen/vermoegensaufbau/ umleiten. Der alte Inhalt dort
(DATEV, BAFA-Foerderung, digitale Buchfuehrung) ist inhaltlich etwas
anderes als der neue Vermoegensaufbau-Content. Erst umleiten, wenn
/leistungen/digitale-buchhaltung/ mit eigenem Inhalt existiert.
