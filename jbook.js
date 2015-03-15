var JBookDataModel = function(){
    var self = this;

    self.advanced = ko.observable("");

    self.spellbookDash = {};
    self.preparedSpellsDash = {};

    self.spellbook = ko.observableDictionary({});
    self.selectedClass = ko.observable("Wizard");
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
            if (value.Name != "ALL") {
                self.spellbook.push(spell.Name, spell);
                self.spellbookDash.addItemToGrid(spell.Name, spell);
            }
        }
    };





    self.info_all = ['Call', 'Name', 'Class', 'SubClass', 'Ritual', 'Concentration', 'Level', 'School', 'Component', 'Material', 
        'Range', 'CastingTime', 'Duration', 'Description', 'HigherLevel', 'Effect', 'PowerCard', 'SaveStat', 'SaveSuccess', 
        'HealAmount', 'CritText', 'DamageStatBonus', 'DamageMiscBonus', 'DamageType', 'DamageKind', 'EffectClean', 
        'TargetAoE', 'SpellSlotLevel'];
    self.info_advanced = ['SubClass', 'SaveStat', 'SaveSuccess', 'DamageStatBonus', 'DamageMiscBonus', 'EffectClean'];
    self.info_ignore = ['Call', 'Effect', 'PowerCard', 'SpellSlotLevel'];

    self.advancedToggle = function() {
        self.advanced(self.advanced() ? "" : "true");
        console.log("Advanced: " + self.advanced());
    };

    self.hideShowInfoCats = function() {
        console.log("hiding/showing");
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

    self.advanced.subscribe(function() {
        self.hideShowInfoCats();
    });

    self.shouldShowInfoCat = function(key) {
        var show = true;
        show = show && $.inArray(key, self.info_ignore)<0;
        show = show && ($.inArray(key, self.info_advanced)<0 || self.advanced());
        show = show && ($.inArray(self.selectedSpell.get(key)(), ['', '0', '.', 'None'])<0);
        console.log(key);
        console.log(self.selectedSpell.get(key)());
        return show;
    };

    self.showSpellModal = function() {
        self.hideShowInfoCats();
        $("#spellModal").modal('show');
    };






    self.spellbookIconGrid = function() {
        var list = self.spellbook;

        this.getItemList = function(callback) {
            callback(list.values());
        };

        this.openItem = function(itemID) {
            console.log(itemID);
            var spell = list.get(itemID)();
            console.log("Clicked on spell: " + spell.Name);
            self.selectSpell(spell);
            self.showSpellModal();
        };

        this.userRemovedItem = function(itemID, callback) {
            delete list.remove(itemID);
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
            console.log("asking for " + itemID);
            return list.get(itemID)().Name;
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
        var hostElement = $("#icongridSpellBook");
        myLayout = new GridLayout(hostElement.width(), hostElement.height(), 3, 6);
        //var myLayout = new GridLayout(300, 800, 3, 5);
        self.spellbookDash = new IconGrid("spellbook", hostElement, new self.spellbookIconGrid(), myLayout);

        self.spellbookDash.initialize();
        self.spellbookDash.refresh();
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
    console.log("ready");
});
