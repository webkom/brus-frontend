# Brus-Frontend

> https://brus-frontend.webkom.now.sh/

## Query params

- `folks`
  - List of folks
  - Generate with: `cat members.json | jq -r -c "[.[] | select(.active==true) | {name: .name, avatar: .avatar, uids: .cards.rfid.mifare}]" | base64 -w0`
- `mqttServer`
  - mqtts://<USERNAME>:<PASSWORD>@mqtt.abakus.no/mqtt
- `onlyShow`
  - List with the only product you want to show, separated with comma. eg. `onlyShow=beer_dahls_bottle`. Defaults to show all
