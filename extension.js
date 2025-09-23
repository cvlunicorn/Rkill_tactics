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
                            image: 'ext:舰R战术/huhangyuanhu9.png',
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
                        paojixunlian9: {
                            image: 'ext:舰R战术/paojixunlian9.png',
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
                            image: 'ext:舰R战术/yuanchengdaodan9.png',
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
                            image: 'ext:舰R战术/ganraodan9.png',
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
                            audio: true,
                            fullskin: true,
                            type: "trick",
                            enable: true,
                            singleCard: true,
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
                                    if (player == game.me && get.attitude(viewer, player._trueMe || player) > 0) return 0;
                                },
                                basic: {
                                    order: 8,
                                    value: 2,
                                    useful: 1,
                                },
                                result: {
                                    player: (player, target) => {
                                        if (!target.hasSkillTag("noe") && get.attitude(player, target) > 0) return 0;
                                        return (
                                            (player.hasSkillTag("noe") ? 0.32 : 0.15)
                                        );
                                    },
                                    target: (player, target, card) => {
                                        let targets = [].concat(ui.selected.targets);
                                        if (_status.event.preTarget) targets.add(_status.event.preTarget);
                                        if (targets.length) {
                                            let preTarget = targets.lastItem,
                                                pre = _status.event.getTempCache("jiedao_result", preTarget.playerid);
                                            if (pre && pre.card === card && pre.target.isIn())
                                                return target === pre.target ? pre.eff : 0;
                                            return (
                                                get.effect(target, { name: "sha" }, preTarget, player) /
                                                get.attitude(player, target)
                                            );
                                        }
                                        let arms =
                                            (target.hasSkillTag("noe") ? 0.32 : -0.15)
                                        if (!target.mayHaveSha(player, "use")) return arms;
                                        let sha = game.filterPlayer(get.info({ name: "yanhangleiji9" }).filterAddedTarget),
                                            addTar = null;
                                        sha = sha.reduce((num, current) => {
                                            let eff = get.effect(current, { name: "sha" }, target, player);
                                            if (eff <= num) return num;
                                            addTar = current;
                                            return eff;
                                        }, -100);
                                        if (!addTar) return arms;
                                        sha /= get.attitude(player, target);
                                        _status.event.putTempCache("yanhangleiji9_result", target.playerid, {
                                            card: card,
                                            target: addTar,
                                            eff: sha,
                                        });
                                        return Math.max(arms, sha);
                                    },
                                },
                                tag: {
                                    use: 1,
                                    useSha: 1,
                                },
                            },
                            selectTarget: 1,
                        },
                    },
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
                        "yanhangleiji9_info": "出牌阶段，对一名有 使用杀的目标 的角色使用，令其对另一名指定角色使用一张杀。",
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