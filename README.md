dicer
=====

Generic RPG Stat and Dice Roller for OS X

Build
=====

Dicer uses [MacGap](https://github.com/maccman/macgap) to package the
application. Make is eschewed for a simpler build.sh script. The resulting
application is in ./app.

Use
===

Eventually there will be help in the application. For now, Characters have
stats and rolls associated with them. Rolls use the following grammer:

    dice [operation dice ] ... [operaton dice]
		  dice := integer | [num_rolls][rollmode][minmax]
				rollmode := d | w
			  minmax := integer | integer..integer

Some examples:

    1d6 := roll 1 six sided die.
		1d6 + 2 := roll 1 six sided die, then add 2.
		2d8 + d6 := roll 2 eight sided die, then add the roll of a 1 sided die.
		1w6 := roll 1 six sided die. On a six, add the result and reroll.

Anywhere an integer can go, a stat box from the character can go. For
example, the character "ThunderPants" has a state call "Pure Awesome" with
a value of 27. He can add this value whenever he rolls a 6 sided die. His
roll would look like:

    1d6 + [Pure Awesome]

This can also be used for weapon damage in dnd 4th edition:

    1d[W] + [Strength Mod] + [Weapon Enhancement] + [Weapon Proficiency]

Or for a wild die system, like Star Wars d6:

    [Force Use]d6 + 1w6
