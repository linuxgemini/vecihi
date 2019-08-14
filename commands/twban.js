const Command = require("../classes/voyunPride/Command");

class Twban extends Command {
    constructor(client) {
        super(client, {
            name: "twban", // komutun adı
            enabled: true, // komutun açık olup olmadığını belirler
            guildOnly: true, // komutun sadece sunucularda mı çalışacağını belirler
            aliases: ["hammer", "çekiç"], // komutun takma adlarını belirler
            hodorRequired: false, // komutun sadece config.js'de belirtilen kullanıcıların çalıştırabileceğini belirler
            timeout: 1000 // komut çalıştırıldıktan sonra, 1 saniye boyunca kullanılamaz.
        });
    }
    
    async run(message, suffix, args) { // eslint-disable-line no-unused-vars
        let yetki = message.member.roles.get("609316050882002954");
        if (!suffix) return await message.reply("Kullanım:\n\n<twban >>banlanacak kişi<< >>kanal<< >>sebep<<\n\nÖrnek:\n<twban gavat videoyun gavat işte\n\nkanal yerine \"ALAYI\" yazarsan crossban atarsın.", { code: true });
        if (args.length < 3) return await message.reply("eksik bir şeyler girdin!");
        let targetUser = args[0];
        let banChannel = args[1];
        let reason = suffix.split(" ").slice(2).join(" ");

        if (reason === "" || reason.length < 5) return await message.reply("bu işler sebepsiz olmaz.");
        if (!this.client.ayarlar.tmiConfig.channels.includes(`#${banChannel}`) && banChannel !== "ALAYI") return await message.reply("hedef kanalı yanlış mı girdin?");

        if (banChannel === "ALAYI") {
            if (!yetki) return await message.reply("yetkin yok bunun için.");
            if (this.client.isOnBanningStreak) return await message.reply("şu anda başka bir ban işlemi sırada. Bir süre bekleyip tekrar deneyin.");

            this.client.isOnBanningStreak = true;

            for (const ch of this.client.ayarlar.tmiConfig.channels) {
                try {
                    await this.client.tmijs.ban(ch, targetUser, reason);
                    await message.channel.send(`${targetUser}, ${ch} kanalından başarıyla banlandı.`, { code: true });
                } catch (error) {
                    await message.channel.send(`Bir hata oluştu: Kanal: ${ch}, Hedef: ${targetUser}\n\n${error}`, { code: true });
                }
                await this.client.utils.sleep(15000);
            }

            this.client.isOnBanningStreak = false;       
                 
            return await message.reply("işlem tamam kaptan. Yolda birkaç pürüz olabilir ama.");
        }
        
        try {
            await this.client.tmijs.ban(`#${banChannel}`, targetUser, reason);
            await message.channel.send(`${targetUser}, #${banChannel} kanalından başarıyla banlandı.`, { code: true });
        } catch (error) {
            await message.channel.send(`Bir hata oluştu: Kanal: #${banChannel}, Hedef: ${targetUser}\n\n${error}`, { code: true });
        }
    }
}

module.exports = Twban;
