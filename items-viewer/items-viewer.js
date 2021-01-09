load(chorus_js_api);

credits = 'Chorus';
version = '1.0.0';
description = 'A simple menu that displays all the available items.';
image = 'https://i.imgur.com/raVNG01.png'

function onLoad() {
    translationMap = {
        'items': {
            en: 'Items',
            it: 'Item',
            de: 'Gegenstand',
        }
    }
}

function onDropMenuOpen(type, menu) {
    // Add the button to the 'show' sub-menu
    if (type == 'show') {
        menu.addButton(translate('items'), function (area, x, y) {
            var menu = generateMenu(getItems());
            menu.layoutX = x;
            menu.layoutY = y;
            menu.show();
        })
    }
}

// These JavaFX properties help us indirectly access text fields and label content

// Search query
var queryTextProperty = new fxproperty.SimpleStringProperty();

// Current item name
var itemTextProperty = new fxproperty.SimpleStringProperty();

function createTextField() {
    var textField = new TextField();
    textField.promptText = 'e.g. Cobblestone';
    textField.style = '-fx-padding: 10;';
    queryTextProperty.bind(textField.textProperty());
    return textField;
}

function createItemNameLabel() {
    var label = new Label();
    label.style = '-fx-padding: 10; -fx-font-weight: bold;'
    label.textProperty().bind(itemTextProperty);
    return label;
}

function generateMenu(items) {
    var menu = new Menu(translate('items'), true);
    menu.alignment = Alignment.CENTER;

    // A FlowPane makes a linear row that wraps to new lines if needed
    var flowPane = new fxlayout.FlowPane();
    flowPane.style = '-fx-padding: 5;';

    // Space between rows and columns
    flowPane.hgap = 5;
    flowPane.vgap = 5;

    // Width and height of the flow pane
    flowPane.setPrefWidth(500);
    flowPane.prefHeightProperty().bind(chorus.root.heightProperty().divide(2)); // Half window height

    // Update items on query change
    listen(queryTextProperty, function () {
        var query = queryTextProperty.get();
        var filteredItems = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            // Apply query
            if (query.isEmpty() || item.name.replace('_', ' ').toLowerCase().contains(query.toLowerCase())) {
                filteredItems.push(item);
            }
        }
        updateContent(flowPane, filteredItems);
    });

    var scrollPane = new fxcontrols.ScrollPane(flowPane); // Wrap the FlowPane in a scroll pane
    scrollPane.hbarPolicy = fxcontrols.ScrollPane.ScrollBarPolicy.NEVER; // Disable horizontal scroll
    menu.children.addAll(createTextField(), createItemNameLabel(), scrollPane);
    return menu;
}

function updateContent(flowPane, items) {
    flowPane.children.clear();
    items.forEach(
        function (item) {
            for (i = 0; i < item.icons.length; i++) {
                var image = new ImageView(item.icons[i]);
                var pane = new fxlayout.Pane(image);
                pane.setOnMouseEntered(function (e) {
                    itemTextProperty.set(item.formalName); // Display current item name, capitelized and with spaces
                })
                pane.setOnMouseExited(function (e) {
                    itemTextProperty.set('');
                })
                flowPane.children.add(pane);
            }
        }
    )
}