//On importe la fonction qui permet de creer l'application Vue
import { createApp } from 'vue'

//On importe le composant racine de l'application c'ets le point d'entrée
import App from './App.vue'


//On importe le router qu'on vas configurer dans router/index.js
//Il gère la navigation entre les pages (login, etudiant, eneignant)
import router from './router'

//On cree l'application Vue avec App comme composant principal
//.use(router) dit a Vue d'utiliser notre systeme de navigation 
//.mount('#app') attache l7aplication à la balise <div id="app"> dans index.html
createApp(App).use(router).mount('#app')
