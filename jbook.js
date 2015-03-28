var JBookDataModel = function(){
    var self = this;

    self.advanced = ko.observable("");

    self.spellbookDash = {};
    self.preparedSpellsDash = {};

    self.spellbook = ko.observableDictionary({});
    self.preparedSpells = ko.observableDictionary({});
    self.selectedClass = ko.observable("Wizard");
    self.playerLevel = ko.observable("1");
    self.selectedSpell = ko.observableDictionary({});
    self.classes = ko.observableArray(["Sorcerer", "Wizard", "Bard", "Warlock", "Paladin", "Cleric", "Druid", "Monk"]);

    self.selectClass = function(cl) {
        self.selectedClass(cl);
    };

    self.selectSpell = function(spell) {
        self.selectedSpell.removeAll();
        self.selectedSpell.pushAll(spell);
    };

    self.addSpellToSpellbook = function(spell) {
        if (spell.Name === "ALL") {
            $.each(self.getFullSpellListByClass(), function(index, value) {
                if (value.Name != "ALL") {
                    self.spellbook.push(value.Name, value);
                    self.spellbookDash.addItemToGrid(value.Name, value);
                }
            });
        }
        else {
            self.spellbook.push(spell.Name, spell);
            self.spellbookDash.addItemToGrid(spell.Name, spell);

            //console.log(self.preparedSpellsDash);
            self.preparedSpells.push(spell.Name, spell);
            self.preparedSpellsDash.addItemToGrid(spell.Name, spell);
        }
        self.showall();
    };

    self.prepareSelectedSpell = function() {
        var spell = self.selectedSpell;
        console.log(spell);
        console.log(spell.get('Name')());
        console.log("preparing " + spell.get('Name')());
        self.preparedSpells.push(spell.get('Name')(), spell);
        self.preparedSpellsDash.addItemToGrid(spell.get('Name')(), spell);

        self.showall();
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
        //console.log(self.selectedSpell.values());
        //console.log(self.preparedSpellsDash);
        //console.log(self.spellbookDash);
        //console.log(self.preparedSpells.keys());
        //console.log(self.spellbook.keys());
        //console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

        //self.spellbookDash.refresh();
        //self.preparedSpellsDash.refresh();
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






    self.spellIconGrid = function(source) {
        var me = this;
        me.list = source;

        this.getItemList = function(callback) {
            callback(me.list.values());
        };

        this.openItem = function(itemID) {
            //console.log("Asking for " + itemID + "from " + me.dashname);
            var spell = me.list.get(itemID)();
            console.log("Clicked on spell: " + spell.Name + " from ID " + itemID);
            self.selectSpell(spell);
            self.showSpellModal();
            self.showall();
        };

        this.userRemovedItem = function(itemID, callback) {
            delete me.list.remove(itemID);
            if (callback){
                callback(itemID);
            }
        };

        // if all your items have 'itemImgURL' and 'itemTitle' properties, then you don't need to implement these.
        // These get called when an item doesn't have the right properties.
        // Note that you can pass in data URIs for icons
        this.getItemImgURL = function(itemid) {
            return "foo.com";
        };

        this.getItemTitle = function(itemID) {
            console.log("Getting item title for " + itemID);
            console.log(me.list.keys());
            return me.list.get(itemID)().Name;
        };

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

    self.initIconGrids = function() {
        var sbHostElement = $("#icongridSpellBook");
        var sbLayout = new GridLayout(sbHostElement.width(), sbHostElement.height(), 3, 6);
        self.spellbookDash = new IconGrid("spellbook", sbHostElement, new self.spellIconGrid(self.spellbook), sbLayout);

        var pHostElement = $("#icongridPrepared");
        var pLayout = new GridLayout(pHostElement.width(), pHostElement.height(), 3, 6);
        self.preparedSpellsDash = new IconGrid("prepared", pHostElement, new self.spellIconGrid(self.preparedSpells), pLayout);

        self.spellbookDash.initialize();
        self.preparedSpellsDash.initialize();

        self.spellbookDash.refresh();
        self.preparedSpellsDash.refresh();
    };

    self.init = function() {
        self.initIconGrids();
        self.selectSpell(spelllist[1]);
        self.hideShowInfoCats();
    };

};

$(document).ready( function() {
    model = new JBookDataModel();
    model.init();
    ko.applyBindings(model);
});
