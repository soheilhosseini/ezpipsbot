const TelegramBot = require('node-telegram-bot-api');
const users = require('../models/users')
const analyzes = require('../models/analyzes');
const subjects = require('../models/subjects');
const watchlist = require('../models/watchlist');
const { BOT_TOKEN } = require('../config/config');
const { watch } = require('../models/users');
const use = require('node-telegram-bot-api-middleware').use;
const sanitize = require('mongo-sanitize')
const fadinTorkfarId = 1373820624
const soheilHosseinId = 115885080
const safiranGroupId = '-1001485085605';
// const safiranGroupId = '-1001221056723';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const errorMessage = 'شما اجازه استفاده از این سامانه را ندارید یا درخواست شما برای عضویت رد شده است. به امید دیدار شما در آکادمی ایزیپیس\u{270B}';
let watchlistMessageProperties = {};
const helpMessage = `\u{2714}لطفا در هر زمانی که در وارد کردن اطلاعات اشتباه به وجود اومد، با زدن دکمه شروع مجدد به اول فرآیند بازگشته و از ابتدا شروع کنید. این نکته بسیار بسیار اهمیت دارد.\n
\u{2714}قابلیت حذف و ویرایش در این سیستم تعبیه نشده پس لطفا در وارد کردن اطلاعات دقت لازم در نظر بگیرید.\n
\u{2714}هر تحلیل جدید از یک نماد، جایگزین تحلیل قبلی در واچلیست خواهد شد.\n
\u{2714}تمامی تحلیل های انفرادی منتشر شده دارای دو شماره افزایشی هستند که اولین عدد نشان دهنده کل تحلیل های ارسالی و دومین عدد نشان دهنده تحلیل های ارسال شده از نماد مفروض می باشد.\n
\u{2714}در تحلیل های گروهی شمارنده وجود ندارد و این اعداد صرفا متعلق به تحلیل های انفرادی می باشد.\n
\u{2714}تعداد تحلیل های گروهی قابل روئیت در واچلیست 10 عدد در نظر گرفته شده است که همواره جدیدترین ها می باشند.\n
در پایان امید این است که این سیستم گامی مثبت در جهت رشد و پیشرفت تمامی اعضای گروه سفیران ایزی پیپس باشد. \u{1F64F}\u{2764}\u{2764}\n`;
watchlist.findOne({ chatId: safiranGroupId }, (err, message) => {
    if (err) throw err;
    if (message) {
        watchlistMessageProperties = {
            messageId: Number(message.messageId),
            chatId: Number(message.chatId),
            createAt: Date.now()
        }
    } else if (!message) {
        bot.sendMessage(safiranGroupId, '#Watchlist #واچلیست').then(sentMessage => {
            const watchlistMessage = new watchlist({
                messageId: sentMessage.message_id,
                chatId: sentMessage.chat.id,
                createAt: Date.now()
            })
            watchlistMessage.save();
            watchlistMessageProperties = {
                messageId: sentMessage.message_id,
                chatId: sentMessage.chat.id,
                createAt: Date.now()
            }
        })
    }
})

bot.onText(/\/start/, async (msg) => {
    const userId = msg.from.id
    // user validation checking 
    // adding users to db
    if (msg.chat.type === 'private') {
        users.findOne({ _id: userId }, (err, user) => {
            if (!user) {
                if (!msg.from.username) return bot.sendMessage(msg.from.id, 'حساب کاربری شما دارای یوزرنیم نمی باشد. لطفا پس از فعال سازی یوزر نیم حساب خود، مجددا اقدام فرمایید')
                bot.sendMessage(msg.from.id, 'سلام\nبه ربات سفیران ایزیپیپس خوش آمدید\nاجازه دسترسی شما به این بات صادر نشده است. درخواست شما برای مدیر ارسال شد. پس از تایید دسترسی، از طریق همین بات به شما اطلاع داده خواهد شد')
                    .then(() => {
                        console.log(msg.from.username + ' send request for using this bot')
                        bot.sendMessage(fadinTorkfarId, `Username: @${msg.from.username ? msg.from.username : 'یوزرنیم مخفی شده است'}\nName: ${msg.from.first_name}\n درخواست استفاده از بات را دارد`, {
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: 'مجاز', callback_data: `valid/${msg.from.id}/${msg.from.first_name}/${msg.from.username}` },
                                    { text: 'غیرمجاز', callback_data: `invalid/${msg.from.id}/${msg.from.first_name}/${msg.from.username}` }]
                                ]
                            },
                        }).then((err, res) => { return })
                        bot.sendMessage(msg.chat.id, helpMessage)
                    })
            }
            else if (!user.isValid) {
                bot.sendMessage(userId, errorMessage).then((err, res) => { return })
            }
            else {
                bot.sendMessage(msg.chat.id, `سلام\nبه ربات سفیران ایزیپیپس خوش آمدید.\n برای دریافت توضیحات بر روی /help کلیک کنید`, {
                    reply_markup: {
                        keyboard: [
                            [{ text: '/start شروع مجدد' }]
                        ],
                        resize_keyboard: true
                    },
                }).then(async () => {
                    const callbackData = (input) => `ifHasNumbers/${input}`;
                    bot.sendMessage(msg.chat.id, `لطفا جفت ارز مورد نظر خود را انتخاب کنید`, {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'AUDCAD', callback_data: callbackData('AUDCAD') }, { text: 'AUDCHF', callback_data: callbackData('AUDCHF') }, { text: 'AUDJPY', callback_data: callbackData('AUDJPY') }],
                                [{ text: 'AUDNZD', callback_data: callbackData('AUDNZD') }, { text: 'AUDUSD', callback_data: callbackData('AUDUSD') }, { text: 'CADJPY', callback_data: callbackData('CADJPY') }],
                                [{ text: 'CHFJPY', callback_data: callbackData('CHFJPY') }, { text: 'EURAUD', callback_data: callbackData('EURAUD') }, { text: 'EURCAD', callback_data: callbackData('EURCAD') }],
                                [{ text: 'EURCHF', callback_data: callbackData('EURCHF') }, { text: 'EURGBP', callback_data: callbackData('EURGBP') }, { text: 'EURJPY', callback_data: callbackData('EURJPY') }],
                                [{ text: 'EURNZD', callback_data: callbackData('EURNZD') }, { text: 'EURUSD', callback_data: callbackData('EURUSD') }, { text: 'GBPAUD', callback_data: callbackData('GBPAUD') }],
                                [{ text: 'GBPCAD', callback_data: callbackData('GBPCAD') }, { text: 'GBPCHF', callback_data: callbackData('GBPCHF') }, { text: 'GBPJPY', callback_data: callbackData('GBPJPY') }],
                                [{ text: 'GBPNZD', callback_data: callbackData('GBPNZD') }, { text: 'GBPUSD', callback_data: callbackData('GBPUSD') }, { text: 'NZDJPY', callback_data: callbackData('NZDJPY') }],
                                [{ text: 'NZDUSD', callback_data: callbackData('NZDUSD') }, { text: 'USDCAD', callback_data: callbackData('USDCAD') }, { text: 'USDCHF', callback_data: callbackData('USDCHF') }],
                                [{ text: 'USDJPY', callback_data: callbackData('USDJPY') }, { text: 'XAGUSD', callback_data: callbackData('XAGUSD') }, { text: 'XAUUSD', callback_data: callbackData('XAUUSD') }],

                            ]
                        },
                    }).then(() => {
                        ///////////////// admins section
                        if (userId === 1373820624 || userId === 115885080) {
                            bot.getChatMembersCount(safiranGroupId).then(async (result) => bot.sendMessage(msg.chat.id,
                                `گزارش ادمین\nتعداد اعضای سفیران: ${result - 1}\nتعداد افراد ثبت شده در بات تا این لحظه: ${await users.countDocuments({}, (err, result) => result)
                                }\nتعداد کل مسیج های ارسال شده از طریق این بات: ${await analyzes.countDocuments({ isPublished: true }, (err, result) => result)}`))

                        }
                    })

                    // delete incomplete
                    await analyzes.deleteMany(
                        {
                            $or: [
                                { isPublished: undefined },
                                { isPublished: false },
                            ],
                            $and: [
                                { creator: sanitize(userId) }
                            ]
                        }, (err, result) => { });

                })
            }
        })
    }
    else {
        bot.sendMessage(msg.chat.id, 'لینک استفاده از بات آریان\nt.me/EzPipsAryanBot'
            , {
                reply_markup: {
                    remove_keyboard: true
                }
            }
        )
    }

});

bot.on('photo', (photoObj) => {

    const chatId = photoObj.chat.id
    const userId = photoObj.from.id
    const file_id = photoObj.photo[photoObj.photo.length - 1].file_id
    bot.getFile(file_id).then(({ file_path }) => {
        file_url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file_path}`;
        //     // const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file_path}`
        //     // bot.sendDocument(chatId , file_path)
        analyzes.updateMany({
            $and: [
                { creator: sanitize(userId), isPublished: undefined }
            ]
        },
            {
                $push: {
                    photos: {
                        file_id,
                        file_path,
                        file_url
                    }
                }
            }, (err, result) => { })
    })
});

bot.on('callback_query', async (ctx) => {
    // bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
    // user validation checking 
    const action = ctx.data
    let pairId;
    const userId = ctx.from.id

    if (action === 'sendingPhotoEnding') {

        let isPhotoExist = true;
        analyzes.findOne({ creator: userId, photos: [], isPublished: undefined }).then(async (incompleteMessage) => {
            if (incompleteMessage) {
                return bot.sendMessage(ctx.message.chat.id, 'ارسال عکس تحلیل الزامی است. لطفا عکس را ارسال نموده و سپس بر روی دکمه اتمام ارسال عکس کلیک کنید.', {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'اتمام ارسال عکس', callback_data: 'sendingPhotoEnding' }]
                        ],
                        force_reply: true,
                        one_time_keyboard: true
                    }
                })

            } else {
                bot.sendMessage(ctx.message.chat.id, 'لطفا متن تحلیل را با ریپلای به همین پیام ارسال کنید').then(sentMessage => {
                    bot.onReplyToMessage(sentMessage.chat.id, sentMessage.message_id, reply => {
                        // bot.deleteMessage(reply.chat.id, reply.message_id)
                        // bot.deleteMessage(sentMessage.chat.id, sentMessage.message_id)
                        caption = reply.text
                        analyzes.updateMany({ creator: sanitize(userId), isPublished: undefined }
                            , { caption: reply.text }, (err, result) => { })
                        bot.sendMessage(reply.chat.id, 'تحلیل گروهی یا انفرادی بوده است؟', {
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: 'گروهی', callback_data: 'team' }, { text: 'انفرادی', callback_data: 'individual' }]
                                ]
                            }
                        })


                    })
                })
            }
        })

    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (action === 'team') {
        bot.sendMessage(ctx.message.chat.id, ' لطفا یوزرنیم اعضا (بجز خودتان) را با فاصله با ریپلای به این پیام طبق الگوی ارائه شده، وارد کنید\n#fardintorkfar #SoheilHossein').then(sentMessage => {
            bot.onReplyToMessage(sentMessage.chat.id, sentMessage.message_id, reply => {
                analyzes.find({ creator: userId, isPublished: undefined }).exec((err, result) => {
                    analyzes.updateMany({ _id: result[0]._id }, { isGroup: sanitize(reply.text) }).exec()
                    bot.sendMessage(reply.from.id, 'همه چی مرتبه. برای دیدن تحلیل بر روی پیش نمایش کلیک کنید', {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'پیش نمایش', callback_data: 'preview' }]
                            ]
                        }
                    })
                }
                )
            })
        })
    }
    else if (action === 'individual') {
        bot.sendMessage(ctx.message.chat.id, 'همه چی مرتبه. برای دیدن تحلیل بر روی پیش نمایش کلیک کنید', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'پیش نمایش', callback_data: 'preview' }]
                ]
            }
        })
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (action === 'preview') {
        const username = ctx.from.username
        return analyzes.find({ creator: userId, isPublished: undefined }).exec(async (err, analyze) => {
            const pair = await subjects.findOne({ _id: analyze[0].subject }, (err, value) => value)
            const sendMediaGroupArray = analyze[0].photos.map((photo, index) =>
                !index ? {
                    type: "photo",
                    media: photo.file_id,
                    caption:
                        `#${username} ${analyze[0].isGroup ? analyze[0].isGroup : ''}
#${pair.name}
${analyze[0].takeprofit ? analyze[0].takeprofit > analyze[0].stoploss ? '\u{1F535} Long' : '\u{1F534} Short' : ''}${analyze[0].takeprofit ? "\nOpen At: " + analyze[0].entrypoint : ''}${analyze[0].takeprofit ? "\nStoploss: " + analyze[0].stoploss : ''}${analyze[0].takeprofit ? "\nTakeprofit: " + analyze[0].takeprofit : ''}

\u{1F4A1}${analyze[0].caption}

\u{1F449} EzPips \u{1F448}`
                } :
                    {
                        type: "photo",
                        media: photo.file_id,
                    }
            );
            bot.sendMediaGroup(ctx.message.chat.id, sendMediaGroupArray).then(() =>
                bot.sendMessage(ctx.message.chat.id, 'برای انتشار بر روی دکمه انتشار کلیک کنید',
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'انتشار', callback_data: 'publish' }]
                            ]
                        }
                    }
                )
            )

            // bot.editMessageCaption(ctx.message.chat.id , )


        })

    }
    else if (action === 'publish') {
        const username = ctx.from.username
        const allSubjects = await subjects.find({}, {}, { lean: true })
        const allUsers = await users.find({}, {}, { lean: true })
        return analyzes.find({ creator: userId, isPublished: undefined }).exec(async (err, analyze) => {
            await analyzes.updateMany({ _id: analyze[0]._id }, { messageURL: { $exists: true } }, (err, result) => { })
            const pair = await subjects.findOne({ _id: analyze[0].subject }, (err, result) => { })
            const analyzesCount = await analyzes.countDocuments({ creator: userId, isGroup: undefined, isPublished: true }, (err, result) => { })
            const pairCount = await analyzes.countDocuments({ creator: userId, subject: analyze[0].subject, isGroup: undefined, isPublished: true }, (err, result) => { })
            const sendMediaGroupArray = analyze[0].photos.map((photo, index) =>
                !index ? {
                    type: "photo",
                    media: photo.file_id,
                    caption:
                        `#${username} ${!analyze[0].isGroup ? (analyzesCount + 1) : analyze[0].isGroup}
#${pair.name} ${!analyze[0].isGroup ? pairCount + 1 : ''}
${analyze[0].takeprofit ? analyze[0].takeprofit > analyze[0].stoploss ? '\u{1F535} Long' : '\u{1F534} Short' : ''}${analyze[0].takeprofit ? "\nOpen At: " + analyze[0].entrypoint : ''}${analyze[0].takeprofit ? "\nStoploss: " + analyze[0].stoploss : ''}${analyze[0].takeprofit ? "\nTakeprofit: " + analyze[0].takeprofit : ''}

\u{1F4A1}${analyze[0].caption}

لینک رفتن به پیام واچلیست:\nhttps://t.me/c/${(watchlistMessageProperties.chatId).toString().substring(4)}/${watchlistMessageProperties.messageId}

\u{270C}EzPips\u{270C}`
                } :
                    {
                        type: "photo",
                        media: photo.file_id,
                    }
            );

            await bot.sendMediaGroup(safiranGroupId, sendMediaGroupArray).then((sentMessage) => {
                const url = `https://t.me/c/${safiranGroupId.substring(4)}/${sentMessage[0].message_id}`
                analyzes.updateMany({ _id: analyze[0]._id }, { messageURL: url, isPublished: true }, (err, result) => { })
                bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id).then(() => bot.sendMessage(ctx.message.chat.id, 'تحلیل شما با موفقیت منتشر شد'))
            })

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            const watchlist = [];
            const allAnalyzes = (await analyzes.find({ isGroup: undefined, isPublished: true }, {}, { lean: true })).reverse();
            allAnalyzes.forEach(async analyze => {
                let flag = true
                for (var i = 0; i < watchlist.length; i++) {
                    if (analyze.creator === watchlist[i].creator && analyze.subject === watchlist[i].subject) {
                        flag = false
                        break
                    }
                }
                if (flag) await watchlist.push(
                    {
                        ...analyze,
                        subjectString: (allSubjects.find(subject => subject._id.toString() === analyze.subject.toString())).name,
                        creatorUsername: (allUsers.find(user => user._id.toString() === analyze.creator.toString())).username
                    }
                )
            });
            
            let watchlistCaption = '#Watchlist #واچلیست\n\nتحلیل انفرادی\n';
            var uniqueSubjects = Array.from(new Set(watchlist.map(item => item.subjectString)))
            for (var i = 0; i < uniqueSubjects.length; i++) {
                watchlistCaption = watchlistCaption + `#${uniqueSubjects[i]}  --------------------\n`
                for (var j = 0; j < watchlist.length; j++) {
                    if (watchlist[j].subjectString === uniqueSubjects[i]) {
                        watchlistCaption = watchlistCaption + `#${watchlist[j].creatorUsername}${watchlist[j].takeprofit ? watchlist[j].stoploss < watchlist[j].takeprofit ?
                            '\n\u{1F535} Long' : '\n\u{1F534} Short' : ''}   ${watchlist[j].takeprofit ? "Open At: " + watchlist[j].entrypoint : ''}   ${watchlist[j].takeprofit ? "StopLoss: " + watchlist[j].stoploss : ''}   ${watchlist[j].takeprofit ? "TakeProfit: " + watchlist[j].takeprofit : ''}\n${watchlist[j].messageURL}\n\n`
                    }
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            const groupWatchlist = [];
            const groupAnalyzes = (await analyzes.find({ isGroup: { $exists: true }, isPublished: true }, {}, { lean: true })).reverse().filter((item, index) => index < 10).map(analyze =>
                ({
                    ...analyze,
                    subjectString: (allSubjects.find(subject => subject._id.toString() === analyze.subject.toString())).name,
                    creatorUsername: (allUsers.find(user => user._id.toString() === analyze.creator.toString())).username
                }));

            watchlistCaption = watchlistCaption + `تحلیل گروهی\n`
            var uniqueSubjects = Array.from(new Set(groupAnalyzes.map(item => item.subjectString)))
            for (var i = 0; i < uniqueSubjects.length; i++) {
                watchlistCaption = watchlistCaption + `#${uniqueSubjects[i]}  --------------------\n`
                for (var j = 0; j < groupAnalyzes.length; j++) {
                    if (groupAnalyzes[j].subjectString === uniqueSubjects[i]) {
                        watchlistCaption = watchlistCaption + `#${groupAnalyzes[j].creatorUsername} ${groupAnalyzes[j].isGroup}${groupAnalyzes[j].takeprofit ? groupAnalyzes[j].stoploss < groupAnalyzes[j].takeprofit ?
                            '\n\u{1F535} Long' : '\n\u{1F534} Short' : ''}      ${groupAnalyzes[j].takeprofit ? "Open At: " + groupAnalyzes[j].entrypoint : ''}   ${groupAnalyzes[j].takeprofit ? "StopLoss: " + groupAnalyzes[j].stoploss : ''}   ${groupAnalyzes[j].takeprofit ? "TakeProfit: " + groupAnalyzes[j].takeprofit : ''}\n${groupAnalyzes[j].messageURL}\n\n`
                    }
                }
            }

            bot.editMessageText(watchlistCaption, {
                'chat_id': watchlistMessageProperties.chatId,
                'message_id': watchlistMessageProperties.messageId,
                'parse_mode': 'Markdown'
            })


        })
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (action.split('/')[0] === 'valid') {
        var dataArray = action.split('/')
        users.findOne({ _id: dataArray[1] }, async (err, user) => {
            if (!user) {
                const user = new users({ _id: sanitize(dataArray[1]), first_name: sanitize(dataArray[2]), username: sanitize(dataArray[3]), isValid: true, createAt: Date.now() })
                console.log(dataArray[3] + ' is added to bot as a valid user')
                await user.save()
                return bot.sendMessage((dataArray[1]), 'دسترسی شما به این ربات فعال شد. در صورت تمایل به ارسال تحلیل، بر روی دکمه شروع مجدد /start کلید کنید')
            } else if (!user.isValid) {
                await users.updateOne({ _id: sanitize(dataArray[1]) }, { isValid: true }, (err, result) => { })
                return bot.sendMessage((dataArray[1]), 'دسترسی شما به این ربات فعال شد. در صورت تمایل به ارسال تحلیل، بر روی دکمه شروع مجدد /start کلید کنید')
            }
        })


    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (action.split('/')[0] === 'invalid') {
        var dataArray = action.split('/')
        users.findOne({ _id: dataArray[1] }, async (err, user) => {
            if (!user) {
                const user = new users({ _id: sanitize(dataArray[1]), first_name: sanitize(dataArray[2]), username: sanitize(dataArray[3]), isValid: false, createAt: Date.now() })
                await user.save()
                console.log(dataArray[3] + ' is added to bot as a invalid user')
                return bot.sendMessage((dataArray[1]), errorMessage)
            } else if (user.isValid) {
                await users.updateOne({ _id: sanitize(dataArray[1]) }, { isValid: false }, (err, result) => { })
                return bot.sendMessage((dataArray[1]), errorMessage)
            }
        })
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (action.split('/')[0] === 'ifHasNumbers') {
        var pairString = action.split('/')[1];

        try {
            await subjects.findOne({ name: pairString }, async (err, pairId) => {
                const analyze = await new analyzes({
                    usersId: [userId], createAt: Date.now(), creator: userId, subject: pairId._id
                })
                analyze.save();
            })
        } catch (err) {
            console.log(err);
            bot.sendMessage(ctx.message.chat.id , 'در روند مشکل ایجاد شده است. لطفا قبل از هر اقدامی با @SoheilHossein ارتباط برقرار کنید')
        }

        bot.sendMessage(ctx.message.chat.id, 'تحلیل دارای حد ضرر، حد سود و نقطه ورود است؟', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'بله', callback_data: `hasNumbers` },
                    { text: 'خیر', callback_data: `hasNotNumbers` }]
                ]
            },
        })
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (action === 'hasNotNumbers') {
        bot.sendMessage(ctx.message.chat.id, 'لطفا عکس‌های تحلیل را ارسال نموده و پس از ارسال همه عکس ها بر روی دکمه اتمام ارسال عکس کلیک کنید', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'اتمام ارسال عکس', callback_data: 'sendingPhotoEnding' }]
                ],
                force_reply: true,
                one_time_keyboard: true
            }
        })
    }
    else if (action === 'hasNumbers') {
        let entrypoint, stoploss, takeprofit;
        const pair = action

        bot.sendMessage(ctx.message.chat.id, 'نقطه ورود را با ریپلای به این پیام وارد کنید').then(async (sentMessage) => {
            // const pairId = await subjects.findOne({ name: sanitize(pair) }, (err, result) => {
            //     return result
            // })
            // let savedSentMessage = sentMessage;/
            bot.onReplyToMessage(sentMessage.chat.id, sentMessage.message_id, reply => {
                entrypoint = Number(persianToEnglishNumber(reply.text));
                // bot.deleteMessage(reply.chat.id, reply.message_id)
                // bot.deleteMessage(sentMessage.chat.id, sentMessage.message_id)
                bot.sendMessage(reply.chat.id, 'لطفا حد سود را با ریپلای به این پیام وارد کنید').then(sentMessage => {
                    bot.onReplyToMessage(sentMessage.chat.id, sentMessage.message_id, reply => {
                        takeprofit = Number(persianToEnglishNumber(reply.text))
                        // bot.deleteMessage(reply.chat.id, reply.message_id)
                        // bot.deleteMessage(sentMessage.chat.id, sentMessage.message_id)
                        bot.sendMessage(reply.chat.id, 'حد ضرر را با ریپلای به این پیام وارد کنید').then(sentMessage => {
                            bot.onReplyToMessage(sentMessage.chat.id, sentMessage.message_id, async reply => {
                                stoploss = Number(persianToEnglishNumber(reply.text))
                                // bot.deleteMessage(reply.chat.id, reply.message_id)
                                // bot.deleteMessage(sentMessage.chat.id, sentMessage.message_id)

                                if (!takeprofit || !stoploss || !entrypoint) {
                                    bot.sendMessage(reply.chat.id, 'ورودی ها ناقص هستند.\nاز ابتدا شروع کنید.')
                                    return;
                                }
                                if ((stoploss <= takeprofit && (entrypoint <= stoploss || entrypoint >= takeprofit)) || (stoploss >= takeprofit && (entrypoint <= takeprofit || entrypoint >= stoploss))) {
                                    bot.sendMessage(reply.chat.id, 'مطمئنی اعداد رو درست وارد کردی؟\u{1F627}\nاز اول شروع کن \u{1F611}')
                                    return
                                }
                                await analyzes.updateOne({ isPublished: undefined, creator: userId }, { stoploss: sanitize(stoploss), entrypoint: sanitize(entrypoint), takeprofit: sanitize(takeprofit) })
                                bot.sendMessage(reply.chat.id, 'لطفا عکس‌های تحلیل را ارسال نموده و پس از ارسال همه عکس ها بر روی دکمه اتمام ارسال عکس کلیک کنید', {
                                    reply_markup: {
                                        inline_keyboard: [
                                            [{ text: 'اتمام ارسال عکس', callback_data: 'sendingPhotoEnding' }]
                                        ],
                                        force_reply: true
                                    }
                                })
                            })
                        })
                    })
                })
            })
        });
    }
})

function persianToEnglishNumber(str) {
    var
        persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
        arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]

    if (typeof str === 'string') {
        for (var i = 0; i < 10; i++) {
            str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
        }
    }
    return str;

}

bot.onText(/\/help/, async (msg) => {
    bot.sendMessage(msg.chat.id, helpMessage)
})