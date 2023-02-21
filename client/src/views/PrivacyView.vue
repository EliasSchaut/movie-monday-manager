<template>
  <div class="content">
    <div id="impressum">
      <h3>{{ $t('privacy.imprint.title') }}</h3>

      <p>{{ $t('privacy.imprint.declaration') }}</p>
      <p>{{ impressum.name }}</p>

      <p><b>{{ $t('privacy.imprint.contact') }}:</b><br>
        {{ $t('privacy.imprint.email') }}: {{ impressum.email }}<br>
        {{ $t('privacy.imprint.phone') }}: {{ impressum.number }}<br>
      </p>
    </div>

    <div id="privacy">
      <h3>{{ $t('privacy.privacy.title') }}</h3>

      <p><b>{{ $t('privacy.privacy.registration.title') }}</b><br>
        {{ $t('privacy.privacy.registration.body') }}
      </p>

      <p><b>{{ $t('privacy.privacy.access.title') }}</b><br>
        {{ $t('privacy.privacy.access.body') }}
      </p>

      <p><b>{{ $t('privacy.privacy.cookies.title') }}</b><br>
        {{ $t('privacy.privacy.cookies.body') }}
      </p>

      <p><b>{{ $t('privacy.privacy.rights.title') }}</b><br>
        {{ $t('privacy.privacy.rights.body') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
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
})
</script>

<style scoped>
.content {
  margin: 20px;
}
</style>