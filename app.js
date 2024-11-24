import DiscordJS, { GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import express from 'express'
import cors from "cors"

const app = express()
const port = 10000 || 8000

dotenv.config()

app.use(cors({
    origin: ['https://secrets-demo.onrender.com', 'http://localhost:10000', 'http://localhost:8000'],
    credentials: true, // 重要：允許跨域攜帶 cookie
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// GatewayIntentBits 宣告機器人的功能
const client = new DiscordJS.Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

/***
 * 註冊事件
    client.once() // 只會觸發一次
    client.on() // 會持續觸發
    client.off() // 取消註冊事件
    client.emit() // 觸發事件
    client.removeAllListeners() // 移除所有事件
 * 
 */

const conversation = [
    { name: '烏科獸', description: '呼叫烏科獸', answer: '我是 烏科獸' },
    { name: '你可以做什麼', description: '了解機器人功能', answer: '我可以實現你所有願望' },
]

// ready事件，當機器人準備好時觸發
client.on('ready', async()=>{
    console.log('BOT準備好了!');
    // 複製的伺服器ID
    const guildId = process.env.SERVER_ID
    const guild = client.guilds.cache.get(guildId)

    try{
        if(guild){
            // 如果有指定伺服器，則在該伺服器註冊命令
            for(const cmd of conversation){
                await guild.commands.create({
                name: cmd.name,
                description: cmd.description
            })
            }
        }else{
            // 如果沒有指定伺服器，則全域註冊命令
            if(client.application){
                for(const cmd of conversation){
                    await client.application.commands.create({
                        name: cmd.name,
                        description: cmd.description
                    })
                }
            }
        }
        console.log('命令已註冊');        
    }catch(err){
        console.error('註冊命令錯誤',err);
        
    }
  
})


// Discord API支援註冊指令功能，能夠讓使用者打上 "/" 展示提供的function
client.on('interactionCreate', async(interaction) => {
    if(!interaction.isCommand){
        return
    }
    const {commandName, options} = interaction
    try{     
        const currcommend = conversation.find(cmd => cmd.name === commandName)   
            if(currcommend){
                await interaction.reply({
                    content: currcommend.answer,
                    ephemeral: true
                })
            }else{
                await interaction.reply({
                    content: '你可以問問我其他問題',
                    ephemeral: true
                })
            }
        }
    catch(err){
        console.log('回覆互動發生錯誤', err);        
    }
})


client.on('messageCreate', (message)=> {
    if(message.content === 'test'){
        message.reply({
            content:'烏科獸BOT已啟動, BOT準備完畢'
        })
    }
})



client.login(process.env.TOKEN)


const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

// 添加錯誤處理
server.on('error', (error) => {
    console.error('Server Error:', error);
  });
  