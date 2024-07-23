<?php

echo trans_choice('time.minutes_ago', 5, ['value' => 5]);

// /* __('dont.collect'); */

echo __('messages.welcome', ['name' => 'dayle']);

echo __( 
    $coalesce  // some
    ??// comments
    'defaults.fallback'
);

?>