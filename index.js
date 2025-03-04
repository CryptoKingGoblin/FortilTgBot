require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

app.use(express.json());

// ✅ Fonction de calcul pour la commande /K2
function calculK2(valeur1, valeur2) {
    let margeReelle = valeur1 - valeur2;                  // Marge réelle
    let coutJournalier = valeur2 / 30;                    // Coût journalier (30 jours)
    let margePourcentage = (margeReelle / valeur1) * 100; // Marge en %

    return {
        margeReelle: margeReelle.toFixed(2),
        coutJournalier: coutJournalier.toFixed(2),
        margePourcentage: margePourcentage.toFixed(2)
    };
}

// 🏁 Commande /start
bot.start((ctx) => {
    ctx.reply("Bienvenue ! Utilise /K2 suivi de deux nombres (ex: `/K2 33500 450`) pour obtenir les résultats.");
});

// 📌 Gestion de la commande /K2
bot.hears(/^\/K2 (\d+(\.\d+)?) (\d+(\.\d+)?)$/, (ctx) => {
    const valeur1 = parseFloat(ctx.match[1]);
    const valeur2 = parseFloat(ctx.match[3]);

    if (valeur2 > valeur1) {
        return ctx.reply("⚠️ Erreur : Le coût ne peut pas être supérieur au prix de vente.");
    }

    const resultats = calculK2(valeur1, valeur2);

    ctx.reply(`📌 **Résultats du calcul K2** :
💰 **Prix de vente** : ${valeur1} €
📉 **Coût total** : ${valeur2} €
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
