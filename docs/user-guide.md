# Benutzerhandbuch — Familiendashboard

Willkommen! Diese Anleitung erklärt, wie du das Familiendashboard als Endnutzer verwendest.

---

## 1. Konten und Rollen

Das Familiendashboard kennt drei Rollen:

| Rolle              | Was du darfst                                                                  |
|--------------------|--------------------------------------------------------------------------------|
| **System-Administrator** | Familien und Benutzerkonten systemweit verwalten.                          |
| **Familien-Administrator** | Widgets aktivieren/deaktivieren, Mitglieder einladen, Berechtigungen pro Widget vergeben, Dashboard-Layout vorgeben. |
| **Nutzer** (z. B. Kind) | Eigenes Dashboard ansehen, mit freigegebenen Widgets interagieren, persönliches Layout anpassen. |

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
Zeigt das aktuelle Wetter. Der Standort wird durch die Familien-Konfiguration im Backend festgelegt.

Bei Verbindungsfehlern erscheint ein Hinweis mit „Erneut versuchen"-Button.

### ✅ To-Do-Widget
Gemeinsame Aufgabenliste der Familie.

- **Aufgabe hinzufügen:** Text in das Eingabefeld tippen, **Enter** oder **+** drücken.
- **Erledigt markieren:** Checkbox anklicken.
- **Bearbeiten:** Stift-Icon → Text anpassen → Haken-Icon speichert, X verwirft.
- **Löschen:** Papierkorb-Icon.

Nur berechtigte Nutzer sehen Bearbeitungs-Buttons.

### 💬 Chat-Widget
Gemeinsamer Familien-Chat für schnelle Kommunikation.

- **Nachricht schreiben:** Text in das Eingabefeld am unteren Rand tippen und **Enter** oder das **Sende-Icon** drücken.
- **Nachrichtenverlauf:** Alle bisherigen Nachrichten sind sichtbar mit Absender und Zeitstempel.
- **Automatisch aktualisiert:** Neue Nachrichten von Familienmitgliedern erscheinen live im Chat.
- **Scrolling:** Bei vielen Nachrichten kann nach oben gescrollt werden, um ältere Einträge zu sehen.

---

## 5. Familien-Administration *(nur Familien-Admin)*

Über den Avatar oben rechts → **„Admin"** öffnet sich der Admin-Bereich mit drei Unterseiten:

### 5.1 Benutzer verwalten 
- Einladungs-Code der Familie anzeigen und neu generieren.
- Mitgliederliste mit Rollen.
- Rolle eines Mitglieds ändern (Admin ↔ Nutzer).
- Mitglied aus der Familie entfernen.

### 5.2 Widgets verwalten 
- Liste aller für die Familie verfügbaren Widgets.
- Pro Widget: einzelnen Mitgliedern **Lesen** / **Bearbeiten** erlauben oder entziehen.

### 5.3 Dashboard bearbeiten 
- Layout-Vorlage der Familie definieren.

---

## 6. System-Administration *(nur System-Admin)*

Unter `/systemadmin` können System-Admins:
- **Alle Familien anzeigen:** Übersicht aller im System registrierten Familien mit deren Mitgliedern.
- **Benutzerkonten verwalten:** Systemweit Benutzer einsehen, bei Bedarf deaktivieren oder Rollen ändern.
- **Systemweite Einstellungen:** Backend-Konfigurationen und globale Parameter anpassen (sofern verfügbar).

*Hinweis:* Der System-Admin hat die höchsten Berechtigungen. Diesen Account sollte daher besonders geschützt werden.

---

## 7. Profil & Accountverwaltung

Klick auf den **Avatar oben rechts** öffnet ein Dropdown:
- **Profil** — Profilseite mit Accountdaten und Familien-Mitgliedschaften.
- **Admin** *(nur Admin)* — Schnellzugriff zur Verwaltung.
- **Abmelden** — Session beenden und zurück zum Login.

### 7.1 Profilseite
Auf deiner Profilseite kannst du:
- Deine **Accountinformationen** einsehen und bearbeiten (Name, E-Mail, falls vorhanden).
- Deine **Familien-Mitgliedschaften** sehen.
- Zur **Familien-Auswahl** zurückkehren (falls mehrere Familien).
- **Passwort ändern** oder **Konto löschen** (je nach System-Konfiguration).

---

## 8. Hell- / Dunkel-Modus

Oben links neben dem Dashboard-Titel kannst du zwischen hellem und dunklem Design umschalten. Die Auswahl wird in deinem Browser gespeichert.

---

## 9. Tastenkombinationen & Shortcuts

| Tastenkombination | Funktion                          |
|-------------------|-----------------------------------|
| **Enter**         | Aufgabe/Nachricht absenden (in To-Do oder Chat) |
| **Escape**        | Modal oder Dialog schließen       |
| **Tab**           | Zur nächsten Schaltfläche navigieren |

---

## 10. Anforderungen & Kompatibilität

### Browser
Die Familien-Dashboard-App läuft auf:
- **Chrome / Chromium** (ab Version 90)
- **Firefox** (ab Version 88)
- **Safari** (ab Version 14)
- **Edge** (ab Version 90)

### Geräte
- **Desktop / Laptop:** Vollständige Funktionalität mit optimalem Layout.
- **Tablet:** Angepasstes Layout, Touch-Gesten für Drag & Drop unterstützt.
- **Smartphone:** Mobile-optimiertes Interface, Landscape- und Portrait-Modus werden unterstützt.

### Internetverbindung
- Eine **stabile, ständige Internetverbindung** wird für optimale Funktion empfohlen.
- Ohne Verbindung können bereits geladene Daten angezeigt werden, neue Daten können aber nicht synchronisiert werden.

---

## 11. Häufige Probleme

| Problem                                         | Lösung                                                                   |
|-------------------------------------------------|--------------------------------------------------------------------------|
| „Keine aktive Familie gefunden"                 | Abmelden und neu anmelden; ggf. Familie beitreten oder erstellen.         |
| Widget zeigt keine Daten                        | Klick auf **„↻ Aktualisieren"**; bei Fortbestehen Backend-Verbindung prüfen. |
| „Session abgelaufen" (Weiterleitung zu Login)   | Erneut anmelden — aus Sicherheitsgründen enden Sessions nach Inaktivität. |
| Buttons (Bearbeiten, Löschen) fehlen            | Deine Rolle erlaubt das nicht — Familien-Admin kontaktieren.              |
| Drag & Drop ruckelt auf dem Smartphone          | Kurz auf das Widget drücken und halten, bevor gezogen wird.               |

---

## 12. Datenschutz & Sicherheit (Kurzfassung)

- Passwörter werden ausschließlich **gehasht** im Backend gespeichert.
- Session-Cookies sind **HttpOnly** — andere Skripte können sie nicht auslesen.
- Änderungsoperationen sind durch einen **CSRF-Token** geschützt.
- Nach einer Abmeldung werden alle Sitzungsdaten im Browser gelöscht.

Bei Fragen oder Fehlern: Issue im Repository eröffnen.
