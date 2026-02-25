// PlayStore Search Function
const fetch = require('node-fetch');
const yts = require('yt-search');
const axios = require("axios");

async function playstoreSearch(supreme, chatId, query, message) {
    if (!query) {
        await supreme.sendMessage(chatId, { 
            text: '📱 *PlayStore Search*\n\nUsage: `.playstore <app name>`\nExample: `.playstore whatsapp`\n\n🔍 Please enter the app name to search on PlayStore!'
        }, { quoted: message });
        return;
    }

    try {
        // Send searching message
        await supreme.sendMessage(chatId, {
            text: `🔍 Searching PlayStore for: "${query}"...`
        }, { quoted: message });

        const searchUrl = `https://api.jerexd666.wongireng.my.id/search/playstore?q=${encodeURIComponent(query)}`;
        
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (!data.status || !data.result || data.result.length === 0) {
            await supreme.sendMessage(chatId, {
                text: `❌ No apps found on PlayStore for "${query}".\n\nTry different keywords or check the spelling.`
            }, { quoted: message });
            return;
        }
        
        const apps = data.result.slice(0, 5); // Limit to 5 results
        let result = `📱 *PlayStore Search Results* 📱\n\n`;
        result += `🔍 *Search:* ${query}\n`;
        result += `📊 *Results Found:* ${data.result.length}\n\n`;
        
        apps.forEach((app, index) => {
            result += `*${index + 1}. ${app.nama}*\n`;
            result += `   👤 Developer: ${app.developer}\n`;
            result += `   ⭐ Rating: ${app.rate2}/5 (${app.rate} reviews)\n`;
            result += `   🔗 Link: ${app.link}\n\n`;
        });
        
        result += `✨ *Powered by Supreme*`;
        
        await supreme.sendMessage(chatId, { 
            text: result 
        }, { quoted: message });
        
    } catch (error) {
        console.error('PlayStore search error:', error);
        
        let errorMessage = `❌ Error searching PlayStore for "${query}".`;
        
        if (error.message.includes('fetch failed') || error.message.includes('network')) {
            errorMessage = '🌐 Network error. Please check your connection and try again.';
        } else if (error.message.includes('timeout')) {
            errorMessage = '⏱️ Search timeout. Please try again later.';
        }
        
        await supreme.sendMessage(chatId, { 
            text: errorMessage 
        }, { quoted: message });
    }
}

module.exports = { playstoreSearch };