@xyz
<html lang="en">
    <head>
        <title>{{ __('pages.home.title') }}</title>
    </head>
    <body>
        <div class="container">
            <nav class="navbar">
                <div class="container">
                    <div class="logo">
                        <h1>Local JS</h1>
                    </div>{{--
                    <span>{{ __('commented.out') }}</span>
                    <div>isdufkdsgksdhgkjsdfhgkjdfhgkjhdfkjhgdfkjh</div>

                    --}}<div class="navbar-right">
                        <select id="localization-switcher" class="locale-switcher">
                            <option value="en">{{__(
                                'English'   )}}</option>
                            <option value="fr">{{__('French')}}</option>
                            <option value="ar">{{__("Arabic & mess \"\'(العربية)''\n")}}</option>
                            <option value="xx">{{__("Multi
                                line")}}</option>
                        </select>
                    </div>
                </div>
            </nav>
            <div class="content-section">
                <p>
                    {{ __($texts->p ?? 'texts.default.empty') }}
                </p>
            </div>
        </div>
        <script src="./js/script.js"></script>
    </body>
</html>
@php
    echo trans('trans.php.in.blade with \'escaped\'\n');
@endphp