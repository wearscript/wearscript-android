GDK Cards
=========
WearScript uses an abstraction called a CardTree that allows for a hierarchy of cards where a node can optionally have either a menu or another set of cards beneath it and every card can have a tap/select callback.  The syntax is overloaded to make common functionality concise.

The following displays a GDK card (consists of a body and footer)
.. code-block:: javascript

    var tree = new WS.Cards();
    tree.add('Body text', 'Footer text');
    WS.cardTree(tree);
    WS.displayCardTree();


Lets add another card
.. code-block:: javascript

    var tree = new WS.Cards();
    tree.add('Body 0', 'Footer 0');
    tree.add('Body 1', 'Footer 1');
    WS.cardTree(tree);
    WS.displayCardTree();

Select and tap callbacks are optional arguments
.. code-block:: javascript

    var tree = new WS.Cards();
    tree.add('Body 0', 'Footer 0', function () {WS.say('Selected')});
    tree.add('Body 1', 'Footer 1', undefined, function () {WS.say('Tapped')});
    WS.cardTree(tree);
    WS.displayCardTree();


A menu is added with alternating title and callback arguments at the end of the parameter list.  Tap/select parameters (if present) precede them.
.. code-block:: javascript

    var tree = new WS.Cards();
    tree.add('Body 0', 'Footer 0', 'Say 0', function () {WS.say('Say 0')}, 'Say 1', function () {WS.say('Say 1')});
    tree.add('Body 1', 'Footer 1', function () {WS.say('Selected')}, 'Say 0', function () {WS.say('Say 0')}, 'Say 1', function () {WS.say('Say 1')});
    tree.add('Body 2', 'Footer 2', function () {WS.say('Selected')}, function () {WS.say('Tapped')}, 'Say 0', function () {WS.say('Say 0')}, 'Say 1', function () {WS.say('Say 1')});
    WS.cardTree(tree);
    WS.displayCardTree();

A subtree of cards is added by creating another set of cards and placing it as the last parameter (may only have a menu or a subtree for a card).  There is no depth limit for subtrees.

.. code-block:: javascript

    var tree = new WS.Cards();
    tree.add('Body 0', 'Footer 0');
    var subtree = new WS.Cards();
    subtree.add('Sub Body 0', 'Sub Footer 0');
    subtree.add('Sub Body 1', 'Sub Footer 1');
    tree.add('Body 1', 'Footer 1', subtree);
    WS.cardTree(tree);
    WS.displayCardTree();
