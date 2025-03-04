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

    if (valeur2 > valeur
