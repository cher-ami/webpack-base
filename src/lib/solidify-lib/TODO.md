# TODO solidify

Cap :

- Framework front office basé sur Less et Typescript pour gérer sous forme de modules des pages simples et complèxes.
- Gestion de vues JQuery et React.
- Permet de créer scripts simples pour des pages avec DOM, mais aussi des web-apps complètes avec système de routage avancé.
- Workflow établi et librairie d'utilitaires en tous genres.

### Fonctionnalité vue solidify

Nous devons mixer les vues classiques et les vues React, les 2 ne servent pas à faire les mêmes choses.
Nos vues classiques vont nous aider à créer des composants rapidement avec une DOM déjà posée par PHP.
Les composants React vont plutôt servir a du full web-app.
Au final, les composants react pourront aussi être appelés depuis la DOM, mais il faut bien être conscient du fonctionnement pour les devs qui utiliseront les composants.

#### Vues classiques

- Gestion des vues classiques avec séléction jQuery + évènements + Central.
- Instancié depuis le code
- Workflow pour gérer le ciblage jQuery et intéractions DOM
- Workflow pour gérer les états (updateState)
- Mini templating sans Handlebars
- [V2] Instancié et configuré directement depuis la DOM
- [V2] Librairie pour gérer la vie de ces composants (récupérer l'instance depuis la DOM, instancier, détruire, etc)

#### Vues react

- [DONE] Gestion des vues React pour de la génération full JS
- Doit aussi avoir les fonctionnalité de ciblage globales
- [DONE] Doit avoir un helper de ciblage local qui prend en compte la DOM virtuelle
- Doit pouvoir aussi gérer Central
- [V2] Instancié et configuré directement depuis la DOM
- [V2] Librairie pour gérer la vie de ces composants (récupérer l'instance depuis la DOM, instancier, détruire, etc)
- Patcher le doublon initState et getInitialState (http://brewhouse.io/blog/2015/03/24/best-practices-for-component-state-in-reactjs.html)

### Navigation, routage et controlleurs

- Gestion du routage
- Gestion de l'arrêt d'une route (compliqué !) sans niquer la nav précédent / suivant
- Gestion du routage inverse
- Gestion du bootstrap (route + bloquage + instanciation + destruction)
- Gestion d'une viewStack React depuis le bootstrap
- [DONE] PlayIn / playOut / shouldPlayIn / shouldPlayOut sur les reactPages

### Models

- [DOC] Object `Config` dispo partout et fed automatiquement depuis l'app
- [DONE] Passer l'action et ses paramètres en props ! et ouai pas de double init !

### Outils

- Faire un helper less pour hériter des dimensions d'un sprite sans hériter de l'image
