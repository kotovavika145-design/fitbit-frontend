<template>
  <!-- ══════════════════════ STUDENT APP ══════════════════════ -->
  <div id="studentApp" class="app-layout" style="display: flex;">
    
    <!-- ================= SIDEBAR ================= -->
    <aside class="sidebar">
 
      <!-- Logo LUnara  -->
      <div class="sidebar-logo">
        <div class="mark">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#fff" stroke-width="1.5" opacity="0.4"/>
            <circle cx="11" cy="11" r="4" fill="#fff" opacity="0.9"/>
            <path d="M11 1 Q14 6 11 11 Q8 6 11 1Z" fill="#c4b5fd" opacity="0.8"/>
            <path d="M21 11 Q16 14 11 11 Q16 8 21 11Z" fill="#a78bfa" opacity="0.6"/>
          </svg>
        </div>
        <span>LUnara</span>
      </div>
 
      <div class="nav-section">Navigation</div>
 
      <!-- Navigation : :class active sur l'item sélectionné, @click change de page -->
      <div 
        class="nav-item" 
        :class="{ active: activePage==='s-session' }" 
        @click="showPage('s-session')"
      >
        <span class="ico">⚡</span> Session en cours
      </div>
      <div 
        class="nav-item" 
        :class="{ active: activePage==='s-questionnaire' }" 
        @click="showPage('s-questionnaire')"
      >
        <span class="ico">📋</span> Questionnaire
      </div>
      <div 
        class="nav-item" 
        :class="{ active: activePage==='s-results' }" 
        @click="showPage('s-results')"
      >
        <span class="ico">📊</span> Mes résultats
      </div>
      <div 
        class="nav-item" 
        :class="{ active: activePage==='s-history' }" 
        @click="showPage('s-history')"
      >
        <span class="ico">📁</span> Historique
      </div>
 
      <!-- Informations de l'étudiant -->
      <!-- TODO (synchro backend) : remplacer par les vraies infos de l'utilisateur connecté -->
      <div class="sidebar-bottom">
        <div class="user-chip">
          <div class="avatar" style="background:rgba(168,85,247,.2);color:var(--accent)">
            {{ userConnecte.email ? userConnecte.email.substring(0,2).toUpperCase() : 'IL' }}
          </div>  
          <div class="info">
            <div class="name">{{ userConnecte.email|| 'Étudiant' }}</div>
            <div class="role">Étudiante</div>
          </div>
          <span style="cursor:pointer;color:var(--muted);font-size:.9rem" @click="logout">⏏</span>
        </div>
      </div>
    </aside>
 
    <!-- ================= MAIN ================= -->
    <main class="main">
      
      <!-- ================= PAGE: SESSION EN COURS ================= -->
      <div id="s-session" class="page" v-show="activePage==='s-session'">
        <div class="page-header">
          <div>
            <h1>{{ sessionName }}</h1>
            <!--
              TODO (synchro backend) : remplacer par les vraies infos de session
              reçues du serveur quand l'enseignant lance la session.
            -->
            <p>{{ sessionGroup || 'Session en cours' }}</p>
          </div>
          <!-- Display flex pour aligner les boutons horizontalement -->
          <div style="display:flex;gap:.7rem">
            <!-- Bouton pause : bascule entre pause et reprise -->
            <button class="btn-outline" @click="togglePause">
              {{ isPaused ? '▶ Reprendre' : '⏸ Pause' }}
            </button>
            <!-- Bouton terminer : arrête le timer et redirige vers le questionnaire -->
            <button class="btn-sm" style="background:linear-gradient(135deg,#ff5757,#c93c3c)" @click="terminerSession">■ Terminer</button>
          </div>
        </div>
 
        <!-- Barre de session -->
        <div class="session-bar">
   
          <!-- Temps écoulé : formattedTime est une computed property (mm:ss) -->
          <div>
            <div class="s-label">Temps écoulé</div>
            <div class="timer">{{ formattedTime }}</div>
          </div>
 
          <div class="divider"></div>
 
          <!--
            Durée prévue de la session
            MODIFIÉ : suppression de l'input paramétrable (l'étudiant ne doit pas
            pouvoir modifier la durée, elle vient du prof)
            TODO (synchro backend) : remplacer sessionDuration par la valeur
            reçue du serveur lors du lancement de session par l'enseignant.
          -->
          <div>
            <div class="s-label">Durée prévue</div>
            <div class="s-value">{{ sessionDuration }}</div>
          </div>
 
          <div class="divider"></div>
 
          <!-- Progression : calculée automatiquement par progressPercent -->
          <div class="progress-container" style="flex:1">
            <div class="s-label">Progression</div>
            <div class="progress-track">
              <!--
                TODO (synchro backend) : progressPercent sera calculé à partir
                du temps écoulé / durée reçue du serveur.
              -->
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>
 
        </div>
 
        <!-- Statut Fitbit -->
        <!--
          TODO (synchro backend) : afficher le vrai statut de connexion Fitbit.
          Ex: <span class="badge" :class="fitbitConnected ? 'live' : 'high'">...</span>
        -->
        <span class="badge" :class="fitbitConnecte ? 'live' : 'high'">
           {{ fitbitConnecte ? '✓ Connecté' : '⚠ Non connecté' }}
          </span>
        <button v-if="!fitbitConnecte" class="btn-outline" @click="lancerOAuthFitbit" style="margin-left:.5rem">
        Connecter Fitbit
        </button>
 
        <!-- Affichage des paramètres physiologiques -->
        <!--
          TODO (synchro backend) : remplacer les valeurs fixes par des données
          reçues en temps réel depuis l'API Fitbit via le backend.
        -->
        <div class="grid-4">
          <div class="card">
            <div class="card-header"><span class="card-title">Charge mentale</span><span class="badge mid">Modérée</span></div>
            <div class="card-value" style="color:var(--warn)">{{ chargeMentale ?? '-'}}</div>
            <div class="card-sub">Score sur 100</div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">Fréq. cardiaque</span><span style="font-size:.8rem;color:var(--muted)">bpm</span></div>
            <div class="card-value">{{ heartRate ?? '-' }}</div>
            <div class="card-sub">Repos moyen: 65 bpm</div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">HRV</span><span style="font-size:.8rem;color:var(--muted)">ms</span></div>
            <div class="card-value" style="color:var(--accent2)">{{ hrv ?? '-'}}</div>
            <div class="card-sub">Variabilité cardiaque</div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">Fréq. resp.</span><span style="font-size:.8rem;color:var(--muted)">rpm</span></div>
            <div class="card-value">{{ breathingRate ?? '-'}}</div>
            <div class="card-sub">Respirations/min</div>
          </div>
        </div>
 
        <!-- Graphes -->
        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span class="card-title">Évolution de la charge mentale</span>
              <span><span class="live-dot"></span><span style="font-size:.78rem;color:var(--accent)">Temps réel</span></span>
            </div>
            <svg class="chart-area" viewBox="0 0 500 160" preserveAspectRatio="none">
            <defs>
             <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stop-color="#ffb547" stop-opacity=".25"/>
                 <stop offset="100%" stop-color="#ffb547" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <!-- Zone remplie dynamique, affichée seulement si assez de points -->
            <path v-if="pathCharge" :d="pathChargeZone" fill="url(#g1)"/>
            <!-- Courbe dynamique -->
             <path v-if="pathCharge" :d="pathCharge" fill="none" stroke="#ffb547" stroke-width="2.5" stroke-linecap="round"/>
             <!-- Message si pas encore de données -->
             <text v-if="!pathCharge" x="250" y="85" text-anchor="middle" font-size="12" fill="#6b7f9e" font-family="DM Sans">
             En attente des données Fitbit...
            </text>
            <text x="0" y="155" font-size="11" fill="#6b7f9e" font-family="DM Sans">0:00</text>
            <text x="470" y="155" font-size="11" fill="#6b7f9e" font-family="DM Sans">{{ formattedTime }}</text>
            </svg>


          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">Fréquence cardiaque</span></div>
            <svg class="chart-area" viewBox="0 0 500 160" preserveAspectRatio="none">
  <defs>
    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#a855f7" stop-opacity=".2"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Zone remplie dynamique -->
  <path v-if="pathFC" :d="pathFCZone" fill="url(#g2)"/>
  <!-- Courbe dynamique -->
  <path v-if="pathFC" :d="pathFC" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Message si pas encore de données -->
  <text v-if="!pathFC" x="250" y="85" text-anchor="middle" font-size="12" fill="#6b7f9e" font-family="DM Sans">
    En attente des données Fitbit...
  </text>
  <!-- Min/Max dynamiques -->
  <text v-if="fcMax" x="4" y="15" font-size="10" fill="#6b7f9e" font-family="DM Sans">{{ fcMax }} bpm</text>
  <text v-if="fcMin" x="4" y="155" font-size="10" fill="#6b7f9e" font-family="DM Sans">{{ fcMin }} bpm</text>
</svg>

          </div>
        </div>
      </div>
 
      <!-- ================= PAGE: QUESTIONNAIRE ================= -->
      <div id="s-questionnaire" class="page" v-show="activePage==='s-questionnaire'">
        <!-- Header de la page -->
        <div class="page-header">
          <div>
            <h1>Questionnaire NASA-TLX Raw</h1>
            <p>Évaluez votre charge mentale sur chaque dimension (0 = très faible, 100 = très élevé)</p>
          </div>
          <div><span class="badge live">{{ questionnaireMoment === 'start' ? 'Début de session' : 'Fin de session' }}</span></div></div>
 
        <!--
          Utilisation de CSS Grid pour avoir deux colonnes :
          Colonne gauche (1.4fr) → carte questionnaire avec les dimensions et inputs.
          Colonne droite (1fr) → carte graphique (donut SVG).
          gap:1.5rem → espace entre les colonnes
        -->
        <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:1.5rem">
          
          <!-- Carte du questionnaire -->
          <div class="card">
            <div style="margin-bottom:1.5rem">
              <span style="font-size:.75rem;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;">
                6 dimensions · Échelle 0–100
              </span>
            </div>
 
            <!-- Boucle sur les dimensions NASA-TLX -->
            <div class="tlx-dimension" v-for="(dim, index) in dimensions" :key="index">
 
              <!-- Label + valeur courante -->
              <div class="tlx-header">
                <span class="tlx-label">{{ dim.label }}</span>
                <span class="tlx-val">{{ dim.value }}</span>
              </div>
 
              <!-- Barre de progression (taille proportionnelle à la valeur saisie) -->
              <div class="tlx-track">
                <div class="tlx-fill" :style="{width: dim.value+'%', background: dim.color}"></div>
              </div>
 
              <!-- Description optionnelle de la dimension -->
              <div v-if="dim.desc" style="font-size:.75rem;color:var(--muted);margin-top:.3rem">
                {{ dim.desc }}
              </div>
 
              <!-- Input utilisateur : v-model.number lie l'input à dim.value en nombre -->
              <input type="number" v-model.number="dim.value" min="0" max="100"
                     style="margin-top:.5rem;width:100%;padding:.4rem .7rem;
                            background:var(--surface2);border:1px solid var(--border);
                            border-radius:6px;color:var(--text);font-family:'DM Sans',sans-serif;
                            font-size:.9rem;outline:none;" />
            </div>
 
            <!-- Score moyen calculé automatiquement depuis les dimensions -->
            <div style="margin-top:1.8rem;padding-top:1.2rem;border-top:1px solid var(--border);
                        display:flex;align-items:center;justify-content:space-between">
              <div>
                <div style="font-size:.78rem;color:var(--muted)">Score moyen NASA-TLX</div>
                <div style="font-family:'Syne',sans-serif;font-size:1.8rem;font-weight:800;color:var(--warn)">
                  {{ averageScore.toFixed(1) }} 
                  <span style="font-size:.9rem;font-weight:400;color:var(--muted)">/100</span>
                </div>
              </div>
              <!--
                MODIFIÉ : appelle validerQuestionnaire() au lieu de showPage directement
                pour sauvegarder le score avant de changer de page
              -->
              <button class="btn-sm" @click="validerQuestionnaire">{{ questionnaireMoment === 'start' ? 'Valider & commencer la session →' : 'Valider & voir les résultats →' }}</button>
            </div>
          </div>
 
          <!-- Carte graphique (donut SVG) -->
          <div style="display:flex;flex-direction:column;gap:1.2rem">
            <div class="card">
              <div class="card-title" style="margin-bottom:1rem">Répartition des dimensions</div>
              <svg viewBox="0 0 200 200" style="width:100%;max-width:180px;display:block;margin:0 auto">
                <circle cx="100" cy="100" r="70" fill="none" stroke="var(--surface2)" stroke-width="14"/>
                <!-- v-for affiche un arc pour chaque dimension -->
                <circle v-for="(dim, i) in dimensions" :key="i"
                        cx="100" cy="100" r="70" fill="none"
                        :stroke="dim.color" stroke-width="14"
                        :stroke-dasharray="Math.min(dim.value,100)*2.2 + ' ' + (220-Math.min(dim.value,100)*2.2)"
                        :stroke-dashoffset="calculateOffset(i)"
                        stroke-linecap="round"/>
                <!-- Score moyen affiché au centre du donut -->
                <text x="100" y="105" text-anchor="middle" font-family="Syne,sans-serif"
                      font-size="22" font-weight="800" fill="white">{{ averageScore.toFixed(0) }}</text>
                <text x="100" y="125" text-anchor="middle" font-family="DM Sans,sans-serif"
                      font-size="11" fill="#6b7f9e">/ 100</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
 
      <!-- ================= PAGE: RÉSULTATS ================= -->
      <!--
        MODIFIÉ : les valeurs ne sont plus codées en dur.
        Le score NASA-TLX vient directement du questionnaire rempli par l'étudiant.
        Un message s'affiche si le questionnaire n'a pas encore été validé.
      -->
      <div id="s-results" class="page" v-show="activePage==='s-results'">
        <div class="page-header">
          <div>
            <h1>Résultats de la session</h1>
            <!--
              TODO (synchro backend) : remplacer par les vraies infos de session.
            -->
            <p>{{ sessionName }} — {{ todayDate }} · {{ sessionDuration }}</p>
          </div>
          <!-- MODIFIÉ : bouton export fonctionnel -->
          <button class="btn-outline" @click="exporterResultats">⬇ Exporter</button>
        </div>
 
        <!-- Alerte si le questionnaire n'est pas encore rempli -->
        <div v-if="!questionnaireValide" class="conseil" style="margin-bottom:1.5rem">
          <span class="icon">ℹ️</span>
          <div class="msg">
            <strong>Questionnaire non rempli.</strong>
            Remplissez d'abord le questionnaire NASA-TLX pour voir vos résultats complets.
            <span style="color:var(--accent);cursor:pointer;margin-left:.5rem" @click="showPage('s-questionnaire')">
              → Aller au questionnaire
            </span>
          </div>
        </div>
 
        <div class="grid-4">
          <div class="card" style="border-color:rgba(255,181,71,.3)">
            <div class="card-header">
              <span class="card-title">Score global</span>
              <!-- Badge dynamique selon le niveau calculé -->
              <span class="badge" :class="niveauBadge">{{ niveauLabel }}</span>
            </div>
            <!--
              MODIFIÉ : scoreGlobal calculé depuis averageScore (questionnaire)
              TODO (synchro backend) : sera calculé côté serveur (Fitbit + NASA-TLX)
            -->
            <div class="card-value" style="color:var(--warn)">{{ scoreGlobal }}</div>
            <div class="card-sub">Objectif + Subjectif</div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">{{ questionnaireMoment==='start' ? 'NASA-TLX DÉBUT' : 'NASA-TLX FINAL' }}</span></div>
            <!-- MODIFIÉ : score venant directement du questionnaire rempli -->
            <div class="card-value">{{ averageScore.toFixed(1) }}</div>
            <div class="card-sub">Score questionnaire</div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">FC moyenne</span></div>
            <!--
              TODO (synchro backend) : remplacer par la vraie FC de l'API Fitbit.
            -->
            <div class="card-value">79<span style="font-size:1rem;color:var(--muted)">bpm</span></div>
            <div class="card-sub">Max: 94 · Min: 64</div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">HRV moyenne</span></div>
            <!--
              TODO (synchro backend) : remplacer par la vraie HRV de l'API Fitbit.
            -->
            <div class="card-value" style="color:var(--accent2)">44<span style="font-size:1rem;color:var(--muted)">ms</span></div>
            <div class="card-sub">Variabilité cardiaque</div>
          </div>
        </div>
 
        <!-- Détail des dimensions NASA-TLX (visible seulement si questionnaire rempli) -->
        <div class="card" style="margin-bottom:1.5rem" v-if="questionnaireValide">
          <div class="card-header"><span class="card-title">Détail NASA-TLX par dimension</span></div>
          <div style="display:flex;flex-direction:column;gap:.8rem;margin-top:.5rem">
            <div v-for="(dim, i) in dimensions" :key="i">
              <div style="display:flex;justify-content:space-between;margin-bottom:.3rem">
                <span style="font-size:.85rem">{{ dim.label }}</span>
                <span style="font-size:.85rem;font-weight:700;color:var(--accent2)">{{ dim.value }}/100</span>
              </div>
              <div class="tlx-track">
                <div class="tlx-fill" :style="{ width: dim.value + '%', background: dim.color }"></div>
              </div>
            </div>
          </div>
        </div>
 
        <div class="grid-2">
          <div class="card">
            <div class="card-header"><span class="card-title">Évolution complète</span></div>
            <svg class="chart-area" viewBox="0 0 500 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ffb547" stop-opacity=".25"/>
                  <stop offset="100%" stop-color="#ffb547" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,120 C50,115 100,105 150,95 C200,85 250,80 300,70 C350,60 400,55 450,52 L500,50 L500,160 L0,160 Z" fill="url(#g3)"/>
              <path d="M0,120 C50,115 100,105 150,95 C200,85 250,80 300,70 C350,60 400,55 450,52 L500,50" fill="none" stroke="#ffb547" stroke-width="2.5"/>
              <circle cx="0" cy="120" r="4" fill="var(--surface)" stroke="#6b7f9e" stroke-width="2"/>
              <circle cx="500" cy="50" r="4" fill="var(--surface)" stroke="#ffb547" stroke-width="2"/>
              <text x="2" y="140" font-size="10" fill="#6b7f9e" font-family="DM Sans">Début</text>
              <!-- MODIFIÉ : score dynamique au lieu de valeur fixe -->
              <text x="455" y="45" font-size="10" fill="#ffb547" font-family="DM Sans">{{ nasaDebutScore !== null ? nasaDebutScore.toFixed(0) : '—' }}</text>
            </svg>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">Score NASA-TLX</span></div>
            <div style="display:flex;align-items:flex-end;gap:1.5rem;padding:1rem 0;justify-content:center">
              <div style="display:flex;flex-direction:column;align-items:center;gap:.5rem">
                <div style="width:50px;background:rgba(168,85,247,.25);border-radius:6px 6px 0 0;height:76px;border:1px solid rgba(168,85,247,.4)"></div>
                <div style="font-family:'Syne',sans-serif;font-weight:700">{{ nasaDebutScore !== null ? nasaDebutScore.toFixed(0) : '-' }}</div>
                <div style="font-size:.78rem;color:var(--muted)">Début</div>
              </div>
              <div style="display:flex;flex-direction:column;align-items:center;gap:.5rem">
                <!-- MODIFIÉ : hauteur de la barre proportionnelle au score réel -->
                <div style="width:50px;background:rgba(255,181,71,.25);border-radius:6px 6px 0 0;border:1px solid rgba(255,181,71,.4);"
                     :style="{ height: Math.max(20, averageScore * 1.6) + 'px' }"></div>
                <div style="font-family:'Syne',sans-serif;font-weight:700;color:var(--warn)">{{ averageScore.toFixed(0) }}</div>
                <div style="font-size:.78rem;color:var(--muted)">Fin</div>
              </div>
            </div>
          </div>
        </div>
 
        <!-- Conseil dynamique selon le niveau de charge -->
        <div class="conseil" :class="niveauBadge === 'low' ? 'low' : ''" style="margin-bottom:1.2rem">
          <span class="icon">{{ niveauBadge === 'low' ? '✅' : niveauBadge === 'high' ? '🚨' : '⚠️' }}</span>
          <div class="msg"><strong>{{ conseilMessage }}</strong></div>
        </div>
      </div>
 
      <!-- ================= PAGE: HISTORIQUE ================= -->
      <div id="s-history" class="page" v-show="activePage==='s-history'">
        <div class="page-header">
          <div><h1>Historique des sessions</h1><p>Vos sessions précédentes</p></div>
          <!-- MODIFIÉ : export fonctionnel -->
          <button class="btn-outline" @click="exporterHistorique">⬇ Tout exporter</button>
        </div>
        <div class="card">
          <table>
            <thead>
              <tr><th>Date</th><th>Cours</th><th>Durée</th><th>NASA-TLX</th><th>Score global</th><th>Niveau</th></tr>
            </thead>
            <tbody>
              <!--
                MODIFIÉ : la session actuelle apparaît en 1ère ligne
                si le questionnaire a été validé
                TODO (synchro backend) : remplacer par v-for sur données du backend
              -->
              <tr v-if="questionnaireValide">
                <td>{{ todayDate }}</td>
                <td>{{ sessionName }}</td>
                <td>{{ formattedTime }}</td>
                <td>{{ averageScore.toFixed(1) }}</td>
                <td style="font-weight:600;color:var(--warn)">{{ scoreGlobal }}</td>
                <td><span class="badge" :class="niveauBadge">{{ niveauLabel }}</span></td>
              </tr>
              <tr v-for="session in historique" :key="session.id">
                <td>{{ session.started_at ? new Date(session.started_at).toLocaleDateString('fr-FR') : '-' }}</td>
                <td>{{ session.label || session.name || '-'}}</td>
                <td>{{ session.duration_minutes ? session.duration_minutes + 'min' : '—' }}</td>
                <td>{{ session.nasa_tlx_score ? session.nasa_tlx_score.toFixed(1) : '—' }}</td>
                <td style="font-weight:600;color:var(--warn)">{{ session.mental_load_score ? Math.round(session.mental_load_score) : '—' }}</td>
                <td><span class="badge" :class="session.mental_load_level === 'low' ? 'low' : session.mental_load_level === 'high' ? 'high' : 'mid'">{{ session.mental_load_level === 'low' ? 'Faible' : session.mental_load_level === 'high' ? 'Élevé' : 'Modéré' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
 
    </main>
  </div>
</template>
 
 
<script setup>
import{ io } from 'socket.io-client'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()
// Récupère l'utilisateur connecté depuis le localStorage
const userConnecte = ref(JSON.parse(localStorage.getItem('lunara_user') || '{}'))
const fitbitConnecte = ref(false)
const heartRate = ref(null)
const hrv = ref(null)
const breathingRate = ref(null)
const chargeMentale = ref(null)
const questionnaireMoment = ref('start')
const nasaDebutScore = ref(null)
const resultatFinal = ref(null)
// Historique des valeurs pour les graphiques temps réel
// Chaque entrée = { temps: 'mm:ss', valeur: number }
const historiqueCharge = ref([])
const historiqueFC = ref([])

const sessionName = ref('Session en cours')
const sessionGroup = ref('')
const sessionStartedAt = ref(null)

let fitbitPollInterval = null

const API_URL = import.meta.env.VITE_API_URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

//Connexion au serveur Websocket
const socket = io (SOCKET_URL, {
  transports: ['websocket', 'polling']
})
socket.on('connect', ()=>{
  console.log('Socket étudiant connecté:', socket.id)
})

socket.on('connect_error', (err) => {
  console.log('Erreur connexion socket:', err)
})


//Quand le prof lance la session, on demarre le timer 
socket.on('session_demarree', async (data) => {
  sessionName.value = data.nom || 'Session en cours'
  localStorage.setItem('lunara_student_session_id', data.session_id)
  sessionDuration.value = data.duree || 'Le temps apparaîtra bientôt.'
  dureeTotaleSecondes.value = data.dureeSecondes || 3600
  
  sessionStartedAt.value = data.startedAt || Date.now()
  localStorage.setItem('lunara_student_session_started_at', sessionStartedAt.value)

  elapsed.value = Math.floor((Date.now() - sessionStartedAt.value) / 1000)
  startTimer()

  questionnaireMoment.value = 'start'
  console.log('QUESTIONNAIRE MOMENT =', questionnaireMoment.value)
  showPage('s-questionnaire')
  await new Promise(resolve => setTimeout(resolve, 500))
  
  
  // Récupérer la session active et démarrer le polling Fitbit
  try {
    const res = await fetch(`${API_URL}/sessions/active`)
    if (res.ok) {
      const session = await res.json()
      demarrerPollFitbit(session.id)
    }
  } catch (e) {
      console.error('Erreur récupération session active:', e)
    }
})
//Quand le prof termine la session on redirige vers le questionnaire 
socket.on('aller_questionnaire', () => {
  if (timerInterval)clearInterval(timerInterval)
  questionnaireMoment.value = 'end'
  // On vide les réponses pour que le questionnaire de fin soit à remplir
    dimensions.value.forEach(dim => {
      dim.value = 0
    })

  questionnaireValide.value = false
  showPage('s-questionnaire')
})

// ── Page active ──────────────────────────────────────────────
const activePage = ref('s-session');
 
// Fonction pour changer de page
function showPage(pageId) {
  activePage.value = pageId;
}
 
// Fonction de déconnexion
// TODO (synchro backend) : appel API de déconnexion
// TODO (synchro backend) : appel API de déconnexion
function logout() {
  localStorage.removeItem('lunara_user')
  router.push('/')
}
 
// ── Infos session ────────────────────────────────────────────
// TODO (synchro backend) : ces valeurs seront reçues du serveur
// quand l'enseignant lancera une session.
const sessionDuration = ref('1h00');
const todayDate = new Date().toLocaleDateString('fr-FR');
 
// ── Timer ────────────────────────────────────────────────────
const elapsed = ref(0);        // Temps écoulé en secondes, augmente chaque seconde
const isPaused = ref(false);   // MODIFIÉ : état pause/reprise
let timerInterval = null;      // Stocke l'intervalle du timer
 
// TODO (synchro backend) : la durée max viendra du serveur.
// Pour l'instant on utilise 3600s (1h) par défaut.
const dureeTotaleSecondes = ref(3600);
 
/*
  computed() crée une variable réactive mise à jour automatiquement quand elapsed change.
  Fonction qui affiche le temps écoulé au format mm:ss
*/
const formattedTime = computed(() => {
  const min = Math.floor(elapsed.value / 60).toString().padStart(2, '0');
  const sec = (elapsed.value % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
});
 
/*
  computed() met à jour la progression automatiquement.
  Calcule le pourcentage d'avancement de la session.
*/
const progressPercent = computed(() => {
  if (!dureeTotaleSecondes.value) return 0;
  const percent = (elapsed.value / dureeTotaleSecondes.value) * 100;
  return percent > 100 ? 100 : percent;
});
/*
  Convertit un tableau de valeurs en path SVG.
  Le SVG a un viewBox de 500x160.
  valeurMin/valeurMax définissent l'échelle verticale.
  On mappe chaque point sur x (0→500) et y (0→160).
  y=160 = valeur basse, y=0 = valeur haute (SVG inversé).
*/
function valeursVersSVG(points, valeurMin, valeurMax) {
  if (points.length < 2) return ''
  const total = points.length
  return points.map((p, i) => {
    const x = (i / (total - 1)) * 500
    // On inverse y car SVG: y=0 est en haut, y=160 en bas
    const y = 160 - ((p.valeur - valeurMin) / (valeurMax - valeurMin)) * 140
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

// Path SVG dynamique pour la courbe charge mentale (0-100)
const pathCharge = computed(() => {
  if (historiqueCharge.value.length < 2) return ''
  return valeursVersSVG(historiqueCharge.value, 0, 100)
})

// Path SVG dynamique pour la courbe fréquence cardiaque (40-140 bpm)
const pathFC = computed(() => {
  if (historiqueFC.value.length < 2) return ''
  return valeursVersSVG(historiqueFC.value, 40, 140)
})

// Path SVG pour la zone remplie sous la courbe charge mentale
const pathChargeZone = computed(() => {
  if (historiqueCharge.value.length < 2) return ''
  const ligne = valeursVersSVG(historiqueCharge.value, 0, 100)
  const total = historiqueCharge.value.length
  const xFin = ((total - 1) / (total - 1)) * 500
  return `${ligne} L${xFin},160 L0,160 Z`
})

// Path SVG pour la zone remplie sous la courbe FC
const pathFCZone = computed(() => {
  if (historiqueFC.value.length < 2) return ''
  const ligne = valeursVersSVG(historiqueFC.value, 40, 140)
  const total = historiqueFC.value.length
  const xFin = ((total - 1) / (total - 1)) * 500
  return `${ligne} L${xFin},160 L0,160 Z`
})

// FC min et max pour affichage dynamique dans le graphique
const fcMin = computed(() => historiqueFC.value.length
  ? Math.min(...historiqueFC.value.map(p => p.valeur))
  : 0
)
const fcMax = computed(() => historiqueFC.value.length
  ? Math.max(...historiqueFC.value.map(p => p.valeur))
  : 0
)

// FONCTIONS TIMER
function startTimer() {
  // Supprimer le timer s'il est déjà existant
  if (timerInterval) clearInterval(timerInterval);
  /*
    setInterval() exécute une fonction répétitivement toutes les 1000ms (1 seconde).
    Le timer augmente en temps réel jusqu'à ce qu'on atteigne la durée totale.
  */
  timerInterval = setInterval(() => {
    // MODIFIÉ : on ne compte que si la session n'est pas en pause
    if (!isPaused.value && sessionStartedAt.value) {
      elapsed.value = Math.floor(
        (Date.now() - sessionStartedAt.value) / 1000
      )
      if (elapsed.value >= dureeTotaleSecondes.value) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  }, 1000);
}
 
// MODIFIÉ : bascule entre pause et reprise
function togglePause() {
  isPaused.value = !isPaused.value;
}
 
// MODIFIÉ : arrête le timer et redirige vers le questionnaire
function terminerSession() {
  if (timerInterval) clearInterval(timerInterval);
  questionnaireMoment.value = 'end'
  dimensions.value.forEach(dim => {
    dim.value = 0
  })

  questionnaireValide.value = false
  showPage('s-questionnaire');
}
// Fonction asynchrone qui vérifie si l'utilisateur est déjà connecté à Fitbit
async function verifierFitbit() {
  try {

    // Envoie une requête HTTP vers ton backend pour vérifier l'état de la connexion Fitbit
    // On passe l'ID de l'utilisateur connecté pour savoir s'il a déjà autorisé l'app
    const res = await fetch(`${API_URL}/fitbit/status/${userConnecte.value.id}`)

    // Conversion de la réponse en JSON
    // Exemple de réponse attendue :
    // {
    //   connected: true,
    //   is_expired: false
    // }
    const data = await res.json()

    // Vérifie deux choses :
    // 1. L'utilisateur a déjà connecté Fitbit (connected = true)
    // 2. Le token d'accès n'est pas expiré (is_expired = false)
    if (data.connected && !data.is_expired) {

      // Si tout est OK → on considère que Fitbit est connecté
      // On met à jour un état (probablement un ref Vue.js)
      fitbitConnecte.value = true

    } else {

      lancerOAuthFitbit()
    }

  } catch (e) {

    // Gestion des erreurs possibles :
    // - backend inaccessible
    // - erreur réseau
    // - réponse invalide
    // - bug côté serveur

    // Log de l'erreur pour debug
    console.error('Erreur vérification Fitbit', e)
  }
}

// Fonction asynchrone qui lance le processus OAuth avec Fitbit
async function lancerOAuthFitbit() {
  try {
    console.log("CLICK OK")
    console.log("USER:", userConnecte.value)

    const res = await fetch(`${API_URL}/fitbit/authorize/${userConnecte.value.id}`)
    const data = await res.json()

    console.log("DATA:", data)

    if (data.auth_url) {
      window.location.href = data.auth_url
    } else {
      console.error("Pas d'URL OAuth reçue")
    }

  } catch (e) {
    console.error('Erreur lancement OAuth', e)
  }
}
// Fonction qui démarre un "polling" (appel répété) pour récupérer les données Fitbit
async function recupererSampleFitbit(sessionId) {
  try {
    const res = await fetch(`${API_URL}/sessions/${sessionId}/sample`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userConnecte.value.id })
    })

    const data = await res.json()
    console.log('Sample Fitbit reçu :', data)

    if (!res.ok) {
      console.error('Erreur HTTP sample Fitbit:', data)
      return
    }

    const lastHrPoint = data.intraday_hr?.length
    ? data.intraday_hr[data.intraday_hr.length - 1]
    : null

    heartRate.value = lastHrPoint?.value ?? data.heart_rate ?? null
    if (lastHrPoint?.value !== null && lastHrPoint?.value !== undefined) {
      historiqueFC.value.push({
        temps: lastHrPoint.time ?? formattedTime.value,
        valeur: lastHrPoint.value
      })
      if (historiqueFC.value.length > 60) historiqueFC.value.shift()
    }

    hrv.value = data.hrv ?? null
    breathingRate.value = data.breathing_rate ?? null
    chargeMentale.value = data.mental_load_score ?? null

    if (data.mental_load_score !== null && data.mental_load_score !== undefined) {
      historiqueCharge.value.push({
        temps: formattedTime.value,
        valeur: data.mental_load_score
      })
      if (historiqueCharge.value.length > 60) historiqueCharge.value.shift()
    }
  } catch (e) {
    console.error('Erreur polling Fitbit:', e)
  }
}

function demarrerPollFitbit(sessionId) {
  if (fitbitPollInterval) clearInterval(fitbitPollInterval)

  //appel immédiat 
  recupererSampleFitbit(sessionId)

  fitbitPollInterval = setInterval(() => {
    recupererSampleFitbit(sessionId)
  }, 60000)
}
 
async function chargerSessionActive() {
  try {
    const res = await fetch(`${API_URL}/sessions/active`)

    if (res.ok) {
      const session = await res.json()
      console.log("Session active :", session)

      sessionName.value = session.name || 'Session en cours'
      sessionGroup.value = session.group_name || ''

      if (timerInterval) clearInterval(timerInterval)
      if (fitbitPollInterval) clearInterval(fitbitPollInterval)

      if (session.duration_minutes) {
        dureeTotaleSecondes.value = session.duration_minutes * 60
        sessionDuration.value = `${session.duration_minutes} minutes`
      }

      if (session.start_time) {
        const start = new Date(session.start_time + 'Z')
        const now = new Date()
        elapsed.value = Math.max(0, Math.floor((now - start) / 1000))
        startTimer()
      }

      demarrerPollFitbit(session.id)
    }
  } catch (e) {
    console.error("Erreur session active:", e)
  }
}

// CYCLE DE VIE
// CYCLE DE VIE DU COMPOSANT (Vue.js)

// onMounted = exécuté automatiquement quand le composant est affiché dans la page
onMounted(async () => {

  // Charge l'historique des données (probablement sessions, stats, etc.)
  chargerHistorique()

  // Récupère les paramètres présents dans l'URL (query string)
  // Exemple : http://site.com?fitbit=connected
  const urlParams = new URLSearchParams(window.location.search)

  // On récupère le statut Fitbit envoyé par le backend après redirection OAuth
  const fitbitStatus = urlParams.get('fitbit')

  // CAS 1 : Fitbit connecté avec succès
  if (fitbitStatus === 'connected') {

    // Nettoie l'URL pour enlever les paramètres OAuth (meilleure UX)
    window.history.replaceState({}, '', window.location.pathname)

    // Met à jour l'état local : Fitbit est connecté
    fitbitConnecte.value = true
  }

  // CAS 2 : l'utilisateur a refusé l'accès Fitbit
  else if (fitbitStatus === 'denied') {

    // Nettoie aussi l'URL pour éviter de garder les paramètres sensibles
    window.history.replaceState({}, '', window.location.pathname)

    // Informe l'utilisateur que les données Fitbit ne seront pas disponibles
    alert('Vous avez refusé Fitbit. Les données physiologiques ne seront pas disponibles.')
  }

  // Vérifie si un utilisateur est bien connecté (sécurité / état initial)
  if (userConnecte.value.id && userConnecte.value.id) {

    // Lance la vérification Fitbit côté backend :
    // - déjà connecté ?
    // - token valide ?
    // - sinon → lance OAuth
    await verifierFitbit()
  }

  await chargerSessionActive()
})


// onUnmounted = exécuté automatiquement quand le composant est détruit
// (changement de page, navigation, etc.)
onUnmounted(() => {

  // Arrête un timer global (probablement utilisé ailleurs dans le composant)
  clearInterval(timerInterval)

  // Arrête le polling Fitbit (appel API toutes les X secondes)
  clearInterval(fitbitPollInterval)
})
 
// ── Questionnaire NASA-TLX ───────────────────────────────────
// MODIFIÉ : ajout de questionnaireValide pour savoir si le questionnaire a été rempli
const questionnaireValide = ref(false);
 
const dimensions = ref([
  { label: '🧠 Demande mentale',    value: 0, desc: 'Complexité cognitive des tâches réalisées', color: 'linear-gradient(90deg,#9333ea,#a855f7)' },
  { label: '💪 Demande physique',   value: 0, color: 'linear-gradient(90deg,#6b7f9e,#8ca0b8)' },
  { label: '⏱ Demande temporelle', value: 0, color: 'linear-gradient(90deg,#ffb547,#ff8c00)' },
  { label: '🎯 Performance perçue', value: 0, color: 'linear-gradient(90deg,#00e5a0,#00b87a)' },
  { label: '⚙️ Effort',            value: 0, color: 'linear-gradient(90deg,#ff5757,#c93c3c)' },
  { label: '😤 Frustration',        value: 0, color: 'linear-gradient(90deg,#d946ef,#a21caf)' },
]);
//Pour que lorsque l'on met une valeur <0 c'est mis a 0 et lorsque l'on met une valeur>100 elle est mise a 100 pour avoir un score globale compris dans l'intervalle [0,100]
watch(dimensions, (newDimensions) => {
  newDimensions.forEach((dim) => {
    if (dim.value < 0) {
      dim.value = 0
    }
    if (dim.value > 100) {
      dim.value = 100
    }
  })
}, { deep: true })
 
// computed() qui calcule le score moyen automatiquement quand les dimensions changent
const averageScore = computed(() => {
  const sum = dimensions.value.reduce((acc, d) => acc + d.value, 0);
  return sum / dimensions.value.length;
});
 
//  score global déduit du questionnaire
// TODO (synchro backend) : sera calculé côté serveur (Fitbit + NASA-TLX)
const scoreGlobal = computed(() => {
  const backendScore = resultatFinal.value?.mental_load_score

  if (backendScore !== null && backendScore !== undefined) {
    return Math.round(Number(backendScore))
  }

  return Math.round(averageScore.value)
});
 
// Niveau de charge déduit du score (pour le badge et le conseil)
const niveauBadge = computed(() => {
  if (scoreGlobal.value < 40) return 'low';
  if (scoreGlobal.value < 70) return 'mid';
  return 'high';
});
const niveauLabel = computed(() => {
  if (niveauBadge.value === 'low')  return 'Faible';
  if (niveauBadge.value === 'mid')  return 'Modéré';
  return 'Élevé';
});
// Message de conseil adapté au niveau de charge
const conseilMessage = computed(() => {
  if (niveauBadge.value === 'low')  return 'Charge faible. Bonne session, votre charge mentale est restée bien maîtrisée.';
  if (niveauBadge.value === 'mid')  return 'Charge modérée. La charge a augmenté au cours de la session. Pensez à prévoir une pause lors de votre prochaine séance longue.';
  return 'Charge élevée. Il est recommandé de vous accorder du repos avant la prochaine séance.';
});
 
// MODIFIÉ : validerQuestionnaire sauvegarde le score et redirige vers les résultats
// Fonction appelée quand l'utilisateur valide le questionnaire NASA-TLX
async function validerQuestionnaire() {

  // Marque le questionnaire comme validé côté frontend (UI state)
  questionnaireValide.value = true

  const nasaPayload = {
    user_id: userConnecte.value.id,
    nasa_dimensions: {
      mental_demand: dimensions.value[0].value, // charge mentale
      physical_demand: dimensions.value[1].value, // effort physique
      temporal_demand: dimensions.value[2].value, // pression temporelle
      performance: dimensions.value[3].value, // perception performance
      effort: dimensions.value[4].value, // effort global
      frustration: dimensions.value[5].value // frustration ressentie
    }
  }

  try {
    // Récupère la session active depuis le backend
    // (session en cours où l'utilisateur va être ajouté)
    const sessionId = localStorage.getItem('lunara_student_session_id')

    if (!sessionId) {
      console.error('Aucune session sauvegardée côté étudiant')
      return
    }

    // Vérifie qu'une session active existe bien
    if (sessionId) {

      // Étape 1 : rejoindre la session active
      // On envoie l'utilisateur dans la session en cours
      await fetch(`${API_URL}/sessions/${sessionId}/join`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userConnecte.value.id
        })
      })

      // Questionnaire du début
      if (questionnaireMoment.value === 'start') {
        nasaDebutScore.value = averageScore.value
        const startRes = await fetch(`${API_URL}/sessions/${sessionId}/nasa/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nasaPayload)
        })
        if (startRes.ok) console.log('NASA-TLX début sauvegardé !')

        showPage('s-session')
        return
      }

      // Étape 2 : clôturer la session avec les résultats NASA-TLX
      // Ici on envoie les réponses du questionnaire pour analyse côté backend
      const putRes = await fetch(`${API_URL}/sessions/${sessionId}/end`, {

        method: 'PUT',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(nasaPayload)
      })

      // Confirmation côté console si la sauvegarde a réussi
      if (putRes.ok) {
        const data = await putRes.json()
        console.log('Résultat final backend :', data)

        resultatFinal.value = data
        chargeMentale.value = data.mental_load_score
        console.log('Score affiché juste après update =', scoreGlobal.value)
      }
    }

  } catch (e) {

    // Gestion des erreurs globales :
    // - session API inaccessible
    // - join/session end échoue
    // - problème réseau
    console.error('Erreur envoie NASA-TLX', e)
  }

  // Envoi d'un événement en temps réel via WebSocket (socket.io)
  // Permet de notifier le serveur / autres utilisateurs qu'un score a été soumis
  socket.emit('score_soumis', {

    email: userConnecte.value.email, // nom utilisateur

    score: averageScore.value.toFixed(1),  // score moyen arrondi à 1 décimale

    niveau: niveauLabel.value               // niveau/label associé au score
  })

  // Navigation vers la page des résultats
  showPage('s-results')
}
// Récupère l'historique des sessions depuis le backend
const historique = ref([])

async function chargerHistorique() {
  if (!userConnecte.value.id) return
  try {
    const response = await fetch(`${API_URL}/sessions/user/${userConnecte.value.id}`)
    if (response.ok) {
      historique.value = await response.json()
    }
  } catch (e) {
    console.error('Impossible de charger l\'historique', e)
  }
}
 
/* ==================== SVG DONUT ==================== */
// Fonction qui calcule le décalage pour chaque segment du donut
function calculateOffset(index) {
  let offset = 0;
  for (let i = 0; i < index; i++) offset += dimensions.value[i].value * 2.2;
  return -offset;
}
 
// ── Export ───────────────────────────────────────────────────
// MODIFIÉ : fonctions d'export qui génèrent un vrai fichier HTML téléchargeable
function exporterResultats() {
  const etudiant = userConnecte.value.email || 'Étudiant'
  const titre = `Résultats session — ${etudiant} — ${todayDate}`  
  const contenu = `
    <h2>Étudiant : ${etudiant}</h2>
    <p>Date : ${todayDate} | Cours : ${sessionName.value} | Durée : ${formattedTime.value}</p>
    <h3>Score Global : ${scoreGlobal.value}/100 — ${niveauLabel.value}</h3>
    <h3>Score NASA-TLX : ${averageScore.value.toFixed(1)}/100</h3>
    <h3>Détail par dimension</h3>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
      <tr style="background:#f0f0f0"><th>Dimension</th><th>Valeur</th></tr>
      ${dimensions.value.map(d => `<tr><td>${d.label}</td><td>${d.value}/100</td></tr>`).join('')}
    </table>
    <h3>Données physiologiques</h3>
    <p>FC moyenne : ${heartRate.value ?? '-'} bpm</p>
    <p>HRV moyenne : ${hrv.value ?? '-'} ms</p>
    <p>Fréquence respiratoire : ${breathingRate.value ?? '-'} rpm</p>
  `;
  genererFichier(titre, contenu);
}
 
function exporterHistorique() {
  const etudiant = userConnecte.value.email || 'Étudiant'
  const titre = `Historique sessions — ${etudiant}`;
  const ligneActuelle = questionnaireValide.value
    ? `<tr><td>${todayDate}</td><td>${sessionName.value}</td><td>${formattedTime.value}</td><td>${averageScore.value.toFixed(1)}</td><td>${scoreGlobal.value}</td><td>${niveauLabel.value}</td></tr>`
    : '';
  const contenu = `
    <h2>Historique de toutes les sessions — ${etudiant}</h2>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
      <tr style="background:#f0f0f0"><th>Date</th><th>Cours</th><th>Durée</th><th>NASA-TLX</th><th>Score global</th><th>Niveau</th></tr>
      ${ligneActuelle || '<tr><td colspan="6">Aucune session exportable pour le moment</td></tr>'}
    </table>
  `;
  genererFichier(titre, contenu);
}
 
// Fonction commune : crée un fichier HTML et le télécharge automatiquement
function genererFichier(titre, contenu) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>${titre}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; color: #111; }
    h1 { color: #7c5cfc; border-bottom: 2px solid #7c5cfc; padding-bottom: 10px; }
    h2 { color: #333; margin-top: 24px; }
    h3 { color: #555; margin-top: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th { background: #f0f0f0; padding: 8px; }
    td { padding: 8px; }
    .footer { margin-top: 40px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 10px; }
  </style>
</head>
<body>
  <h1>🌙 LUnara — ${titre}</h1>
  ${contenu}
  <div class="footer">Généré le ${todayDate} par LUnara · Université Paris Cité · Groupe L2U2</div>
</body>
</html>`;
 
  // Crée un lien temporaire et clique dessus pour déclencher le téléchargement
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${titre.replace(/[^a-z0-9]/gi, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);  // libère la mémoire
}
</script>
 
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');
 
:root {
  --bg: #080608;
  --surface: #110d16;
  --surface2: #1a1222;
  --border: #2d1f40;
  --accent: #a855f7;
  --accent2: #d946ef;
  --warn: #ffb547;
  --danger: #ff5757;
  --low: #00e5a0;
  --mid: #ffb547;
  --high: #ff5757;
  --text: #ede8f5;
  --muted: #7a6b91;
  --card-shadow: 0 4px 24px rgba(0,0,0,0.5);
}
 
* { margin: 0; padding: 0; box-sizing: border-box; }
 
body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
}
 
/* ─── LAYOUT ─────────────────────────────────────────────── */
.app-layout { min-height: 100vh; }
 
/* ─── SIDEBAR ─────────────────────────────────────────────── */
.sidebar {
  position: fixed; top: 0; left: 0; bottom: 0;
  width: 230px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  padding: 1.5rem 1rem;
  z-index: 100;
}
 
.sidebar-logo {
  display: flex; align-items: center; gap: .7rem;
  margin-bottom: 2.5rem;
  padding: 0 .5rem;
}
/* MODIFIÉ : style du logo LUnara (dégradé violet foncé comme l'interface enseignant) */
.sidebar-logo .mark {
  width: 34px; height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #3b1f8c, #7c5cfc);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.sidebar-logo span {
  font-family: 'Syne', sans-serif;
  font-weight: 700; font-size: 1.1rem;
}
 
.nav-section {
  font-size: .7rem; font-weight: 500;
  color: var(--muted); letter-spacing: .08em;
  text-transform: uppercase;
  padding: 0 .5rem;
  margin-bottom: .5rem;
}
 
.nav-item {
  display: flex; align-items: center; gap: .7rem;
  padding: .65rem .75rem;
  border-radius: 10px;
  font-size: .9rem;
  cursor: pointer;
  margin-bottom: .2rem;
  transition: background .15s, color .15s;
  color: var(--muted);
}
.nav-item:hover { background: var(--surface2); color: var(--text); }
.nav-item.active { background: rgba(168,85,247,.12); color: var(--accent); font-weight: 500; }
.nav-item .ico { font-size: 1rem; width: 18px; text-align: center; }
 
.sidebar-bottom { margin-top: auto; }
.user-chip {
  display: flex; align-items: center; gap: .75rem;
  padding: .75rem;
  background: var(--surface2);
  border-radius: 12px;
  margin-top: .5rem;
}
.avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: .85rem;
  flex-shrink: 0;
}
.user-chip .info { flex: 1; overflow: hidden; }
.user-chip .info .name { font-size: .85rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-chip .info .role { font-size: .72rem; color: var(--muted); }
 
/* ─── MAIN ───────────────────────────────────────────────── */
.main {
  margin-left: 230px;
  padding: 2rem 2.5rem;
  min-height: 100vh;
}
 
/*
  CORRECTION PRINCIPALE :
  On supprime le display:none qui cachait toutes les pages.
  v-show gère déjà la visibilité, pas besoin de CSS ici.
  L'ancien code avait : .page { display: none; } .page.active { display: block; }
  Ce qui rendait tout invisible car v-show et display:none se contredisaient.
*/
.page { display: block; }
 
/* ─── PAGE HEADER ────────────────────────────────────────── */
.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 2rem;
}
.page-header h1 {
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem; font-weight: 800;
  letter-spacing: -.02em;
}
.page-header p { color: var(--muted); font-size: .9rem; margin-top: .2rem; }
 
/* ─── BOUTONS ────────────────────────────────────────────── */
.btn-sm {
  background: linear-gradient(135deg, var(--accent), #7c22d4);
  border: none; border-radius: 8px;
  padding: .55rem 1.1rem;
  color: #fff;
  font-family: 'Syne', sans-serif;
  font-weight: 600; font-size: .85rem;
  cursor: pointer;
  transition: transform .15s;
  white-space: nowrap;
}
.btn-sm:hover { transform: translateY(-1px); }
.btn-outline {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: .55rem 1.1rem;
  color: var(--muted);
  font-family: 'DM Sans', sans-serif;
  font-size: .85rem; cursor: pointer;
  transition: border-color .15s, color .15s;
}
.btn-outline:hover { border-color: var(--accent); color: var(--accent); }
 
/* ─── GRILLES ────────────────────────────────────────────── */
.grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.2rem; margin-bottom: 1.8rem; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.8rem; }
.grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; margin-bottom: 1.8rem; }
 
/* ─── CARDS ──────────────────────────────────────────────── */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.4rem;
  box-shadow: var(--card-shadow);
}
.card-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem;
}
.card-title {
  font-size: .78rem; font-weight: 500;
  color: var(--muted); letter-spacing: .06em; text-transform: uppercase;
}
.card-value {
  font-family: 'Syne', sans-serif;
  font-size: 2.2rem; font-weight: 800;
  letter-spacing: -.03em; line-height: 1;
  margin-bottom: .3rem;
}
.card-sub { font-size: .8rem; color: var(--muted); }
 
/* ─── BADGES ─────────────────────────────────────────────── */
.badge {
  display: inline-flex; align-items: center; gap: .3rem;
  padding: .25rem .65rem;
  border-radius: 20px;
  font-size: .72rem; font-weight: 600;
  letter-spacing: .04em; text-transform: uppercase;
}
.badge.low  { background: rgba(0,229,160,.12);  color: var(--low); }
.badge.mid  { background: rgba(255,181,71,.12);  color: var(--mid); }
.badge.high { background: rgba(255,87,87,.12);   color: var(--high); }
.badge.live { background: rgba(168,85,247,.12);  color: var(--accent); }
.badge::before { content:''; width:6px; height:6px; border-radius:50%; background:currentColor; }
.badge.live::before { animation: pulse 1.2s infinite; }
 
/* ─── SESSION BAR ────────────────────────────────────────── */
.session-bar {
  display: flex; align-items: center; gap: 1.2rem;
  background: rgba(168,85,247,.07);
  border: 1px solid rgba(168,85,247,.15);
  border-radius: 12px;
  padding: .9rem 1.4rem;
  margin-bottom: 2rem;
}
.session-bar .s-label { font-size: .8rem; color: var(--muted); margin-bottom: .2rem; }
.session-bar .s-value { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .95rem; }
.session-bar .divider { width: 1px; height: 30px; background: var(--border); flex-shrink: 0; }
.timer {
  font-family: 'Syne', sans-serif;
  font-size: 1.4rem; font-weight: 800;
  color: var(--accent); letter-spacing: .04em;
}
.progress-track {
  height: 6px; background: var(--surface2);
  border-radius: 3px; overflow: hidden; margin-top: .4rem;
}
.progress-fill {
  height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2));
  border-radius: 3px; transition: width .5s ease;
}
 
/* ─── NASA-TLX ───────────────────────────────────────────── */
.tlx-dimension { margin-bottom: 1.1rem; }
.tlx-header { display: flex; justify-content: space-between; margin-bottom: .4rem; }
.tlx-label { font-size: .85rem; font-weight: 500; }
.tlx-val { font-size: .85rem; font-weight: 700; color: var(--accent2); }
.tlx-track { height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; }
.tlx-fill { height: 100%; border-radius: 3px; transition: width .5s ease; }
 
/* ─── TABLEAU ────────────────────────────────────────────── */
table { width: 100%; border-collapse: collapse; font-size: .88rem; }
th {
  text-align: left;
  font-size: .72rem; font-weight: 500;
  color: var(--muted); letter-spacing: .06em; text-transform: uppercase;
  padding: .6rem .8rem;
  border-bottom: 1px solid var(--border);
}
td { padding: .75rem .8rem; border-bottom: 1px solid rgba(45,31,64,.5); }
tr:last-child td { border-bottom: none; }
tr:hover td { background: rgba(255,255,255,.02); }
 
/* ─── CHARTS ─────────────────────────────────────────────── */
.chart-area { width: 100%; height: 160px; }
 
/* ─── CONSEIL ────────────────────────────────────────────── */
.conseil {
  background: rgba(255,181,71,.06);
  border: 1px solid rgba(255,181,71,.2);
  border-radius: 12px;
  padding: 1rem 1.2rem;
  display: flex; gap: .8rem; align-items: flex-start;
}
.conseil.low { background: rgba(0,229,160,.06); border-color: rgba(0,229,160,.2); }
.conseil .icon { font-size: 1.1rem; margin-top: .1rem; }
.conseil .msg { font-size: .88rem; line-height: 1.5; }
.conseil .msg strong { font-weight: 600; color: var(--warn); }
.conseil.low .msg strong { color: var(--low); }
 
/* ─── POINT LIVE ─────────────────────────────────────────── */
.live-dot {
  display: inline-block; width: 8px; height: 8px;
  border-radius: 50%; background: var(--accent);
  animation: blink 1.5s infinite;
  margin-right: .4rem;
}
 
/* ─── ANIMATIONS ─────────────────────────────────────────── */
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes slideUp { from { transform: translateY(20px); opacity:0 } to { transform: translateY(0); opacity:1 } }
@keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.3} }
 
/* ─── SCROLLBAR ──────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
</style>