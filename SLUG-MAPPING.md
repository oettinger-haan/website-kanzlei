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

## WIADOK-Integration (Stand: noch nicht umgesetzt, Inhalt fehlt)

Laut Sascha (WIADOK, per Mail) sind zwei Unterseiten der alten Domain im
Einsatz und muessen entweder unter derselben URL weiterlaufen oder per
Redirect abgefangen werden - sonst funktionieren alte/archivierte
Verweise (z. B. aus versendeten Newslettern) nicht mehr:

| WIADOK-Baustein | Alte URL | Inhalt |
|---|---|---|
| Steuernews | /news | ERLEDIGT: liegt jetzt unter /news/ (Top-Level-Route, bewusst NICHT unter /aktuelles/news/ verschachtelt - das gespeicherte WIADOK-Konfig (_confRequestUrl, _teaserLocation) verweist fest auf .../news/, daher exakte URL-Uebernahme statt Redirect-Wette) |
| Dialog (Newsletter + Rueckfrageformular) | /dialog/ | Zwei Funktionen auf einer Seite: Newsletter-Anmeldung UND ein individuelles Rueckfrageformular (URL enthaelt employeeid + article als Parameter - vermutlich WIADOK-seitig dynamisch erzeugt, nicht rein statisch) |

Beispiel-Rueckfrageformular-URL mit Parametern:
/dialog/?form=frage_stellen&employeeid=82388886&article=121198907

STATUS Steuernews (/news/): UMGESETZT. Echtes wiadok-frame-Tag mit den
per DevTools ausgelesenen Live-Werten eingebaut (api-config,
api-client-data, dazugehoeriges CSS-Link-Tag). Ladevorgang haengt am
bestehenden Cookie-Consent-Gate (site.js, template-basierte Variante).

EIGENMAECHTIG ANGEPASST, BITTE MIT SASCHA GEGENCHECKEN:
_teaserLocation stand im Original auf dem WIADOK-eigenen Platzhalter
"https://bitte-aendern.de/" - das kann kein Zufall sein, das ist deren
eigene "TODO"-Markierung. Ich habe das auf
"https://www.steuerberaterin-haan.de/news/" gesetzt (beste Vermutung:
Ziel-URL fuer Artikel-Detailansichten/Weiterlesen-Links), aber das ist
NICHT bestaetigt. Bitte vor Livegang mit Sascha klaeren, wohin
_teaserLocation tatsaechlich zeigen soll.

STATUS Dialog (/dialog/): UMGESETZT. Ein wiadok-frame-Tag deckt BEIDE
Faelle ab (Newsletter-Anmeldung als Default, Rueckfrageformular ueber
?form=frage_stellen&employeeid=...&article=... in der URL) - kein
separater Code noetig, war dieselbe Vermutung wie bei den Steuernews,
diesmal bestaetigt.

WICHTIGER BEFUND, BITTE MIT SASCHA BESPRECHEN:
- Benachrichtigung bei neuer Newsletter-Anmeldung geht an
  sascha.witte@wiadok.de (WIADOK-Mitarbeiter-Adresse), NICHT an eine
  Adresse der Kanzlei. Falls die Kanzlei automatisch informiert werden
  soll, wenn sich jemand anmeldet, muss das separat geklaert werden
  (z. B. eigener Portal-Zugang bei WIADOK, oder Sascha bittet, einen
  Kanzlei-Verteiler mit in die Benachrichtigung aufzunehmen).
- Im selben Konfig-Block steckt ein drittes, ungenutztes Formular
  "kontool_order" mit Zielemail "kanzlei@xyz.de" - sieht nach einem
  nicht fertig eingerichteten WIADOK-Platzhalter aus (aehnlich wie
  "bitte-aendern.de" vorher). Nicht aktiv verlinkt, aber falls WIADOK
  das Formular jemals ueber einen eigenen Link aktiviert, geht die
  Benachrichtigung aktuell ins Leere. Ebenfalls mit Sascha klaeren.

Datenschutzerklaerung wurde entsprechend aktualisiert (Abschnitt
"Newsletter"), Footer-Link "Newsletter" -> /dialog/ ergaenzt.
