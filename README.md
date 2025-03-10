# lingual-cloud/translation-keys-collect

Automatically collects all translation keys from your source code.

## How to use
```yaml
name: Lingual Collect Translation Keys

on:
  push:
    # run workflow on pushes to specific branch(es)
    branches:
      - release

jobs:
  collect:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: lingual-cloud/translation-keys-collect@v1
      with:
        # Lingual project source id
        source-id: ${{ secrets.lingual_source_id }}
```

## License

Free to use with your <a href="https://lingual.cloud" target="_blank">Lingual account</a>.
