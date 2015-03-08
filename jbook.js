var JBookDataModel = function(){
    var self = this;

    self.spellbookDash = {};
    self.preparedSpellsDash = {};

    self.selectedClass = ko.observable("Wizard");
    self.classes = ko.observableArray(["Sorcerer", "Wizard", "Bard", "Warlock", "Paladin", "Cleric", "Druid", "Monk"]);
    self.selectClass = function(cl) {
        self.selectedClass(cl);
    };

    self.spellbook = ko.observableDictionary({});
    self.addSpellToSpellbook = function(spell) {
        console.log("adding spell " + spell.Name);
        if (spell.Name === "ALL") {
            $.each(self.getFullSpellListByClass(), function(index, value) {
                self.spellbook.push(value.Name, value);
                self.spellbookDash.addItemToGrid(value.Name, value);
            });
        }
        else {
            self.spellbook.push(spell.Name, spell);
            self.spellbookDash.addItemToGrid(spell.Name, spell);
        }


        self.spellbook.remove('ALL');


        //console.log(self.spellbook);
        console.log(self.spellbook.values()); 
    };



    self.spellbookIconGrid = function() {
        var list = self.spellbook;

        this.getItemList = function(callback) {
            callback(list.values());
        };

        this.openItem = function(itemID) {
            console.log(itemID);
            var title = list.get(itemID)();
            console.log("Clicked on spell: " + title.Name);
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


};

$(document).ready( function() {
    model = new JBookDataModel();
    model.initIconGrids();
    ko.applyBindings(model);
    console.log("ready");
});
