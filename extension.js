game.import("extension", function (lib, game, ui, get, ai, _status) {
    return {
        name: "舰R战术", content: function (config, pack) {
            /*if (config.jianrzs) {
                lib.skill._shashanwuxietao = {
                    prompt: "将♦牌当做杀，♥牌当做桃，♣牌当做闪，♠牌当做无懈可击使用或打出(bushi)，<br>将牌当作原版的牌使用或打出。<br>响应事件只能打出对应名字的卡牌，<br>想打出让其他牌响应事件，需要视为技的帮助",
                    mod: {
                        cardname: function (card, player, name) {
                            if (card.name == 'sheji9') { return 'sha'; }; if (card.name == 'huibi9') { return 'shan'; }; if (card.name == 'zhikongquan9') { return 'wuxie'; }; if (card.name == 'kuaixiu9') { return 'tao'; }; if (card.name == 'zziqi9') { return 'jiu'; };
                            if (card.name == 'juedouba9') { return 'juedou'; };
                            if (card.name == 'leibusigang9') { return 'lebu'; }; if (card.name == 'nobuji9') { return 'bingliang'; }; if (card.name == 'taifeng9') { return 'shandian'; };
                        },
                    },
                };
                for (var i in lib.characterPack['jianrzs']) {
                    if (lib.character[i][4].indexOf("forbidai") < 0) lib.character[i][4].push("forbidai");
                };
            };*/
        }, precontent: function () {
            game.import('card', function () {
                var jianrzsbao = {
                    name: 'jianrzsbao',//卡包命名
                    connect: true,//卡包是否可以联机
                    card: {
                        "huhangyuanhu": {
                            image: 'ext:舰R美化/ewaibuji9.png',
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: 1,
                            cardcolor: "red",
                            toself: true,
                            filterTarget: function (card, player, target) {
                                return target != player;
                            },
                            modTarget: true,
                            content: function () {
                                if (get.is.versus()) {
                                    if (game.friend.contains(target)) {
                                        if (game.friend.length < game.enemy.length) {
                                            target.draw(3); return;
                                        }
                                    }
                                    else {
                                        if (game.friend.length > game.enemy.length) {
                                            target.draw(3); return;
                                        }
                                    }
                                }
                                target.draw(2);
                            },
                            ai: {
                                basic: {
                                    order: 7.2,
                                    useful: 4.5,
                                    value: 9.2,
                                },
                                result: {
                                    target: 2,
                                },
                                tag: {
                                    draw: 2,
                                },
                            },
                        },
                        "paojixunlian": {
                            image: 'ext:舰R美化/bigseven9.png',
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: -1,
                            cardcolor: "red",
                            toself: true,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            content: function () {
                                if (!target.hasSkill('paojixunlian')) {
                                    target.addTempSkill('paojixunlian', { player: 'phaseEnd' });
                                    target.storage.paojixunlian = 1;
                                }
                                else target.storage.paojixunlian++;
                                target.updateMarks();
                            },
                            ai: {
                                basic: {
                                    order: 7.2,
                                    useful: function (card, i) {
                                        if (i > 2) return 7.3;
                                        return 3
                                    },
                                    value: function (card, i) {
                                        if (i > 2) return 7.3;
                                        return 3;
                                    },
                                },
                                order: function () {
                                    return get.order({ name: 'sha' }) + 0.2;
                                },
                                result: {
                                    target: function (player, target) {
                                        if (lib.config.mode == 'stone' && !player.isMin()) {
                                            if (player.getActCount() + 1 >= player.actcount) return false;
                                        }
                                        var shas = player.getCards('h', 'sha');
                                        if (shas.length > 1 && player.getCardUsable('sha') > 1) {
                                            return 0;
                                        }
                                        var card;
                                        if (shas.length) {
                                            for (var i = 0; i < shas.length; i++) {
                                                if (lib.filter.filterCard(shas[i], target)) {
                                                    card = shas[i]; break;
                                                }
                                            }
                                        }
                                        else if (player.hasSha()) {
                                            card = { name: 'sha' };
                                        }
                                        if (card) {
                                            if (game.hasPlayer(function (current) {
                                                return (get.attitude(target, current) < 0 &&
                                                    target.canUse(card, current, true, true) &&
                                                    get.effect(current, card, target) > 0);
                                            })) {
                                                return 1;
                                            }
                                        }
                                        return 0;
                                    },
                                },
                            },
                        },


                    },
                    skill: {
                        paojixunlian: {
                            charlotte: true,
                            locked: true,
                            intro: {
                                content: function (storage, player, skill) {
                                    return '使用杀的次数+' + get.translation(player.storage.paojixunlian * 2);
                                },
                            },
                            mod: {
                                cardUsable: function (card, player, num) {
                                    if (card.name == 'sha') return num + 2 * player.storage.paojixunlian;
                                },
                            },
                            "_priority": 0,
                        }
                    },
                    translate: {
                        "huhangyuanhu": "护航援护",
                        "huhangyuanhu_info": "出牌阶段，对一名其他角色使用。其摸两张牌。",
                        "paojixunlian": "炮击训练",
                        "paojixunlian_info": "出牌阶段，对自己使用。本回合你使用杀的上限+2。",

                    },
                    list: [
                        ["heart", 10, "huhangyuanhu"],
                        ["heart", 11, "huhangyuanhu"],
                        ["heart", 12, "huhangyuanhu"],
                        ["club", 10, "paojixunlian"],
                        ["club", 11, "paojixunlian"],
                        ["club", 12, "paojixunlian"],
                    ],//牌堆添加
                }
                return jianrzsbao
            });
            lib.translate['jianrzsbao_card_config'] = '舰R战术卡包';
            lib.config.all.cards.push('jianrzsbao');
            if (!lib.config.cards.contains('jianrzsbao')) lib.config.cards.push('jianrzsbao');//包名翻译

            //选项触发内容，原因见config
        }, help: {}, config: {}, package: {
            character: {
                character: {
                },
                translate: {
                },
            },
            card: {
                card: {
                },
                translate: {
                },
                list: [],
            },
            skill: {

            },
            intro: "",
            author: "※无名玩家",
            diskURL: "",
            forumURL: "",
            version: "0.1",
        }, files: { "character": [], "card": [], "skill": [] }
    }
})