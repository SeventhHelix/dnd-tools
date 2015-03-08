var JBookDataModel = function(){
    var self = this;

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
            });
        }
        else {
            self.spellbook.push(spell.Name, spell);
        }


        // self.spellbook.remove('ALL');
        //console.log(self.spellbook);
        console.log(self.spellbook.values()); 
    };



    self.spellbookIconGrid = function() {
        var list = self.spellbook;

        this.getItemList = function(callback) {
            callback(list);
        };

        this.openItem = function(itemID) {
            var title = list.get(itemID).Name;
            console.log("Clicked on spell: " + title);
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
        this.getitemimgurl = function(itemid) {
            return "foo.com";
        };

        this.getitemtitle = function(itemid) {
            return list.get(itemid).Name;
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
        myLayout = new GridLayout(hostElement.width(), hostElement.height(), 3, 10);
        myDash = new IconGrid("spellbook", hostElement, new self.spellbookIconGrid(), myLayout);

        myDash.initialize();
        myDash.refresh();
    };


};

$(document).ready( function() {
    var model = new JBookDataModel();
    model.initIconGrids();
    ko.applyBindings(model);
    console.log("ready");
});
