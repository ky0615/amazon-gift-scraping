# アマギフいっぱい買うやつ

Amazon.co.jp: アカウントにチャージ

https://www.amazon.co.jp/gp/gc/create/ref=gc_cac_red


こいつを買いまくるだけ。

## Configure

```
# ヘッドレスモード無効化する。動いてるのが分かる
export HEADLESS=false

# Amazonのアカウント
export AMAZON_MAIL="example@aa.com"
export AMAZON_PW="password_is_here"

# 購入するギフトの単価
export AMAZON_BUY_PRICE="100"

# ログイン後はカード番号の再入力を求められるので、選択するカードの番号。一番上が0
export AMAZON_CARD_ID="3"

# 再入力するクレカの番号
export AMAZON_CARD_NUMBER="1145141919810"

```


## Running

```
$ yarn install
$ yarn start
```
