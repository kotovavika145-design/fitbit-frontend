<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const identifiant = ref('')   
const motDePasse  = ref('')   
const profil      = ref('Étudiant') 
const erreur      = ref('')   

const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL

async function handleLogin() {
  erreur.value = ''

  if (!identifiant.value || !motDePasse.value || !profil.value) {
    erreur.value = 'Veuillez remplir tous les champs.'
    return
  }

  const emailValide = identifiant.value.endsWith('@etu.u-paris.fr')
                   || identifiant.value.endsWith('@u-paris.fr')

  if (!emailValide || motDePasse.value.length < 3) {
    erreur.value = 'Identifiant ou mot de passe incorrect.'
    return
  }

  try {
    const role = profil.value === 'Étudiant' ? 'student' : 'pilot'

    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: identifiant.value,
        password: motDePasse.value
      })
    })

    if (response.status === 401) {
  erreur.value = 'Identifiant ou mot de passe incorrect.'
  return
}

if (!response.ok) {
  erreur.value = 'Erreur de connexion au serveur.'
  return
}

    const user = await response.json()
    localStorage.setItem('lunara_user', JSON.stringify(user))

    if (profil.value === 'Étudiant') {
      router.push('/student')
    } else {
      router.push('/teacher')
    }

  } catch (e) {
    erreur.value = 'Impossible de contacter le serveur.'
  }
}
</script>

<template>
  <!-- Conteneur principal de la page de connexion -->
  <div class="login-page">

    <div class="bg-glow"></div>

    <!-- Logo et nom de l'application -->
    <div class="brand">
      <div class="logo-icon">
        <!-- Logo SVG en forme de lune (identique aux autres interfaces) -->
        <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="8" stroke="#fff" stroke-width="1.5" opacity="0.4"/>
          <circle cx="11" cy="11" r="4" fill="#fff" opacity="0.9"/>
          <path d="M11 1 Q14 6 11 11 Q8 6 11 1Z" fill="#c4b5fd" opacity="0.8"/>
          <path d="M21 11 Q16 14 11 11 Q16 8 21 11Z" fill="#a78bfa" opacity="0.6"/>
        </svg>
      </div>
      <span class="brand-name">LUnara</span>
    </div>

    <p class="tagline">Mesure de charge mentale en éducation</p>

    <!-- Boîte de connexion -->
    <div class="login-box">
      <h2>Connexion</h2>

      <!-- Champ identifiant -->
      <!-- v-model="identifiant" lie cet input à la variable identifiant -->
      <!-- @keyup.enter permet de valider en appuyant sur Entrée -->
      <div class="field">
        <label for="identifiant">Identifiant</label>
        <input
          id="identifiant"
          v-model="identifiant"
          type="email"
          placeholder="prenom.nom@etu.u-paris.fr"
          @keyup.enter="handleLogin"
        />
      </div>

      <!-- Champ mot de passe -->
      <!-- type="password" masque automatiquement les caractères saisis -->
      <div class="field">
        <label for="motDePasse">Mot de passe</label>
        <input
          id="motDePasse"
          v-model="motDePasse"
          type="password"
          placeholder="••••••••••••"
          @keyup.enter="handleLogin"
        />
      </div>

      <!-- Sélection du profil -->
      <!-- v-model="profil" lie le select à la variable profil -->
      <div class="field">
        <label for="profil">Profil</label>
        <select id="profil" v-model="profil">
          <option>Étudiant</option>
          <option>Enseignant</option>
        </select>
      </div>

      <!-- Message d'erreur -->
      <!-- v-if="erreur" : ce bloc n'est affiché que si la variable erreur n'est pas vide -->
      <p v-if="erreur" class="erreur">{{ erreur }}</p>

      <!-- Bouton de connexion -->
      <!-- @click="handleLogin" appelle la fonction handleLogin au clic -->
      <button class="btn-login" @click="handleLogin">
        Se connecter →
      </button>
    </div>

    <!-- Note en bas de page -->
    <p class="footer-note">Université Paris Cité · Groupe L2U2</p>
    <p style="text-align:center;margin-top:1rem;font-size:.85rem;color:#6b6b85">
      Pas encore de compte ? 
      <span 
        style="color:#7c5cfc;cursor:pointer;font-weight:600" 
        @click="router.push('/register')"
      >
        S'inscrire
      </span>
    </p>
  </div>
  
</template>

<style scoped>
/* scoped = ces styles s'appliquent UNIQUEMENT à ce composant, pas aux autres pages */

@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* Page entière : fond sombre centré */
.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;        /* centré horizontalement */
  justify-content: center;    /* centré verticalement */
  background: #0e0e14;
  font-family: 'DM Sans', sans-serif;
  color: #e8e8f0;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* Halo violet décoratif en haut de la page */
.bg-glow {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(124,92,252,0.18) 0%, transparent 70%);
  pointer-events: none; /* le halo ne bloque pas les clics */
}

/* Logo + nom sur la même ligne */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

/* Carré arrondi contenant le SVG lune */
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

/* Nom "LUnara" en grand */
.brand-name {
  font-family: 'Syne', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

/* Sous-titre sous le logo */
.tagline {
  color: #6b6b85;
  font-size: 0.9rem;
  margin-bottom: 2.5rem;
}

/* Carte blanche/sombre contenant le formulaire */
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
  margin-bottom: 1.8rem;
}

/* Groupe label + input */
.field { margin-bottom: 1.1rem; }

.field label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b6b85;
  margin-bottom: 6px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

/* Style commun pour les inputs et le select */
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
  transition: border-color 0.2s; /* animation douce au focus */
}

/* Bordure violette quand le champ est actif */
.field input:focus,
.field select:focus { border-color: #7c5cfc; }

.field input::placeholder { color: #3a3a52; }

.field select { appearance: none; cursor: pointer; }
.field select option { background: #13131c; }

/* Message d'erreur en rouge */
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

/* Bouton de connexion */
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

/* Note en bas de page */
.footer-note {
  margin-top: 2rem;
  font-size: 0.78rem;
  color: #3a3a52;
}
</style>
