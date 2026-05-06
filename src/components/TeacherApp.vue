<template>
  <div id="app">

    <!-- SIDEBAR : barre de navigation latérale fixe à gauche
         Contient le logo, les liens de navigation et l'info utilisateur -->
    <aside class="sidebar">

      <!-- Logo LUnara -->
      <div class="logo">
        <div class="logo-icon">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#fff" stroke-width="1.5" opacity="0.4" />
            <circle cx="11" cy="11" r="4" fill="#fff" opacity="0.9" />
            <path d="M11 1 Q14 6 11 11 Q8 6 11 1Z" fill="#c4b5fd" opacity="0.8" />
            <path d="M21 11 Q16 14 11 11 Q16 8 21 11Z" fill="#a78bfa" opacity="0.6" />
          </svg>
        </div>
        LUnara
      </div>

      <!-- Navigation : boucle sur navItems pour afficher chaque lien -->
      <!-- :class="{active: ...}" ajoute la classe active sur l'item sélectionné -->
      <!-- @click="currentPage=item.id" change la page affichée au clic -->
      <nav class="nav-section">
        <div class="nav-label">Enseignant</div>
        <div v-for="item in navItems" :key="item.id" class="nav-item" :class="{ active: currentPage === item.id }"
          @click="currentPage = item.id">
          <span class="icon">{{ item.icon }}</span>
          {{ item.label }}
        </div>
      </nav>

      <!-- Informations de l'enseignant connecté en bas de la sidebar -->
      <!-- TODO (synchro backend) : remplacer par les vraies infos de l'utilisateur connecté -->
      <div class="sidebar-user">
        <div class="avatar">
          {{ userConnecte.email ? userConnecte.email.substring(0, 2).toUpperCase() : 'CG' }}
        </div>
        <div class="user-info">
          <div class="user-name">{{ userConnecte.email || 'Enseignant' }}</div>
          <div class="user-role">Enseignant</div>
        </div>
        <span style="cursor:pointer;color:var(--muted);font-size:.9rem" @click="logout">⏏</span>
      </div>
    </aside>

    <!-- MAIN : zone principale qui affiche la page courante
         <transition> ajoute une animation de fondu entre les pages -->
    <main class="main">
      <transition name="fade" mode="out-in">

        <!-- ═══════ PAGE 1 : TABLEAU DE BORD ════ -->
        <div v-if="currentPage === 'dashboard'" key="dashboard">
          <div class="page-header">
            <div>
              <!-- Titre dynamique avec le nom de la session courante -->
              <div class="page-title">Tableau de bord <span>— {{ currentSession.name }}</span></div>
              <div class="page-sub">
                <!-- Point vert animé qui devient gris quand la session est terminée -->
                <span class="live-dot" :class="{ stopped: sessionTerminee }"></span>
                {{ sessionTerminee ? 'Session terminée' : 'Session en cours' }}
                · {{ stats.connectes }} étudiants connectés · {{ currentSession.elapsed }}
              </div>
            </div>
            <button class="btn btn-primary" @click="currentPage = 'group'">Voir le groupe →</button>
          </div>

          <!-- Notification verte : s'affiche 5 secondes après le lancement -->
          <div v-if="sessionCreated" class="notif-bar notif-green">
            <span>✅</span>
            <span>Session <strong>{{ currentSession.name }}</strong> lancée · Durée : <strong>{{ dureeAffichee
                }}</strong></span>
            <button class="notif-close" @click="sessionCreated = false">✕</button>
          </div>

          <!-- Notification violette : quand le chrono atteint la durée max -->
          <div v-if="sessionTerminee" class="notif-bar notif-purple">
            <span>🔔</span>
            <div>
              <strong>Session terminée !</strong>
              La durée de <strong>{{ dureeAffichee }}</strong> est écoulée.
              Pensez à lancer le questionnaire NASA-TLX de fin auprès des étudiants.
            </div>
            <button class="notif-close" @click="sessionTerminee = false">✕</button>
          </div>

          <div class="content">
            <!-- 4 cartes de stats -->
            <!-- TODO (synchro backend) : remplacer stats par des données du serveur -->
            <div class="stats-row">
              <div class="stat-card">
                <div class="stat-label">CM Groupe <span class="badge badge-mod">● Modérée</span></div>
                <div class="stat-value" style="color:var(--yellow)">{{ stats.cmGroupe }}</div>
                <div class="stat-sub">Moyenne du groupe /100</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">En surcharge</div>
                <div class="stat-value" style="color:var(--red)">{{ stats.enSurcharge }}</div>
                <div class="stat-sub">Étudiants > 80/100</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">FC Moyenne</div>
                <div class="stat-value">{{ stats.fcMoyenne }}<span
                    style="font-size:18px;font-weight:400;color:var(--muted)">bpm</span></div>
                <div class="stat-sub">Groupe · live</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Connectés</div>
                <div class="stat-value" style="color:var(--purple-light)">{{ stats.connectes }}</div>
                <div class="stat-sub">/ {{ stats.total }} étudiants</div>
              </div>
            </div>

            <!-- Deux graphiques côte à côte -->
            <div class="charts-row">
              <!-- Graphique charge mentale (statique pour l'instant) -->
              <!-- TODO (synchro backend) : remplacer par des données temps réel -->
              <div class="chart-card">
                <div class="chart-card-header">
                  <span class="card-title">Charge mentale du groupe</span>
                  <span class="live-badge">{{ sessionTerminee ? 'Terminé' : 'Live' }}</span>
                </div>
                <svg class="chart-svg" viewBox="0 0 500 140" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#f5834a" stop-opacity="0.5" />
                      <stop offset="100%" stop-color="#f5834a" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                  <!-- Zone surcharge -->
                  <rect x="0" y="0" width="500" height="30" fill="rgba(240,83,100,0.06)" />
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#f05364" stroke-width="1" stroke-dasharray="6,4"
                    opacity="0.4" />
                  <text x="460" y="22" fill="#f05364" font-size="10" text-anchor="end" font-family="DM Sans">Zone
                    surcharge</text>
                  <!-- Zone remplie dynamique -->
                  <path v-if="pathCMGroupe" :d="pathCMGroupeZone" fill="url(#fillGrad)" />
                  <!-- Courbe dynamique -->
                  <path v-if="pathCMGroupe" :d="pathCMGroupe" fill="none" stroke="#f5c542" stroke-width="2.5"
                    stroke-linecap="round" />
                  <!-- Message si pas encore de données -->
                  <text v-if="!pathCMGroupe" x="250" y="75" text-anchor="middle" font-size="12" fill="#6b6b85"
                    font-family="DM Sans">
                    En attente des données...
                  </text>
                  <text x="4" y="138" fill="#6b6b85" font-size="10" font-family="DM Sans">0:00</text>
                  <text x="470" y="138" fill="#6b6b85" font-size="10" font-family="DM Sans">{{ currentSession.elapsed
                    }}</text>
                </svg>
              </div>

              <!-- Liste étudiants avec barres de score -->
              <!-- v-for boucle sur students pour afficher chaque ligne -->
              <div class="chart-card">
                <div class="chart-card-header">
                  <span class="card-title">Charge par étudiant</span>
                </div>
                <div class="student-list">
                  <div v-for="s in students" :key="s.name" class="student-row">
                    <span class="student-name">{{ s.name }}</span>
                    <div class="bar-track">
                      <!-- Largeur de la barre = score en % -->
                      <div class="bar-fill" :class="'bar-' + s.level" :style="{ width: s.score + '%' }"></div>
                    </div>
                    <span class="student-score" :class="'score-' + s.level">{{ s.score > 0 ? s.score : '-'}}</span>
                    <div class="level-dot" :style="{ background: levelColor(s.level) }"></div>
                    <span
                      style="font-size:10px;color:var(--muted);width:30px;text-align:right;text-transform:uppercase;">{{
                      s.levelLabel }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alerte surcharge -->
            <div v-if="stats.enSurcharge > 0" class="alert-bar">
              <span class="alert-icon">⚠️</span>
              <div class="alert-text">
                <strong>Alerte surcharge ({{ stats.enSurcharge }} étudiant(s)).</strong>
                Certains étudiants dépassent le seuil de charge élevée.
                Envisager une pause ou un allègement des activités.
              </div>
            </div>
          </div>
        </div>

        <!-- ══════════ PAGE 2 : CRÉER UNE SESSION ═══ -->
        <div v-else-if="currentPage === 'create'" key="create">
          <div class="page-header">
            <div>
              <div class="page-title">Créer une session</div>
              <div class="page-sub">Paramétrer une nouvelle session de mesure</div>
            </div>
          </div>
          <div class="content">
            <div class="two-col">
              <div class="form-card">
                <h2>Paramètres de la session</h2>

                <!-- v-model lie chaque input à sessionForm -->
                <div class="form-group">
                  <label class="form-label">Nom de la session / Cours</label>
                  <input class="form-input" v-model="sessionForm.name" placeholder="ex: POO — TD3" />
                </div>

                <!-- Durée : prédéfinie ou personnalisée selon durationType -->
                <div class="form-group">
                  <label class="form-label">Durée de la session</label>
                  <div class="duration-row">
                    <select class="form-select" v-model="sessionForm.durationType">
                      <option value="preset">Durée prédéfinie</option>
                      <option value="custom">Durée personnalisée</option>
                    </select>
                    <select v-if="sessionForm.durationType === 'preset'" class="form-select"
                      v-model="sessionForm.duration">
                      <option>30 minutes</option>
                      <option>1 heure</option>
                      <option>1h30</option>
                      <option>2 heures</option>
                    </select>
                    <!-- Deux inputs heures + minutes si durée personnalisée -->
                    <div v-else class="custom-duration">
                      <input class="form-input" type="number" v-model.number="sessionForm.customHours" min="0" max="5"
                        placeholder="0" style="width:72px;text-align:center" />
                      <span class="duration-unit">h</span>
                      <input class="form-input" type="number" v-model.number="sessionForm.customMinutes" min="0"
                        max="59" placeholder="00" style="width:72px;text-align:center" />
                      <span class="duration-unit">min</span>
                    </div>
                  </div>
                </div>

                <!-- TODO (synchro backend) : groupOptions viendra de la BDD -->
                <div class="form-group">
                  <label class="form-label">Groupe d'étudiants</label>
                  <select class="form-select" v-model="sessionForm.group">
                    <option v-for="g in groupOptions" :key="g">{{ g }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Dispositif de mesure</label>
                  <select class="form-select" v-model="sessionForm.device">
                    <option>Fitbit Inspire 3 (API connectée)</option>
                    <option>Polar H10</option>
                    <option>Questionnaire seul</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Questionnaire</label>
                  <select class="form-select" v-model="sessionForm.questionnaire">
                    <option>NASA-TLX Raw (début + fin)</option>
                    <option>NASA-TLX Simple</option>
                    <option>Aucun</option>
                  </select>
                </div>

                <div class="form-actions">
                  <button class="btn btn-ghost">Enregistrer en brouillon</button>
                  <!-- lancerSession() démarre le chrono et redirige vers le dashboard -->
                  <button class="btn btn-primary" @click="lancerSession">▶ Lancer la session</button>
                </div>
              </div>

              <!-- Colonne droite : liste étudiants + récapitulatif -->
              <div>
                <div class="side-card">
                  <div class="side-title">Étudiants sélectionnés</div>
                  <!-- TODO (synchro backend) : sessionStudents viendra du backend -->
                  <div class="student-item" v-for="s in sessionStudents" :key="s.name">
                    <div class="s-avatar" :style="{ background: s.color }">{{ s.initials }}</div>
                    <span style="font-size:13px">{{ s.name }}</span>
                    <span v-if="s.connected" class="fitbit-badge">● FITBIT ✓</span>
                    <span v-else class="disconnected">Non connecté</span>
                  </div>
                </div>
                <div class="side-card">
                  <div class="side-title">Récapitulatif</div>
                  <!-- dureeAffichee est une computed property -->
                  <div class="recap-row">
                    <span class="recap-key">Durée</span>
                    <span class="recap-val">{{ dureeAffichee }}</span>
                  </div>
                  <div class="recap-row"><span class="recap-key">Étudiants</span><span class="recap-val">{{ sessionStudents.filter(s => s.selected).length }} / {{ sessionStudents.length }}</span>
                  </div>
                  <div class="recap-row"><span class="recap-key">Questionnaire</span><span class="recap-val">{{
                      sessionForm.questionnaire }}</span></div>
                  <div class="recap-row"><span class="recap-key">API</span><span class="api-badge">FITBIT PRÊTE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ════ PAGE 3 : VUE GROUPE ══════ -->
        <div v-else-if="currentPage === 'group'" key="group">
          <div class="page-header">
            <div>
              <div class="page-title">Vue groupe</div>
              <div class="page-sub">Analyse détaillée — {{ currentSession.name }} {{ currentSession.date }}</div>
            </div>
            <!-- exportPDF('group') génère et télécharge un rapport HTML -->
            <button class="btn btn-outline" @click="exportPDF('group')">↓ Rapport automatique</button>
          </div>
          <div class="content">
            <div class="three-col">
              <!-- Répartition niveaux -->
              <div class="stat-card" style="padding-bottom:22px">
                <div class="stat-label">Répartition des niveaux</div>
                <div class="bar-chart-group">
                  <div class="bar-group-item">
                    <div class="bar-group-rect" style="background:#3dd68c;height:65px"></div>
                    <div class="bar-group-label" style="color:#3dd68c">{{ niveaux.faible }}</div>
                  </div>
                  <div class="bar-group-item">
                    <div class="bar-group-rect" style="background:#f5c542;height:80px"></div>
                    <div class="bar-group-label" style="color:#f5c542">{{ niveaux.modere }}</div>
                  </div>
                  <div class="bar-group-item">
                    <div class="bar-group-rect" style="background:#f05364;height:50px"></div>
                    <div class="bar-group-label" style="color:#f05364">{{ niveaux.eleve }}</div>
                  </div>
                </div>
              </div>

              <!-- Scores NASA-TLX début et fin -->
              <div class="stat-card">
                <div class="stat-label">Score NASA-TLX Groupe</div>
                <div class="tlx-bar-wrap">
                  <div class="tlx-label">Début de session</div>
                  <div class="tlx-track">
                    <div class="tlx-fill" style="background:var(--purple)" :style="{ width: tlx.debut + '%' }"></div>
                  </div>
                  <div class="tlx-score">{{ tlx.debut }} / 100</div>
                </div>
                <div class="tlx-bar-wrap" style="margin-top:14px">
                  <div class="tlx-label">Fin de session</div>
                  <div class="tlx-track">
                    <div class="tlx-fill" style="background:var(--yellow)" :style="{ width: tlx.fin + '%' }"></div>
                  </div>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="tlx-score" style="color:var(--yellow)">{{ tlx.fin }} / 100</div>
                    <span class="tlx-delta">(+{{ tlx.fin - tlx.debut }})</span>
                  </div>
                </div>
              </div>

              <!-- Jauge score global -->
              <div class="stat-card gauge-wrap">
                <div class="stat-label" style="text-align:center">Score global groupe</div>
                <svg class="gauge-svg" viewBox="0 0 140 80">
                  <defs>
                    <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stop-color="#3dd68c" />
                      <stop offset="50%" stop-color="#f5c542" />
                      <stop offset="100%" stop-color="#f05364" />
                    </linearGradient>
                  </defs>
                  <path d="M15,75 A55,55 0 0,1 125,75" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="10"
                    stroke-linecap="round" />
                  <path d="M15,75 A55,55 0 0,1 125,75" fill="none" stroke="url(#gaugeGrad)" stroke-width="10"
                    stroke-linecap="round" stroke-dasharray="173" stroke-dashoffset="70" />
                </svg>
                <div class="gauge-score" style="color:var(--yellow)">{{ stats.cmGroupe }}</div>
                <div class="gauge-sub"><span class="badge badge-mod">● CHARGE MODÉRÉE</span></div>
              </div>
            </div>

            <!-- Tableau détaillé par étudiant -->
            <!-- TODO (synchro backend) : groupDetails viendra du backend -->
            <div class="chart-card">
              <div class="chart-card-header"><span class="card-title">Détail par étudiant</span></div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Étudiant</th>
                    <th>FC Moy.</th>
                    <th>HRV</th>
                    <th>NASA-TLX</th>
                    <th>Score Global</th>
                    <th>Niveau</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in groupDetails" :key="s.name">
                    <td style="font-weight:500">{{ s.name }}</td>
                    <td style="color:var(--muted)">{{ s.fc }} bpm</td>
                    <td style="color:var(--muted)">{{ s.hrv }}ms</td>
                    <td>{{ s.tlx }}</td>
                    <td class="col-score" :style="{ color: levelColor(s.level) }">{{ s.score }}</td>
                    <td><span class="badge" :class="'badge-' + s.level">● {{ s.levelLabel }}</span></td>
                    <td><button class="btn btn-ghost" style="padding:5px 12px;font-size:12px">Détails</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ══ PAGE 4 : HISTORIQUE ═════ -->
        <div v-else-if="currentPage === 'history'" key="history">
          <div class="page-header">
            <div>
              <div class="page-title">Historique des sessions</div>
              <div class="page-sub">Toutes vos sessions de cours</div>
            </div>
            <button class="btn btn-outline" @click="exportPDF('history')">↓ Exporter</button>
          </div>
          <div class="content">
            <div class="hist-card">
              <table class="hist-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Cours</th>
                    <th>Groupe</th>
                    <th>Étudiants</th>
                    <th>CM Groupe</th>
                    <th>Niveau</th>
                    <th></th>
                  </tr>
                </thead>
                <!-- TODO (synchro backend) : history viendra de la base de données -->
                <tbody>
                  <tr v-for="h in history" :key="h.date">
                    <td style="color:var(--muted)">{{ h.date }}</td>
                    <td style="font-weight:500">{{ h.course }}</td>
                    <td style="color:var(--muted)">{{ h.group }}</td>
                    <td>{{ h.students }}</td>
                    <td class="col-score" :style="{ color: levelColor(h.level) }">{{ h.cm }}</td>
                    <td><span class="badge" :class="'badge-' + h.level">● {{ h.levelLabel }}</span></td>
                    <td><button class="btn btn-ghost" style="padding:5px 14px;font-size:12px"
                        @click="exportPDF('rapport', h)">Rapport</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </transition>
    </main>
  </div>
</template>

<script>
import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL


export default {
  name: 'App',

  data() {
    return {
      // Page actuellement affichée
      currentPage: 'dashboard',

      // true pendant 5s après le lancement d'une session
      sessionCreated: false,

      // true quand le chrono a atteint la durée max
      sessionTerminee: false,

      // Items de la sidebar
      navItems: [
        { id: 'dashboard', icon: '🎯', label: 'Tableau de bord' },
        { id: 'create', icon: '⚙️', label: 'Créer une session' },
        { id: 'group', icon: '👥', label: 'Vue groupe' },
        { id: 'history', icon: '📁', label: 'Historique' },
      ],

      // Infos de la session en cours
      // TODO (synchro backend) : viendra du serveur
      currentSession: {
        id: null,
        name: 'Aucune session en cours',
        date: '',
        elapsed: '00:00',
      },


      userConnecte: JSON.parse(localStorage.getItem('lunara_user') || '{}'),

      // Stats du groupe
      // TODO (synchro backend) : données live du serveur
      stats: {
        cmGroupe: 0,
        enSurcharge: 0,
        fcMoyenne: 0,
        connectes: 0,
        total: 0,
      },

      // Étudiants pour les barres du dashboard
      // TODO (synchro backend) : viendra du backend
      students: [],

      // Répartition niveaux pour la vue groupe
      niveaux: { faible: 0, modere: 0, eleve: 0},

      // Scores NASA-TLX
      tlx: { debut: 0, fin: 0 },
      historiqueCMGroupe: [],

      // Options du select groupe
      // TODO (synchro backend) : viendra de la BDD
      groupOptions: [
        'L2 Informatique — Groupe 1',
        'L2 Informatique — Groupe 2',
        'L3 Informatique',
      ],

      // Données du formulaire "Créer une session" liées aux inputs via v-model
      sessionForm: {
        name: '',
        durationType: 'preset',   // 'preset' ou 'custom'
        duration: '1 heure',
        customHours: 1,
        customMinutes: 0,
        group: '',
        device: 'Fitbit Inspire 3 (API connectée)',
        questionnaire: 'NASA-TLX Raw (début + fin)',
      },

      // Étudiants dans le panneau de création de session
      // TODO (synchro backend) : viendra du backend selon le groupe sélectionné
      sessionStudents: [],

      // Détails par étudiant pour la vue groupe
      // TODO (synchro backend) : viendra du backend (Fitbit + NASA-TLX)
      groupDetails: [],

      // Historique des sessions passées
      // TODO (synchro backend) : viendra de la base de données
      history: [],

      socket: null,


    }
  },

  computed: {
    // Formate la durée pour l'affichage dans le récapitulatif
    // Exemple : customHours=1, customMinutes=30 → "1h30"
    dureeAffichee() {
      if (this.sessionForm.durationType === 'custom') {
        const h = this.sessionForm.customHours || 0
        const m = String(this.sessionForm.customMinutes || 0).padStart(2, '0')
        return `${h}h${m}`
      }
      return this.sessionForm.duration
    },
    dureeEnMinutes() {
      if (this.sessionForm.durationType === 'custom') {
        return (this.sessionForm.customHours || 0) * 60 + (this.sessionForm.customMinutes || 0)
      }
      const map = { '30 minutes': 30, '1 heure': 60, '1h30': 90, '2 heures': 120 }
      return map[this.sessionForm.duration] || 60
    },
    pathCMGroupe() {
      const points = this.historiqueCMGroupe
      if (points.length < 2) return ''
      const total = points.length
      const ligne = points.map((p, i) => {
        const x = (i / (total - 1)) * 500
        // Échelle 0-100, SVG inversé (y=0 en haut)
        const y = 160 - (p.valeur / 100) * 140
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      }).join(' ')
      return ligne
    },
    pathCMGroupeZone() {
      const points = this.historiqueCMGroupe
      if (points.length < 2) return ''
      const total = points.length
      const ligne = points.map((p, i) => {
        const x = (i / (total - 1)) * 500
        const y = 160 - (p.valeur / 100) * 140
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      }).join(' ')
      return `${ligne} L500,160 L0,160 Z`
    },
  },

  methods: {

    //Bouton de déconnexion
    logout() {
      localStorage.removeItem('lunara_user')
      this.$router.push('/')
    },

    async chargerHistorique() {
      try {

        const response = await fetch(`${API_URL}/sessions/created_by/${this.userConnecte.id}`)
        if (response.ok) {
          const sessions = await response.json()
          if (sessions.length > 0) {
            this.history = sessions.map(s => ({
              date: new Date(s.start_time).toLocaleDateString('fr-FR'),
              course: s.name || 'Session sans titre',
              group: s.group_name || 'L2U2',
              students: 0,
              cm: s.mental_load_score ? Math.round(s.mental_load_score) : '—',
              level: s.mental_load_level === 'low' ? 'faib' : s.mental_load_level === 'high' ? 'elev' : 'mod',
              levelLabel: s.mental_load_level === 'low' ? 'Faible' : s.mental_load_level === 'high' ? 'Élevé' : 'Modéré'
            }))
          }
        }
      } catch (e) {
        console.error('Impossible de charger l\'historique', e)
      }
    },

    //Charge les details des etudinatspour la vue groupe 
    //Appelle le bcakend pour recuperer tous les utilisateurs 
    //Met à jour deux listes students et groupDetails
    
    async chargerGroupeDetails() {
      if (!this.currentSession.id) return
      try {const response = await fetch(`${API_URL}/teacher/sessions/${this.currentSession.id}/results`)
        if (!response.ok) return
        const data = await response.json()
        this.stats = data.stats || this.stats
        const studentsData = data.students || []
        const details = studentsData.map(s => {
          const level =
            s.mental_load_level === 'low'
              ? 'faib'
              : s.mental_load_level === 'high'
                ? 'elev'
                : 'mod'

          return {id: s.user_id,
            name: s.email,
            fc: s.avg_heart_rate ? Math.round(s.avg_heart_rate) : '-',
            hrv: s.avg_hrv ? Math.round(s.avg_hrv) : '-',
            tlx: s.nasa_score ? Math.round(s.nasa_score) : '-',
            score: s.mental_load_score ? Math.round(s.mental_load_score) : 0,
            level,
            levelLabel:
              level === 'faib'
                ? 'Faible'
                : level === 'elev'
                  ? 'Élevé'
                  : 'Modéré',
            fitbit_connected: s.fitbit_connected,
          }
        })

        this.groupDetails = details
        this.students = details.map(d => ({name: d.name, score: d.score, level: d.level,
          levelLabel:
            d.level === 'faib'
              ? 'Faib.'
              : d.level === 'elev'
                ? 'Élev.'
                : 'Mod.',
        }))

        this.niveaux.faible = details.filter(d => d.level === 'faib').length
        this.niveaux.modere = details.filter(d => d.level === 'mod').length
        this.niveaux.eleve = details.filter(d => d.level === 'elev').length

        if (this.stats.cmGroupe > 0) {
          this.historiqueCMGroupe.push({temps: this.currentSession.elapsed, valeur: this.stats.cmGroupe,})
          if (this.historiqueCMGroupe.length > 60) {
            this.historiqueCMGroupe.shift()
          }
        }
      } catch (e) {
        console.error('Erreur chargement résultats session prof', e)
      }
    },

    // Lance une nouvelle session :
    // - met à jour currentSession
    // - démarre le chrono avec setInterval
    // - redirige vers le dashboard
    async lancerSession() {
      this.currentSession.name = this.sessionForm.name || 'Session en cours'
      this.currentSession.date = new Date().toLocaleDateString('fr-FR')
      this.currentSession.elapsed = '00:00'
      this.sessionTerminee = false

      // Sauvegarde la session dans le backend
      try {
        console.log('userConnecte:', this.userConnecte)
        const response = await fetch(`${API_URL}/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            created_by: this.userConnecte.id,
            name: this.sessionForm.name || 'Session sans titre',
            group_name: this.sessionForm.group,
            duration_minutes: this.dureeEnMinutes,
            device: this.sessionForm.device,
            questionnaire_type: this.sessionForm.questionnaire,
            participant_ids: this.sessionStudents
              .filter(s => s.selected)
              .map(s => s.id),
          })
        })
        if (!response.ok) {
          console.error('Erreur backend création session')
          return
        }
        const session = await response.json()
        this.currentSession = {
          id: session.id,
          name: session.name,
          date: new Date().toLocaleDateString('fr-FR'),
          elapsed: '00:00'
        }

        console.log('Session créée avec id:', session.id)
      } catch (e) {
        console.error('Erreur création session', e)
        return
      }

      // Calcule la durée totale en secondes
      let dureeMax = 0
      if (this.sessionForm.durationType === 'custom') {
        dureeMax = (this.sessionForm.customHours || 0) * 3600
          + (this.sessionForm.customMinutes || 0) * 60
      } else {
        const map = {
          '30 minutes': 1800,
          '1 heure': 3600,
          '1h30': 5400,
          '2 heures': 7200,
        }
        dureeMax = map[this.sessionForm.duration] || 3600
      }

      if (dureeMax === 0) dureeMax = 60
      let seconds = 0

      if (this._timer) clearInterval(this._timer)

      this._timer = setInterval(() => {
        seconds++
        const m = String(Math.floor(seconds / 60)).padStart(2, '0')
        const s = String(seconds % 60).padStart(2, '0')
        this.currentSession.elapsed = `${m}:${s}`

        if (seconds >= dureeMax) {
          clearInterval(this._timer)
          this._timer = null
          this.sessionTerminee = true

          //EMet ;'evenement Websocket pourrediriger les etudiants vers le questionnaire'
          this.socket.emit('session_terminee', {
            nom: this.currentSession.name
          })
        }
      }, 1000)

      this.sessionCreated = true
      //Emet l'evenement WebSocket pour informer les etudiants 
      this.socket.emit('session_lancee', {
        session_id: this.currentSession.id,
        duree: this.dureeAffichee,
        dureeSecondes: this.dureeEnMinutes * 60,
        nom: this.currentSession.name
      })
      this.currentPage = 'dashboard'
      setTimeout(() => { this.sessionCreated = false }, 5000)
    },

    // Génère et télécharge un fichier HTML avec les données
    // type : 'group' | 'history' | 'rapport'
    exportPDF(type, data) {
      const date = new Date().toLocaleDateString('fr-FR')
      let titre = ''
      let contenu = ''

      if (type === 'group') {
        titre = `Rapport Vue Groupe — ${this.currentSession.name}`
        contenu = `
          <h2>Session : ${this.currentSession.name}</h2>
          <p>Date : ${this.currentSession.date} | Durée : ${this.dureeAffichee} | Temps écoulé : ${this.currentSession.elapsed}</p>
          <h3>Score Global Groupe : ${this.stats.cmGroupe}/100 — Charge Modérée</h3>
          <h3>Répartition</h3>
          <p>Faible : ${this.niveaux.faible} étudiants &nbsp;|&nbsp; Modéré : ${this.niveaux.modere} &nbsp;|&nbsp; Élevé : ${this.niveaux.eleve}</p>
          <h3>NASA-TLX</h3>
          <p>Début : ${this.tlx.debut}/100 → Fin : ${this.tlx.fin}/100 (+${this.tlx.fin - this.tlx.debut})</p>
          <h3>Détail par étudiant</h3>
          <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
            <tr style="background:#f0f0f0"><th>Étudiant</th><th>FC Moy.</th><th>HRV</th><th>NASA-TLX</th><th>Score</th><th>Niveau</th></tr>
            ${this.groupDetails.map(s =>
          `<tr><td>${s.name}</td><td>${s.fc} bpm</td><td>${s.hrv}ms</td><td>${s.tlx}</td><td><b>${s.score}</b></td><td>${s.levelLabel}</td></tr>`
        ).join('')}
          </table>`

      } else if (type === 'history') {
        titre = `Historique des sessions — LUnara`
        contenu = `
          <h2>Historique de toutes les sessions</h2>
          <p>Exporté le ${date} par C. Gnaho</p>
          <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
            <tr style="background:#f0f0f0"><th>Date</th><th>Cours</th><th>Groupe</th><th>Étudiants</th><th>CM Groupe</th><th>Niveau</th></tr>
            ${this.history.map(h =>
          `<tr><td>${h.date}</td><td>${h.course}</td><td>${h.group}</td><td>${h.students}</td><td><b>${h.cm}</b></td><td>${h.levelLabel}</td></tr>`
        ).join('')}
          </table>`

      } else if (type === 'rapport' && data) {
        titre = `Rapport — ${data.course} (${data.date})`
        contenu = `
          <h2>${data.course}</h2>
          <p>Date : ${data.date} | Groupe : ${data.group} | Étudiants : ${data.students}</p>
          <h3>Charge Mentale Groupe : ${data.cm}/100 — ${data.levelLabel}</h3>
          <p>Ce rapport a été généré automatiquement par LUnara.</p>
          <p><i>Les données détaillées seront disponibles une fois connectées au backend.</i></p>`
      }

      // Crée un fichier HTML et le télécharge automatiquement
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
  <div class="footer">Généré le ${date} par LUnara · Université Paris Cité · Groupe L2U2</div>
</body>
</html>`

      // Crée un lien temporaire et clique dessus pour télécharger
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${titre.replace(/[^a-z0-9]/gi, '_')}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)  // libère la mémoire
    },
  },
  mounted() {
    //Connexionn au serveur Websocket
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    })

    //Quand un etudiant soumet son score on met a jour la vue groupe 
    this.socket.on('nouveau_score', (data) => {
      console.log('Nouveau score reçu: ', data)
      this.chargerGroupeDetails()
    })
    // Quand le serveur termine la session automatiquement (timer écoulé)
    this.socket.on('session_terminee_serveur', (data) => {
      console.log('Session terminée par le serveur:', data)
      this.sessionTerminee = true
      if (this._timer) {
        clearInterval(this._timer)
        this._timer - null
      }
    })
    this.socket.on('nouveau_sample', (data) => {
      this.chargerGroupeDetails()
    })
    this.chargerHistorique()
    this.chargerEtudiants()
    this.chargerGroupeDetails()

    //Rafraichit les donnéees du groupe toutes les 5 secondes 
    this._refreshTimer = setInterval(() => {
      this.chargerGroupeDetails()
      this.chargerHistorique()
    }, 5000)
  },
  // Cycle de vie : nettoyage du timer quand le composant est détruit
  // Évite les fuites mémoire
  beforeUnmount() {
    if (this._timer) clearInterval(this._timer)
    if (this._refreshTimer) clearInterval(this._refreshTimer)
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #0e0e14;
  --bg2: #13131c;
  --card: #1a1a26;
  --card2: #1f1f2e;
  --border: #2a2a3e;
  --purple: #7c5cfc;
  --purple-light: #a07cf8;
  --yellow: #f5c542;
  --orange: #f5834a;
  --red: #f05364;
  --green: #3dd68c;
  --blue: #4db8ff;
  --text: #e8e8f0;
  --muted: #6b6b85;
}

html,
body {
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
}

/* Layout : sidebar gauche + main droite */
#app {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  min-width: 220px;
  height: 100vh;
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 24px;
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.logo-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b1f8c, #7c5cfc);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-section {
  padding: 0 12px;
}

.nav-label {
  font-size: 10px;
  letter-spacing: .1em;
  color: var(--muted);
  padding: 0 8px 8px;
  text-transform: uppercase;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--muted);
  transition: all .15s;
  margin-bottom: 2px;
  font-size: 13.5px;
}

.nav-item:hover {
  background: var(--card);
  color: var(--text);
}

.nav-item.active {
  background: rgba(124, 92, 252, .18);
  color: var(--purple-light);
}

.nav-item .icon {
  font-size: 15px;
  width: 18px;
  text-align: center;
}

.sidebar-user {
  margin-top: auto;
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5a3fbf, #8c55f5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
}

.user-role {
  font-size: 11px;
  color: var(--muted);
}

.main {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.notif-bar {
  margin: 16px 36px 0;
  border-radius: 10px;
  padding: 13px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  animation: slideDown .3s ease;
}

.notif-green {
  background: rgba(61, 214, 140, .1);
  border: 1px solid rgba(61, 214, 140, .3);
  color: var(--green);
}

.notif-purple {
  background: rgba(124, 92, 252, .12);
  border: 1px solid rgba(124, 92, 252, .4);
  color: var(--purple-light);
}

.notif-bar strong {
  color: #fff;
}

.notif-close {
  margin-left: auto;
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 14px;
  padding: 0 4px;
}

.notif-close:hover {
  color: var(--text);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px)
  }

  to {
    opacity: 1;
    transform: translateY(0)
  }
}

.page-header {
  padding: 28px 36px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.page-title {
  font-family: 'Syne', sans-serif;
  font-size: 28px;
  font-weight: 800;
}

.page-title span {
  color: var(--muted);
  font-weight: 400;
  font-size: 18px;
  margin-left: 10px;
}

.page-sub {
  font-size: 12.5px;
  color: var(--muted);
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 1.6s infinite;
  flex-shrink: 0;
}

.live-dot.stopped {
  background: var(--muted);
  animation: none;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1)
  }

  50% {
    opacity: .5;
    transform: scale(1.3)
  }
}

.content {
  padding: 24px 36px;
  flex: 1;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px 22px;
}

.stat-label {
  font-size: 10.5px;
  letter-spacing: .08em;
  color: var(--muted);
  text-transform: uppercase;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-value {
  font-family: 'Syne', sans-serif;
  font-size: 38px;
  font-weight: 800;
  line-height: 1;
}

.stat-sub {
  font-size: 12px;
  color: var(--muted);
  margin-top: 6px;
}

.badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 6px;
}

.badge-mod {
  background: rgba(245, 197, 66, .15);
  color: var(--yellow);
}

.badge-elev {
  background: rgba(240, 83, 100, .15);
  color: var(--red);
}

.badge-faib {
  background: rgba(61, 214, 140, .15);
  color: var(--green);
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.chart-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px;
}

.chart-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.card-title {
  font-size: 10.5px;
  letter-spacing: .09em;
  color: var(--muted);
  text-transform: uppercase;
}

.live-badge {
  font-size: 10px;
  color: var(--blue);
  display: flex;
  align-items: center;
  gap: 5px;
}

.live-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--blue);
  display: inline-block;
  animation: pulse 1.6s infinite;
}

.chart-svg {
  width: 100%;
  height: 140px;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.student-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.student-name {
  width: 72px;
  font-size: 12.5px;
  color: var(--text);
  flex-shrink: 0;
}

.bar-track {
  flex: 1;
  height: 8px;
  background: var(--bg);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width .6s ease;
}

.bar-mod {
  background: linear-gradient(90deg, #6060f0, #a07cf8);
}

.bar-elev {
  background: linear-gradient(90deg, #f05364, #f5834a);
}

.bar-faib {
  background: linear-gradient(90deg, #3dd68c, #4db8ff);
}

.student-score {
  width: 28px;
  text-align: right;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 14px;
}

.score-mod {
  color: var(--yellow);
}

.score-elev {
  color: var(--red);
}

.score-faib {
  color: var(--green);
}

.level-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.alert-bar {
  background: rgba(245, 197, 66, .08);
  border: 1px solid rgba(245, 197, 66, .25);
  border-radius: 10px;
  padding: 12px 18px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 12.5px;
}

.alert-icon {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}

.alert-text strong {
  color: var(--yellow);
}

.btn {
  padding: 9px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  border: none;
  transition: all .15s;
}

.btn-primary {
  background: var(--purple);
  color: #fff;
}

.btn-primary:hover {
  background: var(--purple-light);
}

.btn-ghost {
  background: transparent;
  color: var(--muted);
  border: 1px solid var(--border);
}

.btn-ghost:hover {
  color: var(--text);
  border-color: var(--muted);
}

.btn-outline {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
}

.btn-outline:hover {
  background: var(--card2);
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 20px;
  align-items: start;
}

.form-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 28px;
}

.form-card h2 {
  font-family: 'Syne', sans-serif;
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 22px;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  font-size: 10.5px;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 7px;
  display: block;
}

.form-input,
.form-select {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  outline: none;
  transition: border-color .15s;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--purple);
}

.form-select {
  appearance: none;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.duration-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.custom-duration {
  display: flex;
  align-items: center;
  gap: 8px;
}

.duration-unit {
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
}

.side-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px;
  margin-bottom: 16px;
}

.side-title {
  font-size: 10.5px;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 14px;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px solid var(--border);
}

.student-item:last-child {
  border-bottom: none;
}

.s-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}

.fitbit-badge {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 5px;
  background: rgba(77, 184, 255, .12);
  color: var(--blue);
  font-weight: 600;
  margin-left: auto;
}

.disconnected {
  font-size: 11px;
  color: var(--muted);
  margin-left: auto;
}

.recap-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
  font-size: 12.5px;
}

.recap-row:last-child {
  border-bottom: none;
}

.recap-key {
  color: var(--muted);
}

.recap-val {
  font-weight: 600;
}

.api-badge {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 5px;
  background: rgba(61, 214, 140, .12);
  color: var(--green);
  font-weight: 700;
}

.api-badge::before {
  content: '● ';
  font-size: 8px;
}

.three-col {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.bar-chart-group {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 100px;
  padding-top: 10px;
}

.bar-group-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.bar-group-rect {
  width: 100%;
  border-radius: 6px 6px 0 0;
}

.bar-group-label {
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 800;
}

.tlx-bar-wrap {
  margin-bottom: 12px;
}

.tlx-label {
  font-size: 11.5px;
  color: var(--muted);
  margin-bottom: 4px;
}

.tlx-track {
  height: 7px;
  background: var(--bg);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 3px;
}

.tlx-fill {
  height: 100%;
  border-radius: 4px;
}

.tlx-score {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 14px;
}

.tlx-delta {
  font-size: 11px;
  color: var(--green);
}

.gauge-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.gauge-svg {
  width: 140px;
  height: 80px;
}

.gauge-score {
  font-family: 'Syne', sans-serif;
  font-size: 40px;
  font-weight: 800;
  margin-top: -10px;
}

.gauge-sub {
  font-size: 11px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  font-size: 10px;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 0 0 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.data-table td {
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, .04);
  font-size: 13px;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.col-score {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 16px;
}

.hist-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}

.hist-table {
  width: 100%;
  border-collapse: collapse;
}

.hist-table th {
  font-size: 10px;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 16px 22px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.hist-table td {
  padding: 16px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, .04);
  font-size: 13px;
}

.hist-table tr:last-child td {
  border-bottom: none;
}

.hist-table tr:hover td {
  background: rgba(255, 255, 255, .02);
}

/* Animations de transition entre pages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s, transform .2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}
</style>
