require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

app.use(express.json());

// ✅ Fonction qui effectue les calculs
function calculer(salaire, tjm) {
    let margeReelle = salaire - tjm;                  // Marge réelle
    let coutJournalier = tjm / 30;                    // Coût journalier sur 30 jours
    let margePourcentage = (margeReelle / salaire) * 100; // Marge en %

    return {
        margeReelle: margeReelle.toFixed(2),
        coutJournalier: coutJournalier.toFixed(2),
        margePourcentage: margePourcentage.toFixed(2)
    };
}

// 🏁 Commande /start pour l'accueil
bot.start((ctx) => {
    ctx.reply("Bienvenue ! Envoie simplement **deux nombres** (ex: `33500 450`), et je te donnerai les résultats 📊.");
});

// 📌 Détection automatique des messages contenant **deux nombres**
bot.hears(/^(\d+(\.\d+)?) (\d+(\.\d+)?)$/, (ctx) => {
    const salaire = parseFloat(ctx.match[1]); // Premier nombre = salaire
    const tjm = parseFloat(ctx.match[3]);     // Deuxième nombre = TJM

    if (tjm > salaire) {
        return ctx.reply("⚠️ Erreur : Le coût ne peut pas être supérieur au salaire.");
    }

    const resultats = calculer(salaire, tjm);

    ctx.reply(`📌 **Résultats du calcul** :
💰 **Salaire** : ${salaire} €
📉 **TJM** : ${tjm} €
📊 **Marge réelle** : ${resultats.margeReelle} €
📆 **Coût journalier (30j)** : ${resultats.coutJournalier} €
📈 **Marge (%)** : ${resultats.margePourcentage} %`);
});

// 🚀 Lancer le bot
bot.launch();

// 🌍 Vérification que le bot fonctionne
app.get("/", (req, res) => {
    res.send("Bot Telegram actif !");
});

// 🔗 Gérer les requêtes Telegram (Webhook)
app.post('/webhook', (req, res) => {
    bot.handleUpdate(req.body);
    res.sendStatus(200);
});

// Démarrer le serveur Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bot en ligne sur le port ${PORT} 🚀`);
});
