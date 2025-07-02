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
                        /*"huibida9": {
                            image: 'ext:舰R美化/huibida9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip2",
                            ai: {
                                basic: {
                                    equipValue: 7.5,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            skills: ["bagua_skill"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {//fullimage:true,
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,

                        },
                        "puliesai9": {
                            image: 'ext:舰R美化/puliesai9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip2",
                            loseDelay: false,
                            onLose: function () {
                                var next = game.createEvent('baiyin_recover');
                                event.next.remove(next);
                                var evt = event.getParent();
                                if (evt.getlx === false) evt = evt.getParent();
                                evt.after.push(next);
                                next.player = player;
                                next.setContent(function () {
                                    if (player.isDamaged()) player.logSkill('baiyin_skill');
                                    player.recover();
                                });
                            },
                            filterLose: function (card, player) {
                                if (player.hasSkillTag('unequip2')) return false;
                                return true;
                            },
                            skills: ["baiyin_skill"],
                            tag: {
                                recover: 1,
                            },
                            ai: {
                                order: 9.5,
                                equipValue: function (card, player) {
                                    if (player.hp == player.maxHp) return 5;
                                    if (player.countCards('h', 'baiyin')) return 6;
                                    return 0;
                                },
                                basic: {
                                    equipValue: 5,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "nobuji9": {
                            image: 'ext:舰R美化/nobuji9.png',
                            audio: true,
                            fullskin: true,
                            type: "delay",
                            range: {
                                global: 1,
                            },
                            filterTarget: function (card, player, target) {
                                return (lib.filter.judge(card, player, target) && player != target);
                            },
                            judge: function (card) {
                                if (get.suit(card) == 'club') return 1;
                                return -2;
                            },
                            "judge2": function (result) {
                                if (result.bool == false) return true;
                                return false;
                            },
                            effect: function () {
                                if (result.bool == false) {
                                    if (get.is.changban()) {
                                        player.addTempSkill('bingliang_changban');
                                    } else {
                                        lib.animate.skill['bingliang'].call(player, 'bingliang');
                                        player.skip('phaseDraw');
                                    }
                                }
                            },
                            ai: {
                                basic: {
                                    order: 1,
                                    useful: 1,
                                    value: 4,
                                },
                                result: {
                                    target: function (player, target) {
                                        if (target.hasJudge('caomu')) return 0;
                                        return -1.5 / Math.sqrt(target.countCards('h') + 1);
                                    },
                                },
                                tag: {
                                    skip: "phaseDraw",
                                },
                            },
                            selectTarget: 1,
                            enable: true,
                            content: function () {
                                if (lib.filter.judge(card, player, target) && cards.length && get.position(cards[0], true) == 'o') target.addJudge(card, cards);
                            },
                            allowMultiple: false,
                        },
                        "dongli9": {
                            image: 'ext:舰R美化/dongli9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip4",
                            distance: {
                                globalFrom: -1,
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                            ai: {
                                basic: {
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    equipValue: 4,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                        },
                        "jiaohuan9": {
                            image: 'ext:舰R美化/jiaohuan9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip3",
                            distance: {
                                globalTo: 1,
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                            ai: {
                                basic: {
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    equipValue: 7,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                        },
                        "fayantong9": {
                            image: 'ext:舰R美化/fayantong9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip3",
                            distance: {
                                globalTo: 1,
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                            ai: {
                                basic: {
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    equipValue: 7,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                        },
                        "bigseven9": {
                            image: 'ext:舰R美化/bigseven9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -3,
                            },
                            ai: {
                                basic: {
                                    equipValue: 2.5,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            skills: ["duanbing"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "shangyouyh9": {
                            image: 'ext:舰R美化/shangyouyh9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -2,
                            },
                            ai: {
                                equipValue: function (card, player) {
                                    var num = 2.5 + (player.countCards('h') + player.countCards('e')) / 2.5;
                                    return Math.min(num, 5);
                                },
                                basic: {
                                    equipValue: 4.5,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            skills: ["guanshi_skill"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "xiji9": {
                            image: 'ext:舰R美化/xiji9.png',
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: 1,
                            postAi: function (targets) {
                                return targets.length == 1 && targets[0].countCards('j');
                            },
                            filterTarget: function (card, player, target) {
                                if (player == target) return false;
                                return target.countDiscardableCards(player, get.is.single() ? 'he' : 'hej');
                            },
                            "yingbian_prompt": "当你使用此牌选择目标后，你可为此牌增加一个目标",
                            "yingbian_tags": ["add"],
                            yingbian: function (event) {
                                event.yingbian_addTarget = true;
                            },
                            content: function () {
                                'step 0'
                                if (!get.is.single() && target.countDiscardableCards(player, 'hej')) {
                                    player.discardPlayerCard('hej', target, true);
                                    event.finish();
                                }
                                else {
                                    var bool1 = target.countDiscardableCards(player, 'h');
                                    var bool2 = target.countDiscardableCards(player, 'e');
                                    if (bool1 && bool2) {
                                        player.chooseControl('手牌区', '装备区').set('ai', function () {
                                            return Math.random() < 0.5 ? 1 : 0;
                                        }).set('prompt', '弃置' + (get.translation(target)) + '装备区的一张牌，或观看其手牌并弃置其中的一张牌。');
                                    }
                                    else event._result = { control: bool1 ? '手牌区' : '装备区' };
                                }
                                'step 1'
                                var pos = result.control == '手牌区' ? 'h' : 'e';
                                player.discardPlayerCard(target, pos, true, 'visible');
                            },
                            ai: {
                                basic: {
                                    order: 9,
                                    useful: 5,
                                    value: 5,
                                },
                                yingbian: function (card, player, targets, viewer) {
                                    if (get.attitude(viewer, player) <= 0) return 0;
                                    if (game.hasPlayer(function (current) {
                                        return !targets.contains(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
                                    })) return 6;
                                    return 0;
                                },
                                result: {
                                    target: function (player, target) {
                                        var att = get.attitude(player, target);
                                        var nh = target.countCards('h');
                                        if (att > 0) {
                                            if (target.countCards('j', function (card) {
                                                var cardj = card.viewAs ? { name: card.viewAs } : card;
                                                return get.effect(target, cardj, target, player) < 0;
                                            }) > 0) return 5;
                                            if (target.getEquip('baiyin') && target.isDamaged() &&
                                                get.recoverEffect(target, player, player) > 0) {
                                                if (target.hp == 1) return 3;
                                            }
                                            if (target.countCards('e', function (card) {
                                                if (get.position(card) == 'e') return get.value(card, target) < 0;
                                            }) > 0) return 1;
                                        }
                                        var es = target.getCards('e');
                                        var noe = (es.length == 0 || target.hasSkillTag('noe'));
                                        var noe2 = (es.filter(function (esx) {
                                            return get.value(esx, target) > 0;
                                        }).length == 0);
                                        var noh = (nh == 0 || target.hasSkillTag('noh'));
                                        if (noh && (noe || noe2)) return 0;
                                        if (att <= 0 && !target.countCards('he')) return 1.5;
                                        return -1.5;
                                    },
                                },
                                tag: {
                                    loseCard: 1,
                                    discard: 1,
                                },
                            },
                        },
                        "chuanjiadan9": {
                            image: 'ext:舰R美化/chuanjiadan9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -1,
                            },
                            skills: ["hanbing_skill"],
                            ai: {
                                basic: {
                                    equipValue: 2,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "zziqi9": {
                            image: 'ext:舰R美化/zziqi9.png',
                            audio: true,
                            fullskin: true,
                            type: "basic",
                            toself: true,
                            enable: function (event, player) {
                                //return !player.hasSkill('jiu');
                                return true;
                            },
                            lianheng: true,
                            logv: false,
                            savable: function (card, player, dying) {
                                return dying == player || player.hasSkillTag('jiuOther', null, dying, true);
                            },
                            usable: 1,
                            selectTarget: -1,
                            modTarget: true,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            content: function () {
                                if (typeof event.baseDamage != 'number') event.baseDamage = 1;
                                if (target.isDying() || event.getParent(2).type == 'dying') {
                                    target.recover(event.baseDamage);
                                    if (_status.currentPhase == target) {
                                        target.getStat().card.jiu--;
                                    }
                                }
                                else {
                                    game.addVideo('jiuNode', target, true);
                                    if (cards && cards.length) {
                                        card = cards[0];
                                    }
                                    if (!target.storage.jiu) target.storage.jiu = 0;
                                    target.storage.jiu += event.baseDamage;
                                    game.broadcastAll(function (target, card, gain2) {
                                        target.addSkill('jiu');
                                        if (!target.node.jiu && lib.config.jiu_effect) {
                                            target.node.jiu = ui.create.div('.playerjiu', target.node.avatar);
                                            target.node.jiu2 = ui.create.div('.playerjiu', target.node.avatar2);
                                        }
                                        if (gain2 && card.clone && (card.clone.parentNode == target.parentNode || card.clone.parentNode == ui.arena)) {
                                            card.clone.moveDelete(target);
                                        }
                                    }, target, card, target == targets[0] && cards.length == 1);
                                    if (target == targets[0] && cards.length == 1) {
                                        if (card.clone && (card.clone.parentNode == target.parentNode || card.clone.parentNode == ui.arena)) {
                                            game.addVideo('gain2', target, get.cardsInfo([card]));
                                        }
                                    }
                                }
                            },
                            ai: {
                                basic: {
                                    useful: function (card, i) {
                                        if (_status.event.player.hp > 1) {
                                            if (i == 0) return 4;
                                            return 1;
                                        }
                                        if (i == 0) return 7.3;
                                        return 3;
                                    },
                                    value: function (card, player, i) {
                                        if (player.hp > 1) {
                                            if (i == 0) return 5;
                                            return 1;
                                        }
                                        if (i == 0) return 7.3;
                                        return 3;
                                    },
                                },
                                order: function () {
                                    return get.order({ name: 'sha' }) + 0.2;
                                },
                                result: {
                                    target: function (player, target) {
                                        if (target && target.isDying()) return 2;
                                        if (target && !target.isPhaseUsing()) return 0;
                                        if (lib.config.mode == 'stone' && !player.isMin()) {
                                            if (player.getActCount() + 1 >= player.actcount) return 0;
                                        }
                                        var shas = player.getCards('h', 'sha');
                                        if (shas.length > 1 && (player.getCardUsable('sha') > 1 || player.countCards('h', 'zhuge'))) {
                                            return 0;
                                        }
                                        shas.sort(function (a, b) {
                                            return get.order(b) - get.order(a);
                                        })
                                        var card;
                                        if (shas.length) {
                                            for (var i = 0; i < shas.length; i++) {
                                                if (lib.filter.filterCard(shas[i], target)) {
                                                    card = shas[i]; break;
                                                }
                                            }
                                        }
                                        else if (player.hasSha() && player.needsToDiscard()) {
                                            if (player.countCards('h', 'hufu') != 1) {
                                                card = { name: 'sha' };
                                            }
                                        }
                                        if (card) {
                                            if (game.hasPlayer(function (current) {
                                                return (get.attitude(target, current) < 0 &&
                                                    target.canUse(card, current, null, true) &&
                                                    !current.hasSkillTag('filterDamage', null, {
                                                        player: player,
                                                        card: card,
                                                        jiu: true,
                                                    }) &&
                                                    get.effect(current, card, target) > 0);
                                            })) {
                                                return 1;
                                            }
                                        }
                                        return 0;
                                    },
                                },
                                tag: {
                                    save: 1,
                                    recover: 0.1,
                                },
                            },
                        },
                        "juedouba9": {
                            image: 'ext:舰R美化/juedouba9.png',
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            "yingbian_prompt": "你令此牌不可被响应",
                            "yingbian_tags": ["hit"],
                            yingbian: function (event) {
                                event.directHit.addArray(game.players);
                            },
                            filterTarget: function (card, player, target) {
                                return target != player;
                            },
                            content: function () {
                                "step 0"
                                if (event.turn == undefined) event.turn = target;
                                if (typeof event.baseDamage != 'number') event.baseDamage = 1;
                                if (typeof event.extraDamage != 'number') {
                                    event.extraDamage = 0;
                                }
                                if (!event.shaReq) event.shaReq = {};
                                if (typeof event.shaReq[player.playerid] != 'number') event.shaReq[player.playerid] = 1;
                                if (typeof event.shaReq[target.playerid] != 'number') event.shaReq[target.playerid] = 1;
                                event.playerCards = [];
                                event.targetCards = [];
                                "step 1"
                                event.trigger('juedou');
                                event.shaRequired = event.shaReq[event.turn.playerid];
                                "step 2"
                                if (event.directHit) {
                                    event._result = { bool: false };
                                }
                                else {
                                    var next = event.turn.chooseToRespond({ name: 'sha' });
                                    if (event.shaRequired > 1) {
                                        next.set('prompt2', '共需打出' + event.shaRequired + '张杀')
                                    }
                                    next.set('ai', function (card) {
                                        var event = _status.event;
                                        var player = event.splayer;
                                        var target = event.starget;
                                        if (player.hasSkillTag('notricksource')) return 0;
                                        if (target.hasSkillTag('notrick')) return 0;
                                        if (event.shaRequired > 1 && player.countCards('h', 'sha') < event.shaRequired) return 0;
                                        if (event.player == target) {
                                            if (player.hasSkill('naman')) return -1;
                                            if (get.attitude(target, player) < 0 || event.player.hp <= 1) {
                                                return get.order(card);
                                            }
                                            return -1;
                                        }
                                        else {
                                            if (target.hasSkill('naman')) return -1;
                                            if (get.attitude(player, target) < 0 || event.player.hp <= 1) {
                                                return get.order(card);
                                            }
                                            return -1;
                                        }
                                    });
                                    next.set('splayer', player);
                                    next.set('starget', target);
                                    next.set('shaRequired', event.shaRequired);
                                    next.autochoose = lib.filter.autoRespondSha;
                                    if (event.turn == target) {
                                        next.source = player;
                                    }
                                    else {
                                        next.source = target;
                                    }
                                }
                                "step 3"
                                if (event.target.isDead() || event.player.isDead()) {
                                    event.finish();
                                }
                                else {
                                    if (result.bool) {
                                        event.shaRequired--;
                                        if (event.turn == target) {
                                            if (result.cards) event.targetCards.addArray(result.cards);
                                            if (event.shaRequired > 0) event.goto(2);
                                            else {
                                                event.turn = player;
                                                event.goto(1);
                                            }
                                        }
                                        else {
                                            if (result.cards) event.playerCards.addArray(result.cards);
                                            if (event.shaRequired > 0) event.goto(2);
                                            else {
                                                event.turn = target;
                                                event.goto(1);
                                            }
                                        }
                                    }
                                    else {
                                        if (event.turn == target) {
                                            target.damage(event.baseDamage + event.extraDamage);
                                        }
                                        else {
                                            player.damage(target, event.baseDamage + event.extraDamage);
                                        }
                                    }
                                }
                            },
                            ai: {
                                wuxie: function (target, card, player, viewer) {
                                    if (player == game.me && get.attitude(viewer, player) > 0) {
                                        return 0;
                                    }
                                },
                                basic: {
                                    order: 5,
                                    useful: 1,
                                    value: 5.5,
                                },
                                result: {
                                    target: -1.5,
                                    player: function (player, target, card) {
                                        if (player.hasSkillTag('directHit_ai', true, {
                                            target: target,
                                            card: card,
                                        }, true)) {
                                            return 0;
                                        }
                                        if (get.damageEffect(target, player, target) > 0 && get.attitude(player, target) > 0 && get.attitude(target, player) > 0) {
                                            return 0;
                                        }
                                        var hs1 = target.getCards('h', 'sha');
                                        var hs2 = player.getCards('h', 'sha');
                                        if (hs1.length > hs2.length + 1) {
                                            return -2;
                                        }
                                        var hsx = target.getCards('h');
                                        if (hsx.length > 2 && hs2.length == 0 && hsx[0].number < 6) {
                                            return -2;
                                        }
                                        if (hsx.length > 3 && hs2.length == 0) {
                                            return -2;
                                        }
                                        if (hs1.length > hs2.length && (!hs2.length || hs1[0].number > hs2[0].number)) {
                                            return -2;
                                        }
                                        return -0.5;
                                    },
                                },
                                tag: {
                                    respond: 2,
                                    respondSha: 2,
                                    damage: 1,
                                },
                            },
                            selectTarget: 1,
                        },
                        "leibusigang9": {
                            image: 'ext:舰R美化/leibusigang9.png',
                            audio: true,
                            fullskin: true,
                            type: "delay",
                            filterTarget: function (card, player, target) {
                                return (lib.filter.judge(card, player, target) && player != target);
                            },
                            judge: function (card) {
                                if (get.suit(card) == 'heart') return 1;
                                return -2;
                            },
                            "judge2": function (result) {
                                if (result.bool == false) return true;
                                return false;
                            },
                            effect: function () {
                                if (result.bool == false) {
                                    lib.animate.skill['lebu'].call(player, 'lebu');
                                    player.skip('phaseUse');
                                }
                            },
                            ai: {
                                basic: {
                                    order: 1,
                                    useful: 1,
                                    value: 8,
                                },
                                result: {
                                    ignoreStatus: true,
                                    target: function (player, target) {
                                        var num = target.hp - target.countCards('h') - 2;
                                        if (num > -1) return -0.01;
                                        if (target.hp < 3) num--;
                                        if (target.isTurnedOver()) num /= 2;
                                        var dist = get.distance(player, target, 'absolute');
                                        if (dist < 1) dist = 1;
                                        return num / Math.sqrt(dist) * get.threaten(target, player);
                                    },
                                },
                                tag: {
                                    skip: "phaseUse",
                                },
                            },
                            selectTarget: 1,
                            enable: true,
                            content: function () {
                                if (lib.filter.judge(card, player, target) && cards.length && get.position(cards[0], true) == 'o') target.addJudge(card, cards);
                            },
                            allowMultiple: false,
                        },
                        "manchangyy9": {
                            image: 'ext:舰R美化/manchangyy9.png',
                            audio: true,
                            type: "trick",
                            enable: true,
                            selectTarget: -1,
                            "yingbian_prompt": "当你使用此牌选择目标后，你可为此牌减少一个目标",
                            "yingbian_tags": ["remove"],
                            yingbian: function (event) {
                                event.yingbian_removeTarget = true;
                            },
                            filterTarget: function (card, player, target) {
                                return target != player;
                            },
                            reverseOrder: true,
                            content: function () {
                                "step 0"
                                if (typeof event.baseDamage != 'number') event.baseDamage = 1;
                                if (event.directHit) event._result = { bool: false };
                                else {
                                    var next = target.chooseToRespond({ name: 'sha' } || { name: 'sha' });
                                    next.set('ai', function (card) {
                                        var evt = _status.event.getParent();
                                        if (get.damageEffect(evt.target, evt.player, evt.target) >= 0) return 0;
                                        if (evt.player.hasSkillTag('notricksource')) return 0;
                                        if (evt.target.hasSkillTag('notrick')) return 0;
                                        return get.order(card);
                                    });
                                    next.autochoose = lib.filter.autoRespondSha;
                                }
                                "step 1"
                                if (result.bool == false) {
                                    target.damage(event.baseDamage, event.customSource || player);
                                }
                            },
                            ai: {
                                wuxie: function (target, card, player, viewer) {
                                    var cxdy = game.countPlayer(function (current) {
                                        return current.hp == 1 && !current.hasSkill('tengjia1') && current.countCards('hs', 'sha') == 0 && get.attitude(current, player) > 0;
                                    });
                                    if (cxdy > 0) {
                                        if (get.attitude(viewer, target) > 0 && target.hp > 1) {
                                            return 0;
                                        }
                                    } else {
                                        if (get.attitude(viewer, target) > 0 && target != player && target.hp >= 3) {
                                            return 0;
                                        }
                                    }
                                    if (get.attitude(viewer, target) > 0 && target.countCards('h') > 3 && target.countCards('hs', 'sha') > 0) {
                                        return 0;
                                    }
                                    if (get.attitude(player, target) <= 0) {
                                        return 0;
                                    }
                                },
                                basic: {
                                    order: function (item, player) {
                                        return get.order({ name: 'sha' }) - 0.5;
                                    },
                                    useful: [5, 1],
                                    value: 5,
                                },
                                result: {
                                    "target_use": function (player, target) {
                                        if (player.hasUnknown(2) && get.mode() != 'guozhan') return 0;
                                        var nh = target.countCards('h');
                                        if (get.mode() == 'identity') {
                                            if (target.isZhu && nh <= 2 && target.hp <= 1) return -100;
                                        }
                                        if (nh == 0) return -2;
                                        if (nh == 1) return -1.7
                                        return -1.5;
                                    },
                                    target: function (player, target) {
                                        var nh = target.countCards('h');
                                        if (get.mode() == 'identity') {
                                            if (target.isZhu && nh <= 2 && target.hp <= 1) return -100;
                                        }
                                        if (nh == 0) return -2;
                                        if (nh == 1) return -1.7
                                        return -1.5;
                                    },
                                },
                                tag: {
                                    respond: 1,
                                    respondSha: 1,
                                    damage: 1,
                                    multitarget: 1,
                                    multineg: 1,
                                },
                            },
                            fullskin: true,
                        },
                        "huojiandan9": {
                            image: 'ext:舰R美化/huojiandan9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -4,
                            },
                            ai: {
                                basic: {
                                    equipValue: 3,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            skills: ["qilin_skill"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "chuanjiayl9": {
                            image: 'ext:舰R美化/chuanjiayl9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -1,
                            },
                            ai: {
                                basic: {
                                    equipValue: 2,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            skills: ["qinggang_skill"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "xiaolishe9": {
                            image: 'ext:舰R美化/xiaolishe9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -2,
                            },
                            ai: {
                                equipValue: function (card, player) {
                                    return Math.min(2.5 + player.countCards('h', 'sha'), 4);
                                },
                                basic: {
                                    equipValue: 3.5,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            skills: ["qinglong_skill_R"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "qingjia9": {
                            image: 'ext:舰R美化/qingjia9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip2",
                            skills: ["renwang_skill"],
                            ai: {
                                basic: {
                                    equipValue: 7.5,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "sheji9": {
                            image: 'ext:舰R美化/sheji9.png',
                            audio: true,
                            global: ["shashanwuxietao"],
                            nature: ["thunder", "fire", "kami", "ice"],
                            type: "basic",
                            enable: true,
                            autoViewAs: "sha",
                            usable: 1,
                            updateUsable: "phaseUse",
                            range: function (card, player, target) {
                                return player.inRange(target);
                            },
                            selectTarget: 1,
                            cardPrompt: function (card) {
                                if (card.nature == 'stab') return '出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，且在此之后需弃置一张手牌（没有则不弃）。否则你对其造成1点伤害。';
                                if (lib.linked.contains(card.nature)) return '出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，否则你对其造成1点' + get.translation(card.nature) + '属性伤害。';
                                return '出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，否则你对其造成1点伤害。';
                            },
                            "yingbian_prompt": function (card) {
                                var str = '';
                                if (get.cardtag(card, 'yingbian_hit')) {
                                    str += '此牌不可被响应';
                                }
                                if (get.cardtag(card, 'yingbian_damage')) {
                                    if (str.length) str += '；';
                                    str += '此牌的伤害值基数+1';
                                }
                                if (!str.length || get.cardtag(card, 'yingbian_add')) {
                                    if (str.length) str += '；';
                                    str += '当你使用此牌选择目标后，你可为此牌增加一个目标';
                                }
                                return str;
                            },
                            yingbian: function (event) {
                                var card = event.card, bool = false;
                                if (get.cardtag(card, 'yingbian_hit')) {
                                    bool = true;
                                    event.directHit.addArray(game.players);
                                    game.log(card, '不可被响应');
                                }
                                if (get.cardtag(card, 'yingbian_damage')) {
                                    bool = true;
                                    if (typeof event.baseDamage != 'number') event.baseDamage = 1;
                                    event.baseDamage++;
                                    game.log(event.card, '的伤害值基数+1');
                                }
                                if (!bool || get.cardtag(card, 'yingbian_add')) {
                                    event.yingbian_addTarget = true;
                                }
                            },
                            "yingbian_tags": ["hit", "damage", "add"],
                            filterTarget: function (card, player, target) { return player != target },
                            content: function () {
                                "step 0"
                                if (typeof event.shanRequired != 'number' || !event.shanRequired || event.shanRequired < 0) {
                                    event.shanRequired = 1;
                                }
                                if (typeof event.baseDamage != 'number') event.baseDamage = 1;
                                if (typeof event.extraDamage != 'number') event.extraDamage = 0;
                                "step 1"
                                if (event.directHit || event.directHit2 || (!_status.connectMode && lib.config.skip_shan && !target.hasShan())) {
                                    event._result = { bool: false };
                                }
                                else if (event.skipShan) {
                                    event._result = { bool: true, result: 'shaned' };
                                }
                                else {
                                    var next = target.chooseToUse('请使用一张闪响应杀');
                                    next.set('type', 'respondShan');
                                    next.set('filterCard', function (card, player) {
                                        if (get.name(card) != 'shan') return false;
                                        return lib.filter.cardEnabled(card, player, 'forceEnable');
                                    });
                                    if (event.shanRequired > 1) {
                                        next.set('prompt2', '（共需使用' + event.shanRequired + '张闪）');
                                    }
                                    else if (event.card.nature == 'stab') {
                                        next.set('prompt2', '（在此之后仍需弃置一张手牌）');
                                    }
                                    next.set('ai1', function (card) {
                                        var target = _status.event.player;
                                        var evt = _status.event.getParent();
                                        var bool = true;
                                        if (_status.event.shanRequired > 1 && !get.is.object(card) && target.countCards('h', 'shan') < _status.event.shanRequired) {
                                            bool = false;
                                        }
                                        else if (target.hasSkillTag('useShan')) {
                                            bool = true;
                                        }
                                        else if (target.hasSkillTag('noShan')) {
                                            bool = false;
                                        }
                                        else if (get.damageEffect(target, evt.player, target, evt.card.nature) >= 0) bool = false;
                                        if (bool) {
                                            return get.order(card);
                                        }
                                        return 0;
                                    }).set('shanRequired', event.shanRequired);
                                    next.set('respondTo', [player, card]);
                                    //next.autochoose=lib.filter.autoRespondShan;
                                }
                                "step 2"
                                if (!result || !result.bool || !result.result || result.result != 'shaned') {
                                    event.trigger('shaHit');
                                }
                                else {
                                    event.shanRequired--;
                                    if (event.shanRequired > 0) {
                                        event.goto(1);
                                    }
                                    else if (event.card.nature == 'stab' && target.countCards('h') > 0) {
                                        event.responded = result;
                                        event.goto(4);
                                    }
                                    else {
                                        event.trigger('shaMiss');
                                        event.responded = result;
                                    }
                                }
                                "step 3"
                                if ((!result || !result.bool || !result.result || result.result != 'shaned') && !event.unhurt) {
                                    target.damage(get.nature(event.card), event.baseDamage + event.extraDamage);
                                    event.result = { bool: true }
                                    event.trigger('shaDamage');
                                }
                                else {
                                    event.result = { bool: false }
                                    event.trigger('shaUnhirt');
                                }
                                event.finish();
                                "step 4"
                                target.chooseToDiscard('刺杀：请弃置一张牌，否则此【杀】依然造成伤害').set('ai', function (card) {
                                    var target = _status.event.player;
                                    var evt = _status.event.getParent();
                                    var bool = true;
                                    if (get.damageEffect(target, evt.player, target, evt.card.nature) >= 0) bool = false;
                                    if (bool) {
                                        return 8 - get.useful(card);
                                    }
                                    return 0;
                                });
                                "step 5"
                                if ((!result || !result.bool) && !event.unhurt) {
                                    target.damage(get.nature(event.card), event.baseDamage + event.extraDamage);
                                    event.result = { bool: true }
                                    event.trigger('shaDamage');
                                    event.finish();
                                }
                                else {
                                    event.trigger('shaMiss');
                                }
                                "step 6"
                                if ((!result || !result.bool) && !event.unhurt) {
                                    target.damage(get.nature(event.card), event.baseDamage + event.extraDamage);
                                    event.result = { bool: true }
                                    event.trigger('shaDamage');
                                    event.finish();
                                }
                                else {
                                    event.result = { bool: false }
                                    event.trigger('shaUnhirt');
                                }
                            },
                            ai: {
                                yingbian: function (card, player, targets, viewer) {
                                    if (get.attitude(viewer, player) <= 0) return 0;
                                    var base = 0, hit = false;
                                    if (get.cardtag(card, 'yingbian_hit')) {
                                        hit = true;
                                        if (targets.filter(function (target) {
                                            return target.hasShan() && get.attitude(viewer, target) < 0 && get.damageEffect(target, player, viewer, get.nature(card)) > 0;
                                        })) base += 5;
                                    }
                                    if (get.cardtag(card, 'yingbian_all')) {
                                        if (game.hasPlayer(function (current) {
                                            return !targets.contains(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
                                        })) base += 5;
                                    }
                                    if (get.cardtag(card, 'yingbian_damage')) {
                                        if (targets.filter(function (target) {
                                            return get.attitude(player, target) < 0 && (hit || !target.mayHaveShan() || player.hasSkillTag('directHit_ai', true, {
                                                target: target,
                                                card: card,
                                            }, true)) && !target.hasSkillTag('filterDamage', null, {
                                                player: player,
                                                card: card,
                                                jiu: true,
                                            })
                                        })) base += 5;
                                    }
                                    return base;
                                },
                                canLink: function (player, target, card) {
                                    if (!target.isLinked() && !player.hasSkill('wutiesuolian_skill')) return false;
                                    if (target.mayHaveShan() && !player.hasSkillTag('directHit_ai', true, {
                                        target: target,
                                        card: card,
                                    }, true)) return false;
                                    if (player.hasSkill('jueqing') || player.hasSkill('gangzhi') || target.hasSkill('gangzhi')) return false;
                                    return true;
                                },
                                basic: {
                                    useful: [5, 3, 1],
                                    value: [5, 3, 1],
                                },
                                order: function (item, player) {
                                    if (player.hasSkillTag('presha', true, null, true)) return 10;
                                    if (lib.linked.contains(get.nature(item))) {
                                        if (game.hasPlayer(function (current) {
                                            return current != player && current.isLinked() && player.canUse(item, current, null, true) && get.effect(current, item, player, player) > 0 && lib.card.sha.ai.canLink(player, current, item);
                                        }) && game.countPlayer(function (current) {
                                            return current.isLinked() && get.damageEffect(current, player, player, get.nature(item)) > 0;
                                        }) > 1) return 3.1;
                                        return 3;
                                    }
                                    return 3.05;
                                },
                                result: {
                                    target: function (player, target, card, isLink) {
                                        var eff = function () {
                                            if (!isLink && player.hasSkill('jiu')) {
                                                if (!target.hasSkillTag('filterDamage', null, {
                                                    player: player,
                                                    card: card,
                                                    jiu: true,
                                                })) {
                                                    if (get.attitude(player, target) > 0) {
                                                        return -7;
                                                    }
                                                    else {
                                                        return -4;
                                                    }
                                                }
                                                return -0.5;
                                            }
                                            return -1.5;
                                        }();
                                        if (!isLink && target.mayHaveShan() && !player.hasSkillTag('directHit_ai', true, {
                                            target: target,
                                            card: card,
                                        }, true)) return eff / 1.2;
                                        return eff;
                                    },
                                },
                                tag: {
                                    respond: 1,
                                    respondShan: 1,
                                    damage: function (card) {
                                        if (card.nature == 'poison') return;
                                        return 1;
                                    },
                                    natureDamage: function (card) {
                                        if (card.nature) return 1;
                                    },
                                    fireDamage: function (card, nature) {
                                        if (card.nature == 'fire') return 1;
                                    },
                                    thunderDamage: function (card, nature) {
                                        if (card.nature == 'thunder') return 1;
                                    },
                                    poisonDamage: function (card, nature) {
                                        if (card.nature == 'poison') return 1;
                                    },
                                },
                            },
                            fullskin: true,
                        },
                        "huibi9": {
                            global: ["shashanwuxietao"],
                            image: 'ext:舰R美化/huibi9.png',
                            audio: true,
                            fullskin: true,
                            type: "basic",
                            autoViewAs: "shan",
                            cardcolor: "red",
                            notarget: true,
                            nodelay: true,
                            "yingbian_prompt": function (card) {
                                var str = '';
                                if (get.cardtag(card, 'yingbian_gain')) {
                                    str += '当你声明使用此牌时，你获得此牌响应的目标牌';
                                }
                                if (!str.length || get.cardtag(card, 'yingbian_draw')) {
                                    if (str.length) str += '；';
                                    str += '当你声明使用此牌时，你摸一张牌';
                                }
                                return str;
                            },
                            "yingbian_tags": ["gain", "draw"],
                            yingbian: function (event) {
                                var bool = false;
                                if (get.cardtag(event.card, 'yingbian_damage')) {
                                    bool = true;
                                    var cardx = event.respondTo;
                                    if (cardx && cardx[1] && cardx[1].cards && cardx[1].cards.filterInD('od').length) player.gain(cardx[1].cards.filterInD('od'), 'gain2', 'log');
                                }
                                if (!bool || get.cardtag(event.card, 'yingbian_draw')) event.player.draw();
                            },
                            content: function () {
                                event.result = 'shaned';
                                event.getParent().delayx = false;
                                game.delay(0.5);
                            },
                            ai: {
                                order: 3,
                                respondshan: 1,
                                basic: {
                                    useful: [7, 5.1, 2],
                                    value: [7, 5.1, 2],
                                },
                                result: {
                                    player: 1,
                                },
                            },
                        },
                        "taifeng9": {
                            image: 'ext:舰R美化/taifeng9.png',
                            audio: true,
                            fullskin: true,
                            type: "delay",
                            cardnature: "thunder",
                            modTarget: function (card, player, target) {
                                return lib.filter.judge(card, player, target);
                            },
                            enable: function (card, player) {
                                return player.canAddJudge(card);
                            },
                            filterTarget: function (card, player, target) {
                                return (lib.filter.judge(card, player, target) && player == target);
                            },
                            selectTarget: [-1, -1],
                            judge: function (card) {
                                if (get.suit(card) == 'spade' && get.number(card) > 1 && get.number(card) < 10) return -5;
                                return 1;
                            },
                            "judge2": function (result) {
                                if (result.bool == false) return true;
                                return false;
                            },
                            effect: function () {
                                if (result.bool == false) {
                                    //lib.animate.skill['shandian'].call(player, 'shandian');
                                    player.damage(3, 'thunder', 'nosource');
                                } else {
                                    player.addJudgeNext(card);
                                }
                            },
                            cancel: function () {
                                player.addJudgeNext(card);
                            },
                            ai: {
                                basic: {
                                    order: 1,
                                    useful: 0,
                                    value: 0,
                                },
                                result: {
                                    target: function (player, target) {
                                        var num = game.countPlayer(function (current) {
                                            var skills = current.getSkills();
                                            for (var j = 0; j < current.skills.length; j++) {
                                                var rejudge = get.tag(current.skills[j], 'rejudge', current);
                                                if (rejudge != undefined) {
                                                    if (get.attitude(target, current) > 0 &&
                                                        get.attitude(current, target) > 0) {
                                                        return rejudge;
                                                    }
                                                    else {
                                                        return -rejudge;
                                                    }
                                                }
                                            }
                                        });
                                        if (num > 0) return num;
                                        if (num == 0) {
                                            var mode = get.mode();
                                            if (mode == 'identity') {
                                                if (target.identity == 'nei') return 1;
                                                var situ = get.situation();
                                                if (target.identity == 'fan') {
                                                    if (situ > 1) return 1;
                                                }
                                                else {
                                                    if (situ < -1) return 1;
                                                }
                                            }
                                            else if (mode == 'guozhan') {
                                                if (target.identity == 'ye') return 1;
                                                if (game.hasPlayer(function (current) {
                                                    return current.identity == 'unknown';
                                                })) {
                                                    return -1;
                                                }
                                                if (get.population(target.identity) == 1) {
                                                    if (target.maxHp > 2 && target.hp < 2) return 1;
                                                    if (game.countPlayer() < 3) return -1;
                                                    if (target.hp <= 2 && target.countCards('he') <= 3) return 1;
                                                }
                                            }
                                        }
                                        return -1;
                                    },
                                },
                                tag: {
                                },
                            },
                            content: function () {
                                if (lib.filter.judge(card, player, target) && cards.length && get.position(cards[0], true) == 'o') target.addJudge(card, cards);
                            },
                            allowMultiple: false,
                        },
                        "zhanlipin9": {
                            image: 'ext:舰R美化/zhanlipin9.png',
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            range: {
                                global: 1,
                            },
                            selectTarget: 1,
                            postAi: function (targets) {
                                return targets.length == 1 && targets[0].countCards('j');
                            },
                            filterTarget: function (card, player, target) {
                                if (player == target) return false;
                                return target.countGainableCards(player, get.is.single() ? 'he' : 'hej') > 0;
                            },
                            content: function () {
                                var position = get.is.single() ? 'he' : 'hej';
                                if (target.countGainableCards(player, position)) {
                                    player.gainPlayerCard(position, target, true);
                                }
                            },
                            ai: {
                                wuxie: function (target, card, player, viewer) {
                                    if (get.attitude(viewer, player) > 0 && get.attitude(viewer, target) > 0) {
                                        return 0;
                                    }
                                },
                                basic: {
                                    order: 7.5,
                                    useful: 4,
                                    value: 9,
                                },
                                result: {
                                    target: function (player, target) {
                                        if (get.attitude(player, target) <= 0) return (target.countCards('he', function (card) {
                                            return get.value(card, target) > 0 && card != target.getEquip('jinhe');
                                        }) > 0) ? -1.5 : 1.5;
                                        return (target.countCards('ej', function (card) {
                                            if (get.position(card) == 'e') return get.value(card, target) <= 0;
                                            var cardj = card.viewAs ? { name: card.viewAs } : card;
                                            return get.effect(target, cardj, target, player) < 0;
                                        }) > 0) ? 1.5 : -1.5;
                                    },
                                    player: function (player, target) {
                                        if (get.attitude(player, target) < 0 && !target.countCards('he', function (card) {
                                            return get.value(card, target) > 0 && card != target.getEquip('jinhe');
                                        })) {
                                            return 0;
                                        }
                                        if (get.attitude(player, target) > 1) {
                                            return (target.countCards('ej', function (card) {
                                                if (get.position(card) == 'e') return get.value(card, target) <= 0;
                                                var cardj = card.viewAs ? { name: card.viewAs } : card;
                                                return get.effect(target, cardj, target, player) < 0;
                                            }) > 0) ? 1.5 : -1.5;
                                        }
                                        return 1;
                                    },
                                },
                                tag: {
                                    loseCard: 1,
                                    gain: 1,
                                },
                            },
                        },
                        "kuaixiu9": {
                            image: 'ext:舰R美化/kuaixiu9.png',
                            fullskin: true,
                            type: "basic",
                            autoViewAs: "tao",
                            cardcolor: "red",
                            toself: true,
                            enable: function (card, player) {
                                return player.hp < player.maxHp;
                            },
                            savable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player && target.hp < target.maxHp;
                            },
                            modTarget: function (card, player, target) {
                                return target.hp < target.maxHp;
                            },
                            content: function () {
                                target.recover(event.baseDamage || 1);
                            },
                            ai: {
                                basic: {
                                    order: function (card, player) {
                                        if (player.hasSkillTag('pretao')) return 5;
                                        return 2;
                                    },
                                    useful: [6.5, 4, 3, 2],
                                    value: [6.5, 4, 3, 2],
                                },
                                result: {
                                    target: 2,
                                    "target_use": function (player, target) {
                                        var numt = player.countCards('hs', 'tao');
                                        var tri = _status.event.getTrigger();
                                        var numz = game.countPlayer(function (current) {
                                            return current.identity == 'zhong' || current.identity == 'mingzhong';
                                        });
                                        var numf = game.countPlayer(function (current) {
                                            return current.identity == 'fan';
                                        });
                                        if (_status.mode == "normal" && tri && tri.name == 'dying') {
                                            if (player.identity == 'zhu') {
                                                if (target.identity == 'zhong' || target.identity == 'mingzhong') {
                                                    if ((numt + target.hp) > 0 && player.hp >= 2) {
                                                        return 1;
                                                    } else {
                                                        return 0;
                                                    }
                                                }
                                                if (target.identity == 'nei' && numf >= 3 && player.hp >= 2 && target.hasSkill('AIkaiguan_tz')) {
                                                    if ((numt + target.hp) > 0) {
                                                        return 1;
                                                    } else {
                                                        if (player.hp < 2) {
                                                            return 0;
                                                        }
                                                    }
                                                }
                                                if (target.identity == 'fan') {
                                                    return 0;
                                                }
                                            }
                                            if (player.identity == 'zhong') {
                                                if (target != player && (target.identity == 'zhong' || target.identity == 'mingzhong')) {
                                                    if ((numt + target.hp) > 0) {
                                                        return 1;
                                                    } else {
                                                        return 0;
                                                    }
                                                }
                                                if (target.identity == 'zhong' && target == player) {
                                                    return 1;
                                                }
                                                if (target.identity == 'zhu') {
                                                    return 1;
                                                }
                                                if (target.identity == 'nei' && numf >= 3 && numz <= 1 && target.hasSkill('AIkaiguan_tz')) {
                                                    if ((numt + target.hp) > 0 && player.hp >= 2) {
                                                        return 1;
                                                    } else {
                                                        return 0;
                                                    }
                                                }
                                                if (target.identity == 'fan') {
                                                    return 0;
                                                }
                                            }
                                            if (player.identity == 'nei' && (player.hasSkill('AIkaiguan_tz') || player.hasSkill('AIkaiguan_tf'))) {
                                                if (target.identity == 'zhu') {
                                                    return 1;
                                                }
                                                if (player.hasSkill('AIkaiguan_tz') && (target.identity == 'zhong' || target.identity == 'mingzhong')) {
                                                    if ((numt + target.hp) > 0 && player.hp >= 2 && numf >= 3 && numz <= 1) {
                                                        return 1;
                                                    } else {
                                                        return 0;
                                                    }
                                                }
                                                if (player.hasSkill('AIkaiguan_tf') && target.identity == 'fan' && tri.source && tri.source != player) {
                                                    if ((numt + target.hp) > 0 && player.hp >= 2 && numf <= 1 && numz >= 2) {
                                                        return 1;
                                                    } else {
                                                        return 0;
                                                    }
                                                }
                                            }
                                            if (player.identity == 'fan') {
                                                if (target.identity == 'fan' && tri.source && tri.source.identity == 'fan') {
                                                    if (target.countCards('h') >= 3 && (numt + target.hp) > 0) {
                                                        return 1;
                                                    } else {
                                                        if (target.countCards('h') < 3 && (numt + target.hp) <= 0) {
                                                            return 0;
                                                        }
                                                    }
                                                }
                                                if (target.identity == 'fan' && tri.source && tri.source.identity != 'fan') {
                                                    if (target == player) {
                                                        return 1;
                                                    } else {
                                                        if (target != player) {
                                                            if ((numt + target.hp) > 0) {
                                                                return 1;
                                                            } else {
                                                                if ((numt + target.hp) <= 0) {
                                                                    return 0;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                if (target.identity == 'fan' && !tri.source) {
                                                    if (target == player) {
                                                        return 1;
                                                    } else {
                                                        if (target != player) {
                                                            if ((numt + target.hp) > 0) {
                                                                return 1;
                                                            } else {
                                                                if ((numt + target.hp) <= 0) {
                                                                    return 0;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                if (target.identity == 'nei' && numf <= 1 && numz >= 2 && target.hasSkill('AIkaiguan_tf')) {
                                                    if ((numt + target.hp) > 0 && player.hp >= 2) {
                                                        return 1;
                                                    }
                                                }
                                                if (target.identity == 'zhu' || target.identity == 'zhong') {
                                                    return 0;
                                                }
                                            }
                                        }
                                        if (tri && tri.name == 'dying' && get.mode() != 'identity' && get.attitude(player, target) > 0) {
                                            if ((numt + target.hp) > 0) {
                                                return 1;
                                            } else {
                                                if ((numt + target.hp) <= 0) {
                                                    return 0;
                                                }
                                            }
                                        }
                                        if (tri && tri.name == 'dying') {
                                            if (target.hasSkill('spshanxi_bj') && target.countCards('he') < 2) {
                                                return 0;
                                            }
                                        }
                                        // if(player==target&&player.hp<=0) return 2;
                                        if (player.hasSkillTag('nokeep', true, null, true)) return 2;
                                        var nd = player.needsToDiscard();
                                        var keep = false;
                                        if (nd <= 0) {
                                            keep = true;
                                        }
                                        else if (nd == 1 && target.hp >= 2 && target.countCards('h', 'tao') <= 1) {
                                            keep = true;
                                        }
                                        var mode = get.mode();
                                        if (target.hp >= 2 && keep && target.hasFriend()) {
                                            if (target.hp > 2 || nd == 0) return 0;
                                            if (target.hp == 2) {
                                                if (game.hasPlayer(function (current) {
                                                    if (target != current && get.attitude(target, current) >= 3) {
                                                        if (current.hp <= 1) return true;
                                                        if ((mode == 'identity' || mode == 'versus' || mode == 'chess') && current.identity == 'zhu' && current.hp <= 2) return true;
                                                    }
                                                })) {
                                                    return 0;
                                                }
                                            }
                                        }
                                        var att = get.attitude(player, target);
                                        if (att < 3 && att >= 0 && player != target) return 0;
                                        if (mode == 'identity' && player.identity == 'fan' && target.identity == 'fan') {
                                            if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'fan' && tri.source != target) {
                                                var num = game.countPlayer(function (current) {
                                                    if (current.identity == 'fan') {
                                                        return current.countCards('h', 'tao');
                                                    }
                                                });
                                                if (num > 1 && player == target) return 2;
                                                return 0;
                                            }
                                        }
                                        if (mode == 'identity' && player.identity == 'zhu' && target.identity == 'nei') {
                                            if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'zhong') {
                                                return 0;
                                            }
                                        }
                                        if (mode == 'stone' && target.isMin() &&
                                            player != target && tri && tri.name == 'dying' && player.side == target.side &&
                                            tri.source != target.getEnemy()) {
                                            return 0;
                                        }
                                        return 2;
                                    },
                                },
                                tag: {
                                    recover: 1,
                                    save: 1,
                                },
                            },
                        },
                        "jingjixiuli9": {
                            image: 'ext:舰R美化/jingjixiuli9.png',
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: -1,
                            cardcolor: "red",
                            reverseOrder: true,
                            "yingbian_prompt": "当你使用此牌选择目标后，你可为此牌减少一个目标",
                            "yingbian_tags": ["remove"],
                            yingbian: function (event) {
                                event.yingbian_removeTarget = true;
                            },
                            filterTarget: function (card, player, target) {
                                //return target.hp<target.maxHp;
                                return true;
                            },
                            ignoreTarget: function (card, player, target) {
                                return target.isHealthy();
                            },
                            content: function () {
                                target.recover();
                            },
                            ai: {
                                basic: {
                                    order: function (item, player) {
                                        var ssdy = game.countPlayer(function (current) {
                                            return current.getDamagedHp() && get.attitude(current, player) > 0;
                                        });
                                        var ssdr = game.countPlayer(function (current) {
                                            return current.getDamagedHp() && get.attitude(current, player) <= 0;
                                        });
                                        if (ssdy >= ssdr) {
                                            return get.order({ name: 'nanman' }) + 0.25;
                                            return get.order({ name: 'wanjian' }) + 0.25;
                                        } else {
                                            return get.order({ name: 'nanman' }) - 0.25;
                                            return get.order({ name: 'wanjian' }) - 0.25;
                                        }
                                    },
                                    useful: [3, 1],
                                    value: 0,
                                },
                                result: {
                                    target: function (player, target) {
                                        return (target.hp < target.maxHp) ? 2 : 0;
                                    },
                                },
                                tag: {
                                    recover: 0.5,
                                    multitarget: 1,
                                },
                            },
                        },
                        "zhongjia9": {
                            image: 'ext:舰R美化/zhongjia9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip2",
                            ai: {
                                value: function (card, player, index, method) {
                                    if (player.isDisabled(2)) return 0.01;
                                    if (card == player.getEquip(2)) {
                                        if (player.hasSkillTag('noDirectDamage')) return 10;
                                        if (game.hasPlayer(function (current) {
                                            return current != player && get.attitude(current, player) < 0 && current.hasSkillTag('thunderAttack', null, null, true);
                                        })) return 0;
                                        return 6;
                                    }
                                    var value = 0;
                                    var info = get.info(card);
                                    var current = player.getEquip(info.subtype);
                                    if (current && card != current) {
                                        value = get.value(current, player);
                                    }
                                    var equipValue = info.ai.equipValue;
                                    if (equipValue == undefined) {
                                        equipValue = info.ai.basic.equipValue;
                                    }
                                    if (typeof equipValue == 'function') {
                                        if (method == 'raw') return equipValue(card, player);
                                        if (method == 'raw2') return equipValue(card, player) - value;
                                        return Math.max(0.1, equipValue(card, player) - value);
                                    }
                                    if (typeof equipValue != 'number') equipValue = 0;
                                    if (method == 'raw') return equipValue;
                                    if (method == 'raw2') return equipValue - value;
                                    return Math.max(0.1, equipValue - value);
                                },
                                equipValue: function (card, player) {
                                    if (player.hasSkillTag('maixie') && player.hp > 1) return 0;
                                    if (player.hasSkillTag('noDirectDamage')) return 10;
                                    if (get.damageEffect(player, player, player, 'thunder') >= 0) return 10;
                                    var num = 4 - game.countPlayer(function (current) {
                                        if (get.attitude(current, player) < 0) {
                                            if (current.hasSkillTag('thunderAttack', null, null, true)) return 3;
                                            return 1;
                                        }
                                        return false;
                                    });
                                    if (player.hp == 1) num += 3;
                                    if (player.hp == 2) num += 1;
                                    return num;
                                },
                                basic: {
                                    equipValue: 3,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            skills: ["tiejia1", "tiejia2", "tiejia3", "tiejia4"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "lastfriend9": {
                            image: 'ext:舰R美化/lastfriend9.png',
                            audio: true,
                            type: "trick",
                            enable: true,
                            filterTarget: function (card, player, target) {
                                return true ;
                            },
                            selectTarget: 2,
                            complexTarget: true,
                            content: function () {
                                "step 0"
                                event.target = target;
                                target.link(); if (target.isFriendOf(player)) { player.draw(); };
                            },
                            chongzhu: true,
                            ai: {
                                wuxie: function (target, card, player, viewer) {
                                    if (_status.event.getRand() < 0.5) return 0;
                                    if (!target.hasSkill('tengjia2') && get.attitude(viewer, player) > 0) {
                                        return 0;
                                    }
                                    if (target.hp > 2 && get.attitude(viewer, player) > 0) {
                                        return 0;
                                    }
                                },
                                basic: {
                                    useful: 4,
                                    value: 4,
                                    order: 7,
                                },
                                result: {
                                    target: function (player, target) {
                                        if (target.isLinked()) {
                                            if (target.hasSkillTag('link')) return 0;
                                            var f = target.hasSkillTag('nofire');
                                            var t = target.hasSkillTag('nothunder');
                                            if (f && t) return 0;
                                            if (f || t) return 0.5;
                                            return 2;
                                        }
                                        if (get.attitude(player, target) >= 0) return -0.9;
                                        if (ui.selected.targets.length) return -0.9;
                                        if (game.hasPlayer(function (current) {
                                            return get.attitude(player, current) <= -1 && current != target && !current.isLinked();
                                        })) {
                                            return -0.9;
                                        }
                                        return 0;
                                    },
                                },
                                tag: {
                                    multitarget: 1,
                                    multineg: 1,
                                    norepeat: 1,
                                },
                            },
                            fullskin: true,
                        },
                        "zhiyuangj9": {
                            image: 'ext:舰R美化/zhiyuangj9.png',
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: -1,
                            reverseOrder: true,
                            "yingbian_prompt": "当你使用此牌选择目标后，你可为此牌减少一个目标",
                            "yingbian_tags": ["remove"],
                            yingbian: function (event) {
                                event.yingbian_removeTarget = true;
                            },
                            filterTarget: function (card, player, target) {
                                return target != player;
                            },
                            content: function () {
                                "step 0"
                                if (typeof event.baseDamage != 'number') event.baseDamage = 1;
                                if (event.directHit) event._result = { bool: false };
                                else {
                                    var next = target.chooseToRespond({ name: 'shan' });
                                    next.set('ai', function (card) {
                                        var evt = _status.event.getParent();
                                        if (get.damageEffect(evt.target, evt.player, evt.target) >= 0) return 0;
                                        if (evt.player.hasSkillTag('notricksource')) return 0;
                                        if (evt.target.hasSkillTag('notrick')) return 0;
                                        if (evt.target.hasSkillTag('noShan')) {
                                            return -1;
                                        }
                                        return get.order(card);
                                    });
                                    next.autochoose = lib.filter.autoRespondShan;
                                }
                                "step 1"
                                if (result.bool == false) {
                                    target.damage(event.baseDamage);
                                }
                            },
                            ai: {
                                wuxie: function (target, card, player, viewer) {
                                    var cxdy = game.countPlayer(function (current) {
                                        return current.hp == 1 && !current.hasSkill('tengjia1') && get.attitude(current, player) > 0;
                                    });
                                    if (cxdy > 0) {
                                        if (get.attitude(viewer, target) > 0 && target.hp > 1) {
                                            return 0;
                                        }
                                    } else {
                                        if (get.attitude(viewer, target) > 0 && target != player && target.hp >= 3) {
                                            return 0;
                                        }
                                    }
                                    if (get.attitude(viewer, target) > 0 && target.countCards('h') > 3 && target.countCards('hs', 'shan') > 0) {
                                        return 0;
                                    }
                                    if (get.attitude(viewer, target) > 0 && target.hasSkillTag("useShan") && target.countCards('hs', 'shan') > 0) {
                                        return 0;
                                    }
                                    if (get.attitude(player, target) <= 0) {
                                        return 0;
                                    }
                                },
                                basic: {
                                    order: function (item, player) {
                                        return get.order({ name: 'sha' }) + 0.5;
                                    },
                                    useful: 1,
                                    value: 5,
                                },
                                result: {
                                    "target_use": function (player, target) {
                                        if (player.hasUnknown(2) && get.mode() != 'guozhan') return 0;
                                        var nh = target.countCards('h');
                                        if (get.mode() == 'identity') {
                                            if (target.isZhu && nh <= 2 && target.hp <= 1) return -100;
                                        }
                                        if (nh == 0) return -2;
                                        if (nh == 1) return -1.7
                                        return -1.5;
                                    },
                                    target: function (player, target) {
                                        var nh = target.countCards('h');
                                        if (get.mode() == 'identity') {
                                            if (target.isZhu && nh <= 2 && target.hp <= 1) return -100;
                                        }
                                        if (nh == 0) return -2;
                                        if (nh == 1) return -1.7
                                        return -1.5;
                                    },
                                },
                                tag: {
                                    respond: 1,
                                    respondShan: 1,
                                    damage: 1,
                                    multitarget: 1,
                                    multineg: 1,
                                },
                            },
                        },
                        "zhikongquan9": {
                            global: ["shashanwuxietao"],
                            image: 'ext:舰R美化/zhikongquan9.png',
                            autoViewAs: "wuxie",
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            ai: {
                                tag: {
                                    respond: 1,
                                    respondwuxie: 1,

                                },

                                basic: {
                                    useful: [6, 4, 3],
                                    value: [6, 4, 3],
                                },
                                result: {
                                    player: 1,
                                },
                                expose: 0.2,
                            },
                            notarget: true,
                            "yingbian_tags": ["gain", "draw"],
                            "yingbian_prompt": function (card) {
                                if (!get.cardtag(card, 'yingbian_gain')) return '当你声明使用此牌时，你摸一张牌';
                                return '当此牌生效后，你获得此牌响应的目标牌';
                            },
                            yingbian: function (event) {
                                if (!get.cardtag(event.card, 'yingbian_gain') || get.cardtag(event.card, 'yingbian_draw')) event.player.draw();
                            },
                            contentBefore: function () {
                                'step 0'
                                if (get.mode() == 'guozhan' && get.cardtag(card, 'guo')) {
                                    var trigger = event.getParent(2);
                                    if (trigger.triggername != 'phaseJudge' && !trigger.statecard && trigger.target.identity != 'ye' && trigger.target.identity != 'unknown') {
                                        player.chooseControl('对单体使用', '对势力使用').set('prompt', '请选择' + get.translation(card) + '的使用方式').set('ai', function () {
                                            return '对势力使用'
                                        });
                                    }
                                    else event.finish();
                                }
                                else event.finish();
                                'step 1'
                                if (result.control == '对势力使用') {
                                    player.chat('对势力使用');
                                    event.getParent(2).guowuxie = true;
                                }
                            },
                            content: function () {
                                var evt = event.getParent();
                                event.result = {
                                    wuxied: true,
                                    directHit: evt.directHit || [],
                                    nowuxie: evt.nowuxie,
                                };
                                if (player.isOnline()) {
                                    player.send(function (player) {
                                        if (ui.tempnowuxie && !player.hasWuxie()) {
                                            ui.tempnowuxie.close();
                                            delete ui.tempnowuxie;
                                        }
                                    }, player);
                                }
                                else if (player == game.me) {
                                    if (ui.tempnowuxie && !player.hasWuxie()) {
                                        ui.tempnowuxie.close();
                                        delete ui.tempnowuxie;
                                    }
                                }
                                if (event.card.yingbian && get.cardtag(event.card, 'yingbian_gain')) {
                                    var cardx = event.getParent().respondTo;
                                    if (cardx && cardx[1] && cardx[1].cards && cardx[1].cards.filterInD('od').length) player.gain(cardx[1].cards.filterInD('od'), 'gain2', 'log');
                                }
                            },
                        },
                        "ewaibuji9": {
                            image: 'ext:舰R美化/ewaibuji9.png',
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
                        "sushepao9": {
                            image: 'ext:舰R美化/sushepao9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            ai: {
                                order: function () {
                                    return get.order({ name: 'sha' }) - 0.1;
                                },
                                equipValue: function (card, player) {
                                    if (player._zhuge_temp) return 1;
                                    player._zhuge_temp = true;
                                    var result = function () {
                                        if (!game.hasPlayer(function (current) {
                                            return get.distance(player, current) <= 1 && player.canUse('sha', current) && get.effect(current, { name: 'sha' }, player, player) > 0;
                                        })) {
                                            return 1;
                                        }
                                        if (player.hasSha() && _status.currentPhase == player) {
                                            if (player.getEquip('zhuge') && player.countUsed('sha') || player.getCardUsable('sha') == 0) {
                                                return 10;
                                            }
                                        }
                                        var num = player.countCards('h', 'sha');
                                        if (num > 1) return 6 + num;
                                        return 3 + num;
                                    }();
                                    delete player._zhuge_temp;
                                    return result;
                                },
                                basic: {
                                    equipValue: 5,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                tag: {
                                    valueswap: 1,
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            skills: ["zhuge_skill"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "gaobaodan9": {
                            image: 'ext:舰R美化/gaobaodan9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -3,
                            },
                            ai: {
                                basic: {
                                    equipValue: 2,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            skills: ["zhuque_skill"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "chaozhongdan9": {
                            image: 'ext:舰R美化/chaozhongdan9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -1,
                            },
                            ai: {
                                basic: {
                                    equipValue: 2,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            skills: ["guding_skill"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "caiseyulei9": {
                            image: 'ext:舰R美化/caiseyulei9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -1,
                            },
                            ai: {
                                basic: {
                                    equipValue: 2,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            skills: ["cixiong_R"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },

                        "zhenchaji9": {
                            image: 'ext:舰R美化/zhenchaji9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip5",
                            derivation: "key_miki",
                            skills: ["miki_binoculars"],
                            ai: {
                                equipValue: function (card) {
                                    return 7;
                                },
                                basic: {
                                    equipValue: 7,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "donglixj9": {
                            image: 'ext:舰R美化/donglixj9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip4",
                            distance: {
                                globalFrom: -1,
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                            ai: {
                                basic: {
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    equipValue: 4,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                        },
                        "zhaomingdan9": {
                            image: 'ext:舰R美化/zhaomingdan9.png',
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            filterTarget: function (card, player, target) {
                                if (player != game.me && player.countCards('h') < 2) return false;
                                return target.countCards('h') > 0;
                            },
                            content: function () {
                                "step 0"
                                if (target.countCards('h') == 0) {
                                    event.finish();
                                    return;
                                }
                                target.chooseCard(true).ai = function (card) {
                                    if (_status.event.getRand() < 0.5) return Math.random();
                                    return get.value(card);
                                };
                                "step 1"
                                event.dialog = ui.create.dialog(get.translation(target) + '展示的手牌', result.cards);
                                event.videoId = lib.status.videoId++;

                                game.broadcast('createDialog', event.videoId, get.translation(target) + '展示的手牌', result.cards);
                                game.addVideo('cardDialog', null, [get.translation(target) + '展示的手牌', get.cardsInfo(result.cards), event.videoId]);
                                event.card2 = result.cards[0];
                                game.log(target, '展示了', event.card2);
                                event._result = {};
                                player.chooseToDiscard({ suit: get.suit(event.card2) }, function (card) {
                                    var evt = _status.event.getParent();
                                    if (get.damageEffect(evt.target, evt.player, evt.player, 'fire') > 0) {
                                        return 7 - get.value(card, evt.player);
                                    }
                                    return -1;
                                }).set('prompt', false);
                                game.delay(2);
                                "step 2"
                                if (result.bool) {
                                    target.damage('fire', event.baseDamage || 1);
                                }
                                else {
                                    target.addTempSkill('huogong2');
                                }
                                event.dialog.close();
                                game.addVideo('cardDialog', null, event.videoId);
                                game.broadcast('closeDialog', event.videoId);
                            },
                            ai: {
                                basic: {
                                    order: 4,
                                    value: [3, 1],
                                    useful: 1,
                                },
                                wuxie: function (target, card, player, current, state) {
                                    if (get.attitude(current, player) >= 0 && state > 0) return false;
                                },
                                result: {
                                    player: function (player) {
                                        var nh = player.countCards('h');
                                        if (nh <= player.hp && nh <= 4 && _status.event.name == 'chooseToUse') {
                                            if (typeof _status.event.filterCard == 'function' &&
                                                _status.event.filterCard({ name: 'huogong' }, player, _status.event)) {
                                                return -10;
                                            }
                                            if (_status.event.skill) {
                                                var viewAs = get.info(_status.event.skill).viewAs;
                                                if (viewAs == 'huogong') return -10;
                                                if (viewAs && viewAs.name == 'huogong') return -10;
                                            }
                                        }
                                        return 0;
                                    },
                                    target: function (player, target) {
                                        if (target.hasSkill('huogong2') || target.countCards('h') == 0) return 0;
                                        if (player.countCards('h') <= 1) return 0;
                                        if (target == player) {
                                            if (typeof _status.event.filterCard == 'function' &&
                                                _status.event.filterCard({ name: 'huogong' }, player, _status.event)) {
                                                return -1.15;
                                            }
                                            if (_status.event.skill) {
                                                var viewAs = get.info(_status.event.skill).viewAs;
                                                if (viewAs == 'huogong') return -1.15;
                                                if (viewAs && viewAs.name == 'huogong') return -1.15;
                                            }
                                            return 0;
                                        }
                                        return -1.15;
                                    },
                                },
                                tag: {
                                    damage: 1,
                                    fireDamage: 1,
                                    natureDamage: 1,
                                    norepeat: 1,
                                },
                            },
                            selectTarget: 1,
                        },
                        "c17dipai": {
                            image: 'ext:舰R美化/c17dipai.png',
                            type: "equip",
                            subtype: "equip5",
                            fullskin: true,
                            skills: ["xinge"],
                            ai: {
                                equipValue: 2,
                                basic: {
                                    equipValue: 2,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        xunyou9: {
                            image: 'ext:舰R美化/xunyou9.png',
                            audio: true,
                            type: "trick",
                            enable: true,
                            cardcolor: "red",
                            selectTarget: -1,
                            filterTarget: true,
                            contentBefore: function () {
                                "step 0"
                                if (!targets.length) {
                                    event.finish();
                                    return;
                                }
                                if (get.is.versus()) {
                                    player.chooseControl('顺时针', '逆时针', function (event, player) {
                                        if (player.next.side == player.side) return '逆时针';
                                        return '顺时针';
                                    }).set('prompt', '选择' + get.translation(card) + '的结算方向');
                                }
                                else {
                                    event.goto(2);
                                }
                                "step 1"
                                if (result && result.control == '顺时针') {
                                    var evt = event.getParent(), sorter = (_status.currentPhase || player);
                                    evt.fixedSeat = true;
                                    evt.targets.sortBySeat(sorter);
                                    evt.targets.reverse();
                                    if (evt.targets[evt.targets.length - 1] == sorter) {
                                        evt.targets.unshift(evt.targets.pop());
                                    }
                                }
                                "step 2"
                                ui.clear();
                                var num;
                                if (event.targets) {
                                    num = event.targets.length;
                                }
                                else {
                                    num = game.countPlayer();
                                }
                                var cards = get.cards(num);
                                game.cardsGotoOrdering(cards).relatedEvent = event.getParent();
                                var dialog = ui.create.dialog('五谷丰登', cards, true);
                                _status.dieClose.push(dialog);
                                dialog.videoId = lib.status.videoId++;
                                game.addVideo('cardDialog', null, ['五谷丰登', get.cardsInfo(cards), dialog.videoId]);
                                event.getParent().preResult = dialog.videoId;
                                game.broadcast(function (cards, id) {
                                    var dialog = ui.create.dialog('五谷丰登', cards, true);
                                    _status.dieClose.push(dialog);
                                    dialog.videoId = id;
                                }, cards, dialog.videoId);
                                game.log(event.card, '亮出了', cards);
                            },
                            content: function () {
                                "step 0"
                                for (var i = 0; i < ui.dialogs.length; i++) {
                                    if (ui.dialogs[i].videoId == event.preResult) {
                                        event.dialog = ui.dialogs[i]; break;
                                    }
                                }
                                if (!event.dialog) {
                                    event.finish();
                                    return;
                                }
                                if (event.dialog.buttons.length > 1) {
                                    var next = target.chooseButton(true, function (button) {
                                        return get.value(button.link, _status.event.player);
                                    });
                                    next.set('dialog', event.preResult);
                                    next.set('closeDialog', false);
                                    next.set('dialogdisplay', true);
                                }
                                else {
                                    event.directButton = event.dialog.buttons[0];
                                }
                                "step 1"
                                var dialog = event.dialog;
                                var card;
                                if (event.directButton) {
                                    card = event.directButton.link;
                                }
                                else {
                                    for (var i of dialog.buttons) {
                                        if (i.link == result.links[0]) {
                                            card = i.link;
                                            break;
                                        }
                                    }
                                    if (!card) card = event.dialog.buttons[0].link;
                                }

                                var button;
                                for (var i = 0; i < dialog.buttons.length; i++) {
                                    if (dialog.buttons[i].link == card) {
                                        button = dialog.buttons[i];
                                        button.querySelector('.info').innerHTML = function (target) {
                                            if (target._tempTranslate) return target._tempTranslate;
                                            var name = target.name;
                                            if (lib.translate[name + '_ab']) return lib.translate[name + '_ab'];
                                            return get.translation(name);
                                        }(target);
                                        dialog.buttons.remove(button);
                                        break;
                                    }
                                }
                                var capt = get.translation(target) + '选择了' + get.translation(button.link);
                                if (card) {
                                    target.gain(card, 'visible');
                                    target.$gain2(card);
                                    game.broadcast(function (card, id, name, capt) {
                                        var dialog = get.idDialog(id);
                                        if (dialog) {
                                            dialog.content.firstChild.innerHTML = capt;
                                            for (var i = 0; i < dialog.buttons.length; i++) {
                                                if (dialog.buttons[i].link == card) {
                                                    dialog.buttons[i].querySelector('.info').innerHTML = name;
                                                    dialog.buttons.splice(i--, 1);
                                                    break;
                                                }
                                            }
                                        }
                                    }, card, dialog.videoId, function (target) {
                                        if (target._tempTranslate) return target._tempTranslate;
                                        var name = target.name;
                                        if (lib.translate[name + '_ab']) return lib.translate[name + '_ab'];
                                        return get.translation(name);
                                    }(target), capt);
                                }
                                dialog.content.firstChild.innerHTML = capt;
                                game.addVideo('dialogCapt', null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
                                game.log(target, '选择了', button.link);
                                game.delay();
                            },
                            contentAfter: function () {
                                for (var i = 0; i < ui.dialogs.length; i++) {
                                    if (ui.dialogs[i].videoId == event.preResult) {
                                        var dialog = ui.dialogs[i];
                                        dialog.close();
                                        _status.dieClose.remove(dialog);
                                        if (dialog.buttons.length) {
                                            event.remained = [];
                                            for (var i = 0; i < dialog.buttons.length; i++) {
                                                event.remained.push(dialog.buttons[i].link);
                                            }
                                            event.trigger('wuguRemained');
                                        }
                                        break;
                                    }
                                }
                                game.broadcast(function (id) {
                                    var dialog = get.idDialog(id);
                                    if (dialog) {
                                        dialog.close();
                                        _status.dieClose.remove(dialog);
                                    }
                                }, event.preResult);
                                game.addVideo('cardDialog', null, event.preResult);
                            },
                            ai: {
                                wuxie: function () {
                                    if (Math.random() < 0.5) return 0;
                                },
                                basic: {
                                    order: 3,
                                    useful: 0.5,
                                },
                                result: {
                                    target: function (player, target) {
                                        var sorter = (_status.currentPhase || player);
                                        if (get.is.versus()) {
                                            if (target == sorter) return 1.5;
                                            return 1;
                                        }
                                        if (player.hasUnknown(2)) {
                                            return 0;
                                        }
                                        return (1 - get.distance(sorter, target, 'absolute') / game.countPlayer()) * get.attitude(player, target) > 0 ? 0.5 : 0.7;
                                    },
                                },
                                tag: {
                                    draw: 1,
                                    multitarget: 1,
                                },
                            },
                            fullskin: true,
                        },
                        "paohuofg9": {
                            image: 'ext:舰R美化/paohuofg9.png',
                            fullskin: true,
                            audio: true,
                            type: "trick",
                            filterTarget: function (card, player, target) {
                                if (get.mode() == 'guozhan') {
                                    var next = player.getNext();
                                    if (!next) return false;
                                    return target == next || target.inline(next);
                                }
                                if (player == target) return false;
                                if (game.hasPlayer(function (current) {
                                    return current.isLinked() && current != player;
                                })) {
                                    if (!target.isLinked()) return false;
                                    var distance = get.distance(player, target, 'absolute');
                                    return !game.hasPlayer(function (current) {
                                        if (target != current && current != player && current.isLinked()) {
                                            var dist = get.distance(player, current, 'absolute');
                                            if (dist < distance) {
                                                return true;
                                            }
                                            if (dist == distance && parseInt(current.dataset.position) < parseInt(target.dataset.position)) {
                                                return true;
                                            }
                                        }
                                    });
                                }
                                else {
                                    var dist = get.distance(player, target);
                                    return !game.hasPlayer(function (current) {
                                        return current != player && get.distance(player, current) < dist
                                    });
                                }
                            },
                            enable: true,
                            selectTarget: -1,
                            modTarget: true,
                            content: function () {
                                target.damage('fire', event.baseDamage || 1);
                            },
                            ai: {
                                order: 5,
                                value: 6,
                                tag: {
                                    damage: 1,
                                    natureDamage: 1,
                                    fireDamage: 1,
                                },
                                result: {
                                    target: function (player, target) {
                                        if (target.hasSkillTag('nofire') || target.hasSkillTag('nodamage')) return 0;
                                        if (target.hasSkill('xuying') && target.countCards('h') == 0) return 0;
                                        if (!target.isLinked()) {
                                            return get.damageEffect(target, player, target, 'fire');
                                        }
                                        return game.countPlayer(function (current) {
                                            if (current.isLinked()) {
                                                return get.sgn(get.damageEffect(current, player, target, 'fire'));
                                            }
                                        });
                                    },
                                },
                            },
                        },
                        "micaiwz9": {
                            image: 'ext:舰R美化/micaiwz9.png',

                            fullskin: true,
                            type: "equip",
                            subtype: "equip3",
                            distance: {
                                globalTo: 1,
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                            ai: {
                                basic: {
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    equipValue: 4,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                        },
                        "gaojingld9": {
                            image: 'ext:舰R美化/gaojingld9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip3",
                            distance: {
                                globalTo: 1,
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                            ai: {
                                basic: {
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    equipValue: 7,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                        },
                        "guolu9": {
                            image: 'ext:舰R美化/guolu9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip4",
                            distance: {
                                globalFrom: -1,
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                            ai: {
                                basic: {
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    equipValue: 4,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                        },
                        "yingjizp9": {
                            image: 'ext:舰R美化/yingjizp9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -2,
                            },
                            ai: {
                                equipValue: function (card, player) {
                                    var num = 2.5 + player.countCards('h') / 3;
                                    return Math.min(num, 4);
                                },
                                basic: {
                                    equipValue: 3.5,
                                    order: function (card, player) {
                                        if (player && player.hasSkillTag('reverseEquip')) {
                                            return 8.5 - get.equipValue(card, player) / 20;
                                        }
                                        else {
                                            return 8 + get.equipValue(card, player) / 20;
                                        }
                                    },
                                    useful: 2,
                                    value: function (card, player, index, method) {
                                        if (player.isDisabled(get.subtype(card))) return 0.01;
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue;
                                        if (equipValue == undefined) {
                                            equipValue = info.ai.basic.equipValue;
                                        }
                                        if (typeof equipValue == 'function') {
                                            if (method == 'raw') return equipValue(card, player);
                                            if (method == 'raw2') return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != 'number') equipValue = 0;
                                        if (method == 'raw') return equipValue;
                                        if (method == 'raw2') return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: function (player, target, card) {
                                        return get.equipResult(player, target, card.name);
                                    },
                                },
                            },
                            skills: ["zhangba_skill"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        "toudx9": {
                            image: 'ext:舰R美化/toudx9.png',
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            singleCard: true,
                            targetprompt: ["被借刀", "出杀目标"],
                            complexSelect: true,
                            complexTarget: true,
                            multicheck: function () {
                                var card = { name: 'sha', isCard: true };
                                return game.hasPlayer(function (current) {
                                    if (current.getEquip(1)) {
                                        return game.hasPlayer(function (current2) {
                                            return current.inRange(current2) && lib.filter.targetEnabled(card, current, current2);
                                        })
                                    }
                                });
                            },
                            filterTarget: function (card, player, target) {
                                var card = { name: 'sha', isCard: true };
                                return player != target && target.getEquip(1) && game.hasPlayer(function (current) {
                                    return target != current && target.inRange(current) && lib.filter.targetEnabled(card, target, current);
                                });
                            },
                            filterAddedTarget: function (card, player, target, preTarget) {
                                var card = { name: 'sha', isCard: true };
                                return target != preTarget && preTarget.inRange(target) && lib.filter.targetEnabled(card, preTarget, target);
                            },
                            content: function () {
                                "step 0"
                                if (event.directHit || !event.addedTarget || (!_status.connectMode && lib.config.skip_shan && !target.hasSha())) {
                                    event.directfalse = true;
                                }
                                else {
                                    target.chooseToUse('对' + get.translation(event.addedTarget) + '使用一张杀，或令' + get.translation(player) + '获得你的武器牌', function (card, player) {
                                        if (get.name(card) != 'sha') return false;
                                        return lib.filter.filterCard.apply(this, arguments);
                                    }).set('targetRequired', true).set('complexSelect', true).set('filterTarget', function (card, player, target) {
                                        if (target != _status.event.sourcex && !ui.selected.targets.contains(_status.event.sourcex)) return false;
                                        return lib.filter.filterTarget.apply(this, arguments);
                                    }).set('sourcex', event.addedTarget).set('addCount', false).set('respondTo', [player, card]);
                                }
                                "step 1"
                                if (event.directfalse || result.bool == false) {
                                    var cards = target.getCards('e', { subtype: 'equip1' });
                                    if (cards.length) player.gain(cards, target, 'give', 'bySelf');
                                }
                            },
                            ai: {
                                wuxie: function (target, card, player, viewer) {
                                    if (player == game.me && get.attitude(viewer, player) > 0) {
                                        return 0;
                                    }
                                },
                                basic: {
                                    order: 8,
                                    value: 2,
                                    useful: 1,
                                },
                                result: {
                                    target: -1.5,
                                    player: function (player) {
                                        if (player.getCards('he', { subtype: 'equip1' }).length) return 0;
                                        return 1.5;
                                    },
                                },
                                tag: {
                                    gain: 1,
                                    use: 1,
                                    useSha: 1,
                                    loseCard: 1,
                                },
                            },
                            selectTarget: 1,
                        },*/
                    },
                    skill: {
                        paojixunlian: {
                            
                                sub:true,
                                mod:{
                                    cardUsable:function (card, player, num) {
                                        if (card.name == 'sha' || card.name == 'sheji9') return num + 2*player.storage.paojixunlian;
                                    },
                                },
                                mark:true,
                                charlotte:true,
                                intro:{
                                    content:function (storage) { if (storage) return '使用【杀】的次数上限+' + 2*storage},
                                },
                                "_priority":0,
                            
                        },
                        /* "tiejia1": {
                             equipSkill: true,
                             trigger: {
                                 target: ["useCardToBefore"],
                             },
                             forced: true,
                             priority: 6,
                             audio: "ext:舰R美化:true",
                             filter: function (event, player) {
                                 if (player.hasSkillTag('unequip2')) return false;
                                 if (event.player.hasSkillTag('unequip', false, {
                                     name: event.card ? event.card.name : null,
                                     target: player,
                                     card: event.card
                                 })) return false;
                                 if (event.card.name == 'nanman') return true;
                                 if (event.card.name == 'wanjian') return true;
                                 if (event.card.name == 'zhiyuangj9') return true;
                                 if (event.card.name == 'manchangyy9') return true;
                                 if(event.card.name=='jinjuzy') return true;
                                 return false;
                             },
                             content: function () {
                                 trigger.cancel();
                             },
                             ai: {
                                 effect: {
                                     target: function (card, player, target, current) {
                                         if (target.hasSkillTag('unequip2')) return;
                                         if (player.hasSkillTag('unequip', false, {
                                             name: card ? card.name : null,
                                             target: target,
                                             card: card
                                         }) || player.hasSkillTag('unequip_ai', false, {
                                             name: card ? card.name : null,
                                             target: target,
                                             card: card
                                         })) return;
                                         //if(card.name=='nanman'||card.name=='wanjian'||card.name=='chuqibuyi') return 'zerotarget';
                                         if (card.name == 'nanman' || card.name == 'wanjian' || card.name == 'zhiyuangj9' || card.name == 'manchangyy9') return 'zerotarget';
                                         if (card.name == 'sha') {
                                             var equip1 = player.getEquip(1);
                                             if (equip1 && equip1.name == 'zhuque') return 1.9;
                                             if (!card.nature) return 'zerotarget';
                                         }
                                     },
                                 },
                             },
                         },
                         "tiejia2": {
                             equipSkill: true,
                             trigger: {
                                 player: "damageBegin3",
                             },
                             filter: function (event, player) {
                                 if (event.nature != 'thunder') return false;
                                 if (player.hasSkillTag('unequip2')) return false;
                                 if (event.source && event.source.hasSkillTag('unequip', false, {
                                     name: event.card ? event.card.name : null,
                                     target: player,
                                     card: event.card
                                 })) return false;
                                 return true;
                             },
                             audio: "ext:舰R美化:true",
                             forced: true,
                             content: function () {
                                 trigger.num++;
                             },
                             ai: {
                                 thunderAttack: true,
                                 effect: {
                                     target: function (card, player, target, current) {
                                         if (card.name == 'sha') {
                                             if (card.nature == 'thunder') return 2;
                                             if (player.hasSkill('quzhudd')) return 1.9;
                                         }
                                         if (get.tag(card, 'thunderDamage') && current < 0) return 2;
                                     },
                                 },
                             },
                         },
                         "tiejia3": {
                             equipSkill: true,
                             audio: "tengjia1",
                             trigger: { target: "shaBefore", },
                             forced: true,
                             filter: function (event, player) {
                                 if (player.hasSkillTag('unequip2')) return false;
                                 if (event.player.hasSkillTag('unequip', false, {
                                     name: event.card ? event.card.name : null,
                                     target: player,
                                     card: event.card
                                 })) return false;
                                 if (event.card.nature == 'thunder'||event.card.nature == 'fire') return false;
                                 if (event.card.name == 'sha') return true;
                                 return false;
                             },
                             content: function () {
                                 trigger.cancel();
                             },
                         },
                         "tiejia4": {
                             
                             
                             trigger: {
                                 target: "useCardToPlayered",
                             },
                             forced: true,
                             filter: function (event, player) {
                                 return (event.card.name == 'sha' || event.card.name == 'sheji9') && event.card.nature == 'thunder' && !event.getParent().directHit.contains(event.target);
                             },
                             logTarget: "target",
                             content: function () {
                                 var id = trigger.target.playerid;
                                 var map = trigger.getParent().customArgs;
                                 if (!map[id]) map[id] = {};
                                 if (typeof map[id].shanRequired == 'number') {
                                     map[id].shanRequired++;
                                 }
                                 else {
                                     map[id].shanRequired = 2;
                                 }
                             },
                             ai: {
                                 "directHit_ai": true,
                                 skillTagFilter: function (player, tag, arg) {
                                     if (arg.card.name != 'sha' || arg.target.countCards('h', 'shan') > 1) return false;
                                 },
                             },
                         },
                         shashanwuxietao: {
                             prompt: "将♦牌当做杀，♥牌当做桃，♣牌当做闪，♠牌当做无懈可击使用或打出(bushi)，<br>将射击当做杀，快修当做桃，回避当做闪，制空当做无懈可击使用或打出。<br>响应事件只能打出对应名字的卡牌，<br>想打出让其他牌响应事件，需要视为技的帮助",
                             mod: {
                                 cardname: function (card, player, name) {
                                     if (card.name == 'sheji9') { return 'sha'; }; if (card.name == 'huibi9') { return 'shan'; }; if (card.name == 'zhikongquan9') { return 'wuxie'; }; if (card.name == 'kuaixiu9') { return 'tao'; }; if (card.name == 'zziqi9') { return 'jiu'; };
                                     if (card.name == 'juedouba9') { return 'juedou'; };
                                     if (card.name == 'leibusigang9') { return 'lebu'; }; if (card.name == 'nobuji9') { return 'bingliang'; };
                                 },
                             },
                         },
                         qinglong_skill_R:{
                             equipSkill:true,
                             trigger:{
                                 player:["shaMiss","eventNeutralized"],
                             },
                             direct:true,
                             filter:function(event,player){
                                 if(get.mode()=='guozhan'||!event.card||(event.card.name!='sha'&&event.card.name!='sheji9')) return false;
                                 return event.target.isIn()&&player.canUse('sha',event.target,false)&&(player.hasSha()||_status.connectMode&&player.countCards('hs'));
                             },
                             content:function(){
                                 "step 0"
                                 player.chooseToUse(get.prompt('qinglong',trigger.target),function(card,player,event){
                                     if(get.name(card)!='sha'&&get.name(card)!='sheji9') return false;
                                     if(!player.hasSkill('qinglong_skill_R',null,false)){
                                         var cards=player.getEquips('xiaolishe9');
                                         if(!cards.some(card2=>card2!=card&&!ui.selected.cards.contains(card2))) return false;
                                     }
                                     return lib.filter.filterCard.apply(this,arguments);
                                 },trigger.target,-1).set('addCount',false).logSkill='qinglong_skill';
                             },
                             "_priority":-25,
                         },
                         twmoukui_R: {
                             trigger: {
                                 player: "useCardToPlayered",
                             },
                             direct: true,
                             preHidden: true,
                             filter: function (event, player) {
                                 return event.card && event.card.name == 'sha';
                             },
                             content: function () {
                                 'step 0'
                                 var list = ['选项一'];
                                 if (trigger.target.countDiscardableCards(player, 'he') > 0) list.push('选项二');
                                 list.push('背水！');
                                 list.push('cancel2');
                                 player.chooseControl(list).set('choiceList', [
                                     '摸一张牌',
                                     '令' + get.translation(trigger.target) + '弃置一张牌',
                                     '背水！依次执行以上两项。然后若此【杀】未令其进入濒死状态，则其弃置你的一张牌。',
                                 ]).set('prompt', get.prompt('twmoukui', trigger.target)).setHiddenSkill('twmoukui');
                                 'step 1'
                                 if (result.control != 'cancel2') {
                                     var target = trigger.target;
                                     player.logSkill('twmoukui', target);
                                     if (result.control == '选项一' || result.control == '背水！') player.draw();
                                     if (result.control == '选项二' || result.control == '背水！') trigger.target.chooseToDiscard('he', true);
                                     if (result.control == '背水！') {
                                         player.addTempSkill('twmoukui_effect');
                                         var evt = trigger.getParent();
                                         if (!evt.twmoukui_effect) evt.twmoukui_effect = [];
                                         evt.twmoukui_effect.add(target);
                                     }
                                 }
                             },
                             subSkill: {
                                 effect: {
                                     trigger: {
                                         player: "useCardAfter",
                                     },
                                     charlotte: true,
                                     forced: true,
                                     filter: function (event, player) {
                                         return event.twmoukui_effect && event.twmoukui_effect.filter(function (current) {
                                             return current.isIn() && !current.hasHistory('damage', function (evt) {
                                                 return evt._dyinged && evt.card == event.card;
                                             });
                                         }).length > 0;
                                     },
                                     content: function () {
                                         var list = trigger.twmoukui_effect.filter(function (current) {
                                             return current.isIn() && !current.hasHistory('damage', function (evt) {
                                                 return evt._dyinged && evt.card == event.card;
                                             });
                                         }).sortBySeat();
                                         for (var i of list) {
                                             i.discardPlayerCard(player, true, 'he').boolline = true;
                                         }
                                     },
                                     sub: true,
                                 },
                             },
                         },
                         cixiong_R: {
                             prompt:"是否发动弃牌穿甲弹\n其选择一项：弃一张牌，你摸一张牌",
                             equipSkill: true,
                             trigger: {
                                 player: "useCardToPlayered",
                             },
                             audio: true,
                             logTarget: "target",
                             check: function (event, player) {
                                 if (get.attitude(player, event.target) > 0) return true;
                                 var target = event.target;
                                 return target.countCards('h') == 0 || !target.hasSkillTag('noh');
                             },
                             filter: function (event, player) {
                                 if (event.card.name != 'sha') return false;
                                 return player.group!=event.target.group;
                             },
                             content: function () {
                                 "step 0"
                                 if (!trigger.target.countCards('h')) event._result = { bool: false };
                                 else trigger.target.chooseToDiscard('弃置一张手牌，或令' + get.translation(player) + '摸一张牌').set('ai', function (card) {
                                     var trigger = _status.event.getTrigger();
                                     return -get.attitude(trigger.target, trigger.player) - get.value(card) - Math.max(0, 4 - trigger.target.hp) * 2;
                                 });
                                 "step 1"
                                 if (result.bool == false) player.draw();
                             },
                             "_priority": -25,
                         },
 */

                    },
                    translate: {
                        "huhangyuanhu": "护航援护",
                        "huhangyuanhu_info": "出牌阶段，对一名其他角色使用。其摸两张牌。",
                        "paojixunlian": "炮击训练",
                        "paojixunlian_info": "出牌阶段，对自己使用。本回合你使用杀的上限+2。",

                        "huibi9": "回避",
                        "huibi9_info": "抵消一张【射击】",
                        "puliesai9": "防雷装甲",
                        "puliesai9_info": "锁定技，你每次受到伤害时，最多承受1点伤害（防止多余的伤害）；当你失去装备区里的【防雷装甲】时，你回复1点体力。",
                        "nobuji9": "破交袭击",
                        "nobuji9_info": "目标角色判定阶段进行判定：若判定结果不为梅花，则跳过该角色的摸牌阶段。",
                        "dongli9": "动力(改良)",
                        "dongli9_info": "锁定技，你计算与其他角色的距离-1。",
                        "fayantong9": "发烟筒",
                        "fayantong9_info": "锁定技，其他角色计算与你的距离+1。",
                        "jiaohuan9": "快递箱",
                        "jiaohuan9_info": "锁定技，其他角色计算与你的距离+1。",
                        "bigseven9": "BIGSEVEN",
                        "bigseven9_info": "使用杀可以额外指定一名距离为1角色为目标",
                        "shangyouyh9": "上游一号",
                        "shangyouyh9_info": "当你使用的【射击】被目标角色使用的【闪】抵消时，你可以弃置两张牌，令此【射击】依然对其造成伤害。",
                        "xiji9": "偷袭",
                        "xiji9_info": "出牌阶段，对区域里有牌的一名其他角色使用。你弃置其区域里的一张牌。",
                        "chuanjiadan9": "超重弹",
                        "chuanjiadan9_info": "当你使用射击造成伤害时，你可以防止此伤害，改为依次弃置目标角色的两张牌。",
                        "zziqi9": "z字旗",
                        "zziqi9_info": "出牌阶段，对自己使用，令自己的下一张使用的【射击】造成的伤害+1（每回合限使用1次）；濒死阶段，对自己使用，回复1点体力",
                        "juedouba9": "决斗，吧",
                        "juedouba9_info": "出牌阶段，对一名其他角色使用。由其开始，其与你轮流打出一张【射击】，直到其中一方未打出【射击】为止。未打出【射击】的一方受到另一方对其造成的1点伤害。",
                        "leibusigang9": "乐不思港",
                        "leibusigang9_info": "出牌阶段，对一名其他角色使用。若判定结果不为红桃，跳过其出牌阶段。",
                        "manchangyy9": "漫长一役",
                        "manchangyy9_info": "出牌阶段，对所有其他角色使用。每名目标角色需打出一张【射击】，否则受到1点伤害。",
                        "huojiandan9": "断腿火箭",
                        "huojiandan9_info": "当你使用【射击】对目标角色造成伤害时，你可以弃置其装备区里的一张坐骑牌。",
                        "chuanjiayl9": "穿甲鱼雷",
                        "chuanjiayl9_info": "锁定技，当你使用【射击】指定一名目标角色后，你令其防具技能无效直到此【射击】被抵消或造成伤害。",
                        "xiaolishe9": "效力射",
                        "xiaolishe9_info": "当你使用的【射击】被目标角色使用的【闪】抵消时，你可以对其使用一张【射击】（无距离限制）。",
                        "qingjia9": "黑色装甲",
                        "qingjia9_info": "锁定技，黑色的射击对你无效",
                        "sheji9": "射击",
                        "sheji9_info": "出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，否则你对其造成1点伤害。",
                        "huibida9": "回避(八卦)",
                        "huibida9_info": "当你需要使用或打出一张【闪】时，你可以进行判定。若结果为红色，则你视为使用或打出一张【闪】。",
                        "taifeng9": "台风",
                        "taifeng9_info": "出牌阶段，对自己使用。若判定结果为黑桃2~9，则目标角色受到3点雷电伤害。若判定不为黑桃2~9，将之移动到下家的判定区里。",
                        "zhanlipin9": "顺走战利品",
                        "zhanlipin9_info": "出牌阶段，对距离为1且区域里有牌的一名其他角色使用。你获得其区域里的一张牌。",
                        "kuaixiu9": "快修",
                        "kuaixiu9_info": "出牌阶段，对自己使用，回复一点体力。",
                        "jingjixiuli9": "紧急修理",
                        "jingjixiuli9_info": "出牌阶段，对所有角色使用。每名目标角色回复1点体力。",
                        "zhongjia9": "重型装甲",
                        "zhongjia9_info": "锁定技，【南蛮入侵】、【万箭齐发】、普通【射击】和HE【射击】对你无效。当你需要响应雷击时需要出两张闪，受到雷电伤害时，该伤害+1。",
                        "lastfriend9": "最后的队友",
                        "lastfriend9_info": "出牌阶段使用，选择2个角色，分别横置或重置这些角色。若包含队友，则令你与目标摸一张牌。",
                        "zhiyuangj9": "支援攻击",
                        "zhiyuangj9_info": "出牌阶段，对所有其他角色使用。每名目标角色需打出一张【闪】，否则受到1点伤害。",
                        "zhikongquan9": "制空权",
                        "zhikongquan9_info": "一张锦囊牌生效前，对此牌使用。抵消此牌对一名角色产生的效果，或抵消另一张【无懈可击】产生的效果。",
                        "ewaibuji9": "补给",
                        "ewaibuji9_info": "出牌阶段，对你使用。你摸两张牌。",
                        "sushepao9": "速射炮",
                        "sushepao9_info": "锁定技，你于出牌阶段内使用【射击】无次数限制。",
                        "gaobaodan9": "燃烧弹",
                        "gaobaodan9_info": "你可以将一张普通【射击】当具火焰伤害的【射击】使用。",
                        "chaozhongdan9": "爆雷奇袭",
                        "chaozhongdan9_info": "锁定技，当你使用【射击】对目标角色造成伤害时，若其没有手牌，此伤害+1。",
                        "caiseyulei9": "弃牌穿甲弹",
                        "caiseyulei9_info": "当你使用【射击】指定一名不同势力的目标角色后，其可以选择一项：1.弃置一张手牌；2.令你摸一张牌。",
                        "zhenchaji9": "侦察机",
                        "zhenchaji9_info": "锁定技，其他角色的手牌对你可见。",
                        "donglixj9": "动力(先进)",
                        "donglixj9_info": "锁定技，你计算与其他角色的距离-1。",
                        "zhaomingdan9": "照明弹",
                        "zhaomingdan9_info": "目标角色展示一张手牌，然后若你能弃掉一张与所展示牌相同花色的手牌，则对该角色造成1点火焰伤害。",
                        "c17dipai": "c-1递牌",
                        "c17dipai_info": "出牌阶段限一次。你可以将一张手牌交给一名其他角色。",
                        huojiandan9: "断腿火箭",
                        "huojiandan9_info": "当你使用【射击】对目标角色造成伤害时，你可以弃置其装备区里的一张马达牌。",
                        xunyou9: "皇家巡游",
                        "xunyou9_info": "出牌阶段，对所有角色使用。（选择目标后）你从牌堆顶亮出等同于目标数量的牌，每名目标角色获得这些牌中（剩余的）的任意一张。",
                        "paohuofg9": "炮火覆盖",
                        "paohuofg9_info": "对离你最近的一名横置角色使用（若无横置角色则改为对距离你最近的所有角色使用），对目标造成一点火焰伤害",
                        "micaiwz9": "迷彩伪装",
                        "micaiwz9_info": "锁定技，其他角色计算与你的距离+1。",
                        "gaojingld9": "雷达告警",
                        "gaojingld9_info": "锁定技，其他角色计算与你的距离+1。",
                        "guolu9": "动力(锅炉)",
                        "guolu9_info": "锁定技，你计算与其他角色的距离-1。",
                        "yingjizp9": "火力平台",
                        "yingjizp9_info": "你可以将两张手牌当【射击】使用或打出，用于应急。",
                        "toudx9": "伪造情报",
                        "toudx9_info": "出牌阶段，对装备区里有武器牌且有使用【射击】的目标的一名其他角色使用。令其对你指定的一名角色使用一张【射击】，否则将其装备区里的武器牌交给你。",
                        "tiejia1": "铁甲1",
                        "tiejia1_info": "锁定技，【南蛮入侵】、【万箭齐发】、普通【杀】和火【杀】对你无效。当你需要响应雷杀时需要出两张闪，受到雷电伤害时，该伤害+1。",
                        "tiejia2": "铁甲2",
                        "tiejia2_info": "锁定技，【南蛮入侵】、【万箭齐发】、普通【杀】和火【杀】对你无效。当你需要响应雷杀时需要出两张闪，受到雷电伤害时，该伤害+1。",
                        "tiejia3": "铁甲3",
                        "tiejia3_info": "锁定技，【南蛮入侵】、【万箭齐发】、普通【杀】和火【杀】对你无效。当你需要响应雷杀时需要出两张闪，受到雷电伤害时，该伤害+1。",
                        "tiejia4": "铁甲4",
                        "tiejia4_info": "锁定技，【南蛮入侵】、【万箭齐发】、普通【杀】和火【杀】对你无效。当你需要响应雷杀时需要出两张闪，受到雷电伤害时，该伤害+1。",
                        zhikongwuxie: "制空权",
                        "zhikongwuxie_info": "",
                        shashanwuxietao: "卡牌兼容",
                        "shashanwuxietao_info": "杀闪桃无懈，无名杀的卡牌不容易互换，需要技能龙魂的帮助",
                    },
                    list: [
                        /*["spade", 7, "sheji9"],
                        ["spade", 8, "sheji9"],
                        ["spade", 8, "sheji9"],
                        ["spade", 9, "sheji9"],
                        ["spade", 9, "sheji9"],
                        ["spade", 10, "sheji9"],
                        ["spade", 10, "sheji9"],
                        ["club", 2, "sheji9"],
                        ["club", 3, "sheji9"],
                        ["club", 4, "sheji9"],
                        ["club", 5, "sheji9"],
                        ["club", 6, "sheji9"],
                        ["club", 7, "sheji9"],
                        ["club", 8, "sheji9"],
                        ["club", 8, "sheji9"],
                        ["club", 9, "sheji9"],
                        ["club", 9, "sheji9"],
                        ["club", 10, "sheji9"],
                        ["club", 10, "sheji9"],
                        ["club", 11, "sheji9"],
                        ["club", 11, "sheji9"],
                        ["heart", 10, "sheji9"],
                        ["heart", 10, "sheji9"],
                        ["heart", 11, "sheji9"],
                        ["diamond", 6, "sheji9"],
                        ["diamond", 7, "sheji9"],
                        ["diamond", 8, "sheji9"],
                        ["diamond", 9, "sheji9"],
                        ["diamond", 10, "sheji9"],
                        ["diamond", 13, "sheji9"],
                        ["heart", 2, "huibi9"],
                        ["heart", 2, "huibi9"],
                        ["heart", 13, "huibi9"],
                        //["diamond", 1, "huibi9"],
                        ["diamond", 2, "huibi9"],
                        ["diamond", 2, "huibi9"],
                        ["diamond", 3, "huibi9"],
                        ["diamond", 4, "huibi9"],
                        ["diamond", 5, "huibi9"],
                        ["diamond", 6, "huibi9"],
                        ["diamond", 7, "huibi9"],
                        ["diamond", 8, "huibi9"],
                        ["diamond", 9, "huibi9"],
                        ["diamond", 10, "huibi9"],
                        ["diamond", 11, "huibi9"],
                        ["diamond", 11, "huibi9"],
                        ["heart", 3, "kuaixiu9"],
                        ["heart", 4, "kuaixiu9"],
                        ["heart", 6, "kuaixiu9"],
                        ["heart", 7, "kuaixiu9"],
                        ["heart", 8, "kuaixiu9"],
                        ["heart", 9, "kuaixiu9"],
                        ["heart", 12, "kuaixiu9"],
                        ["diamond", 12, "kuaixiu9"],

                        ["spade", 2, "huibida9"],
                        ["club", 2, "huibida9"],
                        ["spade", 5, "donglixj9"],
                        ["club", 5, "micaiwz9"],
                        ["heart", 13, "gaojingld9"],
                        ["heart", 5, "guolu9"],
                        ["spade", 13, "dongli9"],
                        ["diamond", 13, "fayantong9"],
                        ["club", 1, "sushepao9"],
                        ["diamond", 1, "sushepao9"],
                        ["spade", 2, "caiseyulei9"],
                        ["spade", 6, "chuanjiayl9"],
                        ["spade", 5, "xiaolishe9"],
                        ["spade", 12, "yingjizp9"],
                        ["diamond", 5, "shangyouyh9"],
                        ["diamond", 12, "bigseven9"],
                        ["heart", 5, "huojiandan9"],

                        ["heart", 3, "xunyou9"],
                        ["heart", 4, "xunyou9"],
                        ["heart", 1, "jingjixiuli9"],
                        ["spade", 7, "manchangyy9"],
                        ["spade", 13, "manchangyy9"],
                        ["club", 7, "manchangyy9"],
                        ["heart", 1, "zhiyuangj9"],
                        ["spade", 1, "juedouba9"],
                        ["club", 1, "juedouba9"],
                        ["diamond", 1, "juedouba9"],
                        ["heart", 7, "ewaibuji9"],
                        ["heart", 8, "ewaibuji9"],
                        ["heart", 9, "ewaibuji9"],
                        ["heart", 11, "ewaibuji9"],
                        ["spade", 3, 'zhanlipin9'],
                        ["spade", 4, 'zhanlipin9'],
                        ["spade", 11, 'zhanlipin9'],
                        ["diamond", 3, 'zhanlipin9'],
                        ["diamond", 4, 'zhanlipin9'],
                        ["spade", 3, 'xiji9'],
                        ["spade", 4, 'xiji9'],
                        ["spade", 12, 'xiji9'],
                        ["club", 3, 'xiji9'],
                        ["club", 4, 'xiji9'],
                        ["heart", 12, 'xiji9'],
                        ["club", 12, 'toudx9'],
                        ["club", 13, 'toudx9'],
                        ["spade", 11, 'zhikongquan9'],
                        ["club", 12, 'zhikongquan9'],
                        ["club", 13, 'zhikongquan9'],
                        ["spade", 6, 'leibusigang9'],
                        ["club", 6, 'leibusigang9'],
                        ["heart", 6, 'leibusigang9'],
                        ["spade", 1, 'taifeng9'],
                        ["spade", 2, 'chuanjiadan9'],
                        ["club", 2, 'qingjia9'],
                        ["heart", 12, 'taifeng9'],
                        ["diamond", 12, 'zhikongquan9'],
                        ["heart", 4, "sheji9", "fire"],
                        ["heart", 7, "sheji9", "fire"],
                        ["heart", 10, "sheji9", "fire"],
                        ["diamond", 4, "sheji9", "fire"],
                        ["diamond", 5, "sheji9", "fire"],
                        ["spade", 4, "sheji9", "thunder"],
                        ["spade", 5, "sheji9", "thunder"],
                        ["spade", 6, "sheji9", "thunder"],
                        ["spade", 7, "sheji9", "thunder"],
                        ["spade", 8, "sheji9", "thunder"],
                        ["club", 5, "sheji9", "thunder"],
                        ["club", 6, "sheji9", "thunder"],
                        ["club", 7, "sheji9", "thunder"],
                        ["club", 8, "sheji9", "thunder"],
                        ["heart", 8, "huibi9"],
                        ["heart", 9, "huibi9"],
                        ["heart", 11, "huibi9"],
                        ["heart", 12, "huibi9"],
                        ["diamond", 6, "huibi9"],
                        ["diamond", 7, "huibi9"],
                        ["diamond", 8, "huibi9"],
                        ["diamond", 10, "huibi9"],
                        ["diamond", 11, "huibi9"],
                        ["heart", 5, "kuaixiu9"],
                        ["heart", 6, "kuaixiu9"],
                        ["diamond", 2, "kuaixiu9"],
                        ["diamond", 3, "kuaixiu9"],
                        ["diamond", 9, "zziqi9"],
                        ["spade", 3, "zziqi9"],
                        ["spade", 9, "zziqi9"],
                        ["club", 3, "zziqi9"],
                        ["club", 9, "zziqi9"],

                        ["diamond", 13, "jiaohuan9"],
                        ["club", 1, "puliesai9"],
                        ["spade", 2, "zhongjia9"],
                        ["club", 2, "zhongjia9"],
                        ["spade", 1, "chaozhongdan9"],
                        ["diamond", 1, "gaobaodan9"],

                        ["heart", 2, "zhaomingdan9"],
                        ["heart", 3, "zhaomingdan9"],
                        ["heart", 3, "paohuofg9"],
                        ["diamond", 12, "zhaomingdan9"],
                        ["spade", 11, "lastfriend9"],
                        ["spade", 12, "lastfriend9"],
                        ["club", 10, "lastfriend9"],
                        ["club", 11, "lastfriend9"],
                        ["club", 12, "lastfriend9"],
                        ["club", 13, "lastfriend9"],
                        ["heart", 1, "zhikongquan9"],
                        ["heart", 13, "zhikongquan9"],
                        ["spade", 13, "zhikongquan9"],
                        ["spade", 10, "nobuji9"],
                        ["club", 4, "nobuji9"],
                        ['diamond', 5, 'zhenchaji9'],
                        ['diamond', 5, 'c17dipai'],*/
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
        }, help: {}, config: { "jianrzs": { "name": "舰R战术", "init": false } }, package: {
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