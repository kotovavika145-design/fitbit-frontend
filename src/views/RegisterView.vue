<template>
  <div class="login-page">
    <div class="bg-glow"></div>

    <div class="brand">
      <div class="logo-icon">
        <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="8" stroke="#fff" stroke-width="1.5" opacity="0.4"/>
          <circle cx="11" cy="11" r="4" fill="#fff" opacity="0.9"/>
          <path d="M11 1 Q14 6 11 11 Q8 6 11 1Z" fill="#c4b5fd" opacity="0.8"/>
          <path d="M21 11 Q16 14 11 11 Q16 8 21 11Z" fill="#a78bfa" opacity="0.6"/>
        </svg>
      </div>
      <span class="brand-name">LUnara</span>
    </div>

    <p class="tagline">Créer un compte</p>

    <div class="login-box">
      <h2>Inscription</h2>

      <div class="field">
        <label>Prénom</label>
        <input v-model="prenom" type="text" placeholder="ex: Lydia" @keyup.enter="handleRegister"/>
      </div>

      <div class="field">
        <label>Nom</label>
        <input v-model="nom" type="text" placeholder="ex: Dupont" @keyup.enter="handleRegister"/>
      </div>

      <div class="field">
        <label>Adresse email</label>
        <input v-model="email" type="email" placeholder="prenom.nom@etu.u-paris.fr" @keyup.enter="handleRegister"/>
      </div>

      <div class="field">
        <label>Mot de passe</label>
        <input v-model="motDePasse" type="password" placeholder="••••••••" @keyup.enter="handleRegister"/>
      </div>

      <div class="field">
        <label>Profil</label>
        <select v-model="profil">
          <option>Étudiant</option>
          <option>Enseignant</option>
        </select>
      </div>

      <p v-if="erreur" class="erreur">{{ erreur }}</p>
      <p v-if="succes" class="succes">{{ succes }}</p>

      <button class="btn-login" @click="handleRegister">S'inscrire →</button>

      <p style="text-align:center;margin-top:1rem;font-size:.85rem;color:#6b6b85">
        Déjà un compte ? 
        <span style="color:#7c5cfc;cursor:pointer;font-weight:600" @click="router.push('/')">
          Se connecter
        </span>
      </p>
    </div>

    <p class="footer-note">Université Paris Cité · Groupe L2U2</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL

const prenom    = ref('')
const nom       = ref('')
const email     = ref('')
const motDePasse = ref('')
const profil    = ref('Étudiant')
const erreur    = ref('')
const succes    = ref('')

async function handleRegister() {
  erreur.value = ''
  succes.value = ''

  // Vérification des champs
  if (!prenom.value || !nom.value || !email.value || !motDePasse.value) {
    erreur.value = 'Veuillez remplir tous les champs.'
    return
  }

  const emailValide = email.value.endsWith('@etu.u-paris.fr')
                   || email.value.endsWith('@u-paris.fr')
  if (!emailValide) {
    erreur.value = 'Utilisez une adresse Paris Cité (@etu.u-paris.fr ou @u-paris.fr).'
    return
  }

  if (motDePasse.value.length < 6) {
    erreur.value = 'Le mot de passe doit contenir au moins 6 caractères.'
    return
  }

  try {
    const role = profil.value === 'Étudiant' ? 'student' : 'teacher'

    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: motDePasse.value,
        role: role,
        first_name: prenom.value,
        last_name: nom.value
      })
    })

    if (response.status === 409) {
      erreur.value = 'Cet email est déjà utilisé.'
      return
    }

    if (!response.ok) {
      erreur.value = 'Erreur lors de la création du compte.'
      return
    }

    succes.value = 'Compte créé avec succès ! Redirection...'
    setTimeout(() => router.push('/'), 2000)

  } catch (e) {
    erreur.value = 'Impossible de contacter le serveur.'
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0e0e14;
  font-family: 'DM Sans', sans-serif;
  color: #e8e8f0;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.bg-glow {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(124,92,252,0.18) 0%, transparent 70%);
  pointer-events: none;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #3b1f8c, #7c5cfc);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(124,92,252,0.35);
}

.brand-name {
  font-family: 'Syne', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.tagline {
  color: #6b6b85;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.login-box {
  background: #13131c;
  border: 1px solid #2a2a3e;
  border-radius: 20px;
  padding: 2.2rem 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

.login-box h2 {
  font-family: 'Syne', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.field { margin-bottom: 1rem; }

.field label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b6b85;
  margin-bottom: 6px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.field input,
.field select {
  width: 100%;
  background: #0e0e14;
  border: 1px solid #2a2a3e;
  border-radius: 10px;
  padding: 10px 14px;
  color: #e8e8f0;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus,
.field select:focus { border-color: #7c5cfc; }

.field input::placeholder { color: #3a3a52; }
.field select { appearance: none; cursor: pointer; }
.field select option { background: #13131c; }

.erreur {
  font-size: 0.85rem;
  color: #f05364;
  background: rgba(240,83,100,0.08);
  border: 1px solid rgba(240,83,100,0.2);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 0.8rem;
  text-align: center;
}

.succes {
  font-size: 0.85rem;
  color: #00e5a0;
  background: rgba(0,229,160,0.08);
  border: 1px solid rgba(0,229,160,0.2);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 0.8rem;
  text-align: center;
}

.btn-login {
  width: 100%;
  background: linear-gradient(135deg, #7c5cfc, #5a3fbf);
  border: none;
  border-radius: 10px;
  padding: 11px;
  color: #fff;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: transform 0.15s, box-shadow 0.2s;
}

.btn-login:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(124,92,252,0.4);
}

.footer-note {
  margin-top: 2rem;
  font-size: 0.78rem;
  color: #3a3a52;
}
</style>