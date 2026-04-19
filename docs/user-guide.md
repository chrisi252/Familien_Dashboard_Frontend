# Benutzerhandbuch — Familiendashboard

Willkommen! Diese Anleitung erklärt, wie du das Familiendashboard als Endnutzer verwendest.

---

## 1. Konten und Rollen

Das Familiendashboard kennt drei Rollen:

| Rolle              | Was du darfst                                                                  |
|--------------------|--------------------------------------------------------------------------------|
| **System-Administrator** | Familien und Benutzerkonten systemweit verwalten.                          |
| **Familien-Administrator** | Widgets aktivieren/deaktivieren, Mitglieder einladen, Berechtigungen pro Widget vergeben, Dashboard-Layout vorgeben. |
| **Nutzer** (z. B. Kind, Au-Pair) | Eigenes Dashboard ansehen, mit freigegebenen Widgets interagieren, persönliches Layout anpassen. |

Deine Rolle siehst du nicht direkt — du merkst sie daran, welche Menüpunkte und Buttons dir angezeigt werden.

---

## 2. Registrieren & Anmelden

1. Öffne die App im Browser.
2. Hast du noch kein Konto? **„Registrieren"** klicken und Benutzername, Vor-/Nachname und Passwort eingeben.
3. Danach landest du auf der **Anmeldeseite**. Melde dich mit Benutzername und Passwort an.
4. Beim ersten Login wirst du zur **Familienauswahl** geleitet:
   - **Familie erstellen** — du wirst automatisch Familien-Administrator.
   - **Familie beitreten** — über einen Einladungs-Code, den dir der Admin gibt.

---

## 3. Das Dashboard

Nach erfolgreicher Anmeldung siehst du dein **Dashboard**. Es besteht aus frei positionierbaren Kacheln („Widgets").

### Widget hinzufügen
1. Oben rechts auf **„+ Neues Widget hinzufügen"** klicken.
2. Ein Seitenmenü öffnet sich mit allen verfügbaren Widgets.
3. Gewünschtes Widget anklicken — es erscheint sofort auf dem Dashboard.

### Widgets verschieben
- **Desktop:** Widget mit der Maus anklicken und an die neue Position ziehen.
- **Mobile / Tablet:** Widget berühren und ziehen.

### Widget-Einstellungen (Zahnrad-Symbol)
Jedes Widget hat oben rechts ein Zahnrad-Icon. Darüber kannst du:
- Die **Breite** (1–5 Spalten, nur Desktop) anpassen.
- Die **Höhe** (1–5 Zeilen) anpassen.
- Das Widget per **Papierkorb** vom Dashboard entfernen (es wird nicht gelöscht, nur ausgeblendet).
- Mit den Pfeilen links/rechts das Widget in der Reihenfolge verschieben.

### Dashboard aktualisieren
Der Button **„↻ Aktualisieren"** lädt alle Widget-Daten vom Server neu.

---

## 4. Die Widgets im Detail

### 📚 Stundenplan-Widget
Zeigt den wöchentlichen Stundenplan für alle Familienmitglieder an.

- **Personen-Tabs oben:** Zwischen Mitgliedern oder „Alle" umschalten.
- **Desktop-Ansicht:** Gesamter Wochenplan als Tabelle (Mo–Fr).
- **Mobile-Ansicht:** Ein Tag gleichzeitig, über Tabs wechseln.
- **Eintrag hinzufügen** *(nur Familien-Admin oder Berechtigte):* Fach, Uhrzeit, Raum, Lehrer, Notiz.
- **Eintrag bearbeiten/löschen:** Stift- bzw. Papierkorb-Icon am jeweiligen Eintrag.
- **Person komplett entfernen:** Mülleimer-Icon neben dem Personen-Tab.

### ☀️ Wetter-Widget
Zeigt das aktuelle Wetter sowie die Vorhersage für die nächsten Tage. Der Standort wird durch die Familien-Konfiguration im Backend festgelegt.

Bei Verbindungsfehlern erscheint ein Hinweis mit „Erneut versuchen"-Button.

### ✅ To-Do-Widget
Gemeinsame Aufgabenliste der Familie.

- **Aufgabe hinzufügen:** Text in das Eingabefeld tippen, **Enter** oder **+** drücken.
- **Erledigt markieren:** Checkbox anklicken.
- **Bearbeiten:** Stift-Icon → Text anpassen → Haken-Icon speichert, X verwirft.
- **Löschen:** Papierkorb-Icon.

Nur berechtigte Nutzer sehen Bearbeitungs-Buttons.

---

## 5. Familien-Administration *(nur Familien-Admin)*

Über den Avatar oben rechts → **„Admin"** öffnet sich der Admin-Bereich mit drei Unterseiten:

### 5.1 Benutzer verwalten (`/familyadmin/editusers`)
- Einladungs-Code der Familie anzeigen und neu generieren.
- Mitgliederliste mit Rollen.
- Rolle eines Mitglieds ändern (Admin ↔ Nutzer).
- Mitglied aus der Familie entfernen.

### 5.2 Widgets verwalten (`/familyadmin/editwidgets`)
- Liste aller für die Familie verfügbaren Widgets.
- Pro Widget: einzelnen Mitgliedern **Lesen** / **Bearbeiten** erlauben oder entziehen.

### 5.3 Dashboard bearbeiten (`/familyadmin/editdashboard`)
- Layout-Vorlage der Familie definieren.

---

## 6. System-Administration *(nur System-Admin)*

Unter `/systemadmin` können System-Admins:
- Alle Familien anzeigen, erstellen oder löschen.
- Alle Benutzerkonten verwalten (aktivieren/deaktivieren, Rollen zuweisen).

---

## 7. Profil & Abmelden

Klick auf den **Avatar oben rechts** öffnet ein Dropdown:
- **Profil** — Profilseite mit Accountdaten und Familien-Mitgliedschaften.
- **Admin** *(nur Admin)* — Schnellzugriff.
- **Abmelden** — Session beenden und zurück zum Login.

---

## 8. Hell- / Dunkel-Modus

Oben links neben dem Dashboard-Titel kannst du zwischen hellem und dunklem Design umschalten. Die Auswahl wird in deinem Browser gespeichert.

---

## 9. Häufige Probleme

| Problem                                         | Lösung                                                                   |
|-------------------------------------------------|--------------------------------------------------------------------------|
| „Keine aktive Familie gefunden"                 | Abmelden und neu anmelden; ggf. Familie beitreten oder erstellen.         |
| Widget zeigt keine Daten                        | Klick auf **„↻ Aktualisieren"**; bei Fortbestehen Backend-Verbindung prüfen. |
| „Session abgelaufen" (Weiterleitung zu Login)   | Erneut anmelden — aus Sicherheitsgründen enden Sessions nach Inaktivität. |
| Buttons (Bearbeiten, Löschen) fehlen            | Deine Rolle erlaubt das nicht — Familien-Admin kontaktieren.              |
| Drag & Drop ruckelt auf dem Smartphone          | Kurz auf das Widget drücken und halten, bevor gezogen wird.               |

---

## 10. Datenschutz & Sicherheit (Kurzfassung)

- Passwörter werden ausschließlich **gehasht** im Backend gespeichert.
- Session-Cookies sind **HttpOnly** — andere Skripte können sie nicht auslesen.
- Änderungsoperationen sind durch einen **CSRF-Token** geschützt.
- Nach einer Abmeldung werden alle Sitzungsdaten im Browser gelöscht.

Bei Fragen oder Fehlern: Issue im Repository eröffnen.
