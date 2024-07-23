<?php
	echo L::greeting;
	// If 'en' is applied: 'Hello World'

	echo L::category_somethingother;
	// If 'en' is applied: 'Something other...'

	echo L::last_modified("today");
	// Could be: 'Last modified: today'

    $string = 'my_cool_key';

	echo L($string);
	// Outputs a dynamically chosen static property

	echo L($string, $args);

    echo L( 'inline_key_22', $args);

	echo L( $var1 ?? $var2 ?? 'defaults_message_xyz');
?>