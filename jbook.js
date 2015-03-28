var JBookDataModel = function(){
    var self = this;

    self.advanced = ko.observable("");

    self.spellbook = ko.observableDictionary({});
    self.preparedSpells = ko.observableDictionary({});
    self.selectedClass = ko.observable("Wizard");
    self.playerLevel = ko.observable("1");
    self.maxSpellLevel = ko.observable("1");
    self.selectedSpell = ko.observableDictionary({});
    self.classes = ko.observableArray(["Sorcerer", "Wizard", "Bard", "Warlock", "Paladin", "Cleric", "Druid", "Monk"]);

    self.selectClass = function(cl) {
        self.selectedClass(cl);
    };

    self.selectSpell = function(spell) {
        console.log(self.selectedSpell.toJSON());
        self.selectedSpell.removeAll();
        console.log(self.selectedSpell.toJSON());
        self.selectedSpell.pushAll(spell);
        console.log(self.selectedSpell.toJSON());
    };

    self.addSpellToSpellbook = function(spell) {
        if (spell.Name === "ALL") {
            $.each(self.getFullSpellListByClass(), function(index, value) {
                if (value.Name != "ALL") {
                    if (value.Level <= self.maxSpellLevel()) {
                        self.spellbook.push(value.Name, value);
                    }
                }
            });
        }
        else {
            if (spell.Level <= self.maxSpellLevel()) {
                self.spellbook.push(spell.Name, spell);
            }
        }
    };

    self.prepareSelectedSpell = function() {
        var spell = self.selectedSpell;
        self.preparedSpells.push(spell.get('Name'), spell);
    };


    self.prepareSpell = function(spell) {
        self.preparedSpells.push(spell.Name, spell);
    };

    self.selectAndPrepareSpell = function(spell) {
        console.log("Selecting and preparing");
        console.log(spell);
        self.selectSpell(spell);
        self.prepareSpell(spell);
    };

    self.removeSpellFromSpellbook = function(spell) {
        self.spellbook.remove(spell.Name);
    };

    self.removeSpellFromPrepared = function(spell) {
        self.preparedSpells.remove(spell.Name);
    };





    self.info_all = ['Call', 'Name', 'Class', 'SubClass', 'Ritual', 'Concentration', 'Level', 'School', 'Component', 'Material', 
        'Range', 'CastingTime', 'Duration', 'Description', 'HigherLevel', 'Effect', 'PowerCard', 'SaveStat', 'SaveSuccess', 
        'HealAmount', 'CritText', 'DamageStatBonus', 'DamageMiscBonus', 'DamageType', 'DamageKind', 'EffectClean', 
        'TargetAoE', 'SpellSlotLevel'];
    self.info_advanced = ['SubClass', 'SaveStat', 'SaveSuccess', 'DamageType', 'DamageKind', 'CritText', 'DamageStatBonus', 'DamageMiscBonus', 'EffectClean'];
    self.info_ignore = ['Call', 'Effect', 'PowerCard', 'SpellSlotLevel'];

    self.advancedToggle = function() {
        self.advanced(self.advanced() ? "" : "true");
    };

    self.hideShowInfoCats = function() {
        self.info_all.forEach(function(entry) {
            var show = self.shouldShowInfoCat(entry);
            if (show) {
                $(".info_cat_"+entry).show();
            }
            else {
                $(".info_cat_"+entry).hide();
            }
        });
    };

    self.showall = function() {
    };

    self.advanced.subscribe(function() {
        self.hideShowInfoCats();
    });

    self.shouldShowInfoCat = function(key) {
        var show = true;
        show = show && $.inArray(key, self.info_ignore)<0;
        show = show && ($.inArray(key, self.info_advanced)<0 || self.advanced());
        show = show && ($.inArray(self.selectedSpell.get(key)(), ['', '0', '.', 'None'])<0);
        return show;
    };

    self.showSpellModal = function() {
        self.hideShowInfoCats();
        $("#spellModal").modal('show');
    };


    self.getFullSpellListByClass = ko.computed(function() {
        var spells = [];

        $.each(spelllist, function(index, value) {
            var classes = value.Class.split(",");
            if (classes.indexOf(self.selectedClass()) >=0) {
                spells.push(value);
            }
        });
        spells = sortByKey(spells, "Name");
        return spells;
    });

    self.initSortable = function() {
        $("#spellbook-list").sortable({items: '> li', forcePlaceholderSize: true});
        $("#prepared-list").sortable({items: '> li', forcePlaceholderSize: true});
    };


    self.init = function() {
        self.initSortable();
        self.selectSpell(spelllist[1]);
        self.hideShowInfoCats();
    };

};

$(document).ready( function() {
    model = new JBookDataModel();
    model.init();
    ko.applyBindings(model);
});
