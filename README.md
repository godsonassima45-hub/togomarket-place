
# 🇹🇬 TogoMarket Premium Enterprise - Netlify Deploy Guide

Votre projet est maintenant configuré pour un déploiement "Zero-Config" sur Netlify.

## 🚀 Étapes pour déployer sur Netlify

1.  **Hébergez votre code** : Poussez ce projet sur un dépôt GitHub, GitLab ou Bitbucket.
2.  **Lien Netlify** : 
    - Allez sur [app.netlify.com](https://app.netlify.com).
    - Cliquez sur **"Add new site"** > **"Import an existing project"**.
    - Sélectionnez votre dépôt.
3.  **Configuration du build** (Normalement automatique grâce au fichier `netlify.toml`) :
    - **Build Command** : `npm run build`
    - **Publish directory** : `dist`
4.  **Variables d'Environnement (CRUCIAL)** :
    - Allez dans **Site Settings** > **Environment variables**.
    - Ajoutez une variable :
        - Key: `API_KEY`
        - Value: `VOTRE_CLE_API_GOOGLE_GEMINI` (nécessaire pour l'IA Styliste et la cabine virtuelle).
5.  **Déployez** : Cliquez sur "Deploy site".

## 🛠️ Maintenance
Chaque fois que vous ferez un `git push` sur votre branche principale, Netlify mettra à jour votre site automatiquement.

## 📱 Aperçu Mobile
Une fois déployé, scannez le QR Code fourni par Netlify pour tester l'expérience "App" directement sur votre téléphone.
