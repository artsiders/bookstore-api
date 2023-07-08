# Nom de l'API

Description brève de l'API et des fonctionnalités qu'elle offre.

## Description

L'API permet de gérer les rapports de stage ainsi que les supports de cours et les anciens sujets d'examen pour les étudiants. Les utilisateurs peuvent numériser leurs rapports de stage et les stocker en ligne, accéder aux supports de cours fournis par les enseignants, et consulter les anciens sujets d'examen pour se préparer aux évaluations.

## Installation

1. Cloner le dépôt de l'API.
2. Installer les dépendances avec la commande `yarn` ou `npm install`.
3. Démarrer le serveur de développement avec la commande `yarn dev` ou `npm run dev`.

L'API sera alors disponible sur `localhost:5000`.

## Fonctionnalités

L'API offre les fonctionnalités suivantes :

- Gestion des rapports de stage : les utilisateurs peuvent numériser leurs rapports de stage et les stocker en ligne.
- Support de cours : les enseignants peuvent fournir des supports de cours aux étudiants, qui peuvent les consulter en ligne.
- Anciens sujets d'examen : les étudiants peuvent accéder aux anciens sujets d'examen pour se préparer aux évaluations.

## Endpoints

L'API expose les endpoints suivants :

- `/internship` : Gestion des rapports de stage.
- `/supports` : Support de cours.
- `/examens` : Anciens sujets d'examen.

## Utilisation

Pour utiliser l'API, il est nécessaire de se connecter avec un compte utilisateur et d'obtenir un token d'authentification. Une fois authentifié, les endpoints peuvent être appelés avec les paramètres nécessaires.

Exemple d'appel d'endpoint avec `curl` :

```
import axios from 'axios';
const endpointUrl = 'http://localhost:5000/internship';

async function getRapportById(id: number, token: string): Promise<any> {
try {
    const response = await axios.get(`${endpointUrl}?id=${id}`, {
    headers: {
    Authorization: `Bearer ${token}`
}
});
    return response.data;
} catch (error) {
    console.error(error);
}
}

// Utilisation de la fonction getRapportById
const rapportId = 123;
const authToken = 'votre_token_d_autorisation';
const rapport = await getRapportById(rapportId, authToken);
console.log(rapport);
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une pull request pour proposer des améliorations ou corriger des bugs.

## Licence

[MIT](https://choosealicense.com/licenses/mit/)
