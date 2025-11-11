import { lib, game, ui, get, ai, _status } from "../../noname.js";
game.import("extension", function (lib, game, ui, get, ai, _status) {
    return {
        name: "舰R战术", content: function (config, pack) {

        }, precontent: function (jianrzsbao) {
            game.import('card', function () {
                var jianrzsbao = {
                    name: 'jianrzsbao',//卡包命名
                    connect: true,//卡包是否可以联机
                    card: {
                        huhangyuanhu9: {
                            image: 'ext:舰R战术/image/huhangyuanhu9.png',
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: 1,
                            cardcolor: "red",
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
                        paojixunlian9: {
                            image: 'ext:舰R战术/image/paojixunlian9.png',
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: -1,
                            toself: true,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            content: function () {
                                if (!target.hasSkill('paojixunlian9_skill')) {
                                    target.addTempSkill('paojixunlian9_skill', { player: 'phaseEnd' });
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
                        yuanchengdaodan9: {
                            image: 'ext:舰R战术/image/yuanchengdaodan9.png',
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: 1,
                            filterTarget: function (card, player, target) {
                                return target != player;
                            },
                            content: function () {
                                "step 0";
                                if (typeof event.baseDamage != "number") event.baseDamage = 1;
                                if (typeof event.extraDamage != "number") {
                                    event.extraDamage = 0;
                                }
                                if (typeof event.ganraoRequired != "number" || !event.ganraoRequired || event.ganraoRequired < 0) { event.ganraoRequired = 1; }
                                "step 1";
                                if (event.directHit) {
                                    event._result = { bool: false };
                                } else {
                                    var next = target.chooseToRespond({ name: "ganraodan9" });
                                    if (event.ganraoRequired > 1)
                                        next.set("prompt2", "共需打出" + event.ganraoRequired + "张干扰弹");
                                    next.set("ai", function (card) {
                                        var evt = _status.event.getParent();
                                        if (get.damageEffect(evt.target, evt.player, evt.target) >= 0) return 0;
                                        if (evt.player.hasSkillTag("notricksource")) return 0;
                                        if (evt.target.hasSkillTag("notrick")) return 0;
                                        return get.order(card);
                                    });
                                    next.autochoose = lib.filter.autoRespondGanrao;
                                }
                                "step 2";
                                if (result.bool == false) {
                                    target.damage();
                                } else {
                                    event.ganraoRequired--;
                                    if (event.ganraoRequired > 0) event.goto(1);
                                }
                            },
                            ai: {
                                wuxie: function (target, card, player, viewer, status) {
                                    if (player === game.me && get.attitude(viewer, player._trueMe || player) > 0)
                                        return 0;
                                    if (
                                        status *
                                        get.attitude(viewer, target) *
                                        get.effect(target, card, player, target) >=
                                        0
                                    )
                                        return 0;
                                },
                                basic: {
                                    order: 5,
                                    useful: 1,
                                    value: 5.5,
                                },
                                result: {
                                    player(player, target, card) {
                                        if (
                                            player.hasSkillTag(
                                                "directHit_ai",
                                                true,
                                                {
                                                    target: target,
                                                    card: card,
                                                },
                                                true
                                            )
                                        ) { return 0; }
                                        if (target.hp > 1 && target.hasSkillTag("respondGanrao", true, "respond", true))
                                            return 0;
                                        let known = target.getKnownCards(player);
                                        if (
                                            known.some((card) => {
                                                let name = get.name(card, target);
                                                if (name === "ganraodan9")
                                                    return lib.filter.cardRespondable(card, target);
                                                if (name === "wuxie")
                                                    return lib.filter.cardEnabled(card, target, "forceEnable");
                                            })
                                        ) { return 0; }
                                        if (
                                            target.hp > 1 ||
                                            target.countCards("hs", (i) => !known.includes(i)) >
                                            4.67 - (2 * target.hp) / target.maxHp
                                        )
                                            return 0;
                                        let res = 0,
                                            att = get.sgnAttitude(player, target);
                                        res -= att * (0.8 * target.countCards("hs") + 0.6 * target.countCards("e") + 3.6);
                                        return res;
                                    },
                                    target(player, target, card) {
                                        if (
                                            player.hasSkillTag(
                                                "directHit_ai",
                                                true,
                                                {
                                                    target: target,
                                                    card: card,
                                                },
                                                true
                                            )
                                        )
                                            return -2;
                                        let known = target.getKnownCards(player);
                                        if (
                                            known.some((card) => {
                                                let name = get.name(card, target);
                                                if (name === "ganraodan9")
                                                    return lib.filter.cardRespondable(card, target);
                                                if (name === "wuxie")
                                                    return lib.filter.cardEnabled(card, target, "forceEnable");
                                            })
                                        )
                                            return -1.2;
                                        let nh = target.countCards("hs", (i) => !known.includes(i));
                                        if (target.hp <= 1) {
                                            if (nh === 0) return -99;
                                            if (nh === 1) return -60;
                                            if (nh === 2) return -36;
                                            if (nh === 3) return -12;
                                            if (nh === 4) return -8;
                                            return -5;
                                        }
                                        if (target.hasSkillTag("respondGanrao", true, "respond", true)) return -1.35;
                                        if (!nh) return -2;
                                        if (nh === 1) return -1.8;
                                        return -1.5;
                                    },
                                },
                                tag: {
                                    respond: 2,
                                    respondGanrao: 2,
                                    damage: 1,
                                },
                            },
                        },
                        ganraodan9: {
                            image: 'ext:舰R战术/image/ganraodan9.png',
                            audio: true,
                            fullskin: true,
                            type: "basic",
                            notarget: true,
                            nodelay: true,
                            global: ["ganraodan9_skill"],
                            content: function () {
                                var info = event.getParent(2).ganraoinfo || event.getParent(3).ganraoinfo;
                                if (!info) {
                                    event.finish();
                                    return;
                                }
                                //info.evt.cancel();
                                event.source = info.source;
                                event.source.addTempSkill("fengyin", { player: 'phaseEnd' });
                            },
                            ai: {
                                order: 3,
                                basic: {
                                    useful: (card, i) => {
                                        let player = _status.event.player,
                                            basic = [7, 5.1, 2],
                                            num = basic[Math.min(2, i)];
                                        if (player.hp > 2 && player.hasSkillTag("maixie")) num *= 0.57;
                                        return num;
                                    },
                                    value: [5.1, 1],
                                },
                                result: {
                                    player: 1,
                                },
                            },
                        },
                        yanhangleiji9: {
                            image: 'ext:舰R战术/image/yanhangleiji9.png',
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,

                            selectTarget: 1,
                            filterTarget: function (card, player, target) {
                                return player != target;
                            },
                            content: function () {
                                if (!target.hasSkill("_wulidebuff_jinshui")) { target.addSkill('_wulidebuff_jinshui'); }
                                target.addMark('_wulidebuff_jinshui', 1);
                                if (!target.hasSkill("_wulidebuff_jiansu")) { target.addSkill('_wulidebuff_jiansu'); }
                                target.addMark('_wulidebuff_jiansu', 1);
                            },
                            ai: {
                                order: 9.01,
                                useful: 1,
                                value: 5,
                                result: {
                                    target: function (player, target) {
                                        return -1;
                                    },
                                },
                                tag: {
                                    loseCard: 1,
                                    discard: 1,
                                },
                            },
                            /* singleCard: true,
                            targetprompt: ["出杀", "被杀"],
                            complexSelect: true,
                            complexTarget: true,
                            multicheck: function () {
                                var card = { name: "sha", isCard: true };
                                return game.hasPlayer(function (current) {
                                    return game.hasPlayer(function (current2) {
                                        return (
                                            current.inRange(current2) &&
                                            lib.filter.targetEnabled(card, current, current2)
                                        );
                                    });
                                });
                            },
                            filterTarget: function (card, player, target) {
                                var card = { name: "sha", isCard: true };
                                return (
                                    player != target &&
                                    game.hasPlayer(function (current) {
                                        return (
                                            target != current &&
                                            target.inRange(current) &&
                                            lib.filter.targetEnabled(card, target, current)
                                        );
                                    })
                                );
                            },
                            filterAddedTarget: function (card, player, target, preTarget) {
                                var card = { name: "sha", isCard: true };
                                return (
                                    target != preTarget &&
                                    preTarget.inRange(target) &&
                                    lib.filter.targetEnabled(card, preTarget, target)
                                );
                            },
                            content: function () {
                                "step 0";
                                if (
                                    event.directHit ||
                                    !event.addedTarget ||
                                    (!_status.connectMode && lib.config.skip_shan && !target.hasSha())
                                ) {
                                    event.directfalse = true;
                                } else {
                                    target
                                        .chooseToUse(
                                            "对" +
                                            get.translation(event.addedTarget) +
                                            "使用一张杀",
                                            function (card, player) {
                                                if (get.name(card) != "sha") return false;
                                                return lib.filter.filterCard.apply(this, arguments);
                                            }
                                        )
                                        .set("targetRequired", true)
                                        .set("complexSelect", true)
                                        .set("filterTarget", function (card, player, target) {
                                            if (
                                                target != _status.event.sourcex &&
                                                !ui.selected.targets.includes(_status.event.sourcex)
                                            )
                                                return false;
                                            return lib.filter.filterTarget.apply(this, arguments);
                                        })
                                        .set("sourcex", event.addedTarget)
                                        .set("addCount", false)
                                        .set("respondTo", [player, card]);
                                }
                            },
                            ai: {
                                wuxie: function (target, card, player, viewer) {
                                    return 0;
                                },
                                basic: {
                                    order: 8,
                                    value: 2,
                                    useful: 1,
                                },
                                result: {
                                    player: (player, target) => {
                                        if (get.attitude(player, target) < 0) return 0;
                                        return 0.15;
                                    },
                                    target: (player, target, card) => {
                                        let targets = [].concat(ui.selected.targets);
                                        if (_status.event.preTarget) targets.add(_status.event.preTarget);
                                        if (targets.length) {
                                            let preTarget = targets.lastItem,
                                                pre = _status.event.getTempCache("yanhangleiji9_result", preTarget.playerid);
                                            if (pre && pre.card === card && pre.target.isIn())
                                                return target === pre.target ? pre.eff : 0;
                                            return (
                                                get.effect(target, { name: "sha" }, preTarget, player) /
                                                get.attitude(player, target)
                                            );
                                        }
                                        if (!target.mayHaveSha(player, "use")) return 0;
                                        if (get.attitude(target, player) < 0) return 0;
                                        let sha = game.filterPlayer(get.info({ name: "yanhangleiji9" }).filterAddedTarget),
                                            addTar = null;
                                        sha = sha.reduce((num, current) => {
                                            let eff = get.effect(current, { name: "sha" }, target, player);
                                            if (eff <= num) return num;
                                            addTar = current;
                                            return eff;
                                        }, -100);
                                        if (!addTar) return 0;
                                        sha /= get.attitude(player, target);
                                        _status.event.putTempCache("yanhangleiji9_result", target.playerid, {
                                            card: card,
                                            target: addTar,
                                            eff: sha,
                                        });
                                        return sha;
                                    },
                                },
                                tag: {
                                    use: 1,
                                    useSha: 1,
                                }, 
                        },*/
                            selectTarget: 1,
                        },
                        tanzhaodeng9: {
                            image: 'ext:舰R战术/image/tanzhaodeng9.png',
                            audio: true,
                            fullskin: true,
                            type: "equip",
                            subtype: "equip5",
                            skills: ["tanzhaodeng9_skill"],
                            ai: {
                                equipValue: 7,
                                basic: {
                                    order: (card, player) => {
                                        const equipValue = get.equipValue(card, player) / 20;
                                        return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
                                    },
                                    useful: 2,
                                    equipValue: 1,
                                    value: (card, player, index, method) => {
                                        if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
                                        const info = get.info(card),
                                            current = player.getEquip(info.subtype),
                                            value = current && card != current && get.value(current, player);
                                        let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                                        if (typeof equipValue == "function") {
                                            if (method == "raw") return equipValue(card, player);
                                            if (method == "raw2") return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != "number") equipValue = 0;
                                        if (method == "raw") return equipValue;
                                        if (method == "raw2") return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: (player, target, card) => get.equipResult(player, target, card.name),
                                },
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        jiaohusheji9: {
                            image: 'ext:舰R战术/image/jiaohusheji9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip2",
                            skills: ["jiaohusheji9_skill"],
                            ai: {
                                basic: {
                                    equipValue: 7.5,
                                    order: (card, player) => {
                                        const equipValue = get.equipValue(card, player) / 20;
                                        return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
                                    },
                                    useful: 2,
                                    value: (card, player, index, method) => {
                                        if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
                                        const info = get.info(card),
                                            current = player.getEquip(info.subtype),
                                            value = current && card != current && get.value(current, player);
                                        let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                                        if (typeof equipValue == "function") {
                                            if (method == "raw") return equipValue(card, player);
                                            if (method == "raw2") return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != "number") equipValue = 0;
                                        if (method == "raw") return equipValue;
                                        if (method == "raw2") return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: (player, target, card) => get.equipResult(player, target, card.name),
                                },
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        yingbeimao9: {
                            image: 'ext:舰R战术/image/yingbeimao9.png',
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -1,
                            },
                            ai: {
                                basic: {
                                    equipValue: 2,
                                    order: (card, player) => {
                                        const equipValue = get.equipValue(card, player) / 20;
                                        return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
                                    },
                                    useful: 2,
                                    value: (card, player, index, method) => {
                                        if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
                                        const info = get.info(card),
                                            current = player.getEquip(info.subtype),
                                            value = current && card != current && get.value(current, player);
                                        let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                                        if (typeof equipValue == "function") {
                                            if (method == "raw") return equipValue(card, player);
                                            if (method == "raw2") return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != "number") equipValue = 0;
                                        if (method == "raw") return equipValue;
                                        if (method == "raw2") return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: (player, target, card) => get.equipResult(player, target, card.name),
                                },
                            },
                            skills: ["yingbeimao9_skill"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        guochuan9: {
                            image: "ext:舰R战术/image/guochuan9.png",
                            fullskin: true,
                            type: "equip",
                            subtype: "equip2",
                            loseDelay: false,
                            skills: ["guochuan9_skill"],
                            ai: {
                                order: 9.5,
                                equipValue: function (card, player) {
                                    if (player.countCards("h", "guochuan9")) return 6;
                                    return 0;
                                },
                                basic: {
                                    equipValue: 5,
                                    order: (card, player) => {
                                        const equipValue = get.equipValue(card, player) / 20;
                                        return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
                                    },
                                    useful: 2,
                                    value: (card, player, index, method) => {
                                        if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
                                        const info = get.info(card),
                                            current = player.getEquip(info.subtype),
                                            value = current && card != current && get.value(current, player);
                                        let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                                        if (typeof equipValue == "function") {
                                            if (method == "raw") return equipValue(card, player);
                                            if (method == "raw2") return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != "number") equipValue = 0;
                                        if (method == "raw") return equipValue;
                                        if (method == "raw2") return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: (player, target, card) => get.equipResult(player, target, card.name),
                                },
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        qianshaoyuanhu9: {
                            image: "ext:舰R战术/image/qianshaoyuanhu9.png",
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: 1,
                            cardcolor: "red",
                            toself: true,
                            filterTarget: function (card, player, target) {
                                return !target.hujia;
                            },
                            modTarget: true,
                            content: function () {
                                target.changeHujia(1);
                            },
                            ai: {
                                wuxie: function (target, card, player, viewer) {
                                    if (get.mode() == "guozhan") {
                                        if (!_status._aozhan) {
                                            if (!player.isMajor()) {
                                                if (!viewer.isMajor()) return 0;
                                            }
                                        }
                                    }
                                },
                                basic: {
                                    order: 7.2,
                                    useful: 4.5,
                                    value: 7.2,
                                },
                                result: {
                                    target: 2,
                                },
                            },
                        },
                        shujujiaohu9: {
                            image: "ext:舰R战术/image/shujujiaohu9.png",
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: 1,
                            filterTarget: function (card, player, target) {
                                return target != player;
                            },
                            modTarget: true,
                            content: function () {
                                "step 0";
                                player
                                    .chooseCard({
                                        position: "he",
                                        selectCard: [1, Infinity],
                                        prompt: get.prompt("shujujiaohu9"),
                                        prompt2: "将任意张牌交给" + get.translation(target) + "，然后其交给你等量张牌。",
                                        ai(card) {
                                            if (card.name == "du") return 20;
                                            var val = get.value(card);
                                            var player = _status.event.player;
                                            if (get.position(card) == "e") {
                                                if (val <= 0) return 10;
                                                return 10 / val;
                                            }
                                            return 6 - val;
                                        },
                                    })
                                    .forResult();
                                "step 1";
                                if (result.bool) {
                                    event.num = result.cards.length;
                                    player.give(result.cards, target);
                                }
                                "step 2";
                                var hs = target.getCards("he");
                                if (hs.length) {
                                    if (hs.length <= event.num) event._result = { bool: true, cards: hs };
                                    else {
                                        target.chooseCard("he", true, "交给" + get.translation(player) + get.cnNumber(event.num) + "张牌", event.num).set("ai", function (card) {
                                            var player = _status.event.player;
                                            var target = _status.event.getParent().player;
                                            if (get.attitude(player, target) > 0) {
                                                if (!target.hasShan() && card.name == "shan") return 10;
                                                if (get.type(card) == "equip" && !get.cardtag(card, "gifts") && target.hasUseTarget(card)) return 10 - get.value(card);
                                                return 6 - get.value(card);
                                            }
                                            return -get.value(card);
                                        });
                                    }
                                } else event.finish();
                                "step 2";
                                target.give(result.cards, player);

                            },
                            ai: {
                                order: 5,
                                tag: {
                                    loseCard: 1,
                                    gain: 0.5,
                                },
                                wuxie: function (target, card, player, viewer) {
                                    return 0;
                                },
                                result: {
                                    target: function (player, target) {
                                        if (get.attitude(player, target) <= 0)
                                            return (
                                                (target.countCards("he", function (card) {
                                                    return (
                                                        get.value(card, target) > 0 && card != target.getEquip("jinhe")
                                                    );
                                                }) > 0
                                                    ? -0.3
                                                    : 0.3) * Math.sqrt(player.countCards("h"))
                                            );
                                        return (
                                            (target.countCards("ej", function (card) {
                                                if (get.position(card) == "e") return get.value(card, target) <= 0;
                                                var cardj = card.viewAs ? { name: card.viewAs } : card;
                                                return get.effect(target, cardj, target, player) < 0;
                                            }) > 0
                                                ? 1.5
                                                : -0.3) * Math.sqrt(player.countCards("h"))
                                        );
                                    },
                                },
                            },

                        },
                        yinghuazhuangjia9: {
                            image: "ext:舰R战术/image/yinghuazhuangjia9.png",
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: -1,
                            cardcolor: "black",
                            toself: true,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            content: function () {
                                target.addTempSkill("zhuangjiafh", { player: 'phaseBegin' });
                            },
                            ai: {
                                wuxie: function (target, card, player, viewer) {
                                    if (get.mode() == "guozhan") {
                                        if (!_status._aozhan) {
                                            if (!player.isMajor()) {
                                                if (!viewer.isMajor()) return 0;
                                            }
                                        }
                                    }
                                },
                                basic: {
                                    order: 7.2,
                                    useful: 4.5,
                                    value: 7,
                                },
                                result: {
                                    target: 2,
                                },
                            },
                        },
                        lanzusheji9: {
                            image: "ext:舰R战术/image/lanzusheji9.png",
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: -1,
                            cardcolor: "black",
                            toself: true,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            content: function () {
                                target.addTempSkill("lanzusheji9_skill", { player: 'phaseBegin' });
                            },
                            ai: {
                                wuxie: function (target, card, player, viewer) {
                                    if (get.mode() == "guozhan") {
                                        if (!_status._aozhan) {
                                            if (!player.isMajor()) {
                                                if (!viewer.isMajor()) return 0;
                                            }
                                        }
                                    }
                                },
                                basic: {
                                    order: 7.2,
                                    useful: 4.5,
                                    value: 7,
                                },
                                result: {
                                    target: 2,
                                },
                            },
                        },
                        bianduiyuanhu9: {
                            image: "ext:舰R战术/image/bianduiyuanhu9.png",
                            fullskin: true,
                            type: "basic",
                            savable: true,
                            selectTarget: -1,
                            content: function () {
                                "step 0";
                                target.recover();
                                "step 1";
                                player.changeHujia(1);
                            },
                            ai: {
                                basic: {
                                    order: 6,
                                    useful: 10,
                                    value: [8, 6.5, 5, 4],
                                },
                                result: {
                                    target: 2,
                                },
                                tag: {
                                    recover: 1,
                                    save: 1,
                                },
                            },
                        },
                        tantiaogongji9: {
                            image: "ext:舰R战术/image/tantiaogongji9.png",
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -2,
                            },
                            ai: {
                                basic: {
                                    equipValue: 2.5,
                                    order: (card, player) => {
                                        const equipValue = get.equipValue(card, player) / 20;
                                        return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
                                    },
                                    useful: 2,
                                    value: (card, player, index, method) => {
                                        if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
                                        const info = get.info(card),
                                            current = player.getEquip(info.subtype),
                                            value = current && card != current && get.value(current, player);
                                        let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                                        if (typeof equipValue == "function") {
                                            if (method == "raw") return equipValue(card, player);
                                            if (method == "raw2") return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != "number") equipValue = 0;
                                        if (method == "raw") return equipValue;
                                        if (method == "raw2") return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: (player, target, card) => get.equipResult(player, target, card.name),
                                },
                            },
                            skills: ["tantiaogongji9_skill"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        duihaijingjieshao9: {
                            image: "ext:舰R战术/image/duihaijingjieshao9.png",
                            fullskin: true,
                            type: "equip",
                            subtype: "equip2",
                            skills: ["duihaijingjieshao9_skill"],
                            filterTarget: function (card, player, target) {
                                if (player != target) return false;
                                return true;
                            },
                            selectTarget: function () {
                                return -1;
                            },
                            toself: true,
                            ai: {
                                basic: {
                                    equipValue: 6,
                                    order: (card, player) => {
                                        const equipValue = get.equipValue(card, player) / 20;
                                        return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
                                    },
                                    useful: 2,
                                    value: (card, player, index, method) => {
                                        if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
                                        const info = get.info(card),
                                            current = player.getEquip(info.subtype),
                                            value = current && card != current && get.value(current, player);
                                        let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                                        if (typeof equipValue == "function") {
                                            if (method == "raw") return equipValue(card, player);
                                            if (method == "raw2") return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != "number") equipValue = 0;
                                        if (method == "raw") return equipValue;
                                        if (method == "raw2") return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: (player, target, card) => get.equipResult(player, target, card.name),
                                },
                            },
                            enable: true,
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
                            },
                        },
                        zhaomingdanjiaozheng9: {
                            image: "ext:舰R战术/image/zhaomingdanjiaozheng9.png",
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: 1,
                            filterTarget: function (card, player, target) {
                                return player != target;
                            },
                            content: function () {
                                if (!target.hasSkill("zhaomingdanjiaozheng9_skill")) { target.addTempSkill('zhaomingdanjiaozheng9_skill', { global: "phaseEnd" }); }
                            },
                            ai: {
                                order: 11,
                                useful: 1,
                                value: [5, 1],
                                result: {
                                    target: function (player, target) {
                                        return -1.5;
                                    },
                                },
                            },
                        },
                        gailiangbeimaodan9: {
                            image: "ext:舰R战术/image/gailiangbeimaodan9.png",
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -1,
                            },
                            ai: {
                                equipValue: function (card, player) {
                                    return Math.min(6 - player.countCards("h", "sha"), 4);
                                },
                                basic: {
                                    equipValue: 3.5,
                                    order: (card, player) => {
                                        const equipValue = get.equipValue(card, player) / 20;
                                        return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
                                    },
                                    useful: 2,
                                    value: (card, player, index, method) => {
                                        if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
                                        const info = get.info(card),
                                            current = player.getEquip(info.subtype),
                                            value = current && card != current && get.value(current, player);
                                        let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                                        if (typeof equipValue == "function") {
                                            if (method == "raw") return equipValue(card, player);
                                            if (method == "raw2") return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != "number") equipValue = 0;
                                        if (method == "raw") return equipValue;
                                        if (method == "raw2") return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: (player, target, card) => get.equipResult(player, target, card.name),
                                },
                            },
                            skills: ["gailiangbeimaodan9_skill"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        chuanjialiudan9: {
                            image: "ext:舰R战术/image/chuanjialiudan9.png",
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -3,
                            },
                            ai: {
                                basic: {
                                    equipValue: 2.5,
                                    order: (card, player) => {
                                        const equipValue = get.equipValue(card, player) / 20;
                                        return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
                                    },
                                    useful: 2,
                                    value: (card, player, index, method) => {
                                        if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
                                        const info = get.info(card),
                                            current = player.getEquip(info.subtype),
                                            value = current && card != current && get.value(current, player);
                                        let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                                        if (typeof equipValue == "function") {
                                            if (method == "raw") return equipValue(card, player);
                                            if (method == "raw2") return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != "number") equipValue = 0;
                                        if (method == "raw") return equipValue;
                                        if (method == "raw2") return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: (player, target, card) => get.equipResult(player, target, card.name),
                                },
                            },
                            skills: ["chuanjialiudan9_skill"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        chuanjiahangdan9: {
                            image: "ext:舰R战术/image/chuanjiahangdan9.png",
                            fullskin: true,
                            type: "equip",
                            subtype: "equip1",
                            distance: {
                                attackFrom: -1,
                            },
                            skills: ["chuanjiahangdan9_skill"],
                            ai: {
                                equipValue: function (card, player) {
                                    return 8;
                                },
                                basic: {
                                    equipValue: 7,
                                    order: (card, player) => {
                                        const equipValue = get.equipValue(card, player) / 20;
                                        return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
                                    },
                                    useful: 2,
                                    value: (card, player, index, method) => {
                                        if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
                                        const info = get.info(card),
                                            current = player.getEquip(info.subtype),
                                            value = current && card != current && get.value(current, player);
                                        let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                                        if (typeof equipValue == "function") {
                                            if (method == "raw") return equipValue(card, player);
                                            if (method == "raw2") return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != "number") equipValue = 0;
                                        if (method == "raw") return equipValue;
                                        if (method == "raw2") return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: (player, target, card) => get.equipResult(player, target, card.name),
                                },
                            },
                            enable: true,
                            selectTarget: -1,
                            filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        zhuangjiajiaban9: {
                            image: "ext:舰R战术/image/zhuangjiajiaban9.png",
                            fullskin: true,
                            type: "equip",
                            subtype: "equip2",
                            ai: {
                                basic: {
                                    equipValue: 7.5,
                                    order: (card, player) => {
                                        const equipValue = get.equipValue(card, player) / 20;
                                        return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
                                    },
                                    useful: 2,
                                    value: (card, player, index, method) => {
                                        if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
                                        const info = get.info(card),
                                            current = player.getEquip(info.subtype),
                                            value = current && card != current && get.value(current, player);
                                        let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                                        if (typeof equipValue == "function") {
                                            if (method == "raw") return equipValue(card, player);
                                            if (method == "raw2") return equipValue(card, player) - value;
                                            return Math.max(0.1, equipValue(card, player) - value);
                                        }
                                        if (typeof equipValue != "number") equipValue = 0;
                                        if (method == "raw") return equipValue;
                                        if (method == "raw2") return equipValue - value;
                                        return Math.max(0.1, equipValue - value);
                                    },
                                },
                                result: {
                                    target: (player, target, card) => get.equipResult(player, target, card.name),
                                },
                            },
                            skills: ["zhuangjiajiaban9_skill"],
                            enable: true,
                            selectTarget: -1,
                            filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
                            modTarget: true,
                            allowMultiple: false,
                            content: function () {
                                if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
                            },
                            toself: true,
                        },
                        quanjiabantuji9: {
                            image: "ext:舰R战术/image/quanjiabantuji9.png",
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: -1,
                            toself: true,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            modTarget: true,
                            content: function () {
                                'step 0'
                                player.chooseToDiscard(true, "h", player.countCards("h"));
                                "step 1"
                                //game.log(lib.inpile);
                                var list = [];
                                for (var i = 0; i < lib.inpile.length; i++) {
                                    var name = lib.inpile[i];
                                    var type = get.type(name);
                                    //game.log(name);
                                    if (type == 'trick') {
                                        if (lib.filter.cardEnabled({ name: name }, player) && name != "quanjiabantuji9") {
                                            list.push([get.translation(type), '', name]);
                                        }
                                    }
                                }
                                if (list == "") {
                                    game.log('牌堆中没有符合要求的牌');
                                    event.finish();
                                }
                                player.chooseButton([
                                    '全甲板突击',
                                    [list, 'vcard'],
                                ]).set('filterButton', button => {
                                    var event = _status.event;
                                    if (ui.selected.buttons) {
                                        return true;
                                    }
                                }).set('ai', function (button) {
                                    return (get.value(button.link) || 1);

                                }).set('selectButton', 1);
                                'step 2'
                                if (result && result.bool && result.links[0]) {
                                    player.chooseUseTarget(true, get.name(result.links[0]));
                                } else {
                                    event.finish();
                                }
                            },
                            ai: {
                                basic: {
                                    order: 1,
                                    useful: 3,
                                    value: 6.5,
                                },
                                order: 1,
                                result: {
                                    player: function (player) {
                                        var num = 0;
                                        var cards = player.getCards("h");
                                        if (cards.length >= 3 && player.hp >= 3) return 0;
                                        for (var i = 0; i < cards.length; i++) {
                                            num += Math.max(0, get.value(cards[i], player, "raw"));
                                        }
                                        num /= cards.length;
                                        num *= Math.min(cards.length, player.hp);
                                        return 12 - num;
                                    },
                                },
                                nokeep: true,
                                skillTagFilter: function (player, tag, arg) {
                                    if (tag === "nokeep") return (!arg || (arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && !player.getStat("skill").qice && player.hasCard(card => get.name(card) != "tao", "h");
                                },
                            },
                        },
                        duikongyujing9: {
                            image: "ext:舰R战术/image/duikongyujing9.png",
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            selectTarget: 1,
                            cardcolor: "black",
                            filterTarget: function (card, player, target) {
                                return !target.hasSkill("duikongyujing9_skill");
                            },
                            content: function () {
                                target.addTempSkill("duikongyujing9_skill", { player: 'phaseBegin' });
                            },
                            ai: {
                                wuxie: function (target, card, player, viewer) {
                                    if (get.mode() == "guozhan") {
                                        if (!_status._aozhan) {
                                            if (!player.isMajor()) {
                                                if (!viewer.isMajor()) return 0;
                                            }
                                        }
                                    }
                                },
                                basic: {
                                    order: 7.2,
                                    useful: 4.5,
                                    value: 5,
                                },
                                result: {
                                    target: function (target) {
                                        if (target.hasSkill("fangkong2")) return 1.5;
                                        return 0;
                                    },
                                },
                            },
                        },
                    },
                    //上面是卡牌
                    //
                    //下面是技能
                    skill: {
                        paojixunlian9_skill: {
                            charlotte: true,
                            locked: true,
                            mark: true,
                            intro: {
                                content: function (storage, player, skill) {
                                    return '出杀次数' + get.translation(player.storage.paojixunlian * 2);
                                },
                            },
                            mod: {
                                cardUsable: function (card, player, num) {
                                    if (card.name == 'sha') return num + player.storage.paojixunlian * 2;
                                },
                                "_priority": 0,
                            }

                        },
                        ganraodan9_skill: {//参考诱敌深入
                            trigger: { target: "shaBefore" },
                            direct: true,
                            filter: function (event, player) {
                                return (
                                    !event.getParent().directHit.includes(player) && player.hasUsableCard("ganraodan9")
                                );
                            },
                            content: function () {
                                event.ganraoinfo = {
                                    source: trigger.player,
                                    evt: trigger,
                                };
                                player
                                    .chooseToUse(function (card, player) {
                                        if (get.name(card) != "ganraodan9") return false;
                                        return lib.filter.cardEnabled(card, player, "forceEnable");
                                    }, "是否使用干扰弹？")
                                    .set("ai2", function (card) {
                                        var target = _status.event.source;
                                        if (get.attitude(player, target) > 0) { return 0; }
                                        var list = [];
                                        var listm = [];
                                        var listv = [];
                                        if (target.name1 != undefined) listm = lib.character[target.name1][3];
                                        else listm = lib.character[target.name][3];
                                        if (target.name2 != undefined) listv = lib.character[target.name2][3];
                                        listm = listm.concat(listv);
                                        var func = function (skill) {
                                            var info = get.info(skill);
                                            if (!info || info.charlotte || info.hiddenSkill || info.zhuSkill || info.juexingji || info.limited || info.dutySkill || (info.unique && !info.gainable) || lib.skill.pangguanzhe.bannedList.includes(skill) || get.is.locked(skill)) return false;
                                            return true;
                                        };
                                        for (var i = 0; i < listm.length; i++) {
                                            if (func(listm[i])) list.add(listm[i]);
                                        }
                                        var skills = [];
                                        for (var i of list) {
                                            var info = lib.translate[i + "_info"];
                                            if (info && info.indexOf("出牌阶段") != -1) skills.add(i);
                                            if (info && info.indexOf("指定目标") != -1) skills.add(i);
                                            if (info && info.indexOf("造成伤害") != -1) skills.add(i);
                                        }


                                        if (skills && skills.length > 0) {
                                            return 1;
                                        }
                                        return 0;
                                    })
                                    .set("source", trigger.player);
                            },
                        },
                        tanzhaodeng9_skill: {
                            equipSkill: true,
                            trigger: {
                                player: "phaseBegin",
                            },
                            forced: true,
                            direct: true,
                            filter: function (event, player) {
                                if (player.countCards("h") <= 0) return false;
                                return game.hasPlayer(function (current) {
                                    return current != player && current.countCards("h") > 0;
                                });
                            },
                            content: function () {
                                "step 0";
                                player.chooseTarget(get.prompt2("tanzhaodeng9"), "回合开始时，你选择一名角色，展示你与其的手牌。", function (card, player, target) {
                                    return player != target && target.countCards("h") > 0;
                                })
                                "step 1";
                                if (result.bool) {
                                    var target = result.targets[0];
                                    player.showHandcards();
                                    game.delayx();
                                    target.showHandcards();
                                    game.delayx();
                                }
                            },
                            "_priority": -25,
                        },
                        jiaohusheji9_skill: {
                            equipSkill: true,
                            trigger: {
                                player: "damageEnd",
                            },
                            filter(event, player) {
                                return event.source != undefined;
                            },
                            check(event, player) {
                                return get.attitude(player, event.source) <= 0;
                            },
                            logTarget: "source",
                            content(event, trigger, player) {
                                var card = {
                                    name: "sha",
                                    isCard: true,
                                };
                                if (player.canUse(card, trigger.source, false)) {
                                    player.useCard(card, trigger.source, false);
                                }
                            },
                            ai: {
                                "maixie_defend": true,
                                effect: {
                                    target(card, player, target) {
                                        if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
                                        return 0.8;
                                        // if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
                                    },
                                },
                            },
                        },
                        yingbeimao9_skill: {
                            equipSkill: true,
                            trigger: {
                                player: "useCard1",
                            },
                            filter: function (event, player) {
                                game.log(event.card);
                                if (event.card.name == "sha") return true;
                            },
                            audio: true,
                            check: function (event, player) {
                                var eff = 0;
                                for (var i = 0; i < event.targets.length; i++) {
                                    var target = event.targets[i];
                                    var eff1 = get.damageEffect(target, player, player);
                                    var eff2 = get.damageEffect(target, player, player, "stab");
                                    eff += eff2;
                                    eff -= eff1;
                                }
                                return eff >= 0;
                            },
                            "prompt2": function (event, player) {
                                return "将" + get.translation(event.card) + "改为刺杀";
                            },
                            content: function () {
                                game.setNature(trigger.card, "stab");
                            },
                            "_priority": -25,
                        },
                        guochuan9_skill: {
                            equipSkill: true,
                            trigger: {
                                player: "damageBegin4",
                            },
                            forced: true,
                            audio: true,
                            filter: function (event, player) {
                                if (event.num <= 1) return false;
                                if (player.hasSkillTag("unequip2")) return false;
                                if (
                                    event.source &&
                                    event.source.hasSkillTag("unequip", false, {
                                        name: event.card ? event.card.name : null,
                                        target: player,
                                        card: event.card,
                                    })
                                )
                                    return false;
                                return true;
                            },
                            content: function () {
                                trigger.cancel();
                            },
                            ai: {
                                filterDamage: true,
                                skillTagFilter: function (player, tag, arg) {
                                    if (player.hasSkillTag("unequip2")) return false;
                                    if (arg && arg.player) {
                                        if (
                                            arg.player.hasSkillTag("unequip", false, {
                                                name: arg.card ? arg.card.name : null,
                                                target: player,
                                                card: arg.card,
                                            })
                                        )
                                            return false;
                                        if (
                                            arg.player.hasSkillTag("unequip_ai", false, {
                                                name: arg.card ? arg.card.name : null,
                                                target: player,
                                                card: arg.card,
                                            })
                                        )
                                            return false;
                                        if (arg.player.hasSkillTag("jueqing", false, player)) return false;
                                    }
                                },
                            },
                        },
                        tantiaogongji9_skill: {
                            equipSkill: true,
                            audio: true,
                            trigger: {
                                player: "useCardToPlayered",
                            },
                            filter: function (event) {
                                return event.isFirstTarget && event.targets && event.targets.length > 1;
                            },
                            forced: true,
                            logTarget: "target",
                            content: function () {
                                "step 0";
                                player
                                    .chooseTarget(get.prompt("tantiaogongji9_skill"), "弃置一名角色的一张牌", function (card, player, target) {
                                        return target != player && trigger.targets.includes(target);
                                    })
                                    .set("ai", function (target) {
                                        var player = _status.event.player;
                                        return get.effect(target, { name: "guohe_copy2" }, player, player);
                                    });
                                "step 1";
                                if (result.bool && result.targets && result.targets.length) {
                                    player.logSkill("tantiaogongji9_skill", result.targets);
                                    player.discardPlayerCard('he', result.targets[0], 1, true);
                                }
                            },
                            ai: {
                                expose: 0.25,
                            },
                            "_priority": -25,
                        },
                        lanzusheji9_skill: {
                            trigger: {
                                target: "useCardToTargeted",
                            },
                            preHidden: true,
                            filter(event, player) {
                                return event.card.name == "sha";
                            },
                            content() {
                                "step 0";
                                var eff = get.effect(player, trigger.card, trigger.player, trigger.player);
                                trigger.player.chooseControl().set('choiceList', [
                                    '受到一点伤害',
                                    '令' + get.translation(trigger.card) + '无效',
                                ])
                                    .set("ai", function () {
                                        if (_status.event.eff > 0) {
                                            return 0;
                                        }
                                        return 1;
                                    })
                                    .set("eff", eff);
                                "step 1";
                                if (result.index == 0) {
                                    trigger.player.damage("nocard");
                                }
                                else trigger.getParent().excluded.add(player);
                            },
                            ai: {
                                effect: {
                                    target_use(card, player, target, current) {
                                        if (card.name == "sha" && get.attitude(player, target) < 0) {
                                            if (_status.event.name == "lanzusheji9_skill") return;
                                            if (get.attitude(player, target) > 0 && current < 0) return "zerotarget";
                                            if (player.hp < 2) return "zerotarget";
                                            if (player.hasSkill("jiu") || player.hasSkill("tianxianjiu")) return;
                                            if (player.hp < 4) {
                                                return [1, 0, 0.3, 0];
                                            }
                                            return [1, 0, 1, -0.5];
                                        }
                                    },
                                },
                            },
                            "_priority": 0,
                        },
                        duihaijingjieshao9_skill: {
                            equipSkill: true,
                            trigger: {
                                player: "damageBegin4",
                            },
                            filter: function (event, player) {
                                if (player.hasSkillTag("unequip2")) return false;
                                if (
                                    event.source &&
                                    event.source.hasSkillTag("unequip", false, {
                                        name: event.card ? event.card.name : null,
                                        target: player,
                                        card: event.card,
                                    })
                                )
                                    return false;
                                var cards = player.getEquips("duihaijingjieshao9");
                                if (!cards.length) return false;
                                if (event.nature == "thunder") return true;
                            },
                            content: function () {
                                trigger.cancel();
                                var e2 = player.getEquips("duihaijingjieshao9");
                                if (e2.length) {
                                    player.discard(e2);
                                }
                                player.removeSkill("duihaijingjieshao9_skill");
                            },
                            "_priority": -25,
                        },
                        zhaomingdanjiaozheng9_skill: {
                            charlotte: true,
                            force: true,
                            intro: {
                                marktext: "照明弹矫正",
                                content: function () {
                                    return "不能使用或打出手牌";
                                },
                            },
                            mod: {
                                cardEnabled2: function (card, player) {
                                    if (get.position(card) == 'h') return false;
                                },
                            },
                            ai: {
                                effect: {
                                    target: function (card, player, target) {
                                        if (get.tag(card, 'damage')) return [0, -999999];
                                    },
                                },
                            },
                        },
                        gailiangbeimaodan9_skill: {
                            equipSkill: true,
                            trigger: {
                                player: ["shaMiss", "eventNeutralized"],
                            },
                            usable: 1,
                            filter: function (event, player) {
                                if (!event.card || event.card.name != "sha") return false;
                                if (event.cards) {
                                    for (var i = 0; i < event.cards.length; i++) {
                                        if (get.position(event.cards[i], true) == "o") return true;
                                    }
                                }
                                return false;
                            },
                            content: function () {
                                "step 0";
                                var cards = trigger.cards.slice(0);
                                for (var i = 0; i < cards.length; i++) {
                                    if (get.position(cards[i], true) != "o") {
                                        cards.splice(i--, 1);
                                    }
                                }
                                player.gain(cards, "gain2");
                            },
                            "_priority": -25,
                        },
                        chuanjialiudan9_skill: {
                            equipSkill: true,
                            trigger: {
                                player: "useCardToPlayered",
                            },
                            filter: function (event) {
                                if (event.target.hasEmptySlot(2)) return false;
                                return event.card.name == "sha";
                            },
                            forced: true,
                            logTarget: "target",
                            content: function () {
                                "step 0";
                                next = player
                                    .chooseToDiscard(get.prompt("chuanjialiudan9_skill"), 1, "hes", function (card, player) {
                                        if (_status.event.ignoreCard) return true;
                                        var cards = player.getEquips("chuanjialiudan9");
                                        if (!cards.includes(card)) return true;
                                        return cards.some((cardx) => cardx != card && !ui.selected.cards.includes(cardx));
                                    })
                                    .set("ignoreCard", player.hasSkill("chuanjialiudan9_skill", null, false))
                                    .set("complexCard", true);
                                next.logSkill = "chuanjialiudan9_skill";
                                next.set("ai", function (card) {
                                    var evt = _status.event.getTrigger();
                                    if (get.attitude(evt.player, evt.target) < 0) {
                                        if (evt.player.needsToDiscard()) return 15 - get.value(card);
                                        return 7 - get.value(card);
                                    }
                                    return -1;
                                });
                                "step 1";
                                if (result.bool) {
                                    trigger.target.addTempSkill("qinggang2");
                                    trigger.target.storage.qinggang2.add(trigger.card);
                                    trigger.target.markSkill("qinggang2");
                                }
                            },
                            ai: {
                                "unequip_ai": true,
                                skillTagFilter: function (player, tag, arg) {
                                    if (arg && arg.name == "sha") return true;
                                    return false;
                                },
                            },
                            "_priority": -25,
                        },
                        chuanjiahangdan9_skill: {
                            equipSkill: true,
                            trigger: {
                                player: "useCardToPlayered",
                            },
                            check: function (event, player) {
                                return get.attitude(player, event.target) <= 0;
                            },
                            filter: function (event, player) {
                                return (event.card.name == "wanjian" || event.card.name == "jinjuzy9") && event.target.countCards("he");
                            },
                            content: function () {
                                trigger.target.chooseToDiscard("he", true);
                            },
                            "_priority": -25,
                        },
                        zhuangjiajiaban9_skill: {
                            equipSkill: true,
                            trigger: {
                                player: ["damageBegin4"],
                            },
                            filter(event, player, name) {
                                //game.log(get.translation(event.card));
                                if (event.card && get.type(event.card) == "trick") {
                                    return event.num > 0;
                                }
                            },
                            check: function (event, player) {
                                return true;
                            },
                            content: function () {
                                "step 0"
                                player.judge(function (result) {
                                    return get.color(result) == "red" ? 2 : -2;
                                });
                                "step 1"
                                if (result.bool == true)
                                    trigger.cancel();
                            },
                            ai: {
                                effect: {
                                    target: function (card, player, target, current) {
                                        if (get.tag(card, 'damage') && get.attitude(player, target) < 0) {
                                            return 0.3;
                                        }
                                    },
                                },
                            },
                            "_priority": 0,
                        },
                        duikongyujing9_skill: {
                            trigger: {
                                global: ["logSkill"],
                            },
                            filter: function (event, player) {
                                return event.player == player && event.skill == 'fangkong2';
                            },
                            content() {
                                player.chooseToGuanxing(2);
                                player.draw(1);
                            },
                        },
                    },
                    translate: {
                        "huhangyuanhu9": "护航援护",
                        "huhangyuanhu9_info": "出牌阶段，对一名其他角色使用。其摸两张牌。",
                        "paojixunlian9": "炮击训练",
                        "paojixunlian9_info": "出牌阶段，对自己使用。本回合你使用杀的上限+2。",
                        "paojixunlian9_skill": "炮击训练",
                        "yuanchengdaodan9": "远程导弹",
                        "yuanchengdaodan9_info": "指定一名其他角色为目标，其须打出干扰弹响应，否则你对其造成一点伤害",
                        "ganraodan9": "干扰弹",
                        "ganraodan9_info": "以你为目标的杀生效前，你可以使用此牌，令此杀的使用者本回合非锁定技失效。",
                        "yanhangleiji9": "雁行雷击",
                        "yanhangleiji9_info": "出牌阶段，对一名其他角色使用，令其 进水 减速。",
                        "tanzhaodeng9": "探照灯",
                        "tanzhaodeng9_info": "回合开始时，你选择一名角色，展示你与其的手牌。",
                        "tanzhaodeng9_skill": "探照灯",
                        "jiaohusheji9": "交互射击",
                        "jiaohusheji9_info": "你受到伤害后，可以视为对伤害来源使用一张杀。",
                        "jiaohusheji9_skill": "交互射击",
                        "yingbeimao9": "硬被帽",
                        "yingbeimao9_info": "你使用杀指定目标后，其使用闪后须弃置一张牌，否则此杀依然造成伤害。",
                        "yingbeimao9_skill": "硬被帽",
                        "guochuan9": "过穿",
                        "guochuan9_info": "防止你受到的大于一的伤害。",
                        "guochuan9_skill": "过穿",
                        "qianshaoyuanhu9": "前哨援护",
                        "qianshaoyuanhu9_info": "对一名没有护甲的角色使用，其获得一点护甲。",
                        "shujujiaohu9": "数据交互",
                        "shujujiaohu9_info": "你可以交给一名角色任意张牌，然后其交给你等量张牌。",
                        "yinghuazhuangjia9": "硬化装甲",
                        "yinghuazhuangjia9_info": "你获得“装甲防护”直到你的下回合开始。",
                        "lanzusheji9": "拦阻射击",
                        "lanzusheji9_info": "出牌阶段使用，你获得：其他角色指定你为杀的目标后，其选择受到一点伤害或令此杀无效。直到你的下回合开始。",
                        "lanzusheji9_skill": "拦阻射击",
                        "bianduiyuanhu9": "编队援护",
                        "bianduiyuanhu9_info": "有角色濒死时，你可以打出此牌，其回复一点体力，结算后你获得一点护甲。",
                        "tantiaogongji9": "弹跳攻击",
                        "tantiaogongji9_info": "当你使用牌指定两名或以上目标后，你可以弃置其中一名目标一张牌。",
                        "tantiaogongji9_skill": "弹跳攻击",
                        "duihaijingjieshao9": "对海警戒哨",
                        "duihaijingjieshao9_info": "你即将受到雷电伤害时，可以弃置此牌，免疫此次伤害",
                        "duihaijingjieshao9_skill": "对海警戒哨",
                        "zhaomingdanjiaozheng9": "照明弹矫正",
                        "zhaomingdanjiaozheng9_info": "对一名其他角色使用。其不能使用或打出手牌直到回合结束。",
                        "gailiangbeimaodan9": "改良被帽弹",
                        "gailiangbeimaodan9_info": "每回合限一次，你使用杀被闪抵消后，你可以获得此杀对应的实体牌。",
                        "gailiangbeimaodan9_skill": "改良被帽弹",
                        "chuanjialiudan9": "穿甲榴弹",
                        "chuanjialiudan9_info": "你使用杀指定目标后，若其有防具，你可以弃置一张牌令其防具失效直至此杀结算结束。",
                        "chuanjialiudan9_skill": "穿甲榴弹",
                        "chuanjiahangdan9": "穿甲航弹",
                        "chuanjiahangdan9_info": "你使用万箭齐发/近距支援指定目标后，其须弃置一张牌(没有则不弃)",
                        "chuanjiahangdan9_skill": "穿甲航弹",
                        "zhuangjiajiaban9": "装甲甲板",
                        "zhuangjiajiaban9_info": "你受到锦囊牌伤害时可以进行判定，若判定结果为红色，此伤害-1。",
                        "zhuangjiajiaban9_skill": "装甲甲板",
                        "quanjiabantuji9": "全甲板突击",
                        "quanjiabantuji9_info": "使用此牌后你弃置所有手牌，然后视为使用任意锦囊牌。",
                        "duikongyujing9": "对空预警",
                        "duikongyujing9_info": "可重铸，对一名角色使用。直到其下回合开始，其使用防空结算后卜算2， 摸一张牌。",
                        "duikongyujing9_skill": "对空预警",
                    },
                    list: [
                        ["heart", 10, "huhangyuanhu9"],
                        ["heart", 11, "huhangyuanhu9"],
                        ["heart", 12, "huhangyuanhu9"],
                        ["club", 10, "paojixunlian9"],
                        ["club", 11, "paojixunlian9"],
                        ["club", 12, "paojixunlian9"],
                        ["spade", 1, "yuanchengdaodan9"],
                        ["spade", 3, "yuanchengdaodan9"],
                        ["spade", 4, "yuanchengdaodan9"],
                        ["club", 3, "ganraodan9"],
                        ["club", 4, "ganraodan9"],
                        ["club", 5, "ganraodan9"],
                        ["diamond", 3, "ganraodan9"],
                        ["diamond", 4, "ganraodan9"],
                        ["diamond", 5, "ganraodan9"],
                        ["diamond", 6, "ganraodan9"],
                        ["club", 8, "yanhangleiji9"],
                        ["club", 9, "yanhangleiji9"],
                        ["spade", 10, "yanhangleiji9"],
                        ["spade", 11, "yanhangleiji9"],
                        ["diamond", 2, "tanzhaodeng9"],
                        ["spade", 2, "jiaohusheji9"],
                        ["spade", 1, "yingbeimao9"],
                        ["heart", 2, "guochuan9"],
                        ["heart", 7, "qianshaoyuanhu9"],
                        ["diamond", 7, "qianshaoyuanhu9"],
                        ["diamond", 9, "qianshaoyuanhu9"],
                        ["club", 7, "shujujiaohu9"],
                        ["spade", 7, "shujujiaohu9"],
                        ["spade", 9, "shujujiaohu9"],
                        ["spade", 11, "yinghuazhuangjia9"],
                        ["spade", 13, "yinghuazhuangjia9"],
                        ["heart", 1, "bianduiyuanhu9"],
                        ["heart", 13, "bianduiyuanhu9"],
                        ["club", 13, "tantiaogongji9"],
                        ["diamond", 4, "lanzusheji9"],
                        ["club", 8, "duihaijingjieshao9"],
                        ["club", 6, "zhaomingdanjiaozheng9"],
                        ["club", 2, "gailiangbeimaodan9"],
                        ["diamond", 1, "chuanjialiudan9"],
                        ["heart", 3, "chuanjiahangdan9"],
                        ["heart", 6, "zhuangjiajiaban9"],
                        ["heart", 8, "quanjiabantuji9"],
                        ["heart", 9, "quanjiabantuji9"],
                        ["spade", 5, "duikongyujing9"],
                        ["spade", 6, "duikongyujing9"],
                        ["spade", 8, "duikongyujing9"],
                    ],//牌堆添加
                };

                return jianrzsbao;
            });
            lib.translate['jianrzsbao_card_config'] = '舰R战术卡包';
            lib.config.all.cards.push('jianrzsbao');
            if (!lib.config.cards.contains('jianrzsbao')) lib.config.cards.push('jianrzsbao');//包名翻译
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
                skill: {
                },
                translate: {
                },
            },
            intro: "",
            author: "无名玩家",
            diskURL: "",
            forumURL: "",
            version: "0.1",
        }, files: { "character": [], "card": [], "skill": [], "audio": [] }
    }
});