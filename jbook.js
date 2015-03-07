var JBookDataModel = function(){
    var self = this;

    self.selectedClass = ko.observable("Wizard");
    self.classes = ko.observableArray(["Sorcerer", "Wizard", "Bard", "Warlock", "Paladin", "Cleric", "Druid", "Monk"]);
    self.selectClass = function(cl) {
        self.selectedClass(cl);
    };

    self.spellbook = ko.observableArray([]);
    self.addSpellToSpellbook = function(spell) {
        console.log("adding to spellbook");
        if (spell.Name === "ALL") {
            $.each(self.getFullSpellListByClass(), function(index, value) {
                if (value.Name !== "ALL") {
                    self.spellbook.push(value);
                }
            });
        }
        else {
            self.spellbook.push(spell);
        }
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
        myDash = new IconGrid("spellbook", hostElement, self.spellbook(), myLayout);

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
