<?php

echo trans_choice('time.minutes_ago', 5, ['value' => 5]);

// /* __('dont.collect'); */

echo __('Welcome :name', ['name' => 'dayle']); // @lingual [en-US] id:messages.welcome

echo __( 
    $coalesce  // some
    ??// comments
    'defaults.fallback' // @lingual en-US:An unknown error occurred
);

?>