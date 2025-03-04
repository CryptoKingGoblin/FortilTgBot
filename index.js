require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

app.use(express.json());

// ✅ Fonction de calcul avec mise en forme HTML
function calculer(salaire, tjm) {
    let coutJour = salaire * 2 / 228 + 20.20;                  
    let margeJour = tjm - coutJour;
    let margeMois = margeJour * 19;
    let margePourcentage = (margeJour / tjm) * 100;

    return {
        coutJour: coutJour.toFixed(2),
        margeJour: margeJour.toFixed(2),
        margeMois : margeMois.toFixed(2),
        margePourcentage: margePourcentage.toFixed(2)
    };
}

// 🏁 Commande /start
bot.start((ctx) => {
    ctx.reply("<b>Bienvenue sur ton assistant FORTIL !</b><i>Envoie simplement deux nombres pour le salaire et le tjm (ex: 33500 450) \n\n💡 J'intègre automatiquement les 20,20€</i>", { parse_mode: "HTML" });
});

// 📌 Détection automatique des messages contenant **deux nombres**
bot.hears(/^(\d+(\.\d+)?) (\d+(\.\d+)?)$/, (ctx) => {
    const salaire = parseFloat(ctx.match[1]); 
    const tjm = parseFloat(ctx.match[3]);     

    if (tjm > salaire) {
        return ctx.reply("<b>⚠️ Erreur :</b> Le coût ne peut pas être supérieur au salaire.", { parse_mode: "HTML" });
    }

    const resultats = calculer(salaire, tjm);

    const message = `
📌 <b>Coût jour :</b> <code>${resultats.coutJour} €</code>
💰 <b>Marge K2 jour :</b> <code>${resultats.margeJour} €</code>
📊 <b>Marge K2 mois :</b> <code>${resultats.margeMois} €</code>
📈 <b>Marge (%) :</b> <code>${resultats.margePourcentage} %</code>
`;

    ctx.reply(message, { parse_mode: "HTML" });
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
