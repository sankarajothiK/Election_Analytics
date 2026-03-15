import json, re
with open('tn_const.json', 'r', encoding='utf-8') as f:
    tn_consts = json.load(f)
with open('static/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_tn_string = '"Tamil Nadu": ' + json.dumps(tn_consts) + ','
# Find and replace the existing "Tamil Nadu": [...] array.
content = re.sub(r'"Tamil Nadu":\s*\[.*?\],', new_tn_string, content, count=1, flags=re.DOTALL)

with open('static/js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated JS')
