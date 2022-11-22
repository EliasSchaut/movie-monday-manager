<template>
  <div class="content">
    <div id="impressum">
      <h3>Impressum</h3>

      <p>Angaben gemäß § 5 TMG</p>
      <p>{{ impressum.name }}</p>

      <p><b>Kontakt:</b><br>
        E-Mail: {{ impressum.email }}<br>
        Telefon: {{ impressum.number }}<br>
      </p>
    </div>

    <div id="privacy">
      <h3>Datenschutzerklärung</h3>

      <p><b>Was passiert mit den Angaben, die ich bei der Registrierung angebe?</b><br>
        Wenn bei der Registrierung auf „Bestätigen“ geklickt wird, werden alle hier gemachten Angaben an eine Datenbank auf einem dedizierten Server von IONOS SE in Frankfurt, Deutschland gesendet und dort spätestens zum Ende des Betreibens dieser Webseite gespeichert.
      </p>

      <p><b>Wer hat Zugriff auf meine Daten und warum?</b><br>
        Zugriff auf alle Angaben hat lediglich der oben genannte betreiber dieser Website.
        Das angegebene Passwort wird nur verschlüsselt gespeichert und kann nicht eingesehen werden.
        Die E-Mail-Adresse wird nur für die Kommunikation mit dem Nutzer verwendet und nicht an Dritte weitergegeben.
        Falls ein Film vorgeschlagen wird, ist der jeweilig angegebene Name des Vorschlagers in der Filmtabelle öffentlich einsehbar!<br>
        Wenn ein Benutzer-Account gelöscht wird, werden alle Daten, die mit diesem Account verknüpft sind, ebenfalls gelöscht.
        Dies beinhaltet auch die Filmvorschläge und Filmwahlen, die der Benutzer gemacht hat.
      </p>

      <p><b>Analytics/Cookies/Externe-Ressourcen u.ä.?</b><br>
        Diese Website verwendet kein analytisches Tracking jeglicher Art.<br>
        Diese Website verwendet Cookies. Das sind kleine Textdateien, die der Webbrowser auf dem Endgerät speichert.
        Cookies helfen dabei, das Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
        Einige Cookies sind “Session-Cookies.” Solche Cookies werden nach Ende der Browser-Sitzung von selbst gelöscht.
        Hingegen bleiben andere Cookies auf Ihrem Endgerät bestehen, bis diese händisch selbst gelöscht werden.
        Solche Cookies helfen bei Rückkehr auf die Website gemachte Einstellungen wiederzuverwenden.
        Mit einem modernen Webbrowser kann das Setzen von Cookies überwacht, einschränkt oder unterbunden werden.
        Viele Webbrowser lassen sich so konfigurieren, dass Cookies mit dem Schließen des Programms von selbst gelöscht werden.
        Die Deaktivierung von Cookies kann eine eingeschränkte Funktionalität der Website zur Folge haben.<br>
      </p>

      <p><b>Was sind meine Rechte?</b><br>
        Nach DSGVO und BDSG kannst du jederzeit Auskunft, Aktualisierung, Sperrung oder Löschung aller deiner Daten verlangen.
        Dein Ansprechpartner hierfür ist der oben genannte Betreiber dieser Webseite.
        Außerdem bin ich verpflichtet, dich an dein Recht zu erinnern, dieser Zustimmung jederzeit zu widersprechen und dich ggf. bei einer Aufsichtsbehörde über mich zu beschweren.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "PrivacyComponent",
  data() {
    return {
      impressum: {
        name: "Elias Lorenz Schaut",
        email: "eschaut@web.de",
        number: "+49 157-51714891",
      }
    }
  }
}
</script>

<style scoped>
.content {
  margin: 20px;
}
</style>