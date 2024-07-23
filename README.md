# lingual-cloud/translation-keys-collect

Automatically collects all translation keys from your source code.

## How to use
```yaml
name: Lingual Collect Translation Keys

on:
  push:
    # Only run workflow for pushes to specific branches
    branches:
      - master

jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: lingual-cloud/translation-keys-collect@v1
      with:
        # Lingual source id
        api-token: ${{ secrets.lingual_source_id }}
```

## License

Free to use with your Lingual account.