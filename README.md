# Projet de Migration JavaScript vers Angular

Ce projet vise à migrer le  projet [DemoKGViz](https://github.com/NadiaYA2019/DemoKGViz) existant vers le framework Angular, en ajoutant également de nouvelles fonctionnalités et améliorations. Le but ultime est d'améliorer la maintenance, la scalabilité et la convivialité du projet grâce à l'utilisation d'Angular.

## Équipe de développement
- AZEBAZE Nadine
- BELHASSEN Mohamed
- SAMY Mokhtar


## Objectifs

1. Migration vers Angular :
  - Convertir progressivement le code JavaScript existant en TypeScript.
  - Structurer le projet en utilisant les concepts modulaires d'Angular.
  - Réorganiser les fichiers et dossiers selon les meilleures pratiques d'Angular.
  - Utiliser les directives, les composants et les services Angular pour améliorer la lisibilité et la maintenabilité du code.

2. Ajout de nouvelles fonctionnalités :
  - Analyser les besoins du projet et identifier les fonctionnalités à ajouter.
  - Implémenter de nouvelles fonctionnalités en utilisant Angular et TypeScript.
  - Intégrer des bibliothèques ou des modules supplémentaires si nécessaire pour faciliter le développement.

3. Améliorations générales :
  - Optimiser les performances de l'application en utilisant les meilleures pratiques d'Angular.
  - Améliorer l'expérience utilisateur en utilisant les fonctionnalités d'Angular.

## Prérequis

Avant de commencer le projet, assurez-vous d'avoir les éléments suivants :

- Node.js (version 18.15.0 ou supérieure) installé sur votre machine. Vous pouvez télécharger Node.js à partir du site officiel : [https://nodejs.org](https://nodejs.org)
- Angular CLI (version 15.2.5) installé globalement. Vous pouvez l'installer en exécutant la commande suivante dans votre terminal :
```
  npm install -g @angular/cli@15.2.5
```

Assurez-vous de disposer des versions spécifiées de Node.js et d'Angular CLI pour garantir la compatibilité avec le projet.

## Installation

1. Clonez le dépôt du projet depuis [lien du dépôt](https://github.com/mohamedlouay/kg-viz).
2. Ouvrez une invite de commande et accédez au répertoire du projet.
3. Exécutez la commande `npm install` pour installer les dépendances du projet.

## Utilisation

- Utilisez la commande `ng serve` pour exécuter le projet en mode développement.
- Ouvrez votre navigateur et accédez à `http://localhost:4200` pour voir l'application en cours d'exécution.


## Déploiement

Pour déployer le projet sur GitHub Pages, nous avons ajouté un script personnalisé dans le fichier `package.json`. Vous pouvez exécuter ce script en utilisant la commande suivante :

```
npm run deploy
```

Assurez-vous d'avoir configuré correctement les paramètres de déploiement dans le fichier `angular.json`. Vous devrez spécifier le nom du référentiel GitHub dans la propriété `"outputPath"` du `"deploy"` dans `"architect"`. Dans notre cas, pour ce projet, le dossier de sortie est configuré sur  `Docs`.

Une fois le script exécuté avec succès, le projet sera déployé sur GitHub Pages et vous pourrez y accéder via le lien suivant : `https://votre-utilisateur-github.github.io/votre-repo/` . Dans le cas spécifique de ce projet, le lien de déploiement est : `https://mohamedlouay.github.io/kg-viz/`




## Contribution

1. Créez une branche (`git checkout -b ma-branche`)
2. Effectuez les modifications nécessaires et commit (`git commit -m 'Ajouter une fonctionnalité'`)
3. Poussez les modifications vers la branche (`git push origin ma-branche`)
4. Soumettez une demande d'extraction (Pull Request).

Veuillez vous assurer de respecter les normes de codage, les conventions de dénomination et d'inclure la documentation appropriée pour toutes les modifications apportées.

## Ressources utiles

- [Documentation officielle d'Angular](https://angular.io/docs)
- [Tutoriels Angular](https://angular.io/tutorial)

N'hésitez pas à nous contacter en cas de questions ou de problèmes.


