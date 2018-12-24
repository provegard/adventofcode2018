const _ = require("lodash");

class Group {
    constructor(name, type, unitCount, hitPoints, attackDamage, attackType, initiative, immunities, weaknesses) {
        this.name = name;
        this.type = type;
        this.unitCount = unitCount;
        this.hitPoints = hitPoints;
        this.attackDamage = attackDamage;
        this.attackType = attackType;
        this.initiative = initiative;
        this.immunities = immunities;
        this.weaknesses = weaknesses;
    }

    isEnemy(other) {
        return other.type !== this.type;
    }

    effectivePower() {
        return this.unitCount * this.attackDamage;
    }

    isImmuneTo(at) {
        return this.immunities.has(at);
    }

    isWeakTo(at) {
        return this.weaknesses.has(at);
    }

    isAlive() {
        return this.unitCount > 0;
    }

    totalHitPoints() {
        return this.hitPoints * this.unitCount;
    }

    damageICanInflictOn(other) {
        const power = this.effectivePower();
        let damage = power;
        if (other.isImmuneTo(this.attackType)) damage = 0;
        else if (other.isWeakTo(this.attackType)) damage *= 2;
        return damage;
    }

    attack(other) {
        const damage = this.damageICanInflictOn(other);
        const hp = other.totalHitPoints();
        let unitsKilled = Math.floor(other.unitCount * damage / hp);
        unitsKilled = Math.min(unitsKilled, other.unitCount); // mostly to get debug output that makes sense
        //console.log(this.name + " attacked " + other.name +
        //    " (which has total hit points " + hp + " and " + other.unitCount + " units) with damage " + damage + ", killing " + unitsKilled + " units");
        other.unitCount -= unitsKilled;
    }

    selectTarget(enemyGroups) {
        const candidates = enemyGroups.filter((g) => this.damageICanInflictOn(g) > 0);
        candidates.sort((a, b) => {
            return (this.damageICanInflictOn(b) - this.damageICanInflictOn(a)) ||
                (b.effectivePower() - a.effectivePower()) ||
                (b.initiative - a.initiative);
        });
        return candidates[0]; 
    }
}

class System {
    constructor(immuneSystem, infection) {
        this.immuneSystem = immuneSystem;
        this.infection = infection;
    }

    fight() {
        const allGroups = this.immuneSystem.concat(this.infection);
        // 1. target selection phase
        allGroups.sort((a, b) => {
            return (b.effectivePower() - a.effectivePower()) ||
                (b.initiative - a.initiative);
        });
        const targetByAttacker = new Map();
        const possibleTargets = allGroups.concat();
        for (const attacker of allGroups) {
            //const selectedAlready = new Set(targetByAttacker.values());
            const enemies = possibleTargets.filter((g) => attacker.isEnemy(g));
            //    .filter((g) => attacker.isEnemy(g) && !selectedAlready.has(g));
            const target = attacker.selectTarget(enemies);
            if (target) {
                targetByAttacker.set(attacker, target);
                const idx = possibleTargets.indexOf(target);
                possibleTargets.splice(idx, 1);
            }
        }
        // 2. attack phase
        allGroups.sort((a, b) => b.initiative - a.initiative);
        for (const attacker of allGroups) {
            const target = targetByAttacker.get(attacker);
            if (!target) continue;
            attacker.attack(target);
        }

        this.immuneSystem = this.immuneSystem.filter((g) => g.isAlive());
        this.infection = this.infection.filter((g) => g.isAlive());
    }

    isCombatDone() {
        return this.immuneSystem.length === 0 || this.infection.length === 0;
    }

    doCombat() {
        let iter = 0;
        while (!this.isCombatDone()) {
            //console.log(this.immuneSystem);
            //console.log(this.infection);
            //if (++iter == 2) throw new Error("???");
            this.fight();
        }
    }

    sizeOfWinner() {
        const winner = this.immuneSystem.length > 0
            ? this.immuneSystem
            : this.infection;
        return winner.reduce((s, g) => s + g.unitCount, 0);
    }

    immuneSystemWon() {
        return this.immuneSystem.length > 0;
    }

    isImmuneSystemStronger() {
        const isPower = this.immuneSystem.reduce((s, u) => s + u.effectivePower(), 0);
        const infPower = this.infection.reduce((s, u) => s + u.effectivePower(), 0);
        return isPower > infPower;
    }
}

Group.parse = (name, type, line, attackDamageBoost = 0) => {
    // 989 units each with 1274 hit points (immune to fire; weak to bludgeoning,
    // slashing) with an attack that does 25 slashing damage at initiative 3
    
    // 17 units each with 5390 hit points (weak to radiation, bludgeoning) with
    // an attack that does 4507 fire damage at initiative 2

    const parts = line.split(/[ ;,()]+/);
    const unitCount = +parts[0];
    const hitPoints = +parts[4];
    const doesIdx = parts.indexOf("does");
    const attackDamage = +parts[doesIdx + 1] + attackDamageBoost;
    const attackType = parts[doesIdx + 2];
    const initiative = +parts[parts.length - 1];

    let immunities;
    let weaknesses;

    const immuneIdx = parts.indexOf("immune");
    if (immuneIdx >= 0) {
        // take parts until we find "weak" or "with"
        let types = parts.slice(immuneIdx + 2);
        types = _.takeWhile(types, (t) => t !== "weak" && t !== "with");
        immunities = new Set(types);
    } else immunities = new Set();

    const weakIdx = parts.indexOf("weak");
    if (weakIdx >= 0) {
        // take parts until we find "immune" or "with"
        let types = parts.slice(weakIdx + 2);
        types = _.takeWhile(types, (t) => t !== "immune" && t !== "with");
        weaknesses = new Set(types);
    } else weaknesses = new Set();

    return new Group(name, type, unitCount, hitPoints, attackDamage, attackType, initiative, immunities, weaknesses);
};

System.parse = (lines, boost) => {
    lines = lines.slice(1);
    const immuneSystem = [];
    const infection = [];
    let current = immuneSystem;
    let type = "immune";
    let idx = 0;
    for (const line of lines) {
        if (line === "") {
            current = infection;
            type = "infection";
            idx = 0;
            boost = 0; // infection doesn't get a boost
            continue;
        }
        if (line.indexOf(":") >= 0) continue;
        idx++;
        let name = type + " group " + idx;
        current.push(Group.parse(name, type, line, boost));
    }
    return new System(immuneSystem, infection);
}

function part1(lines) {
    const system = System.parse(lines);
    system.doCombat();
    return system.sizeOfWinner();
}

function bounds(lines) {
    let boost = 1;
    let prev = 0;
    while (true) {
        const system = System.parse(lines, boost);
        system.doCombat();
        if (system.immuneSystemWon()) return {lower: prev, upper: boost};
        prev = boost;
        boost *= 2;
    }
}

function binarySearch(lines, low, high) {
    if (high < low) return low;
    const mid = Math.floor((low + high) / 2);
    const system = System.parse(lines, mid);
    system.doCombat();
    if (system.immuneSystemWon()) {
        return binarySearch(lines, low, mid - 1);
    }
    return binarySearch(lines, mid + 1, high);
}

function part2(lines) {
    const {lower, upper} = bounds(lines);
    const boost = binarySearch(lines, lower, upper);
    const system = System.parse(lines, boost);
    system.doCombat();
    return system.sizeOfWinner();
    /*let boost = 1;
    while (true) {
        const system = System.parse(lines, boost);
        if (system.isImmuneSystemStronger()) {
            system.doCombat();
            return system.sizeOfWinner();
        }
        boost++;
    }*/
}

module.exports = { part1, part2, Group, System };
